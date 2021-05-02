import { db, functions } from '../firebase'
import _ from 'lodash'
import { Text, Alert } from 'react-native'
import { stringifyUndefined } from './utils'

//#PROCESS ALGORITHM/LOGIC
export const processHandler = async (processModel, currentProcess, projectSecondPhase, clientId, project) => {

    if (!processModel || typeof (processModel) === 'undefined') {
        Alert.alert('Erreur inattendue', "Le model du process n'a pas été initialisé. Veuillez redémarrer l'application.")
        return currentProcess
    }

    const attributes = { clientId, project }
    let process = _.cloneDeep(currentProcess)

    let loopHandler = true

    while (loopHandler) {
        //0. Initialize process with 1st phase/1st step
        console.log('process:::::', process)
        if (Object.keys(process).length === 1) {
            process = initProcess(processModel, process, projectSecondPhase)
        }

        var { currentPhaseId, currentStepId } = getCurrentStep(process)
        let { actions } = process[currentPhaseId].steps[currentStepId] //Actions of current step
        let allActionsValid = true
        let nextStep = ''
        let nextPhase = ''

        //Verify/Update actions status
        if (actions.length > 0) {

            actions = await configureActions(actions, attributes, process) //fill empty params (projectId, clienId, TaskId...)

            //Handle cloud function
            if (actions[0].cloudFunction) {
                const sendEmail = functions.httpsCallable('sendEmail')
                const { subject, dest, projectId, attachments } = actions[0].cloudFunction.params
                const html = `<b>${subject} du projet ${attributes.project.name}</b>`

                const isSent = await sendEmail({ receivers: dest, subject, html, attachments })

                if (isSent.data)
                    await db.collection(actions[0].collection).doc(projectId).update({ finalBillSentViaEmail: true }).then(() => console.log('FINAL BILL SENT !!!!'))

                else console.log('Email was not sent......................')
                //else return error and handle it on UI (MAKE SURE NOT UPDATE PROCESS BY ERROR)
            }

            var verif_res = await verifyActions(actions, attributes, process)

            actions = verif_res.verifiedActions
            allActionsValid = verif_res.allActionsValid
            nextStep = verif_res.nextStep
            nextPhase = verif_res.nextPhase

            process[currentPhaseId].steps[currentStepId].actions = actions
        }

        //3'. Found nextStep/nextPhase -> All actions valid -> Transition
        if (nextStep || nextPhase) { //Next step/phase found means we are on last action of current step -> we do transition.

            console.log('transition...')
            const transitionRes = handleTransition(processModel, process, currentPhaseId, currentStepId, nextStep, nextPhase, attributes.project.id)
            process = transitionRes.process
            const { processEnded } = transitionRes
            if (processEnded) loopHandler = false
            else console.log('LOOP...')
        }

        //3". No nextStep/nextPhase found -> At least one action is not valid -> No transition & Break loop
        else loopHandler = false
    }

    return process
}


export const checkForcedValidations = (actions) => {
    for (let action of actions) {
        if (action.forceValidation) {
            action.status = 'done'
        }
    }
    return actions
}

//#PROCESS TASKS:
//Task 1. Init
const initProcess = (processModel, process, projectSecondPhase) => {

    if (projectSecondPhase === 'init') {
        projectSecondPhase = getSecondPhaseId(processModel)
    }

    //Init project with first phase/first step
    let firstPhaseId = getFirstPhaseIdFromModel(processModel)
    process = projectNextPhaseInit(processModel, process, firstPhaseId)

    //Set "nextPhase" dynamiclly for last action of last step
    Object.keys(process[firstPhaseId].steps).forEach((stepId) => {
        let actions = process[firstPhaseId].steps[stepId].actions
        actions[actions.length - 1].nextPhase = projectSecondPhase
        process[firstPhaseId].steps[stepId].actions = actions
    })

    return process
}

export const getLatestProcessModelVersion = (processModels) => {
    let maxNumber = 0
    let number = 0
    for (const version in processModels) {
        const numberStr = version.replace("version", "")
        number = Number(numberStr)

        if (number > maxNumber) {
            maxNumber = number
        }
    }
    const latestVersion = `version${maxNumber}`

    return latestVersion
}

const getSecondPhaseId = (processModel) => {
    const firstPhaseArray = Object.entries(processModel).filter(([key, value]) => value['phaseOrder'] === 2)
    const firstPhase = Object.fromEntries(firstPhaseArray)
    const firstPhaseId = Object.keys(firstPhase)[0]
    return firstPhaseId
}

const getFirstPhaseIdFromModel = (processModel) => {
    let firstPhaseId
    const copyProcessModel = _.cloneDeep(processModel)
    Object.keys(copyProcessModel).forEach(phaseId => {
        if (copyProcessModel[phaseId].phaseOrder === 1) firstPhaseId = phaseId
    })
    return firstPhaseId
}

//Task 2. Configure actions
const configureActions = async (actions, attributes, process) => {

    let query

    for (let action of actions) {

        let { collection, documentId, screenParams, cloudFunction, queryFilters, verificationType, queryFiltersUpdateNav } = action

        //1. Complete missing params
        if (collection && documentId === '') {
            if (collection === 'Projects') action.documentId = attributes.project.id
            else if (collection === 'Clients') action.documentId = attributes.clientId
        }

        if (screenParams) {
            for (let item in screenParams) {
                if (item === 'project') action.screenParams.project = attributes.project
                if (item === 'user') action.screenParams.user.id = attributes.clientId
            }
        }

        if (queryFilters) {
            for (let item of action.queryFilters) {
                if (item.filter === 'project.id') item.value = attributes.project.id
            }
        }

        if (queryFiltersUpdateNav) {
            for (let item of action.queryFiltersUpdateNav) {
                if (item.filter === 'project.id') item.value = attributes.project.id
            }
        }

        if (cloudFunction) {
            const { params, queryAttachmentsUrls } = action.cloudFunction

            for (let item in params) {
                if (item === 'projectId') params.projectId = attributes.project.id
            }

            //set attachments
            for (let attachmentKey in queryAttachmentsUrls) {

                for (let item of queryAttachmentsUrls[attachmentKey]) {
                    if (item.filter === 'project.id') item.value = attributes.project.id
                }

                query = db.collection('Documents')
                queryAttachmentsUrls[attachmentKey].forEach(({ filter, operation, value }) => query = query.where(filter, operation, value))

                await query.get().then((querysnapshot) => {

                    if (!querysnapshot.empty) {
                        const document = querysnapshot.docs[0].data()
                        const attachment = {
                            filename: `${attachmentKey}.pdf`,
                            path: document.attachment.downloadURL
                        }
                        params.attachments.push(attachment)
                    }

                })
            }
        }

        const selectedQueryFilters = queryFiltersUpdateNav || queryFilters || null

        if (collection && collection !== '' && selectedQueryFilters && selectedQueryFilters.length > 0) {

            query = db.collection(collection)
            selectedQueryFilters.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })
            await query.get().then((querysnapshot) => {

                if (querysnapshot.empty) {
                    if (queryFiltersUpdateNav) {
                        if (collection === 'Agenda') {
                            action.screenParams.TaskId = ''
                        }

                        if (collection === 'Documents')
                            action.screenParams.DocumentId = ''
                    }
                }

                //Reinitialize nav params in case document was deleted
                else {
                    if (action.screenParams) {
                        if (collection === 'Agenda')
                            action.screenParams.TaskId = querysnapshot.docs[0].id

                        if (collection === 'Documents')
                            action.screenParams.DocumentId = querysnapshot.docs[0].id
                    }

                    if (documentId === '') {
                        action.documentId = querysnapshot.docs[0].id
                    }
                }
            })
        }

    }

    return actions
}

//Task 3. Verifications & Status Update
const verifyActions = async (actions, attributes, process) => {
    let allActionsValid = true
    let verifiedActions = []
    let nextStep = ''
    let nextPhase = ''

    //1. Split actions to 4 groups based on "verificationType" property
    const actions_groupedByVerificationType = groupBy(actions, "verificationType")

    //AUTO
    //VERIFICATION TYPE 1: data-fill
    let actions_dataFill = actions_groupedByVerificationType['data-fill'] || []
    let allActionsValid_dataFill = true

    if (actions_dataFill.length > 0) {
        var res1 = await verifyActions_dataFill(actions_dataFill)
        allActionsValid_dataFill = res1.allActionsValid_dataFill
        actions_dataFill = res1.verifiedActions_dataFill
        nextStep = res1.nextStep
        nextPhase = res1.nextPhase
    }

    //VERIFICATION TYPE 2: doc-creation
    let actions_docCreation = actions_groupedByVerificationType['doc-creation'] || []
    let allActionsValid_docCreation = true

    if (actions_docCreation.length > 0) {
        var res2 = await verifyActions_docCreation(actions_docCreation)
        allActionsValid_docCreation = res2.allActionsValid_docCreation
        actions_docCreation = res2.verifiedActions_docCreation
        nextStep = res2.nextStep
        nextPhase = res2.nextPhase
    }

    //MANUAL
    //VERIFICATION TYPE 3: 
    let actions_multipleChoices = actions_groupedByVerificationType['multiple-choices'] || []
    let actions_comment = actions_groupedByVerificationType['comment'] || []
    let actions_validation = actions_groupedByVerificationType['validation'] || []
    let actions_phaseRollback = actions_groupedByVerificationType['phaseRollback'] || []
    let actions_manual = actions_multipleChoices.concat(actions_comment, actions_validation, actions_phaseRollback)
    let allActionsValid_manual = true

    if (actions_manual.length > 0) {
        var res3 = await verifyActions_manual(actions_manual)
        allActionsValid_manual = res3.allActionsValid_manual
        actions_manual = res3.verifiedActions_manual
    }

    allActionsValid = allActionsValid_dataFill && allActionsValid_docCreation && allActionsValid_manual
    verifiedActions = verifiedActions.concat(actions_dataFill, actions_docCreation, actions_manual)

    return { allActionsValid, verifiedActions, nextStep, nextPhase }
}

const verifyActions_dataFill = async (actions) => {

    //Issue: cannot access same document same collection multiple times in a very short delay
    //Solution: Sort by 'Document-Id' to access and verify one time all actions concerning same document (use verifyActions_dataFill_sameDoc).
    const formatedActions = groupBy(actions, "documentId")

    //Verify actions for each document
    let allActionsValid_dataFill = true
    let verifiedActions_dataFill = []
    let nextStep = ''
    let nextPhase = ''

    for (const documentId in formatedActions) {
        let res = await verifyActions_dataFill_sameDoc(formatedActions[documentId])
        allActionsValid_dataFill = allActionsValid_dataFill && res.allActionsSameDocValid
        verifiedActions_dataFill = verifiedActions_dataFill.concat(res.verifiedActionsSameDoc)
        nextStep = res.nextStep
        nextPhase = res.nextPhase
    }

    return { allActionsValid_dataFill, verifiedActions_dataFill, nextStep, nextPhase }
}

const verifyActions_dataFill_sameDoc = async (actionsSameDoc) => {
    const collection = actionsSameDoc[0]['collection']
    const documentId = actionsSameDoc[0]['documentId']
    let allActionsSameDocValid = true
    let nextStep = ''
    let nextPhase = ''

    const verifiedActionsSameDoc = await db.collection(collection).doc(documentId).get().then((doc) => {

        const data = doc.data()

        for (let action of actionsSameDoc) {

            if (!doc.exists) {
                action.status = 'pending'
                allActionsSameDocValid = false
            }

            else {
                const nestedVal = action.properties.reduce((a, prop) => a[prop], data)

                if (typeof (nestedVal) === 'undefined') {
                    action.status = 'pending'
                    allActionsSameDocValid = false
                }

                else {
                    if (nestedVal !== action.verificationValue) {
                        action.status = 'done'
                        nextStep = stringifyUndefined(action.nextStep)
                        nextPhase = stringifyUndefined(action.nextPhase)
                    }

                    else {
                        action.status = 'pending'
                        allActionsSameDocValid = false
                    }
                }
            }

        }

        return actionsSameDoc
    })

    return { verifiedActionsSameDoc, allActionsSameDocValid, nextStep, nextPhase }
}

//Verify actions for each document
const verifyActions_docCreation = async (actions) => {
    let allActionsValid_docCreation = true
    let nextStep = ''
    let nextPhase = ''

    for (let action of actions) {

        const { collection, queryFilters, events } = action

        let query = db.collection(collection)
        queryFilters.forEach(({ filter, operation, value }) => query = query.where(filter, operation, value))
        await query.get().then((querysnapshot) => {

            if (querysnapshot.empty) {
                if (events && events.onDocNotFound) {  //CASE1: Conditional transition (2 options) depending on doc found or not
                    nextStep = events.onDocNotFound.nextStep
                    nextPhase = events.onDocNotFound.nextPhase
                }

                action.status = 'pending' //CASE2: No transition if doc not found
                allActionsValid_docCreation = false
            }

            else {
                if (events && events.onDocFound) { //CASE1: Conditional transition (2 options) depending on doc found or not
                    nextStep = events.onDocFound.nextStep
                    nextPhase = events.onDocFound.nextPhase
                }

                action.status = 'done' //CASE2: Transition only on doc found
                nextStep = stringifyUndefined(action.nextStep)
                nextPhase = stringifyUndefined(action.nextPhase)
            }
        })
    }

    const verifiedActions_docCreation = actions
    return { allActionsValid_docCreation, verifiedActions_docCreation, nextStep, nextPhase }
}

const verifyActions_manual = async (actions) => {
    let allActionsValid_manual = true

    for (let action of actions) {
        if (action.status === 'pending')
            allActionsValid_manual = false
    }

    const verifiedActions_manual = actions
    return { allActionsValid_manual, verifiedActions_manual }
}

//Task 4. Phase/Step transition
export const handleTransition = (processModel, process, currentPhaseId, currentStepId, nextStepId, nextPhaseId, ProjectId) => {

    let processEnded = false

    //Next step transition
    if (nextStepId) {
        console.log('Transition to next step:', nextStepId)
        process = projectNextStepInit(processModel, process, currentPhaseId, currentStepId, nextStepId)
    }

    //Next phase transition
    else if (nextPhaseId) {
        console.log('Transition to next phase:', nextPhaseId)

        //Update project (status/step)
        if (nextPhaseId === 'cancelProject') {
            cancelProject(ProjectId)
           // processEnded = true
        }

        else if (nextPhaseId === 'endProject') {
            endProject(ProjectId)
            processEnded = true
        }

        else {
            updateProjectPhase(processModel, nextPhaseId, ProjectId)
        }

        //Phase transition
        if (nextPhaseId === 'maintainance' && process['installation'].steps['maintainanceContract']) {
            process = resumeMaintainance(processModel, process)
        }

        else {
            process = projectNextPhaseInit(processModel, process, nextPhaseId)
        }
    }

    return { process, processEnded }
}

//Task 4'.
export const getNextStepId = (process, currentPhaseId, currentStepId) => {
    const nextStepId = process[currentPhaseId].steps[currentStepId].nextStep || null
    return nextStepId
}

export const projectNextStepInit = (processModel, process, currentPhaseId, currentStepId, nextStepId) => {

    //0. Handle rollback (report rdn loop)
    if (nextStepId) {
        const currentStepOrder = processModel[currentPhaseId].steps[currentStepId].stepOrder
        console.log('éééééééééééééé', currentPhaseId, nextStepId)
        const nextStepOrder = processModel[currentPhaseId].steps[nextStepId].stepOrder
        if (nextStepOrder < currentStepOrder) {
            delete process[currentPhaseId].steps[currentStepId]
            process[currentPhaseId].steps[nextStepId].actions.forEach((action) => {
                action.status = "pending"
            })
            return process
        }
    }

    //1. Get next Step from process model
    const nextStepModel = processModel[currentPhaseId].steps[nextStepId]

    //2. Concat next step to process
    process[currentPhaseId].steps[nextStepId] = nextStepModel

    return process
}

//Task 4".
export const getNextPhaseId = (process, currentPhaseId, currentStepId) => {
    const nextPhaseId = process[currentPhaseId].steps[currentStepId].nextPhase || null //#rules: Only last step has "nextPhase" property
    return nextPhaseId
}

export const projectNextPhaseInit = (processModel, process, nextPhaseId) => {
    //1. Get next Phase from process model
    const nextPhaseModel = _.cloneDeep(processModel[nextPhaseId])


    //2. Keep only first step (stepOrder = 1)
    const firstStep = getPhaseFirstStep(nextPhaseModel.steps)
    nextPhaseModel.steps = firstStep

    //3. Concat next phase to process
    process[nextPhaseId] = nextPhaseModel

    return process
}

const getPhaseFirstStep = (steps) => {
    const firstStepArray = Object.entries(steps).filter(([key, value]) => value['stepOrder'] === 1)
    const firstStep = Object.fromEntries(firstStepArray)
    return firstStep
}

const resumeMaintainance = (processModel, process) => {
    process['maintainance'] = {}
    process['maintainance'].title = _.clone(processModel['maintainance'].title)
    process['maintainance'].instructions = _.clone(processModel['maintainance'].instructions)
    process['maintainance'].phaseOrder = _.clone(processModel['maintainance'].phaseOrder)
    process['maintainance'].steps = {}
    process['maintainance'].steps['maintainanceContract'] = _.cloneDeep(process['installation'].steps['maintainanceContract'])

    const currentActions = _.cloneDeep(process['maintainance'].steps['maintainanceContract'].actions)
    currentActions.sort((a, b) => (a.actionOrder < b.actionOrder) ? 1 : -1)
    if (currentActions[0].nextStep) delete currentActions[0].nextStep
    if (currentActions[0].nextPhase) delete currentActions[0].nextPhase

    const { actions } = _.cloneDeep(processModel['maintainance'].steps['maintainanceContract'])
    actions.sort((a, b) => (a.actionOrder < b.actionOrder) ? 1 : -1)
    const lastAction = actions[0]
    currentActions.push(lastAction)

    process['maintainance'].steps['maintainanceContract'].actions = currentActions

    return process
}

//Update project (status/step)
const updateProjectPhase = (processModel, nextPhaseId, ProjectId) => {
    const phaseTitle = processModel[nextPhaseId].title
    db.collection('Projects').doc(ProjectId).update({ step: phaseTitle })
}

const endProject = (ProjectId) => {
    db.collection('Projects').doc(ProjectId).update({ state: 'Terminé' })
}

const cancelProject = (ProjectId) => {
    db.collection('Projects').doc(ProjectId).update({ state: 'Annulé' })
}

//#UI FUNCTIONS (PROCESS OVERVIEW)
// Process object at the instant t contains only the current state of the global process model --> So we are sure that the object with max order is the latest phase/step
export const getCurrentPhase = (process) => {

    const phases = Object.entries(process)

    let maxPhaseOrder = 0
    let currentPhaseId

    phases.forEach(([phaseId, phase]) => {
        if (phase.phaseOrder > maxPhaseOrder) {
            maxPhaseOrder = phase.phaseOrder
            currentPhaseId = phaseId
        }
    })

    return currentPhaseId
}

export const getCurrentStep = (process) => {

    let maxStepOrder = 0
    var currentPhaseId = getCurrentPhase(process)
    let currentStepId

    const { steps } = process[currentPhaseId]
    const stepsFormated = Object.entries(steps)

    stepsFormated.forEach(([stepId, step]) => {
        if (step.stepOrder > maxStepOrder) {
            maxStepOrder = step.stepOrder
            currentStepId = stepId
        }
    })

    return { currentPhaseId, currentStepId } //you can then use process[currentPhaseId].steps[currentStepId]
}

export const getCurrentAction = (process) => {
    if (_.isEmpty(process)) return null

    const { currentPhaseId, currentStepId } = getCurrentStep(process)

    let { actions } = process[currentPhaseId].steps[currentStepId]
    actions.sort((a, b) => (a.actionOrder > b.actionOrder) ? 1 : -1)

    let currentAction = null

    for (const action of actions) {
        //if (!currentAction && (action.status === 'pending' || action.status === 'done' && action.isAnimation))
        if (!currentAction && action.status === 'pending')
            currentAction = action
    }

    return currentAction
}

//#Helpers
const phases = [
    { label: 'Initialisation', value: 'Initialisation', id: 'init' },
    { label: 'Rendez-vous 1', value: 'Rendez-vous 1', id: 'rd1' },
    { label: 'Rendez-vous N', value: 'Rendez-vous N', id: 'rdn' },
    { label: 'Visite technique', value: 'Visite technique', id: 'technicalVisitManagement' },
    { label: 'Installation', value: 'Installation', id: 'installation' },
    { label: 'Maintenance', value: 'Maintenance', id: 'maintenance' },
]

export const getPhaseId = (phaseValue) => {
    const phaseValueArr = [phaseValue]
    const phaseObject = phases.filter(phaseObject => phaseValueArr.includes(phaseObject.value))
    const currentPhase = phaseObject[0].id
    return currentPhase
}

const groupBy = (arr, property) => {
    return arr.reduce((memo, x) => {
        if (!memo[x[property]]) {
            memo[x[property]] = []
        }

        memo[x[property]].push(x)
        return memo
    }, {})
}


