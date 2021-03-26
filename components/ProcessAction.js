
import React, { useState, useEffect, Component } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { List } from 'react-native-paper'
import Dialog from 'react-native-dialog'
import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { faCheckCircle, faInfoCircle } from '@fortawesome/pro-light-svg-icons'
import { faCheckCircle as faSolidCheckCircle } from '@fortawesome/pro-solid-svg-icons'
import { withNavigation } from 'react-navigation'

import FormSection from './FormSection'
import ModalOptions from './ModalOptions'
import Button from './Button'
import CustomIcon from './CustomIcon'
import Loading from './Loading'
import StepProgress from './process/StepProgress'

import { getCurrentStep, getCurrentAction, handleTransition, getPhaseId, projectProcessHandler } from '../core/process'
import { configChoiceIcon } from '../core/utils'
import * as theme from "../core/theme"
import { constants } from "../core/constants"

const db = firebase.firestore()



//component
const CommentDialog = ({ title, inputLabel, showDialog, loadingDialog, dialogTitle, dialogInputLabel, onSubmitComment, hideDialog, choice, nextStep, nextPhase }) => {

    const [comment, setComment] = useState('')
    const emptyComment = () => setComment('')

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

            <Dialog.Button label="Annuler" onPress={hideDialog} style={{ color: theme.colors.error }} />
            <Dialog.Button label="Valider" onPress={() => onSubmitComment(comment, choice, nextStep, nextPhase, emptyComment)} style={{ color: theme.colors.primary }} />
        </Dialog.Container>
    )
}

class ProcessAction extends Component {

    constructor(props) {
        super(props);

        this.runProcessHandler = this.runProcessHandler.bind(this)
        this.validateAction = this.validateAction.bind(this)
        this.undoPreviousAction = this.undoPreviousAction.bind(this)
        this.updateProcess = this.updateProcess.bind(this)
        this.refreshProcess = this.refreshProcess.bind(this)

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
            loading: false
        }
    }

    async componentDidMount() {
        const { process } = this.state
        const { project } = this.props

        this.setState({ loading: true })
        await this.runProcessHandler(process)
        this.setState({ loading: false })

        this.focusListener = this.props.navigation.addListener('didFocus', async () => { //#task do conditional verification (skip it if user just pressed go back)
            console.log('000000000000000000000000000000000000000000000000000000000000')
            this.setState({ loading: true })
            await this.runProcessHandler(this.state.process)
            this.setState({ loading: false })
        })

        db.collection('Projects').doc(project.id).onSnapshot((doc) => {
            if (doc.exists) {
                const updatedProcess = doc.data().process
                this.refreshProcess(updatedProcess)
            }
        })
    }

    async runProcessHandler(process) {
        const { project, clientId, step } = this.props
        const secondPhaseId = getPhaseId(step)

        const updatedProcess = await projectProcessHandler(process, secondPhaseId, clientId, project)

        if (!_.isEqual(process, updatedProcess)) {
            await this.updateProcess(updatedProcess)
        }

        else {
            console.log('process is same....')
            this.refreshProcess(updatedProcess)
        }
    }


    async updateProcess(updatedProcess) {
        const { project } = this.props
        await db.collection('Projects').doc(project.id).update({ process: updatedProcess })
    }

    refreshProcess(updatedProcess) {

        const { currentPhaseId, currentStepId } = getCurrentStep(updatedProcess)
        const currentPhase = updatedProcess[currentPhaseId]
        const currentStep = updatedProcess[currentPhaseId].steps[currentStepId]
        const currentAction = getCurrentAction(updatedProcess)

        this.setState({
            process: updatedProcess,
            currentPhase, currentStep, currentPhaseId, currentStepId,
            currentAction,
            nextStep: '', nextPhase: ''
        })
    }

    //func
    onSubmitComment = async (comment, choice, nextStep, nextPhase, emptyComment) => {
        if (!comment) return //show error message
        this.setState({ loadingDialog: true })

        await this.runChoiceOperation(choice.operation)
        await this.validateAction(comment, null, false, nextStep, nextPhase)

        this.setState({ loadingDialog: false, showDialog: false })
        emptyComment()
    }

    //func
    onSelectChoice = async (choice) => {
        this.setState({ choice })  //used in case of comment

        const { currentAction } = this.state
        const { screenName, screenParams, choices } = currentAction
        const { onSelectType, commentRequired, operation } = choice
        var { nextStep, nextPhase } = choice

        this.configNextStepOrPhase(nextStep, nextPhase) //used in case of comment

        if (typeof (choice.selected) === 'boolean') {
            choices.forEach((item) => {
                if (item.label === choice.label) item.selected = true
                else item.selected = false
            })
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
            return
        }

        else {
            this.setState({ loadingModal: true })

            if (onSelectType === 'navigation') {
                this.props.navigation.navigate(screenName, screenParams)
            }

            else if (onSelectType === 'actionRollBack') { //roll back to previous action (update its status to "pending")
                await this.undoPreviousAction()
            }

            else if (onSelectType === 'transition') { //No comment, No "actionData" field -> Choice not needed
                await this.runChoiceOperation(operation)
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }

            else if (onSelectType === 'validation') {
                this.setState({ loadingModal: true })
                // await this.runChoiceOperation(operation)
                // await this.validateAction(null, null, false, null, null)
            }

            else if (onSelectType === 'commentPicker') {
                await this.runChoiceOperation(operation)
                await this.validateAction(choice.label, choices, choice.stay, nextStep, nextPhase)
            }

            this.setState({ showModal: false, loadingModal: false })
        }
        return
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
        // let actionTemp

        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            // actionTemp = action

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
                    //actionTemp.isAnimation = true
                }
            }

        })


        this.setState({
            loadingModal: false
            //currentAction: actionTemp
        })  //isAnimation = true

        // // console.log('Do animation now !')

        // // await this.countDown(1000)

        if (nextStep || nextPhase) {
            const transitionRes = handleTransition(processTemp, currentPhaseId, currentStepId, nextStep, nextPhase, this.props.project.id)
            processTemp = transitionRes.process

            console.log('HELLO', processTemp.endProject)
        }

        await this.updateProcess(processTemp)
        await this.runProcessHandler(processTemp)
    }

    //func
    undoPreviousAction = async () => {
        const { process, currentPhaseId, currentStepId, currentAction } = this.state

        const previousActionOrder = currentAction.actionOrder - 1

        let processTemp = _.cloneDeep(process)
        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            if (action.actionOrder === previousActionOrder) {
                //undo action
                action.status = "pending"
            }
        })

        await this.updateProcess(processTemp)

        // await this.runProcessHandler(processTemp)
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
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }
        }
    }

    //renderer
    renderAction = () => {
        const { currentAction, showModal, showDialog, loadingDialog, dialogTitle, dialogInputLabel, nextStep, nextPhase, loadingModal, choice, loading } = this.state

        if (currentAction) {
            var { title, status, verificationType, choices } = currentAction

            if (choices) {
                var elements = choices.map((choice) => configChoiceIcon(choice))
            }
        }

        return (
            <TouchableOpacity onPress={this.onPressAction} style={styles.actionContainer}>
                <View style={styles.actionTitleContainer}>
                    <Text style={[theme.customFontMSregular.caption]}>{loading ? "Chargement de l'action à faire..." : title}</Text>
                </View>

                {loading ?
                    <View style={styles.actionIconsContainer}>
                        <ActivityIndicator size='small' color={theme.colors.white} />
                        <ActivityIndicator size='small' color={theme.colors.primary} />
                    </View>
                    :
                    <View style={styles.actionIconsContainer}>
                        <CustomIcon icon={status === 'pending' ? faCheckCircle : faSolidCheckCircle} size={19} color={status === 'pending' ? theme.colors.gray_dark : theme.colors.primary} />
                        <CustomIcon icon={faInfoCircle} size={19} color={theme.colors.gray_dark} onPress={() => Alert.alert('Instructions', currentAction.instructions)} />
                    </View>
                }

                {currentAction && currentAction.choices &&
                    <ModalOptions
                        title={title}
                        columns={choices.length}
                        isVisible={showModal}
                        isLoading={loadingModal}
                        toggleModal={() => this.setState({ showModal: !showModal })}
                        handleCancel={() => console.log('cancel')}
                        handleConfirm={() => console.log('confirm')}
                        elements={elements}
                        isReview={currentAction.isReview}
                        autoValidation={true}
                        handleSelectElement={(element, index) => this.onSelectChoice(element)}
                    />
                }

                {(currentAction && currentAction.choices || verificationType === 'comment') && (
                    <CommentDialog
                        showDialog={showDialog}
                        loadingDialog={loadingDialog}
                        dialogTitle={dialogTitle}
                        dialogInputLabel={dialogInputLabel}
                        hideDialog={() => this.setState({ showDialog: false })}
                        onSubmitComment={this.onSubmitComment}
                        choice={choice}
                        nextStep={nextStep}
                        nextPhase={nextPhase} />
                )}
            </TouchableOpacity>
        )
    }

    render() {
        const { process, currentPhase, currentStep, currentPhaseId, currentStepId, currentAction, processUpdated, expanded, loading } = this.state
        const stepTitle = currentStep ? `${currentStep.stepOrder}. ${currentStep.title}` : "Chargement de l'étape..."

        return (
            <View style={styles.container}>

                <View style={{ backgroundColor: theme.colors.primary, borderTopRightRadius: 10, borderTopLeftRadius: 10, paddingVertical: 5 }}>
                    <Text style={[theme.customFontMSregular.body, { color: theme.colors.white, textAlign: 'center' }]}>Suivi du projet</Text>
                </View>

                <List.Accordion
                    showArrow
                    style={{ paddingVertical: 15, paddingHorizontal: 10, marginLeft: 0, borderBottomWidth: expanded ? StyleSheet.hairlineWidth * 2 : 0, borderBottomColor: theme.colors.gray_light }}
                    title={currentPhase.title || "Chargement de la phase..."}
                    description={stepTitle}
                    titleNumberOfLines={1}
                    descriptionNumberOfLines={1}
                    left={props => currentAction && <StepProgress progress={((currentAction.actionOrder - 1) / currentStep.actions.length) * 100} style={{ marginTop: 25, marginRight: 2 }} />}
                    expanded={expanded}
                    titleStyle={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, marginBottom: 5 }]}
                    descriptionStyle={[theme.customFontMSregular.header, { color: theme.colors.secondary }]}
                    onPress={() => this.setState({ expanded: !expanded })}>

                    <View style={{ height: 50, paddingLeft: 0, paddingRight: 0, marginHorizontal: 5 }}>
                        {this.renderAction()}
                    </View>

                </List.Accordion>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: theme.colors.white,
        margin: 15,
    },
    actionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
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



//#bug: on choosing Dossier action logement: Visite technique n'est pas crée (rajouter un fonction pour créer la VT si elle n'existe pas) 


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