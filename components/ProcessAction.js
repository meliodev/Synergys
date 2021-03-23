
import React, { useState, useEffect, Component } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { List } from 'react-native-paper'
import Dialog from 'react-native-dialog'
import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { faCheckCircle, faInfoCircle, faCheck, faFlag, faTimes, faClock, faUpload, faFileSignature, faSackDollar, faEnvelopeOpenDollar, faEye, faPen, faBan, faSpinner } from '@fortawesome/pro-light-svg-icons'
import { faCheckCircle as faSolidCheckCircle } from '@fortawesome/pro-solid-svg-icons'
import { withNavigation } from 'react-navigation'

import FormSection from './FormSection'
import ModalOptions from './ModalOptions'
import Button from './Button'
import CustomIcon from './CustomIcon'
import Loading from './Loading'
import StepProgress from './process/StepProgress'

import { getCurrentStep, getCurrentAction, handleTransition, getPhaseId, processMain } from '../core/process'
import * as theme from "../core/theme"
import { constants } from "../core/constants"
import { projectNextStepInit, projectNextPhaseInit } from '../core/process'

const db = firebase.firestore()

//props
// initialProcess, project, clientId, step, navigation, ...props 

//component
const CommentDialog = ({ title, inputLabel, showDialog, loadingDialog, dialogTitle, dialogInputLabel }) => {

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

            <Dialog.Button label="Annuler" onPress={() => this.setState({ showDialog: true })} style={{ color: theme.colors.error }} />
            <Dialog.Button label="Valider" onPress={() => onSubmitComment(comment)} style={{ color: theme.colors.primary }} />
        </Dialog.Container>
    )
}

class ProcessAction extends Component {

    constructor(props) {
        super(props);

        this.runProcessAlgorithm = this.runProcessAlgorithm.bind(this)
        this.validateAction = this.validateAction.bind(this)

        this.state = {
            showModal: false,
            showDialog: false,
            expanded: true,
            dialogTitle: '',
            dialogInputLabel: '',
            loadingDialog: false,
            loadingModal: false,
            processUpdated: false,

            process: this.props.initialProcess,
            choice: null,
            nextStep: '',
            nextPhase: '',

            currentPhase: '',
            currentStep: '',
            currentPhaseId: '',
            currentStepId: '',

            currentAction: null,
        }
    }

    async componentDidMount() {
        const { process } = this.state

        await this.runProcessAlgorithm(process)

        this.focusListener = this.props.navigation.addListener('willFocus', async () => {
            //#task do conditional verification (skip it if user just pressed go back)
            await this.runProcessAlgorithm(process)
        })
    }

    async runProcessAlgorithm(process) {

        const { project, clientId, step } = this.props

        console.log('initial process.............', process)

        const secondPhaseId = getPhaseId(step) //used only init process stage //Step <=> Phase
        console.log(process, secondPhaseId, clientId, project)

        const updatedProcess = await processMain(process, secondPhaseId, clientId, project)
        console.log('updated process:', updatedProcess)

        const { currentPhaseId, currentStepId } = getCurrentStep(updatedProcess)

        const currentPhase = updatedProcess[currentPhaseId]
        const currentStep = updatedProcess[currentPhaseId].steps[currentStepId]
        console.log('currentStep', currentStep)

        const currentAction = getCurrentAction(updatedProcess)
        console.log('currentAction:', currentAction)

        this.setState({
            process: updatedProcess,
            currentPhase, currentStep, currentPhaseId, currentStepId,
            currentAction
        })
    }


    //func
    configChoiceIcon = (choice) => {
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



    //func
    onSubmitComment = async (comment) => {
        if (!comment) return //show error message
        this.setState({ loadingDialog: true })

        if (choice)
            await runChoiceOperation(choice.operation)

        await validateAction(comment, null, false, nextStep, nextPhase)
        this.setState({ loadingDialog: false, showDialog: false })
    }

    //func
    onSelectChoice = async (choice) => {
        const { currentAction } = this.state
        const { onSelectType, commentRequired, operation } = choice
        const { screenName, screenParams } = currentAction

        console.log('current action.....................', currentAction)

        if (typeof (choice.selected) === 'boolean') {
            choices.forEach((item) => {
                if (item.label === choice.label) item.selected = true
                else item.selected = false
            })
        }

        this.setState({ choice })  //used in case of comment

        if (onSelectType === 'transition') {
            var { nextStep, nextPhase } = choice
            this.configNextStepOrPhase(nextStep, nextPhase) //used in case of comment
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
            this.setState({ dialogTitle, dialogInputLabel, showModal: false, showDialog: true })
        }

        else {
            this.setState({ loadingModal: true })

            if (onSelectType === 'navigation') {
                this.props.navigation.navigate(screenName, screenParams)
                this.setState({ showModal: false, loadingModal: false })
            }

            else if (onSelectType === 'transition') { //No comment, No "actionData" field -> Choice not needed
                await this.runChoiceOperation(operation)
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }

            else if (onSelectType === 'validation') {
                await this.runChoiceOperation(operation)
                await this.validateAction(null, null, false, null, null)
            }

            else if (onSelectType === 'commentPicker') {
                var { nextStep, nextPhase } = choice
                this.configNextStepOrPhase(nextStep, nextPhase)
                await this.runChoiceOperation(operation)
                await this.validateAction(choice.label, choices, choice.stay, nextStep, nextPhase)
            }

            else if (onSelectType === 'actionRollBack') { //roll back to previous action (update its status to "pending")
                await this.undoPreviousAction()
            }

        }
    }

    //func
    configNextStepOrPhase = (nextStep, nextPhase) => {
        //Set next step or phase
        if (nextStep) {
            this.setState({ nextStep, nextPhase: '' })
        }

        else if (nextPhase) {
            this.setState({ nextStep: '', nextPhase })
        }

        else return
    }

    //func
    runChoiceOperation = async (operation) => {
        if (!operation) return

        const { currentAction } = this.state
        const { collection, documentId } = currentAction
        const { type, field, value } = operation

        if (type === 'update') {
            const update = {}
            update[field] = value
            await db.collection(collection).doc(documentId).update(update).then(() => console.log('Document with Id ', documentId, ' updated:', update))
        }
    }

    //func
    countDown = async (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms)
            }, ms)
        })
    }

    //func
    validateAction = async (comment, choices, stay, nextStep, nextPhase) => {
        const { process, currentPhaseId, currentStepId, currentAction } = this.state

        //Update action fields
        let processTemp = _.cloneDeep(process)
        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {

            if (action.id === currentAction.id) {
                //Update comment
                if (comment)
                    action.comment = comment

                //Update selected choice (selected = true -> UI displays it green colored)
                if (choices)
                    action.choices = choices

                //Update action status
                if (!stay) {
                    action.status = "done"
                    //  action.isAnimation = true
                }
            }

        })

        //  this.setState({ loadingModal: false, showModal: false, process: processTemp })  //isAnimation = true

        console.log('Do animation now !')

        //  await this.countDown(1200)

        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => { //delete isAnimation
            if (action.id === currentAction.id) {
                action.isAnimation = false
            }
        })

        const transitionRes = handleTransition(processTemp, currentPhaseId, currentStepId, nextStep, nextPhase, this.props.project.id)
        processTemp = transitionRes.process

        await this.runProcessAlgorithm(processTemp)
    }

    //func
    undoPreviousAction = async () => {
        const { process, currentPhaseId, currentStepId } = this.state

        const previousActionOrder = currentAction.actionOrder - 1

        let processTemp = _.cloneDeep(process)
        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            if (action.actionOrder === previousActionOrder) {
                //undo action
                action.status = "pending"
            }
        })

        db.collection('Projects').doc(project.id).update({ process: processTemp }) //#task < - Required to succeed / remove await for offline support
        // // await processMain() <- Remove this #task
    }

    //func
    onPressAction = async () => {
        const { currentAction } = this.state
        const { responsable, verificationType, type, screenName, screenParams } = currentAction

        if (responsable && responsable.id !== firebase.auth().currentUser.uid) {
            Alert.alert('Action non autorisée', "Seul un responsable peut effectuer cette opération.")
            return
        }

        if (type === 'auto') {
            if (currentAction.choices) {
                this.setState({ showModal: true })
            }

            else this.props.navigation.navigate(screenName, screenParams)
        }

        else if (type === 'manual') {
            if (verificationType === 'comment') {
                const { nextStep, nextPhase } = currentAction
                this.configNextStepOrPhase(nextStep, nextPhase)

                const dialogTitle = "Commentaire"
                const dialogInputLabel = "Veuillez renseigner des informations utiles."
                this.setState({ dialogTitle, dialogInputLabel })
                this.setState({ showDialog: true })
            }

            else if (verificationType === 'multiple-choices') {
                this.setState({ showModal: true })
            }

            else if (verificationType === 'validation') {
                const { nextStep, nextPhase } = currentAction
                await validateAction(null, null, false, nextStep, nextPhase)
            }
        }
    }

    //renderer
    renderAction = () => {
        const { currentAction, showModal, showDialog, loadingDialog, dialogTitle, dialogInputLabel } = this.state

        if (currentAction) {
            var { title, status, verificationType, choices } = currentAction

            if (choices) {
                var elements = choices.map((choice) => this.configChoiceIcon(choice))
            }
        }

        return (
            <TouchableOpacity onPress={this.onPressAction} style={styles.actionContainer}>
                <View style={styles.actionTitleContainer}>
                    <Text style={[theme.customFontMSmedium.caption]}>{title}</Text>
                </View>

                <View style={styles.actionIconsContainer}>
                    <CustomIcon icon={status === 'pending' ? faCheckCircle : faSolidCheckCircle} size={19} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                    <CustomIcon icon={faInfoCircle} size={19} color={theme.colors.gray_dark} onPress={() => Alert.alert('Instructions', currentAction.instructions)} />
                </View>

                {currentAction && currentAction.choices &&
                    <ModalOptions
                        title={title}
                        columns={choices.length}
                        isVisible={showModal}
                        toggleModal={() => this.setState({ showModal: !showModal })}
                        handleCancel={() => console.log('cancel')}
                        handleConfirm={() => console.log('confirm')}
                        elements={elements}
                        autoValidation={true}
                        handleSelectElement={(element, index) => this.onSelectChoice(element)}
                    />
                }

                {(currentAction && currentAction.choices || verificationType === 'comment') && (
                    <CommentDialog
                        showDialog={showDialog}
                        loadingDialog={loadingDialog}
                        dialogTitle={dialogTitle}
                        dialogInputLabel={dialogInputLabel} />)
                }
            </TouchableOpacity>
        )
    }

    render() {
        const { process, currentPhase, currentStep, currentPhaseId, currentStepId, currentAction, processUpdated, expanded } = this.state

        if (!currentAction && !currentPhase && !currentStep) return <Loading style={{ paddingVertical: 50 }} />
        else return (
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
                    onPress={() => this.setState({ expanded: !expanded })}>

                    <View style={{ paddingVertical: 15, paddingLeft: 0, paddingRight: 0, marginHorizontal: 5 }}>
                        {this.renderAction()}
                    </View>

                </List.Accordion>
            </View>
        )
    }

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