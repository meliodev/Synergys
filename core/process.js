import firebase from '@react-native-firebase/app'
const db = firebase.firestore()

//1. Process initialization
const processModel = {
    'init': {
        title: 'Initialisation',
        status: 'pending', //##ask: No need for this attribute: Check status on client: do verification on steps -> status: valid if all steps valid
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 1,
        previousPhase: '',
        progress: 0,
        isCurrent: false,
        steps: { //One step
            'prospectCreation': {
                title: 'Création prospect',
                status: 'pending', //##ask: No need for this attribute: Check status on client: do verification on actions -> status: valid if all actions valid
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                previousStep: '',
                progress: 0,
                isCurrent: false,
                actions: [
                    { //Nom du client associé au projet
                        id: 'nom',
                        title: 'Nom',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'Projects', // In case of subcollection: Projects/SubCollection
                        documentId: 'GS-PR-0W02', // depending on the concerned project
                        properties: ['client', 'fullName'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending'
                    },
                    {
                        id: 'prenom',
                        title: 'Prénom',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'Projects', // In case of subcollection: Projects/SubCollection
                        documentId: 'GS-PR-0W02', // depending on the concerned project
                        properties: ['client', 'fullName'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending'
                    },
                    {
                        id: 'address',
                        title: 'Adresse postale',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'Projects', // In case of subcollection: Projects/SubCollection
                        documentId: 'GS-PR-0W02', // depending on the concerned project
                        properties: ['client', 'address'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending'
                    },
                    //other actions...
                ]
            }
        }
    },
    'rd1': {
        title: 'Rendez-vous 1',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        previousPhase: 'init',
        progress: 0,
        isCurrent: false,
        steps: {
            'priorTechnicalVisit': { //STEP 1
                title: 'Visite technique préalable',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                previousStep: '',
                progress: 0,
                isCurrent: false,
                actions: {
                    'rd1Date': {
                        title: 'Date du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '' },
                        type: 'auto',
                        responsable: '',
                    },
                    //others...
                }
            },
            'aidFile': { //STEP 2'
                title: 'Dossier aidé',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2.1,
                previousStep: 'prior-technical-visit',
                progress: 0,
                isCurrent: false,
                actions: {}
            },
            'housingActionFile': { //STEP 2"
                title: 'Dossier action logement',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2.2,
                previousStep: 'prior-technical-visit',
                progress: 0,
                isCurrent: false,
                actions: {
                    'eebFile': {
                        title: 'Fiche EEB',
                        instructions: 'Lorem ipsum dolor',
                        screenName: 'UploadDocument',
                        screenParams: { project: '', DocumentType: '' },
                        type: 'auto',
                        responsable: '',
                    }
                }
            },

        }
    },
    'rdn': {
        title: 'Rendez-vous N',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        previousPhase: 'Rendez-vous 1',
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
                actions: {
                    'tvDateValidation': {
                        title: 'Valider la date de la visite technique',
                        instructions: 'Lorem ipsum dolor',
                        // screenName: 'CreateTask',
                        // screenParams: { TaskId: '' },
                        type: 'manual',                                                                                                                    //##ask: is it manual or auto -> if manual.. does it require a defined responsable to handle it ?
                        responsable: '', //Define responsable of validating date
                    },
                    //other actions...
                }
            },
            //other steps...
        }
    }
}

export const projectProcessInit = async (ProjectId, clientId, projectNextPhase) => {
    //A. Process Initialization
    //1. Get current ProjectProcess object
    let ProjectProcess = {} //Init: process is empty

    //2. Phase: Get Init phase model
    const { init } = processModel
    init.isCurrent = true

    //3. Step: prospectCreation #task: Pick it using stepOrder (to work dynamiclly for next phases having more than one steps)
    init.steps.prospectCreation.isCurrent = true

    //4. Actions: nom & prenom
    let { actions } = init.steps.prospectCreation
    for (let action of actions) {
        console.log(ProjectId, clientId)
        if (action.collection === 'Projects') {
            action.documentId = ProjectId
        }

        if (action.screenName === 'Profile') {
            action.screenParams.userId = clientId
        }
    }

    console.log('ACTIONS', actions)

    const { verifiedActions, allActionsValid } = await verifyActions(actions)
    init.steps.prospectCreation.actions = verifiedActions //#task: Verify if deep clone or just reference

    //5. Assign process to project
    ProjectProcess.init = init

    //B. Add Next Phase depending on project "step" attribute 
    if (allActionsValid)
        ProjectProcess = ProjectNextPhaseInit(ProjectProcess, projectNextPhase)

    return ProjectProcess
}

const ProjectNextPhaseInit = (ProjectProcess, projectNextPhase) => {
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

const verifyActions = async (actions) => {

    //Issue: cannot access same document same collection multiple times in a very short delay
    //Solution: Sort by 'Document-Id' to access and verify one time all actions concerning same document.
    const formatedActions = groupBy(actions, "documentId")

    //Verify actions for each document
    let verifiedActions = []
    let allActionsValid = true

    for (const documentId in formatedActions) {
        const { verifiedActionsSameDoc, allActionsSameDocValid } = await verifyActionsSameDoc(formatedActions[documentId])
        allActionsValid = allActionsValid && allActionsSameDocValid
        verifiedActions = verifiedActions.concat(verifiedActionsSameDoc)
    }

    return { verifiedActions, allActionsValid }
}

const verifyActionsSameDoc = async (actionsSameDoc) => {
    const collection = actionsSameDoc[0]['collection']
    const documentId = actionsSameDoc[0]['documentId']
    let allActionsSameDocValid = true

    const verifiedActionsSameDoc = await db.collection(collection).doc(documentId).get().then((doc) => {
        if(doc.exists) console.log('Document not found.........')

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

const groupBy = (arr, property) => {
    return arr.reduce((memo, x) => {
        if (!memo[x[property]]) {
            memo[x[property]] = []
        }

        memo[x[property]].push(x)
        return memo
    }, {})
}


//Utils
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