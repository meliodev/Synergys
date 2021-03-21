
import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import Dialog from 'react-native-dialog'
import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { faCheckCircle, faCheck, faFlag, faTimes, faClock, faUpload, faFileSignature, faSackDollar, faEnvelopeOpenDollar, faEye, faBan } from '@fortawesome/pro-light-svg-icons'
import { withNavigation } from 'react-navigation'

import FormSection from './FormSection'
import ModalOptions from './ModalOptions'
import Button from './Button'
import CustomIcon from './CustomIcon'
import Loading from './Loading'

import { getCurrentStep, getCurrentAction } from '../core/process'
import * as theme from "../core/theme"
import { constants } from "../core/constants"
import { projectNextStepInit, projectNextPhaseInit } from '../core/process'

const db = firebase.firestore()

const ProcessAction = ({ process, processMain, ProjectId, navigation, ...props }) => {

    var currentAction = getCurrentAction(process)
    const { currentPhaseId, currentStepId } = getCurrentStep(process)

    if (currentAction) {
        var { title, status, screenName, screenParams, type, verificationType, choices, responsable } = currentAction

        if (choices) {
            var elements = choices.map((choice) => {
                const element = _.cloneDeep(choice)
                if (element.id === 'confirm') { element.icon = faCheck; element.iconColor = theme.colors.primary }
                else if (element.id === 'finish') { element.icon = faFlag; element.iconColor = theme.colors.primary }
                else if (element.id === 'cancel') { element.icon = faTimes; element.iconColor = theme.colors.error }
                else if (element.id === 'comment') { element.icon = faTimes; element.iconColor = theme.colors.error }
                else if (element.id === 'postpone') { element.icon = faClock; element.iconColor = theme.colors.secondary }
                else if (element.id === 'upload') { element.icon = faUpload; element.iconColor = theme.colors.secondary }
                else if (element.id === 'view') { element.icon = faEye; element.iconColor = theme.colors.secondary }
                else if (element.id === 'sign') { element.icon = faFileSignature; element.iconColor = theme.colors.secondary }
                else if (element.id === 'cashPayment') { element.icon = faSackDollar; element.iconColor = theme.colors.secondary }
                else if (element.id === 'financing') { element.icon = faEnvelopeOpenDollar; element.iconColor = theme.colors.secondary }
                else if (element.id === 'block') { element.icon = faBan; element.iconColor = theme.colors.error }
                return element
            })
        }
    }

    const [showDialog, setShowDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogInputLabel, setDialogInputLabel] = useState('')
    const [choice, setChoice] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loadingModal, setLoadingModal] = useState(false)
    const [nextStep, setNextStep] = useState('')
    const [nextPhase, setNextPhase] = useState('')
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     console.log('choice__________', choice)
    // })

    const CommentDialog = ({ title, inputLabel }) => {
        const [comment, setComment] = useState('')

        if (loading)
            return (
                <Dialog.Container visible={showDialog}>
                    <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>Traitement en cours...</Dialog.Title>
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
        setLoading(true)

        if (choice)
            await runChoiceOperation(choice.operation)

        console.log('NS...', nextStep)
        await validateAction(comment, null, choice, nextStep, nextPhase)
        setLoading(false)
        setShowDialog(false)
    }

    const onSelectChoice = async (choice) => {
        const { nextStep, nextPhase, commentRequired, onSelectType, operation } = choice
        const { screenName, screenParams } = currentAction
        setChoice(choice)  //used in case of comment

        if (onSelectType === 'transition') {
            configNextStepOrPhase(nextStep, nextPhase) //used in case of comment
        }

        if (commentRequired) {
            const configDialogLabels = (choiceId) => {
                switch (choiceId) {
                    case 'postpone': return { title: "Motif du repport", inputLabel: "Expliquez brièvemment la raison du report." }; break;
                    case 'cancel': return { title: "Motif de l'annulation", inputLabel: "Expliquez brièvemment la raison de l'annulation." }; break
                    case 'block': return { title: "Motif de l'annulation", inputLabel: "Expliquez brièvemment la raison de l'annulation." }; break
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

            else if (onSelectType === 'transition') {
                await runChoiceOperation(operation)
                await validateAction(null, null, choice, nextStep, nextPhase)
            }

            else if (onSelectType === 'validation') {
                await runChoiceOperation(operation)
                await validateAction(null, null, null, null, null)
            }

            else if (onSelectType === 'actionDataPicker') {
                await runChoiceOperation(operation)
                await validateAction(null, 'paymentMode', choice, null, null)
            }

            else if (onSelectType === 'actionRollBack') { //roll back to previous action (update its status to "pending")
                await undoPreviousAction()
            }

            setLoadingModal(false)
            setShowModal(false)
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

    const validateAction = async (comment, actionDataField, choice, nextStep, nextPhase) => {

        //Update action fields
        process[currentPhaseId].steps[currentStepId].actions.forEach((action) => {

            if (action.id === currentAction.id) {
                //Update comment
                if (comment) {
                    action[comment] = comment
                }

                //Update action data
                if (actionDataField) {
                    action.actionData = {}
                    action.actionData[actionDataField] = choice.label
                }

                //Update action status
                action.status = "done"
            }
        })

        console.log('next step.............', nextStep)

        //Set nextStep or nextPhase
        if (nextStep) {
            //process[currentPhaseId].steps[currentStepId].nextStep = nextStep
            process = projectNextStepInit(process, currentPhaseId, currentStepId, nextStep)
        }

        else if (nextPhase) {
            //process[currentPhaseId].steps[currentStepId].nextPhase = nextPhase
            process = projectNextPhaseInit(process, nextPhase)
        }

        await db.collection('Projects').doc(ProjectId).update({ process })
        await processMain()
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
                const dialogTitle = "Commentaire"
                const dialogInputLabel = "Veuillez renseigner des informations utiles sur le projet (exp: Informations sur l'habitation)"
                setDialogTitle(dialogTitle)
                setDialogInputLabel(dialogInputLabel)
                setShowDialog(true)
            }

            else if (verificationType === 'multiple-choices') {
                setShowModal(true)
            }

            else if (verificationType === 'validation') {
                await validateAction(null, null, null, null, null)
            }
        }
    }

    const renderForm = () => {

        if (!currentAction) return <Loading />

        if (type === 'auto')
            return (
                <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer, styles.actionContainerAuto]}>
                    <Text style={[theme.customFontMSregular.body]}>{title}</Text>
                    <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                    {currentAction.choices &&
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
                    {currentAction.choices && <CommentDialog />}
                </TouchableOpacity>
            )

        else if (type === 'manual') {
            if (verificationType === 'validation') {
                return (
                    <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer]}>
                        <Text style={[theme.customFontMSregular.body]}>{title}</Text>
                        <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                    </TouchableOpacity>
                )
            }

            if (verificationType === 'multiple-choices') {
                return (
                    <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer, styles.actionContainerMultiChoice]}>
                        <Text style={[theme.customFontMSregular.body]}>{title}</Text>
                        <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                        <ModalOptions
                            title={title}
                            columns={choices.length}
                            isVisible={showModal}
                            isLoading={loadingModal}
                            toggleModal={() => setShowModal(!showModal)}
                            handleCancel={() => console.log('cancel')}
                            handleConfirm={() => console.log('confirm')}
                            elements={elements}
                            autoValidation={true}
                            handleSelectElement={(element, index) => onSelectChoice(element)}
                        />
                        <CommentDialog />
                    </TouchableOpacity>
                )
            }

            else if (verificationType === 'comment') {
                return (
                    <TouchableOpacity onPress={onPressAction} style={[styles.actionContainer, styles.actionContainerComment]}>
                        <Text style={[theme.customFontMSregular.body]}>{title}</Text>
                        <CustomIcon icon={faCheckCircle} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                        <CommentDialog />
                    </TouchableOpacity>
                )
            }
        }
    }

    return renderForm()
}

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    actionContainerAuto: {

    },
    actionContainerMultiChoice: {

    },
    actionContainerComment: {

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