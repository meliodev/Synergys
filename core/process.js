import firebase from '@react-native-firebase/app'
import _ from 'lodash'
const db = firebase.firestore()

//##PROCESS MODEL
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
                nextPhase: 'rd1', //#rules: nextStep & nextPhase are exclusive
                actions: [
                    {
                        id: 'nom',
                        title: 'Nom',
                        instructions: 'Lorem ipsum dolor',
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
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        projectId: '', // for verificationType: doc-creation -> we use projectId to check over all tasks if a task {type: "Visite technique préalable", projectId} exists 
                        documentId: '',
                        properties: [''],
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Visite technique préalable' },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation'
                    },
                    {
                        id: 'address',
                        title: 'Lieu du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'CreateTask', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['address', 'description'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill'
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
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        nextPhase: 'technicalVisitManagement',
        progress: 0,
        isCurrent: false,
        steps: {}
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

//##PROCESS ALGORITHM/LOGIC
export const projectProcessHandler = async (process, clientId, projectId) => {

    //1'. Initialize process with 1st phase/1st step
    if (_.isEmpty(process)) {
        //console.log('Initializing project...')
        var { currentPhaseId, currentStepId } = initProcess(process)
    }

    //1". Get current phase/step of the process
    else {
        var { currentPhaseId, currentStepId } = getCurrentStep(process)
        //console.log('Current phase/step: ', currentPhaseId, currentStepId)
    }

    //2. Actions handler (Verifications & Status update)
    const { actions } = process[currentPhaseId].steps[currentStepId] //Actions of current step

    if (actions.length > 0)
        var allActionsValid = await verifyActions(actions)

    //console.log('is All actions valid ? ', allActionsValid)

    let updatedProjectProcess = process

    //3'. All actions valid --> update project's process model
    if (allActionsValid)
        updatedProjectProcess = handleAllActionsValid(process)

    //3". At least one action is not valid
    else console.log('Not all actions are valid... We keep the same process state..')

    return updatedProjectProcess
}

//## PROCESS TASKS:
//Task 1.
const initProcess = (process) => {
    //Fetch first phase
    var currentPhaseId = fetchFirstPhaseModel()

    //Fetch first step (of first phase)
    var currentStepId = fetchFirstStepModel(process, currentPhaseId)

    process[currentPhaseId] = processModel[currentPhaseId]
    process[currentPhaseId].steps[currentStepId] = processModel[currentPhaseId].steps[currentStepId]

    return { currentPhaseId, currentStepId }
}

//Task 2.
const verifyActions = async (actions) => {

    let allActionsValid = true

    //Set verification params (#rules: verification is done no matter action is pending or done)
    const clientId = 'GS-CL-9o1z'

    for (let action of actions) {
        if (action.verificationType === 'data-fill') {
            if (action.collection === 'Clients') {
                action.documentId = clientId
            }

            if (action.screenName === 'Profile') {
                action.screenParams.userId = clientId
            }
        }

        else if (action.verificationType === 'doc-creation') {
            if (action.collection === 'Agenda') {
                action.projectId = projectId
            }
        }
    }

    //2 VERIFICATION TYPES
    //--> Split actions to two groups based on "verificationType" property
    const actions_groupedByVerificationType = groupBy(actions, "verificationType") //Actions grouped by verificationType ("data-fill" & "doc-creation")

    //VERIFICATION TYPE 1: data-fill
    const actions_dataFill = actions_groupedByVerificationType['data-fill']

    if (actions_dataFill) {
        var { verifiedActions_dataFill, allActionsValid_dataFill } = await verifyActions_dataFill(actions_dataFill)
        // console.log('VERIFY ACTIONS TYPE DATA FILL: ', verifiedActions_dataFill, allActionsValid_dataFill)
    }

    //VERIFICATION TYPE 2: doc-creation
    const actions_docCreation = actions_groupedByVerificationType['doc-creation']

    if (actions_docCreation) {
        var { verifiedActions_docCreation, allActionsValid_docCreation } = await verifyActions_docCreation(actions_docCreation)
        // console.log('VERIFY ACTIONS TYPE DOC CREATION: ', verifiedActions_docCreation, allActionsValid_docCreation)
    }

    allActionsValid = allActionsValid_dataFill && allActionsValid_docCreation

    return allActionsValid
}

//Task 3.
const handleAllActionsValid = (process) => {

    const nextStepId = getNextStep(process)

    //Next step transition
    if (nextStepId)
        process = handleNextStepTransition(process)

    else {
        const nextPhaseId = getNextPhase(process)

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

export const getNextStep = (ProjectProcess) => {
    //1. Get current step
    const { currentPhaseId, currentStepId } = getCurrentStep(ProjectProcess)

    //2. Get Steps from process model
    //Option1: Get next step based on "nextStep" property -> Drawbacks: in case of two steps choices nextstep will be two steps same time.
    const nextStepId = processModel[currentPhaseId].steps[currentStepId].nextStep || null

    //Option2: Get next step based on "stepOrder"
    //...

    return nextStepId
}

export const projectNextStepInit = (ProjectProcess) => {

    const { currentPhaseId, currentStepId } = getCurrentStep(ProjectProcess)
    const nextStepId = getNextStep(ProjectProcess)
    const nextStepModel = processModel[currentPhaseId].steps[nextStepId]

    // //3. Concat next step to ProjectProcess
    ProjectProcess[currentPhaseId].steps[nextStepId] = nextStepModel

    return ProjectProcess
}

//Task 4".
const handleNextPhaseTransition = (process) => {
    console.log('Transition to next phase...')
    process = projectNextPhaseInit(process, null)
    return process
}

export const getNextPhase = (ProjectProcess) => {
    //1. Get current step
    var { currentPhaseId, currentStepId } = getCurrentStep(ProjectProcess)

    //2. Get nextPhaseId from process model
    const projectNextPhase = processModel[currentPhaseId].steps[currentStepId].nextPhase || null //#rules: Only last step has "nextPhase" property

    return projectNextPhase
}

export const projectNextPhaseInit = (ProjectProcess, projectNextPhase = null) => {
    //0. Deduct next phase if not given as param
    if (!projectNextPhase) {
        projectNextPhase = getNextPhase(ProjectProcess)
    }

    //1. Get next Phase from process model
    const nextPhaseModel = processModel[projectNextPhase]

    //2. Keep only first step (stepOrder = 1)
    const firstStep = getPhaseFirstStep(nextPhaseModel.steps)
    nextPhaseModel.steps = firstStep

    //3. Concat next phase to ProjectProcess
    ProjectProcess[projectNextPhase] = nextPhaseModel

    return ProjectProcess
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

//##ACTIONS verification
export const verifyActions_dataFill = async (actions) => {

    //Issue: cannot access same document same collection multiple times in a very short delay
    //Solution: Sort by 'Document-Id' to access and verify one time all actions concerning same document.
    const formatedActions = groupBy(actions, "documentId")

    //Verify actions for each document
    let verifiedActions_dataFill = []
    let allActionsValid_dataFill = true

    for (const documentId in formatedActions) {
        const { verifiedActionsSameDoc, allActionsSameDocValid } = await verifyActionsSameDoc(formatedActions[documentId])
        allActionsValid_dataFill = allActionsValid_dataFill && allActionsSameDocValid
        verifiedActions_dataFill = verifiedActions_dataFill.concat(verifiedActionsSameDoc)
    }

    return { verifiedActions_dataFill, allActionsValid_dataFill }
}

export const verifyActions_docCreation = async (actions) => {
    console.log("actions verification type 'doc creation'", actions)
}

const verifyActionsSameDoc = async (actionsSameDoc) => {
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
            const nestedVal = action.properties.reduce((a, prop) => a[prop], data)
            if (nestedVal && nestedVal !== '') action.status = 'done'
            else {
                action.status = 'pending'
                allActionsSameDocValid = false
            }
        }

        return actionsSameDoc
    })

    // console.log('verifiedActionsSameDoc', verifiedActionsSameDoc)

    return { verifiedActionsSameDoc, allActionsSameDocValid }
}

//##UI FUNCTIONS (PROCESS OVERVIEW)
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

const fetchFirstPhaseModel = () => {
    let currentPhaseId
    Object.keys(processModel).forEach(phaseId => {
        if (processModel[phaseId].phaseOrder === 1) currentPhaseId = phaseId
    })
    return currentPhaseId
}

const fetchFirstStepModel = () => {
    const firstPhaseId = fetchFirstPhaseModel()
    let currentStepId
    Object.keys(processModel[firstPhaseId].steps).forEach(stepId => {
        if (processModel[firstPhaseId].steps[stepId].stepOrder === 1) currentStepId = stepId
    })
    return currentStepId
}

export const getCurrentAction = (process) => {
    if (_.isEmpty(process)) return null

    const { currentPhaseId, currentStepId } = getCurrentStep(process)
    const { actions } = process[currentPhaseId].steps[currentStepId]

    let currentAction = null
    for (const action of actions) {
        if (!currentAction && action.status === 'pending')
            currentAction = action
    }

    return currentAction
}


//##Helpers
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




// //1. Project process: Initialization
// export const projectProcessInit = async (clientId, projectNextPhase) => {

//     //A. Process Initialization
//     //1. Get current ProjectProcess object
//     let ProjectProcess = {} //Init: process is empty

//     //2. Phase: Get first phase model
//     //  const { init } = processModel
//     const { currentPhaseId, currentStepId } = getCurrentStep(ProjectProcess)

//     //4. Actions: nom & prenom
//     let { actions } = init.steps.prospectCreation

//     //Set verification params
//     for (let action of actions) {
//         if (action.collection === 'Clients') {
//             action.documentId = clientId
//         }

//         if (action.screenName === 'Profile') {
//             action.screenParams.userId = clientId
//         }
//     }

//     const { verifiedActions, allActionsValid } = await verifyActions(actions)

//     init.steps.prospectCreation.actions = verifiedActions

//     //5. Assign process to project
//     ProjectProcess.init = init

//     //B. Add Next Phase depending on project "step" attribute 
//     if (allActionsValid)
//         ProjectProcess = projectNextPhaseInit(ProjectProcess, projectNextPhase)

//     return ProjectProcess
// }