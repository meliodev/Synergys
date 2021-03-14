import firebase from '@react-native-firebase/app'
import _ from 'lodash'
const db = firebase.firestore()

//#PROCESS MODEL
const processModel = {
    'init': {
        title: 'Initialisation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 1,
        steps: { //One step
            'prospectCreation': {
                title: 'Création prospect',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                nextStep: '',//#test
                nextPhase: '', //#rules: First phase of the processModel has nextPhase set dynamiclly depending on which phase the project has started on
                actions: [
                    {
                        id: 'nom',
                        title: 'Nom',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Clients', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['nom'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill'
                    },
                    {
                        id: 'prenom',
                        title: 'Prénom',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Clients', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['prenom'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill'
                    },
                    {
                        id: 'address',
                        title: 'Adresse postale',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Clients', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['address', 'description'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill'
                    },
                    //other actions...
                ]
            },
        }
    },
    'rd1': {
        title: 'Rendez-vous 1',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        steps: {
            'priorTechnicalVisit': {
                title: 'Visite technique préalable',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                nextStep: 'housingActionFile',
                actions: [
                    {
                        id: 'createPriorTechnicalVisit',
                        title: 'Créer une visite technique préalable',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [],
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Visite technique préalable', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    },
                    {
                        id: 'address',
                        title: 'Lieu du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['address', 'description'],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '' },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill',
                        creationPath: { phaseId: 'rd1', stepId: 'priorTechnicalVisit', actionId: 'createPriorTechnicalVisit' }  //where to find 'id' of the created document we want to update
                    },
                    //others actions... (rd1Place)
                ]
            },
            'housingActionFile': { //##ask can be optional (skipable) depending on the client accepts it or rejects it
                title: 'Dossier action logement',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: 'aidFile', //#rules: when nextStep & nextPhase are both present -> It means there is two choices
                nextPhase: 'technicalVisitManagement', //#rules property only on latest step
                progress: 0,
                isCurrent: false,
                actions: [
                    {
                        id: 'eebFile',
                        title: 'Fiche EEB',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        screenName: 'UploadDocument',
                        screenParams: { project: '', DocumentType: '' },
                        type: 'auto',
                        responsable: '',
                    }
                ]
            },
            'aidFile': {
                title: 'Dossier aidé',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                nextStep: '',
                progress: 0,
                isCurrent: false,
                actions: []
            },
        }
    },
    'rdn': {
        title: 'Rendez-vous N',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        steps: {
            'rd2Creation': { //creation action + multiple choice action
                title: 'Créer un rendez-vous 2',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                nextStep: '',
                nextPhase: '',
                actions: [
                    {
                        id: 'rd2Creation',
                        title: 'Créer un rendez-vous 2',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        documentId: '',
                        properties: [],
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Visite technique préalable', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: ''
                    },
                    {
                        id: 'rd2Choice',
                        title: 'Est-ce que la date du rendez-vous 2 est toujours valide ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '', //Because manual
                        documentId: '', //Because manual
                        properties: [], //Because manual
                        screenName: '', //Because manual
                        screenParams: null, //Because manual
                        type: 'manual', //Check manually
                        responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [{ label: 'Confirmer', nextStep: 'confirmRd2' }, { label: 'Annuler', nextStep: 'cancelRd2' }, { label: 'Reporter', nextStep: 'postponeRd2' }] //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                    },
                ]
            },
            'confirmRd2': {
                title: 'Confirmation du rendez-vous',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: 'signature',
                actions: []
            },
            'postponeRd2': {
                title: 'Report du rendez-vous',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: '',
                actions: [
                    {
                        id: 'rd2Postpone',
                        title: 'Définir la nouvelle date du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        documentId: '',
                        properties: ['startDate'],
                        screenName: 'CreateTask', //update
                        screenParams: { TaskId: '' }, //Defined depending on the existing task (rendez-vous)
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-update',
                        creationPath: { phaseId: 'rdn', stepId: 'rd2Creation', actionId: 'rd2Creation' }  //where to find 'id' of the created document we want to update
                    },
                ]
            },
            'cancelRd2': {
                title: 'Annulation du rendez-vous',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: '',
                actions: [
                    {
                        id: 'rd2Choice',
                        title: 'Est-ce que la date du rendez-vous 2 est toujours valide ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: '', //Because manual
                        documentId: '', //Because manual
                        properties: [], //Because manual
                        screenName: '', //Because manual
                        screenParams: null, //Because manual
                        type: 'manual', //Check manually
                        responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: ['Confirmer', 'Annuler', 'Reporter']
                    },
                ]
            },
            //signature
        }
    },
    'technicalVisitManagement': {
        title: 'Gestion visite technique',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 4,
        previousPhase: 'Rendez-vous N',
        progress: 0,
        isCurrent: false,
        steps: {
            'siteCreation': {
                title: 'Création chantier',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                previousStep: '',
                progress: 0,
                isCurrent: false,
                actions: [
                    {
                        id: 'tvDateValidation',
                        title: 'Valider la date de la visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        // screenName: 'CreateTask',
                        // screenParams: { TaskId: '' },
                        type: 'manual',                                                                                                                    //##ask: is it manual or auto -> if manual.. does it require a defined responsable to handle it ?
                        responsable: '', //Define responsable of validating date
                    },
                    //other actions...
                ]
            },
            //other steps...
        }
    }
}

//#PROCESS MAIN
export const processMain = async (process, projectSecondPhase, clientId, project) => {

    const attributes = { clientId, project }
    const currentProcess = _.cloneDeep(process)
    const updatedProjectProcess = await projectProcessHandler(currentProcess, projectSecondPhase, attributes)

    console.log('old process:', process)
    console.log("Updated process", updatedProjectProcess['init'].steps)

    if (!_.isEqual(process, updatedProjectProcess)) {
        await db.collection('Projects').doc(project.id).update({ process: updatedProjectProcess }).then(() => console.log('PROJECT PROCESS UPDATED !'))
    }

    return updatedProjectProcess//To avoid errors
}

//#PROCESS ALGORITHM/LOGIC
export const projectProcessHandler = async (process, projectSecondPhase, attributes) => {

    let loopHandler = true

    while (loopHandler) {

        //0. Initialize process with 1st phase/1st step
        if (_.isEmpty(process)) {
            console.log('Initializing process...')
            process = initProcess(process, projectSecondPhase)
        }

        //1. Get current phase/step of the process
        var { currentPhaseId, currentStepId } = getCurrentStep(process)

        //2. Actions handler (Verifications & Status update)
        let { actions } = process[currentPhaseId].steps[currentStepId] //Actions of current step

        if (actions.length > 0) {
            var verification_res = await verifyActions(actions, attributes, process, currentPhaseId, currentStepId)
            allActionsValid = verification_res.allActionsValid
            actions = verification_res.verifiedActions
            process[currentPhaseId].steps[currentStepId].actions = actions
        }

        //3'. All actions valid --> update project's process model
        if (allActionsValid) {
            process = handleTransition(process)
            console.log('Transition done --> Loop')
        }

        //3". At least one action is not valid
        else {
            console.log('Not all actions are valid... We keep the same process state..')
            var { currentPhaseId, currentStepId } = getCurrentStep(process)
            loopHandler = false
        }
    }

    return process
}

//#PROCESS TASKS:
//Task 1.
const initProcess = (process, projectSecondPhase) => {
    //Fetch first phase
    var currentPhaseId = getFirstPhaseIdFromModel()

    //Fetch first step (of first phase)
    var currentStepId = getFirstStepIdFromModel(process, currentPhaseId)

    process[currentPhaseId] = processModel[currentPhaseId]
    process[currentPhaseId].steps[currentStepId] = processModel[currentPhaseId].steps[currentStepId]

    //Set "nextPhase" dynamiclly (for all steps.. but only last one will use it)
    Object.keys(process[currentPhaseId].steps).forEach((step) => {
        process[currentPhaseId].steps[step].nextPhase = projectSecondPhase
    })

    return process
}

const getFirstPhaseIdFromModel = () => {
    let currentPhaseId
    Object.keys(processModel).forEach(phaseId => {
        if (processModel[phaseId].phaseOrder === 1) currentPhaseId = phaseId
    })
    return currentPhaseId
}

const getFirstStepIdFromModel = () => {
    const firstPhaseId = getFirstPhaseIdFromModel()
    let currentStepId
    Object.keys(processModel[firstPhaseId].steps).forEach(stepId => {
        if (processModel[firstPhaseId].steps[stepId].stepOrder === 1) currentStepId = stepId
    })
    return currentStepId
}

//Task 2.
const verifyActions = async (actions, attributes, process, currentPhaseId, currentStepId) => {

    let allActionsValid = true
    let verifiedActions = []

    //Complete actions params
    for (let action of actions) {

        if (action.verificationType === 'doc-creation') {
            //Verification & update
            if (action.collection === 'Agenda') {
                action.documentId = attributes.project.id
            }

            //Navigation
            if (action.screenName === 'CreateTask') {
                action.screenParams.project = attributes.project
            }
        }

        else if (action.verificationType === 'data-fill') {
            //Verification & update
            if (action.collection === 'Clients') {
                action.documentId = attributes.clientId
            }

            else if (action.collection === 'Agenda') {

                //1. Get TaskId from the action which created this document
                const { phaseId, stepId, actionId } = action.creationPath //Path to find creation action
                const creationStepAllActions = process[phaseId].steps[stepId].actions
                const creationAction = creationStepAllActions.filter((action) => action.id === actionId) //<-- Action found

                const TaskId = creationAction[0].docCreatedId
                console.log('AGENDA................', TaskId)

                action.documentId = TaskId
            }

            //Navigation
            if (action.screenName === 'Profile') {
                action.screenParams.userId = attributes.clientId
            }

            else if (action.screenName === 'CreateTask') {
                //1. Get TaskId from the action which created this document
                const { phaseId, stepId, actionId } = action.creationPath //Path to find creation action
                const creationStepAllActions = process[phaseId].steps[stepId].actions
                const creationAction = creationStepAllActions.filter((action) => action.id === actionId) //<-- Action found

                const TaskId = creationAction[0].docCreatedId
                console.log('AGENDA................', TaskId)

                action.screenParams.TaskId = TaskId
            }
        }

        else if (action.verificationType === 'doc-update') {
            //Verification & update
            if (action.collection === 'Agenda') {
                action.documentId = attributes.project.id
            }

            //Navigation
            if (action.screenName === 'CreateTask') { //We need existing "TaskId"

                //1. Get TaskId from the action which created this document
                const { phaseId, stepId, actionId } = action.creationPath //Path to find creation action
                const creationStepAllActions = processModel[phaseId].steps[stepId].actions
                const creationAction = creationStepAllActions.filter((action) => action.id === actionId) //<-- Action found
                const TaskId = creationAction.docCreatedId
                action.documentId = TaskId
            }
        }
    }

    //2 VERIFICATION TYPES
    //--> Split actions to two groups based on "verificationType" property
    const actions_groupedByVerificationType = groupBy(actions, "verificationType") //Actions grouped by verificationType ("data-fill" & "doc-creation")

    //VERIFICATION TYPE 1: data-fill
    let actions_dataFill = actions_groupedByVerificationType['data-fill'] || []
    let allActionsValid_dataFill = true

    if (actions_dataFill.length > 0) {
        var res1 = await verifyActions_dataFill(actions_dataFill)
        allActionsValid_dataFill = res1.allActionsValid_dataFill
        actions_dataFill = res1.verifiedActions_dataFill
    }

    //VERIFICATION TYPE 2: doc-creation
    let actions_docCreation = actions_groupedByVerificationType['doc-creation'] || []
    let allActionsValid_docCreation = true

    if (actions_docCreation.length > 0) {
        var res2 = await verifyActions_docCreation(actions_docCreation)
        allActionsValid_docCreation = res2.allActionsValid_docCreation
        actions_docCreation = res2.verifiedActions_docCreation
    }

    //VERIFICATION TYPE 3: multiple-choices
    let actions_multipleChoices = actions_groupedByVerificationType['multiple-choices'] || []
    let allActionsValid_multipleChoices = true

    if (actions_multipleChoices.length > 0) {
        var res3 = await verifyActions_multipleChoices(actions_multipleChoices)
        allActionsValid_multipleChoices = res3.allActionsValid_multipleChoices
        actions_multipleChoices = res3.verifiedActions_multipleChoices
    }

    //VERIFICATION TYPE 4: doc-update
    let actions_docUpdate = actions_groupedByVerificationType['multiple-choices'] || []
    let allActionsValid_docUpdate = true

    if (actions_docUpdate.length > 0) {
        var res3 = await verifyActions_docUpdate(actions_docUpdate)
        allActionsValid_docUpdate = res3.allActionsValid_docUpdate
        actions_docUpdate = res3.verifiedActions_docUpdate
    }


    allActionsValid = allActionsValid_dataFill && allActionsValid_docCreation && allActionsValid_multipleChoices
    verifiedActions = verifiedActions.concat(actions_dataFill, actions_docCreation, actions_multipleChoices)

    return { allActionsValid, verifiedActions }
}

export const verifyActions_dataFill = async (actions) => {

    //Issue: cannot access same document same collection multiple times in a very short delay
    //Solution: Sort by 'Document-Id' to access and verify one time all actions concerning same document.
    const formatedActions = groupBy(actions, "documentId")

    //Verify actions for each document
    let allActionsValid_dataFill = true
    let verifiedActions_dataFill = []

    for (const documentId in formatedActions) {
        const { verifiedActionsSameDoc, allActionsSameDocValid } = await verifyActions_dataFill_sameDoc(formatedActions[documentId])
        allActionsValid_dataFill = allActionsValid_dataFill && allActionsSameDocValid
        verifiedActions_dataFill = verifiedActions_dataFill.concat(verifiedActionsSameDoc)
    }

    return { allActionsValid_dataFill, verifiedActions_dataFill }
}

const verifyActions_dataFill_sameDoc = async (actionsSameDoc) => {
    const collection = actionsSameDoc[0]['collection']
    const documentId = actionsSameDoc[0]['documentId']
    let allActionsSameDocValid = true

    const verifiedActionsSameDoc = await db.collection(collection).doc(documentId).get().then((doc) => {

        const data = doc.data()

        for (let action of actionsSameDoc) {

            //Examples
            //action1: {"collection": "Projects", "documentId": "GS-PR-0W02", "id": "nom", "instructions": "Lorem ipsum dolor", "properties": ["client", "fullName"], "responsable": "", "screenName": "Profile", "screenParams": {"isClient": true, "userId": ""}, "status": "pending", "title": "Nom", "type": "auto"}
            //action2: {"collection": "Projects", "documentId": "GS-PR-0W02", "id": "prenom", "instructions": "Lorem ipsum dolor", "properties": ["client", "fullName"], "responsable": "", "screenName": "Profile", "screenParams": {"isClient": true, "userId": ""}, "status": "pending", "title": "Prénom", "type": "auto"}

            //Action verification
            if (!doc.exists) {
                action.status = 'pending'
                allActionsSameDocValid = false
            }

            else {
                const nestedVal = action.properties.reduce((a, prop) => a[prop], data)

                if (nestedVal && nestedVal !== '') action.status = 'done'
                else {
                    action.status = 'pending'
                    allActionsSameDocValid = false
                }
            }

        }

        return actionsSameDoc
    })

    // console.log('verifiedActionsSameDoc', verifiedActionsSameDoc)

    return { verifiedActionsSameDoc, allActionsSameDocValid }
}

export const verifyActions_docCreation = async (actions) => {

    //Verify actions for each document
    let allActionsValid_docCreation = true

    for (let action of actions) {
        const collection = action.collection //Agenda
        const projectId = action.documentId

        await db.collection(collection).where('project.id', '==', projectId).get().then((querysnapshot) => {
            if (querysnapshot.empty) {
                action.status = 'pending'
                allActionsValid_docCreation = false
            }
            else {
                action.status = 'done'
                action.docCreatedId = querysnapshot.docs[0].id //Id of the created document.. We can use it later on to update it
            }
        })
    }

    const verifiedActions_docCreation = actions
    return { allActionsValid_docCreation, verifiedActions_docCreation }
}

export const verifyActions_multipleChoices = async (actions) => {
    let allActionsValid_multipleChoices = true

    for (let action of actions) {
        if (action.status === 'pending')
            allActionsValid_multipleChoices = false
    }

    const verifiedActions_multipleChoices = actions
    return { allActionsValid_multipleChoices, verifiedActions_multipleChoices }
}

export const verifyActions_docUpdate = async (actions) => {
    //Verify actions for each document
    let allActionsValid_docCreation = true

    for (let action of actions) {
        const collection = action.collection //Agenda
        const documentId = action.documentId

        await db.collection(collection).doc(documentId).get().then((doc) => {
            const data = doc.data()

            const nestedVal = action.properties.reduce((a, prop) => a[prop], data)
            if (nestedVal) action.status = 'done' //Exp: nestedVal = startDate
        })
    }

    const verifiedActions_docCreation = actions
    return { allActionsValid_docCreation, verifiedActions_docCreation }
}


//Task 3.
const handleTransition = (process) => {

    const nextStepId = getNextStepId(process)

    //Next step transition
    if (nextStepId)
        process = handleNextStepTransition(process)

    else {
        const nextPhaseId = getNextPhaseId(process)

        //Next phase transition
        if (nextPhaseId)
            process = handleNextPhaseTransition(process)

        //End process
        else handleEndProcess(process)
    }

    return process
}

//Task 4'.
const handleNextStepTransition = (process) => {
    console.log('Transition to next step...')
    process = projectNextStepInit(process)
    return process
}

export const getNextStepId = (ProjectProcess) => {
    //1. Get current step
    const { currentPhaseId, currentStepId } = getCurrentStep(ProjectProcess)

    //2. Get Steps from process model
    //Option1: Get next step based on "nextStep" property -> Drawbacks: in case of two steps choices nextstep will be two steps same time.
    const nextStepId = processModel[currentPhaseId].steps[currentStepId].nextStep || null

    //Option2: Get next step based on "stepOrder"
    //...

    return nextStepId
}

export const projectNextStepInit = (process) => {

    const { currentPhaseId, currentStepId } = getCurrentStep(process)
    const nextStepId = processModel[currentPhaseId].steps[currentStepId].nextStep
    const nextStepModel = processModel[currentPhaseId].steps[nextStepId]

    //3. Concat next step to process
    process[currentPhaseId].steps[nextStepId] = nextStepModel

    return process
}

//Task 4".
const handleNextPhaseTransition = (process) => {
    //console.log('Transition to next phase...')
    process = projectNextPhaseInit(process)
    return process
}

export const getNextPhaseId = (process) => {
    //1. Get current step
    var { currentPhaseId, currentStepId } = getCurrentStep(process)

    //2. Get nextPhaseId from process model
    const projectNextPhaseId = processModel[currentPhaseId].steps[currentStepId].nextPhase || null //#rules: Only last step has "nextPhase" property

    return projectNextPhaseId
}

export const projectNextPhaseInit = (process) => {

    //0. Deduct next phase if not given as param
    const projectNextPhase = getNextPhaseId(process)

    //1. Get next Phase from process model
    const nextPhaseModel = processModel[projectNextPhase]

    //2. Keep only first step (stepOrder = 1)
    const firstStep = getPhaseFirstStep(nextPhaseModel.steps)
    nextPhaseModel.steps = firstStep

    //3. Concat next phase to process
    process[projectNextPhase] = nextPhaseModel

    return process
}

const getPhaseFirstStep = (steps) => {
    const firstStepArray = Object.entries(steps).filter(([key, value]) => value['stepOrder'] === 1)
    const firstStep = Object.fromEntries(firstStepArray)
    return firstStep
}

//Task 5.
const handleEndProcess = (process) => {
    console.log('Process finished !')
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
        console.log('ACTION', action.id)
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



