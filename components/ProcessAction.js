
import React, { useState, useEffect, Component } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { List } from 'react-native-paper'
import Dialog from 'react-native-dialog'
import firebase, { db } from '../firebase'
import _ from 'lodash'
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimesCircle } from '@fortawesome/pro-light-svg-icons'
import { faCheckCircle as faSolidCheckCircle, faEye } from '@fortawesome/pro-solid-svg-icons'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'

import CommentDialog from './CommentDialog'
import ModalOptions from './ModalOptions'
import CustomIcon from './CustomIcon'
import StepProgress from './process/StepProgress'
import Loading from './Loading'

import { getCurrentStep, getCurrentAction, handleTransition, getPhaseId, projectProcessHandler, getLatestProcessModel } from '../core/process'
import { enableProcessAction } from '../core/privileges'
import { configChoiceIcon, load } from '../core/utils'
import * as theme from "../core/theme"
import { constants } from "../core/constants"
import ProcessContainer from "../screens/src/container/ProcessContainer"

//component
class ProcessAction extends Component {

    constructor(props) {
        super(props)

        this.refreshProcessHistory = this.refreshProcessHistory.bind(this)
        this.runProcessHandler = this.runProcessHandler.bind(this)
        this.validateAction = this.validateAction.bind(this)
        this.undoPreviousAction = this.undoPreviousAction.bind(this)
        this.updateProcess = this.updateProcess.bind(this)
        this.refreshProcess = this.refreshProcess.bind(this)
        this.navigateToProgression = this.navigateToProgression.bind(this)

        this.state = {
            showModal: false,
            showDialog: false,
            expanded: true,
            dialogTitle: '',
            dialogDescription: '',
            loadingDialog: false,
            loadingModal: false,

            process: this.props.initialProcess,
            choice: null,
            nextStep: '',
            nextPhase: '',

            currentPhase: '',
            currentStep: '',
            currentPhaseId: '',
            currentStepId: '',

            phaseLabels: [],
            phaseStatuses: [],
            stepsData: [],

            currentAction: null,
            pressedAction: null,
            loading: false
        }
    }

    async componentDidMount() {

        let { process } = this.state
        const { processModels, initialProcess, project, isAllProcess, canUpdate } = this.props
        const { version } = initialProcess
        this.processModel = processModels[version].process

        load(this, true)
        await this.runProcessHandler(process)
        load(this, false)

        this.focusListener = this.props.navigation.addListener('willFocus', async () => { //#task do conditional verification (skip it if user just pressed go back)
            load(this, true)
            await this.runProcessHandler(this.state.process)
            load(this, false)
        })

        this.unsubscribeProcessListener = db.collection('Projects').doc(project.id).onSnapshot((doc) => {
            if (doc.exists) {
                //#Task should runProcessHandler in case another user submits the last action
                const updatedProcess = doc.data().process
                this.refreshProcess(updatedProcess)

                if (isAllProcess) {
                    this.refreshProcessHistory(updatedProcess)
                }
            }
        })
    }

    sortPhases(process) {
        const procesTemp = Object.entries(process).sort(([keyA, valueA], [keyB, valueB]) => {
            return (valueA.phaseOrder > valueB.phaseOrder ? 1 : -1)
        })
        process = Object.fromEntries(procesTemp)
        return process
    }

    componentWillUnmount() {
        //this.focusListener()
        // if (this.unsubscribeProcessListener)
        //     this.unsubscribeProcessListener()
    }

    async runProcessHandler(process) {

        const { project, clientId, step } = this.props
        const secondPhaseId = getPhaseId(step)
        const copyProcessModel = _.cloneDeep(this.processModel)
        const updatedProcess = await projectProcessHandler(copyProcessModel, process, secondPhaseId, clientId, project)

        //if (!_.isEqual(process, updatedProcess)) {
        await this.updateProcess(updatedProcess)
        // }

        // else { //#task: use this for writes optimization
        //     console.log('PROCESS SAME...')
        //     this.refreshProcess(updatedProcess)
        // }
    }

    async updateProcess(updatedProcess) {
        const { project } = this.props
        await db.collection('Projects').doc(project.id).update({ process: updatedProcess })
    }

    refreshProcessHistory(process) {
        let phaseLabels = []
        let phaseStatuses = []
        let steps = []

        process = this.sortPhases(process)

        for (let phaseId in process) {
            const processData = process[phaseId]
            phaseLabels.push(processData.title)

            let phaseSteps = []
            let phaseStatus = 'done'
            for (let stepId in processData.steps) {
                let step = processData.steps[stepId]

                let actionsDoneCount = 0
                for (let action of step.actions) {
                    if (action.status === 'done')
                        actionsDoneCount += 1
                }
                step.actions.sort((a, b) => (a.actionOrder > b.actionOrder) ? 1 : -1)

                //Step & Phase progress
                step.progress = actionsDoneCount / step.actions.length * 100
                if (step.progress < 100)
                    phaseStatus = 'pending'

                phaseSteps.push(step)
            }

            phaseStatuses.push(phaseStatus)
            phaseSteps.sort((a, b) => (a.stepOrder > b.stepOrder) ? 1 : -1)
            steps.push(phaseSteps)
        }

        this.setState({ process, phaseLabels, phaseStatuses, stepsData: steps })
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
    onSubmitComment = async (comment, clearComment) => {
        const { currentAction, choice, nextStep, nextPhase } = this.state
        const operation = choice && choice.operation || currentAction.operation || null

        if (!comment) return //show error message
        this.setState({ loadingDialog: true })

        if (operation) operation.value = comment
        await this.runChoiceOperation(operation, currentAction)
        await this.validateAction(comment, null, false, nextStep, nextPhase)

        this.setState({ loadingDialog: false, showDialog: false })
        clearComment()
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
            const dialogDescription = configDialogLabels(choice.id).inputLabel
            this.setState({ dialogTitle, dialogDescription, showModal: false, showDialog: true })
            return
        }

        else {
            this.setState({ loadingModal: true })

            if (onSelectType === 'navigation') {
                screenParams.isProcess = true
                this.props.navigation.navigate(screenName, screenParams)
            }

            else if (onSelectType === 'actionRollBack') { //roll back to previous action (update its status to "pending")
                await this.undoPreviousAction()
            }

            else if (onSelectType === 'transition') { //No comment, No "actionData" field -> Choice not needed
                await this.runChoiceOperation(operation, currentAction)
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }

            else if (onSelectType === 'validation') {
                await this.runChoiceOperation(operation, currentAction)
                await this.validateAction(null, null, false, null, null, true)
            }

            else if (onSelectType === 'commentPicker') {
                await this.runChoiceOperation(operation, currentAction)
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
    runChoiceOperation = async (operation, currentAction) => {
        if (!operation) return

        const { collection, documentId } = currentAction
        const { type, field, value } = operation

        if (type === 'update') {
            let update = {}
            update[field] = value
            await db.collection(collection).doc(documentId).update(update)
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
    validateAction = async (comment, choices, stay, nextStep, nextPhase, forceUpdate = false) => {
        const { process, currentPhaseId, currentStepId, currentAction } = this.state

        //Update action fields
        let processTemp = _.cloneDeep(process)
        //let actionTemp

        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            //  actionTemp = action

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
                    //  actionTemp.isAnimation = true
                }
            }

        })

        this.setState({
            // loadingModal: false,
            // currentAction: actionTemp, //for check animation
            currentStep: processTemp[currentPhaseId].steps[currentStepId] //for progress animation
        })

        // console.log('Do animation now !')

        await this.countDown(1000)

        if (nextStep || nextPhase) {
            const transitionRes = handleTransition(this.processModel, processTemp, currentPhaseId, currentStepId, nextStep, nextPhase, this.props.project.id)
            processTemp = transitionRes.process
        }

        // await this.updateProcess(processTemp) //#test: removed this as it seems useless (runProcessHandler calls it after runProcessHandler returns updatedProcess)
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
        //await this.runProcessHandler(processTemp)
    }

    //func
    onPressAction = async (canUpdate, currentAction) => {
        if (!canUpdate) return

        const { currentPhase } = this.state
        const { responsable, verificationType, type, screenName, screenParams } = currentAction
        const currentUserId = firebase.auth().currentUser.uid
        const currentUserRole = this.props.role.value

        const enabledAction = enableProcessAction(responsable, currentUserId, currentUserRole, currentPhase)
        if (!enabledAction) {
            Alert.alert('Action non autorisée', "Seul un responsable peut effectuer cette opération.")
            return
        }

        if (type === 'auto') {
            if (currentAction.choices) {
                this.setState({ showModal: true, pressedAction: currentAction })
            }

            else {
                screenParams.isProcess = true
                this.props.navigation.navigate(screenName, screenParams)
            }
        }

        else if (type === 'manual') {
            if (verificationType === 'comment') {
                const { nextStep, nextPhase, formSettings } = currentAction

                this.configNextStepOrPhase(nextStep, nextPhase)

                const dialogTitle = formSettings && formSettings.label || 'Commentaire'
                const dialogDescription = formSettings && formSettings.description || "Veuillez renseigner des informations utiles."
                this.setState({ dialogTitle, dialogDescription })
                this.setState({ showDialog: true })
            }

            else if (verificationType === 'multiple-choices') {
                this.setState({ showModal: true, pressedAction: currentAction })
            }

            else if (verificationType === 'validation') {
                const { nextStep, nextPhase } = currentAction
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }
        }
    }

    //renderers
    renderAction = (canUpdate, action) => {

        const currentAction = action || this.state.currentAction
        if (!currentAction) return null

        const { loading } = this.state
        const loadingMessage = action ? "Chargement de l'action..." : "Chargement de l'action à faire..."

        var { title, status, verificationType, choices } = currentAction
        var isComment = typeof (currentAction.comment) !== 'undefined' && currentAction.comment !== ''
        const isDialog = choices || verificationType === 'comment'

        return (
            <View style={styles.action}>
                <TouchableOpacity onPress={() => this.onPressAction(canUpdate, currentAction)} style={styles.actionTouchable}>
                    <View style={styles.actionTitleContainer}>
                        {!loading &&
                            <CustomIcon
                                style={{ marginRight: 5 }}
                                icon={currentAction.id === 'cancelProject' ? faTimesCircle : status === 'pending' ? faCheckCircle : faSolidCheckCircle} size={19} color={currentAction.id === 'cancelProject' ? theme.colors.error : status === 'pending' ? theme.colors.gray_dark : theme.colors.primary}
                            />
                        }
                        <Text style={[theme.customFontMSregular.caption, { marginLeft: 7 }]}>{loading ? loadingMessage : title}</Text>
                    </View>

                    {loading ?
                        <View style={styles.actionIconsContainer}>
                            <ActivityIndicator size='small' color={theme.colors.white} />
                            <ActivityIndicator size='small' color={theme.colors.primary} />
                        </View>
                        :
                        <View style={[styles.actionIconsContainer, { justifyContent: isComment ? 'space-between' : 'flex-end' }]}>
                            {isComment &&
                                <CustomIcon
                                    icon={faExclamationCircle}
                                    size={16}
                                    color={theme.colors.gray_dark}
                                    onPress={() => Alert.alert('Commentaire', currentAction.comment)}
                                />
                            }
                            <CustomIcon
                                icon={faInfoCircle}
                                size={16}
                                color={theme.colors.gray_dark}
                                onPress={() => Alert.alert('Instructions', currentAction.instructions)}
                            />
                        </View>
                    }

                    {isDialog && this.renderDialog(currentAction.formSettings)}
                </TouchableOpacity>
            </View>
        )
    }

    renderDialog = (formSettings) => {
        const { showDialog, dialogTitle, dialogDescription, loadingDialog, loading } = this.state
        return (
            <CommentDialog
                isVisible={showDialog}
                title={dialogTitle}
                description={dialogDescription}
                keyboardType={formSettings && formSettings.keyboardType}
                onSubmit={this.onSubmitComment}
                onCancel={() => this.setState({ showDialog: false })}
                loading={loadingDialog}
            />
        )
    }

    renderModal = () => {
        const { pressedAction: currentAction, showModal, loadingModal } = this.state

        if (currentAction) {
            var { title, choices } = currentAction

            if (choices) {
                var elements = choices.map((choice) => configChoiceIcon(choice))
            }
        }

        return (
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
        )
    }

    navigateToProgression(process) {
        const { project, clientId, step, canUpdate, role } = this.props
        const navParams = { process, project, clientId, step, canUpdate, role }
        this.props.navigation.navigate('Progression', navParams)
    }

    renderHeaderBar() {
        return (
            <View style={styles.headerBarContainer}>
                <Text style={[theme.customFontMSregular.body, styles.headerBarText]}>Suivi du projet</Text>
                <TouchableOpacity style={styles.progressionLink}>
                    <CustomIcon
                        onPress={() => this.navigateToProgression(process)}
                        icon={faEye}
                        color={theme.colors.white}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderAccordion(canUpdate) {
        const { expanded, currentPhase, currentStep } = this.state
        const stepTitle = currentStep ? `${currentStep.stepOrder}. ${currentStep.title}` : "Chargement de l'étape..."
        const doneActions = currentStep && currentStep.actions.filter((action) => action.status === 'done') || []
        const totalActions = currentStep && currentStep.actions.length || 0
        console.log('...........')
        var progress = (doneActions.length / totalActions) * 100
        const borderBottomWidth = expanded ? StyleSheet.hairlineWidth * 2 : 0

        return (
            <List.Accordion
                showArrow
                style={[styles.accordion, { borderBottomWidth }]}
                title={currentPhase.title || "Chargement de la phase..."}
                description={stepTitle}
                titleNumberOfLines={1}
                descriptionNumberOfLines={1}
                left={props => <StepProgress progress={progress} style={{ marginTop: 25, marginRight: 2 }} />}
                expanded={expanded}
                titleStyle={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, marginBottom: 5 }]}
                descriptionStyle={[theme.customFontMSregular.body, { color: theme.colors.secondary }]}
                onPress={() => this.setState({ expanded: !expanded })}>

                {this.renderAction(canUpdate, null)}

            </List.Accordion >
        )
    }

    renderProcessContainer(canUpdate) {
        const { process, currentPage, phaseLabels, phaseStatuses, stepsData } = this.state
        return (
            <ProcessContainer
                process={process}
                currentPage={currentPage}
                phaseLabels={phaseLabels}
                phaseStatuses={phaseStatuses}
                stepsData={stepsData}
                canUpdate={canUpdate}
                renderAction={this.renderAction}
            />
        )
    }

    render() {
        const { pressedAction } = this.state
        const { canUpdate, isAllProcess } = this.props

        if (isAllProcess) {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderProcessContainer(canUpdate)}
                    {pressedAction && pressedAction.choices && this.renderModal()}
                </View>
            )
        }

        else return (
            <View style={styles.container}>
                {this.renderHeaderBar()}
                {this.renderAccordion(canUpdate)}
                {pressedAction && pressedAction.choices && this.renderModal()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 5,
        borderRadius: 5,
        backgroundColor: theme.colors.white,
        margin: 15,
    },
    headerBarContainer: {
        backgroundColor: theme.colors.primary,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingVertical: 5
    },
    headerBarText: {
        color: theme.colors.white,
        textAlign: 'center'
    },
    progressionLink: {
        zIndex: 1,
        position: 'absolute',
        top: 2,
        right: theme.padding,
        justifyContent: 'center',
        alignItems: 'center'
    },
    accordion: {
        paddingVertical: 10,
        paddingHorizontal: 13,
        marginLeft: 0,
        borderBottomColor: theme.colors.gray_light
    },
    action: {
        height: 50,
        paddingLeft: 0,
        paddingRight: 0,
        marginHorizontal: 5
    },
    actionTouchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        //backgroundColor: 'pink'
        //paddingHorizontal: 5
    },
    actionTitleContainer: {
        flex: 0.9,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'brown'
    },
    actionIconsContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        //  backgroundColor: 'green'
    }
})

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        processModels: state.process.processModels
        //fcmToken: state.fcmtoken
    }
}

export default withNavigation(connect(mapStateToProps)(ProcessAction))
