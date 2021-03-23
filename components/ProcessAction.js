
import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { List } from 'react-native-paper'
import Dialog from 'react-native-dialog'
import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { faCheckCircle, faInfoCircle, faCheck, faFlag, faTimes, faClock, faUpload, faFileSignature, faSackDollar, faEnvelopeOpenDollar, faEye, faPen, faBan, faSpinner } from '@fortawesome/pro-light-svg-icons'
import { withNavigation } from 'react-navigation'

import FormSection from './FormSection'
import ModalOptions from './ModalOptions'
import Button from './Button'
import CustomIcon from './CustomIcon'
import Loading from './Loading'
import StepProgress from './process/StepProgress'

import { getCurrentStep, getCurrentAction, handleTransition } from '../core/process'
import * as theme from "../core/theme"
import { constants } from "../core/constants"
import { projectNextStepInit, projectNextPhaseInit } from '../core/process'
import { waitForTick } from "pdf-lib"

const db = firebase.firestore()

const ProcessAction = ({ initialProcess, processMain, ProjectId, navigation, ...props }) => {

    const [showModal, setShowModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [expanded, setExpanded] = React.useState(true);

    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogInputLabel, setDialogInputLabel] = useState('')
    const [loadingDialog, setLoadingDialog] = useState(false)
    const [loadingModal, setLoadingModal] = useState(false)
    const [loadingAction, setLoadingAction] = useState(true)

    const [process, setProcess] = useState(initialProcess)
    const [choice, setChoice] = useState(null)
    const [nextStep, setNextStep] = useState('')
    const [nextPhase, setNextPhase] = useState('')

    // useEffect(() => {

    // })

    var currentAction = getCurrentAction(process)
    const { currentPhaseId, currentStepId } = getCurrentStep(process)
    const currentPhase = process[currentPhaseId]
    const currentStep = process[currentPhaseId].steps[currentStepId]


    const configChoiceIcon = (choice) => {
        const element = _.cloneDeep(choice)
        if (element.id === 'confirm') { element.icon = faCheck; element.iconColor = theme.colors.primary }
        else if (element.id === 'finish') { element.icon = faFlag; element.iconColor = theme.colors.primary }
        else if (element.id === 'cancel') { element.icon = faTimes; element.iconColor = theme.colors.error }
        else if (element.id === 'comment') { element.icon = faTimes; element.iconColor = theme.colors.error }
        else if (element.id === 'postpone') { element.icon = faClock; element.iconColor = theme.colors.secondary }
        else if (element.id === 'upload') { element.icon = faUpload; element.iconColor = theme.colors.secondary }
        else if (element.id === 'view') { element.icon = faEye; element.iconColor = theme.colors.secondary }
        else if (element.id === 'edit') { element.icon = faPen; element.iconColor = theme.colors.secondary }
        else if (element.id === 'sign') { element.icon = faFileSignature; element.iconColor = theme.colors.secondary }
        else if (element.id === 'cashPayment') { element.icon = faSackDollar; element.iconColor = theme.colors.secondary }
        else if (element.id === 'financing') { element.icon = faEnvelopeOpenDollar; element.iconColor = theme.colors.secondary }
        else if (element.id === 'block') { element.icon = faBan; element.iconColor = theme.colors.error }
        else if (element.id === 'pending') { element.icon = faSpinner; element.iconColor = theme.colors.gray_dark }
        return element
    }

    if (currentAction) {
        var { title, status, screenName, screenParams, type, verificationType, choices, responsable } = currentAction

        if (choices) {
            var elements = choices.map((choice) => configChoiceIcon(choice))
        }
    }

    const CommentDialog = ({ title, inputLabel }) => {
        const [comment, setComment] = useState('')

        if (loadingDialog)
            return (
                <Dialog.Container visible={showDialog}>
                    <Dialog.Title style={[theme.customFontMSregular.header, { marginBottom: 5 }]}>Traitement en cours...</Dialog.Title>
                    <ActivityIndicator color={theme.colors.primary} size='small' />
                </Dialog.Container>
            )

        else return (
            <Dialog.Container visible={showDialog}>
                <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{dialogTitle}</Dialog.Title>
                <Dialog.Input
                    label={dialogInputLabel}
                    returnKeyType="done"
                    value={comment}
                    onChangeText={comment => setComment(comment)}
                    autoFocus={showDialog} />

                <Dialog.Button label="Annuler" onPress={() => setShowDialog(false)} style={{ color: theme.colors.error }} />
                <Dialog.Button label="Valider" onPress={() => onSubmitComment(comment)} style={{ color: theme.colors.primary }} />
            </Dialog.Container>
        )
    }

    const onSubmitComment = async (comment) => {
        if (!comment) return //show error message
        setLoadingDialog(true)

        if (choice)
            await runChoiceOperation(choice.operation)

        await validateAction(comment, null, false, nextStep, nextPhase)
        setLoadingDialog(false)
        setShowDialog(false)
    }

    const onSelectChoice = async (choice) => {
        const { onSelectType, commentRequired, operation } = choice
        const { screenName, screenParams } = currentAction

        if (typeof (choice.selected) === 'boolean') {
            choices.forEach((item) => {
                if (item.label === choice.label) item.selected = true
                else item.selected = false
            })
        }

        setChoice(choice)  //used in case of comment

        if (onSelectType === 'transition') {
            var { nextStep, nextPhase } = choice
            configNextStepOrPhase(nextStep, nextPhase) //used in case of comment
        }

        if (commentRequired) {
            const configDialogLabels = (choiceId) => {
                switch (choiceId) {
                    case 'postpone': return { title: "Motif du repport", inputLabel: "Expliquez brièvemment la raison du report." }; break;
                    case 'cancel': return { title: "Motif de l'annulation", inputLabel: "Expliquez brièvemment la raison de l'annulation." }; break
                    case 'block': return { title: "Motif du bloquage", inputLabel: "Expliquez brièvemment la raison de ce blocage." }; break
                    case 'comment': return { title: "Commentaire", inputLabel: "Veuillez saisir votre commentaire." }; break
                    default: return { title: "Commentaire", inputLabel: "Veuillez saisir votre commentaire." }; break
                }
            }

            const dialogTitle = configDialogLabels(choice.id).title
            const dialogInputLabel = configDialogLabels(choice.id).inputLabel
            setDialogTitle(dialogTitle)
            setDialogInputLabel(dialogInputLabel)
            setShowModal(false)
            setShowDialog(true)
        }

        else {
            setLoadingModal(true)

            if (onSelectType === 'navigation') {
                navigation.navigate(screenName, screenParams)
            }

            else if (onSelectType === 'transition') { //No comment, No "actionData" field -> Choice not needed
                // await runChoiceOperation(operation)
                await validateAction(null, null, false, nextStep, nextPhase)
            }

            else if (onSelectType === 'validation') {
                await runChoiceOperation(operation)
                await validateAction(null, null, false, null, null)
            }

            else if (onSelectType === 'commentPicker') {
                var { nextStep, nextPhase } = choice
                configNextStepOrPhase(nextStep, nextPhase)
                await runChoiceOperation(operation)
                await validateAction(choice.label, choices, choice.stay, nextStep, nextPhase)
            }

            else if (onSelectType === 'actionRollBack') { //roll back to previous action (update its status to "pending")
                await undoPreviousAction()
            }

            // setLoadingModal(false)
            // setShowModal(false)
        }
    }

    const configNextStepOrPhase = (nextStep, nextPhase) => {
        //Set next step or phase
        if (nextStep) {
            setNextStep(nextStep)
            setNextPhase('')
        }

        else if (nextPhase) {
            setNextPhase(nextPhase)
            setNextStep('')
        }

        else return
    }

    const runChoiceOperation = async (operation) => {
        if (!operation) return

        const { collection, documentId } = currentAction
        const { type, field, value } = operation

        if (type === 'update') {
            const update = {}
            update[field] = value
            await db.collection(collection).doc(documentId).update(update).then(() => console.log('Document with Id ', documentId, ' updated:', update))
        }
    }

    const countDown = async (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms)
            }, ms)
        })
    }

    const validateAction = async (comment, choices, stay, nextStep, nextPhase) => {

        //Update action fields
        process[currentPhaseId].steps[currentStepId].actions.forEach((action) => {

            if (action.id === currentAction.id) {
                //Update comment
                if (comment)
                    action.comment = comment

                //Update selected choice (selected = true -> UI displays it green colored)
                if (choices)
                    action.choices = choices

                //Update action status
                if (!stay)
                    action.status = "done"
            }

        })

        setLoadingModal(false)
        setShowModal(false)

        console.log('Do animation now !')

        await countDown(3000)

        const transitionRes = handleTransition(process, currentPhaseId, currentStepId, nextStep, nextPhase, ProjectId)
        process = transitionRes.process

        console.log('updated process', process)

        // await db.collection('Projects').doc(ProjectId).update({ process }) <- Required to succeed/ remove await for offline support
        // // await processMain() <- Remove this
    }

    const undoPreviousAction = async () => {
        const previousActionOrder = currentAction.actionOrder - 1

        process[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            if (action.actionOrder === previousActionOrder) {
                //undo action
                action.status = "pending"
            }
        })

        await db.collection('Projects').doc(ProjectId).update({ process })
        await processMain()
    }


    const onPressAction = async () => {

        if (responsable && responsable.id !== firebase.auth().currentUser.uid) {
            Alert.alert('Action non autorisée', "Seul un responsable peut effectuer cette opération.")
            return
        }

        if (type === 'auto') {
            if (currentAction.choices) {
                setShowModal(true)
            }

            else navigation.navigate(screenName, screenParams)
        }

        else if (type === 'manual') {
            if (verificationType === 'comment') {
                const { nextStep, nextPhase } = currentAction
                configNextStepOrPhase(nextStep, nextPhase)

                const dialogTitle = "Commentaire"
                const dialogInputLabel = "Veuillez renseigner des informations utiles."
                setDialogTitle(dialogTitle)
                setDialogInputLabel(dialogInputLabel)
                setShowDialog(true)
            }

            else if (verificationType === 'multiple-choices') {
                setShowModal(true)
            }

            else if (verificationType === 'validation') {
                const { nextStep, nextPhase } = currentAction
                await validateAction(null, null, false, nextStep, nextPhase)
            }
        }
    }

    const renderAction = () => {

        //if (!currentAction || loadingAction) return <Loading />

        //  if (type === 'auto')
        return (
            <TouchableOpacity onPress={onPressAction} style={styles.actionContainer}>
                <View style={styles.actionTitleContainer}>
                    <Text style={[theme.customFontMSmedium.caption]}>{title}</Text>
                </View>

                <View style={styles.actionIconsContainer}>
                    <CustomIcon icon={faCheckCircle} size={19} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                    <CustomIcon icon={faInfoCircle} size={19} color={theme.colors.gray_dark} onPress={() => Alert.alert('Instructions', currentAction.instructions)} />
                </View>

                {currentAction && currentAction.choices &&
                    <ModalOptions
                        title={title}
                        columns={choices.length}
                        isVisible={showModal}
                        toggleModal={() => setShowModal(!showModal)}
                        handleCancel={() => console.log('cancel')}
                        handleConfirm={() => console.log('confirm')}
                        elements={elements}
                        autoValidation={true}
                        handleSelectElement={(element, index) => onSelectChoice(element)}
                    />
                }
                {(currentAction && currentAction.choices || verificationType === 'comment') && <CommentDialog />}
            </TouchableOpacity>
        )
    }

    if (!currentAction) return <Loading />
    
    return (
        <View style={{ flex: 1, elevation: 5, borderRadius: 10, backgroundColor: theme.colors.white, margin: 15, paddingHorizontal: 10 }}>
            <List.Accordion
                showArrow
                style={{ paddingVertical: 15, paddingHorizontal: 0, marginLeft: 0, borderBottomWidth: expanded ? StyleSheet.hairlineWidth * 2 : 0, borderBottomColor: theme.colors.gray_light }}
                title={currentPhase.title}
                description={`${currentStep.stepOrder}. ${currentStep.title}`}
                titleNumberOfLines={1}
                descriptionNumberOfLines={1}
                left={props => currentAction ? <StepProgress progress={((currentAction.actionOrder - 1) / currentStep.actions.length) * 100} style={{ marginTop: 25, marginRight: 2 }} /> : null}
                expanded={expanded}
                titleStyle={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, marginBottom: 5 }]}
                descriptionStyle={[theme.customFontMSregular.header, { color: theme.colors.secondary }]}
                onPress={() => setExpanded(!expanded)}>

                <View style={{ paddingVertical: 15, paddingLeft: 0, paddingRight: 0, marginHorizontal: 5 }}>
                    {renderAction()}
                </View>

            </List.Accordion>
        </View>
    )
}

const styles = StyleSheet.create({
    actionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //paddingHorizontal: 5
    },
    actionTitleContainer: {
        flex: 0.85,
        //backgroundColor: 'brown'
    },
    actionIconsContainer: {
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25
        // backgroundColor: 'green'
    }
})

export default withNavigation(ProcessAction)






/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}> */
/* {choices.map((choice) => {
        return (
            <Button
                mode="outlined"
                onPress={() => onSelectChoice(choice)}
                style={{ width: '31%' }}
                labelStyle={theme.customFontMSregular.small}>
                {choice.label}
            </Button>
        )
    })} */
/* </View> */



    // else if (type === 'manual') {
        //     if (verificationType === 'validation') {
        //         return (
        //             <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer]}>
        //                 <Text style={[theme.customFontMSregular.body]}>{title}</Text>
        //                 <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
        //             </TouchableOpacity>
        //         )
        //     }

        //     if (verificationType === 'multiple-choices') {
        //         return (
        //             <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer, styles.actionContainerMultiChoice]}>
        //                 <Text style={[theme.customFontMSregular.body]}>{title}</Text>
        //                 <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
        //                 <ModalOptions
        //                     title={title}
        //                     columns={choices.length}
        //                     isVisible={showModal}
        //                     isLoading={loadingModal}
        //                     toggleModal={() => setShowModal(!showModal)}
        //                     handleCancel={() => console.log('cancel')}
        //                     handleConfirm={() => console.log('confirm')}
        //                     elements={elements}
        //                     autoValidation={true}
        //                     handleSelectElement={(element, index) => onSelectChoice(element)}
        //                 />
        //                 <CommentDialog />
        //             </TouchableOpacity>
        //         )
        //     }

        //     else if (verificationType === 'comment') {
        //         return (
        //             <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer, styles.actionContainerComment]}>
        //                 <Text style={[theme.customFontMSregular.body]}>{title}</Text>
        //                 <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
        //                 <CommentDialog />
        //             </TouchableOpacity>
        //         )
        //     }
        // }