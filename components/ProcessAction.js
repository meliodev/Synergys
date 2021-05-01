
import React, { useState, useEffect, Component } from "react"
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { List } from 'react-native-paper'
import Dialog from 'react-native-dialog'
import firebase, { db, auth } from '../firebase'
import _ from 'lodash'
import { faCheckCircle, faExclamationCircle, faInfoCircle, faRedo, faTimesCircle } from '@fortawesome/pro-light-svg-icons'
import { faCheckCircle as faSolidCheckCircle, faEye } from '@fortawesome/pro-solid-svg-icons'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'

import CommentDialog from './CommentDialog'
import ModalOptions from './ModalOptions'
import CustomIcon from './CustomIcon'
import StepProgress from './process/StepProgress'
import Loading from './Loading'

import { getCurrentStep, getCurrentAction, handleTransition, getPhaseId, processHandler, getLatestProcessModel, checkForcedValidations } from '../core/process'
import { enableProcessAction } from '../core/privileges'
import { configChoiceIcon, countDown, load } from '../core/utils'
import * as theme from "../core/theme"
import { constants } from "../core/constants"
import ProcessContainer from "../screens/src/container/ProcessContainer"

//component
class ProcessAction extends Component {

    constructor(props) {
        super(props)

        this.refresh = this.refresh.bind(this)
        this.mainHandler = this.mainHandler.bind(this)
        this.runProcessHandler = this.runProcessHandler.bind(this)
        this.updateProcess = this.updateProcess.bind(this)
        this.refreshProcess = this.refreshProcess.bind(this)
        this.refreshProcessHistory = this.refreshProcessHistory.bind(this)
        this.validateAction = this.validateAction.bind(this)
        this.undoPreviousAction = this.undoPreviousAction.bind(this)

        this.processModel = this.setProcessModel()

        this.state = {

            process: {},
            choice: null,
            nextStep: '',
            nextPhase: '',

            currentPhase: null,
            currentStep: null,
            currentPhaseId: '',
            currentStepId: '',

            phaseLabels: [],
            phaseStatuses: [],
            stepsData: [],

            currentAction: null,
            pressedAction: null,

            showModal: false,
            showDialog: false,
            expanded: true,
            dialogTitle: '',
            dialogDescription: '',
            loadingDialog: false,
            loadingModal: false,
            loading: true
        }
    }

    setProcessModel() {
        const { initialProcess, processModels } = this.props
        const { version } = initialProcess
        const processModel = processModels[version].process
        return processModel
    }

    async componentDidMount() {
        await this.refresh()
    }

    async refresh() {
        const process = await this.fetchProcess()
        await this.mainHandler(process)
    }

    async fetchProcess() {
        return db
            .collection('Projects')
            .doc(this.props.project.id)
            .get()
            .then((doc) => { return doc.data().process })
    }

    async updateProcess(updatedProcess) {
        await db
            .collection('Projects')
            .doc(this.props.project.id)
            .update({ process: updatedProcess })
    }

    async mainHandler(process) {
        load(this, true)
        const { isAllProcess } = this.props
        const updatedProcess = await this.runProcessHandler(process)
        await this.updateProcess(updatedProcess)
        this.refreshProcess(updatedProcess)
        if (isAllProcess) {
            this.refreshProcessHistory(updatedProcess)
        } 
        load(this, false)
    }

    async runProcessHandler(process) {
        const { project, clientId, step } = this.props
        const secondPhaseId = getPhaseId(step)
        const copyProcessModel = _.cloneDeep(this.processModel)
        var updatedProcess = await processHandler(copyProcessModel, process, secondPhaseId, clientId, project)
        return updatedProcess
    }

    //3. Refresh latest process locally
    refreshProcess(process) {
        const { currentPhaseId, currentStepId } = getCurrentStep(process)
        const currentPhase = process[currentPhaseId]
        const currentStep = process[currentPhaseId].steps[currentStepId]
        const currentAction = getCurrentAction(process)

        this.setState({
            process,
            currentPhase, currentStep,
            currentPhaseId, currentStepId,
            currentAction,
            nextStep: '', nextPhase: ''
        })
    }

    //3. Refresh Process History locally
    refreshProcessHistory(process) {

        delete process.version

        let phaseLabels = []
        let phaseStatuses = []
        let steps = []

        for (const phaseId in this.processModel) {
            if (!process[phaseId] && phaseId !== 'cancelProject' && phaseId !== 'endProject') {
                let phase = _.cloneDeep(this.processModel[phaseId])
                delete phase.steps
                process[phaseId] = phase
            }
        }

        process = this.sortPhases(process)

        for (let phaseId in process) {
            const processData = process[phaseId]
            phaseLabels.push(processData.title)

            let phaseSteps = []
            let phaseStatus = processData.steps ? 'done' : 'grayed'
            for (let stepId in processData.steps) {
                let step = processData.steps[stepId]

                let actionsDoneCount = 0
                for (let action of step.actions) {
                    if (action.status === 'done')
                        actionsDoneCount += 1
                }
                step.actions.sort((a, b) => (a.actionOrder > b.actionOrder) ? 1 : -1)

                //Step & Phase progress
                step.progress = step.actions.length === 0 ? 100 : actionsDoneCount / step.actions.length * 100

                if (step.progress < 100)
                    phaseStatus = 'pending'

                phaseSteps.push(step)
            }

            phaseStatuses.push(phaseStatus)
            phaseSteps.sort((a, b) => (a.stepOrder < b.stepOrder) ? 1 : -1)
            steps.push(phaseSteps)
        }

        this.setState({ phaseLabels, phaseStatuses, stepsData: steps })
    }

    //func1
    onPressAction = async (canUpdate, currentAction) => {
        if (!canUpdate) return

        this.setState({ pressedAction: currentAction })
        const { responsable, verificationType, type, screenName, screenParams, nextStep, nextPhase, formSettings } = currentAction
        const { process, currentPhase } = this.state
        const currentUserId = auth.currentUser.uid
        const currentUserRole = this.props.role.value

        const enableAction = enableProcessAction(responsable, currentUserId, currentUserRole, currentPhase)
        if (!enableAction) {
            Alert.alert('Action non autorisée', "Seul un responsable peut effectuer cette opération.")
            return
        }

        if (type === 'auto') {
            //Modal
            if (currentAction.choices) {
                this.setState({ showModal: true })
            }

            //Navigation
            else {
                screenParams.isProcess = true
                screenParams.onGoBack = () => this.mainHandler(process)
                this.props.navigation.navigate(screenName, screenParams)
            }
        }

        else if (type === 'manual') {
            //Dialog
            if (verificationType === 'comment') {
                this.setNextStepOrPhase(nextStep, nextPhase) //To use later it onSubmit comment
                const dialogTitle = formSettings && formSettings.label || 'Commentaire'
                const dialogDescription = formSettings && formSettings.description || "Veuillez renseigner des informations utiles."
                this.setState({ dialogTitle, dialogDescription, showDialog: true })
            }

            //Modal
            else if (verificationType === 'multiple-choices') {
                this.setState({ showModal: true })
            }

            //Direct
            else if (verificationType === 'validation') {
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }

            else if (verificationType === 'phaseRollback') {
                await this.runOperation(currentAction.operation, currentAction) //Exp: update project status back to 'En cours'
                await this.phaseRollback()
            }
        }
    }

    async phaseRollback() {
        const { process, currentPhaseId } = this.state
        let processTemp = _.cloneDeep(process)
        delete processTemp[currentPhaseId]
        await this.updateProcess(processTemp)
    }

    undoPreviousAction = async () => {
        const { process, currentPhaseId, currentStepId, pressedAction } = this.state

        const previousActionOrder = pressedAction.actionOrder - 1

        let processTemp = _.cloneDeep(process)
        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            if (action.actionOrder === previousActionOrder) {
                action.status = "pending"
            }
        })

        await this.updateProcess(processTemp)
    }

    //func2
    onSelectChoice = async (choice) => {
        this.setState({ choice })  //used in case of comment

        const { process, pressedAction } = this.state
        const { screenName, screenParams, choices } = pressedAction
        const { onSelectType, commentRequired, operation } = choice
        const { nextStep, nextPhase } = choice

        //Highlight selected choice
        if (typeof (choice.selected) === 'boolean') {
            choices.forEach((item) => {
                if (item.label === choice.label) item.selected = true
                else item.selected = false
            })
        }

        if (commentRequired) {
            this.setNextStepOrPhase(nextStep, nextPhase) //used in case of comment
            const dialogTitle = this.configDialogLabels(choice.id).title
            const dialogDescription = this.configDialogLabels(choice.id).description
            this.setState({ dialogTitle, dialogDescription, showModal: false, showDialog: true })
            return
        }

        else {
            this.setState({ loadingModal: true })

            if (onSelectType === 'navigation') {
                screenParams.isProcess = true
                screenParams.onGoBack = () => this.mainHandler(process)
                this.props.navigation.navigate(screenName, screenParams)
            }

            else if (onSelectType === 'actionRollBack') { //roll back to previous action (update its status to "pending")
                await this.undoPreviousAction()
            }

            else if (onSelectType === 'transition') { //No comment, No "actionData" field -> Choice not needed
                await this.runOperation(operation, pressedAction)
                await this.validateAction(null, null, false, nextStep, nextPhase)
            }

            else if (onSelectType === 'validation') {
                await this.runOperation(operation, pressedAction)
                await this.validateAction(null, null, false, null, null, true)
            }

            else if (onSelectType === 'commentPicker') {
                await this.runOperation(operation, pressedAction)
                await this.validateAction(choice.label, choices, choice.stay, nextStep, nextPhase)
            }

            this.setState({ loadingModal: false, showModal: false })
        }
        return
    }

    //func3
    onSubmitComment = async (comment, clearComment) => {
        if (!comment) return //show error message
        this.setState({ loadingDialog: true })

        const { pressedAction, choice, nextStep, nextPhase } = this.state
        const operation = choice && choice.operation || pressedAction.operation || null
        if (operation && !operation.value) operation.value = comment //Like in case updating bill amount

        await this.runOperation(operation, pressedAction)
        await this.validateAction(comment, null, false, nextStep, nextPhase)

        this.setState({ loadingDialog: false, showDialog: false })
        clearComment()
    }

    //func4
    runOperation = async (operation, action) => {
        if (!operation) return

        const { collection, documentId } = action
        const { type, field, value } = operation

        if (type === 'update') {
            let update = {}
            update[field] = value
            await db.collection(collection).doc(documentId).update(update)
        }
    }

    //func5
    validateAction = async (comment, choices, stay, nextStep, nextPhase, forceUpdate = false) => {
        const { process, currentPhaseId, currentStepId, pressedAction } = this.state

        //Update action fields
        let processTemp = _.cloneDeep(process)
        const { actions } = processTemp[currentPhaseId].steps[currentStepId]

        actions.forEach((action) => {

            if (action.id === pressedAction.id) {
                //Update comment
                if (comment)
                    action.comment = comment

                //Update selected choice (selected = true -> Display it green)
                if (choices)
                    action.choices = choices

                //Update action status
                if (!stay && nextPhase !== 'cancelProject') {
                    action.status = "done"
                }
            }

        })

        this.setState({
            // loadingModal: false,
            // currentAction: actionTemp, //for check animation
            currentStep: processTemp[currentPhaseId].steps[currentStepId] //for progress animation
        })

        // console.log('Do animation now !')

        await countDown(1000)

        if (nextStep || nextPhase) {
            processTemp[currentPhaseId].steps[currentStepId].actions = checkForcedValidations(actions)
            const transitionRes = handleTransition(this.processModel, processTemp, currentPhaseId, currentStepId, nextStep, nextPhase, this.props.project.id)
            processTemp = transitionRes.process
        }

        await this.mainHandler(processTemp)
    }

    //func6
    undoPreviousAction = async () => {
        const { process, currentPhaseId, currentStepId, pressedAction } = this.state

        const previousActionOrder = pressedAction.actionOrder - 1

        let processTemp = _.cloneDeep(process)
        processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
            if (action.actionOrder === previousActionOrder) {
                action.status = "pending"
            }
        })

        await this.updateProcess(processTemp)
    }

    //helper1
    setNextStepOrPhase = (nextStep, nextPhase) => {
        //Set next step or phase
        if (nextStep) {
            this.setState({ nextStep, nextPhase: '' })
        }

        else if (nextPhase) {
            this.setState({ nextStep: '', nextPhase })
        }

        else return
    }

    //helper2
    configDialogLabels = (choiceId) => {
        switch (choiceId) {
            case 'postpone': return { title: "Motif du repport", description: "Expliquez brièvemment la raison du report." }; break;
            case 'cancel': return { title: "Motif de l'annulation", description: "Expliquez brièvemment la raison de l'annulation." }; break
            case 'block': return { title: "Motif du bloquage", description: "Expliquez brièvemment la raison de ce blocage." }; break
            case 'comment': return { title: "Commentaire", description: "Veuillez saisir votre commentaire." }; break
            default: return { title: "Commentaire", description: "Veuillez saisir votre commentaire." }; break
        }
    }

    //helper3
    sortPhases(process) {
        const procesTemp = Object.entries(process).sort(([keyA, valueA], [keyB, valueB]) => {
            return (valueA.phaseOrder > valueB.phaseOrder ? 1 : -1)
        })
        process = Object.fromEntries(procesTemp)
        return process
    }

    //renderers
    renderAction = (canUpdate, action) => {

        if (!action) return null

        const { loading } = this.state
        const loadingMessage = "Chargement de l'action..."

        var { title, status, verificationType, choices } = action
        var isComment = typeof (action.comment) !== 'undefined' && action.comment !== ''
        const isDialog = choices || verificationType === 'comment'
        const leftIcon = action.id === 'cancelProject' ? faTimesCircle : status === 'pending' ? faCheckCircle : faSolidCheckCircle
        const leftIconColor = action.id === 'cancelProject' ? theme.colors.error : status === 'pending' ? theme.colors.gray_dark : theme.colors.primary

        return (
            <View style={styles.action}>
                <TouchableOpacity onPress={() => this.onPressAction(canUpdate, action)} style={styles.actionTouchable}>
                    <View style={styles.actionEmptySpace} />
                    <View style={styles.actionTitleContainer}>
                        {!loading &&
                            <CustomIcon
                                icon={leftIcon}
                                size={19}
                                color={leftIconColor}
                            />
                        }
                        <View style={{ flex: 0.95, marginLeft: 10 }}>
                            <Text style={[theme.customFontMSregular.caption]}>{loading ? loadingMessage : title}</Text>
                        </View>
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
                                    onPress={() => Alert.alert('Commentaire', action.comment)}
                                />
                            }
                            <CustomIcon
                                icon={faInfoCircle}
                                size={16}
                                color={theme.colors.gray_dark}
                                onPress={() => Alert.alert('Instructions', action.instructions)}
                            />
                        </View>
                    }

                    {isDialog && this.renderDialog(action.formSettings)}
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
        const { pressedAction, showModal, loadingModal } = this.state
        const { title, choices } = pressedAction
        const elements = choices.map((choice) => configChoiceIcon(choice)) || []

        console.log(choices, pressedAction.actionOrder)
        return (
            <ModalOptions
                isVisible={showModal}
                title={title}
                columns={choices.length}
                isLoading={loadingModal}
                toggleModal={() => this.setState({ showModal: !showModal })}
                handleCancel={() => console.log('cancel')}
                handleConfirm={() => console.log('confirm')}
                elements={elements}
                isReview={pressedAction.isReview}
                autoValidation={true}
                handleSelectElement={(element, index) => this.onSelectChoice(element)}
            />
        )
    }

    renderHeaderBar() {

        const { process } = this.state
        const { project, clientId, step, canUpdate, role } = this.props
        const navParams = { process, project, clientId, step, canUpdate, role }
        const onPressEye = () => this.props.navigation.navigate('Progression', navParams)

        return (
            <View style={styles.headerBarContainer}>
                <Text style={[theme.customFontMSregular.body, styles.headerBarText]}>Suivi du projet</Text>
                <View style={styles.progressionLinks}>
                    <TouchableOpacity>
                        <CustomIcon
                            onPress={this.refresh}
                            icon={faRedo}
                            size={16}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <CustomIcon
                            onPress={onPressEye}
                            icon={faEye}
                            size={18}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    renderAccordion(canUpdate) {

        const { expanded, currentPhase, currentStep, currentAction } = this.state
        const phaseTitle = currentPhase ? currentPhase.title : "Chargement de la phase..."
        const stepTitle = currentStep ? `${currentStep.stepOrder}. ${currentStep.title}` : "Chargement de l'étape..."
        const doneActions = currentStep ? currentStep.actions.filter((action) => action.status === 'done').length : undefined
        const totalActions = currentStep ? currentStep.actions.length : undefined
        var progress = totalActions ? (doneActions / totalActions) * 100 : undefined

        return (
            <List.Accordion
                showArrow
                style={[styles.accordion, { borderBottomWidth: expanded ? StyleSheet.hairlineWidth * 2 : 0 }]}
                title={phaseTitle}
                description={stepTitle}
                titleNumberOfLines={1}
                descriptionNumberOfLines={1}
                left={props => totalActions ? <StepProgress progress={progress} style={{ marginTop: 25, marginRight: 2 }} /> : null}
                expanded={expanded}
                titleStyle={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, marginBottom: 5 }]}
                descriptionStyle={[theme.customFontMSregular.body, { color: theme.colors.secondary }]}
                onPress={() => this.setState({ expanded: !expanded })}>

                {this.renderAction(canUpdate, currentAction)}

            </List.Accordion >
        )
    }

    renderProcessHistoryContainer(canUpdate) {
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
        const { pressedAction, currentPhase, currentStep } = this.state
        const { canUpdate, isAllProcess } = this.props

        if (isAllProcess) {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderProcessHistoryContainer(canUpdate)}
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
    progressionLinks: {
        flexDirection: 'row',
        zIndex: 1,
        position: 'absolute',
        top: 5,
        right: theme.padding / 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 50
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
        //marginHorizontal: 5,
        // backgroundColor: 'green'
    },
    actionTouchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //  paddingHorizontal: 10,
        //backgroundColor: 'pink'
        //paddingHorizontal: 5
    },
    actionEmptySpace: {
        flex: 0.1,
    },
    actionTitleContainer: {
        flex: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        //  backgroundColor: 'brown'
    },
    actionIconsContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
        //   backgroundColor: 'blue'
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
