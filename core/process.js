import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { Text } from 'react-native'

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
                nextStep: '',
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
                    {
                        id: 'phone',
                        title: 'Numéro de téléphone',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Clients', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['phone'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill'
                    },
                    {
                        id: 'comment',
                        title: 'Commentaire',
                        instructions: "Veuillez renseigner des informations utiles (exp: Informations sur l'habitation)",
                        actionOrder: 5,
                        collection: '', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: '',
                        status: 'pending',
                        comment: '',
                        verificationType: 'comment'
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
                nextStep: '',
                nexPhase: '',
                actions: [
                    {
                        id: 'createPriorTechnicalVisit',
                        title: 'Créer une visite technique préalable',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Visite technique préalable' }], //projectId
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
                    {
                        id: 'rd1Choice',
                        title: 'Modifier le statut du rendez-vous 1',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: '', //Because manual
                        documentId: '', //Because manual
                        properties: [], //Because manual
                        screenName: '', //Because manual
                        screenParams: null, //Because manual
                        type: 'manual', //Check manually
                        responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true },
                            { label: 'Reporter', id: 'postpone', onSelectType: 'navigation', screenName: 'CreateTask', screenParams: { TaskId: '' }, creationPath: { phaseId: 'rd1', stepId: 'priorTechnicalVisit', actionId: 'createPriorTechnicalVisit' } },
                            { label: 'Confirmer', id: 'confirm', nextStep: 'housingActionFile', onSelectType: 'transition' },
                        ]
                    },
                    {
                        id: 'rd2Creation',
                        title: 'Créer un rendez-vous 2',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Rendez-vous 2' }], //projectId
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Rendez-vous 2', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    },
                ]
            },
            'housingActionFile': { //##ask can be optional (skipable) depending on the client accepts it or rejects it
                title: 'Dossier action logement',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: '', //will be set dynamiclly depending on the multiple choice decision (choice = NON)
                nextPhase: '', //will be set dynamiclly depending on the multiple choice decision (choice = OUI)
                actions: [
                    {
                        id: 'eebFile',
                        title: 'Créer une fiche EEB',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Fiche EEB' }], //projectId
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Fiche EEB', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    },
                    {
                        id: 'eebFileChoice',
                        title: 'Le client est-il eligible au dossier action logement ?',
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
                        comment: '', //motif
                        choices: [
                            { label: 'NON', id: 'cancel', nextStep: 'aidFile', onSelectType: 'transition', commentRequired: true }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextPhase: 'technicalVisitManagement', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'aidFile': {
                title: 'Dossier aide',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                nextStep: '',
                actions: [
                    {
                        id: 'helpFolderCreation',
                        title: 'Créer un dossier aide',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Dossier aide' }], //projectId
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Dossier aide', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    },
                    {
                        id: 'quoteCreationChoice',
                        title: 'Voulez-vous continuer la procédure du projet ?',
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
                        comment: '', //motif
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true }, //#ask: does task cancellations involve project creation or rollback to previous step
                            { label: 'Créer un devis', id: 'confirm', nextStep: 'quoteCreation', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'quoteCreation': {
                title: "Création d'un devis",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 4,
                nextStep: '',
                actions: [
                    {
                        id: 'quoteCreation',
                        title: 'Créer un devis',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Devis' }], //projectId
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Devis', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    },
                    {
                        id: 'primeCEEChoice',
                        title: 'Ce projet est il éligible à la prime cee ?',
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
                        comment: '', //motif
                        choices: [
                            { label: 'NON', id: 'cancel', nextPhase: 'rdn', onSelectType: 'transition', commentRequired: true }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextStep: 'primeCEECreation', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'primeCEECreation': {
                title: "Création d'une prime CEE",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 5,
                nextPhase: 'rdn',
                actions: [
                    {
                        id: 'primeCEECreation',
                        title: 'Créer une prime CEE',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Devis' }], //projectId
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Devis', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    }
                ]
            },
        }
    },
    'rdn': {
        title: 'Rendez-vous N',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        steps: {
            'rdnChoice': { //creation action + multiple choice action
                title: 'Créer un rendez-vous 2',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                nextStep: '',
                nextPhase: '',
                actions: [
                    {
                        id: 'rdnChoice',
                        title: 'Modifier le statut du rendez-vous 2 (préalablement crée)',
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
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true },
                            { label: 'Reporter', id: 'postpone', nextStep: 'rdnCreation', onSelectType: 'transition', commentRequired: true }, //#task: change 'Motif de l'annulation' en 'Motif du report'
                            { label: 'Confirmer', id: 'confirm', nextStep: 'signature', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'rdnCreation': { //rdn postpone
                title: "Création d'un rendez-vous 2 (Report)",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: 'rdnChoice',
                //nextPhase: '',
                actions: [
                    {
                        id: 'rdnCreation',
                        title: 'Créer un rendez-vous 2 (Report)',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Rendez-vous N' }], //projectId
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Rendez-vous N', project: null, enableRDN: true },
                        type: 'auto',
                        responsable: { id: 'GS-US-xQ6s' },
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: ''
                    }
                ]
            },
            //signature
        }
    },
    'technicalVisitManagement': {
        title: 'Gestion visite technique',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 4,
        steps: {
            'siteCreation': {
                title: 'Création chantier',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                nextStep: '',
                nextPhase: '',
                actions: [
                    {
                        id: 'createTechnicalVisit',
                        title: 'Créer une visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        documentId: '',
                        properties: [{ property: 'project.id', operation: '==', value: '' }, { property: 'type', operation: '==', value: 'Visite technique' }], //projectId
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Visite technique', project: null },
                        type: 'auto',
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        docCreatedId: '' //Is filled automatically after creating the task
                    },
                    //other actions...
                ]
            },
            //other steps...
        }
    },
    'endProcess': {
        title: 'Fin du process',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 5,
        steps: {}
    }
}

//#PROCESS MAIN
export const processMain = async (process, projectSecondPhase, clientId, project) => {

    const attributes = { clientId, project }
    const currentProcess = _.cloneDeep(process)
    const updatedProjectProcess = await projectProcessHandler(currentProcess, projectSecondPhase, attributes)

    console.log('OLD PROCESS:', process)
    console.log("UPDATED PROCESS:", updatedProjectProcess)

    if (!_.isEqual(process, updatedProjectProcess)) {
        await db.collection('Projects').doc(project.id).update({ process: updatedProjectProcess }).then(() => console.log('PROJECT PROCESS UPDATED !'))
    }


    return updatedProjectProcess//To avoid errors
}

//#PROCESS ALGORITHM/LOGIC
export const projectProcessHandler = async (process, projectSecondPhase, attributes) => {

    let loopHandler = true

    //   while (loopHandler) {

    //0. Initialize process with 1st phase/1st step
    if (_.isEmpty(process)) {
        console.log('********************************* Initialization ******************************')
        process = initProcess(process, projectSecondPhase)
        console.log('4. Process initialized: ', process)
    }

    //1. Get current phase/step of the process
    console.log('********************************* Verification ******************************')
    var { currentPhaseId, currentStepId } = getCurrentStep(process)
    console.log(`1. Current phaseId/stepId fetched: ${currentPhaseId}/${currentStepId}`)

    //2. Actions handler (Verifications & Status update)
    let { actions } = process[currentPhaseId].steps[currentStepId] //Actions of current step
    console.log('actions1', actions)
    let allActionsValid = true

    if (actions.length > 0) {
        console.log(`3. Ready to verify actions...`)
        var verification_res = await verifyActions(actions, attributes, process)
        console.log('6. Verification result:', verification_res)

        allActionsValid = verification_res.allActionsValid
        actions = verification_res.verifiedActions
        process[currentPhaseId].steps[currentStepId].actions = actions
    }

    //3'. All actions valid --> update project's process model
    if (allActionsValid) {
        console.log('********************************* Transition ******************************')
        const transitionRes = handleTransition(process, currentPhaseId, currentStepId)
        process = transitionRes.process
        const { processEnded } = transitionRes
        if (processEnded) loopHandler = false
        else console.log('Transition done --> Loop')
    }

    //3". At least one action is not valid
    else {
        console.log('********************************* Break ******************************')
        loopHandler = false
    }
    // }

    return process
}

//#PROCESS TASKS:
//Task 1. Init
const initProcess = (process, projectSecondPhase) => {

    //Init project with first phase/first step
    let firstPhaseId = getFirstPhaseIdFromModel()
    console.log('1. First phase of process model fetched:', firstPhaseId)

    process = projectNextPhaseInit(process, firstPhaseId)
    console.log('2. Process initialized with first phase:', process)

    //Set "nextPhase" dynamiclly for all steps.. (but only last step will use it)
    Object.keys(process[firstPhaseId].steps).forEach((step) => {
        process[firstPhaseId].steps[step].nextPhase = projectSecondPhase
    })

    console.log(`3. Process first phase's steps now pointing toward second phase (nextPhase = ${projectSecondPhase}):`, process[firstPhaseId].steps)

    return process
}

const getFirstPhaseIdFromModel = () => {
    let firstPhaseId
    Object.keys(processModel).forEach(phaseId => {
        if (processModel[phaseId].phaseOrder === 1) firstPhaseId = phaseId
    })
    return firstPhaseId
}

// const getFirstStepIdFromModel = () => {
//     const firstPhaseId = getFirstPhaseIdFromModel()
//     let firstStepId
//     Object.keys(processModel[firstPhaseId].steps).forEach(stepId => {
//         if (processModel[firstPhaseId].steps[stepId].stepOrder === 1) firstStepId = stepId
//     })
//     return { firstPhaseId, firstStepId }
// }

//Task 2. Verifications & Status Update

const verifyActions = async (actions, attributes, process) => {

    let allActionsValid = true
    let verifiedActions = []

    //1. Complete actions params (necessary for database verification)
    console.log(`4. Completing params (necessary for database verification) for actions:`)
    for (let action of actions) {

        console.log(`${action.id}: ${action.verificationType}`)

        //Agenda, Documents
        if (action.verificationType === 'doc-creation') {
            //Verification & update
            if (action.collection === 'Agenda') {

                for (const item of action.properties) {
                    if (item.property === 'project.id')
                        item.value = attributes.project.id
                }
            }

            else if (action.collection === 'Documents') {

                for (const item of action.properties) {
                    if (item.property === 'project.id')
                        item.value = attributes.project.id
                }
            }

            //Navigation
            if (action.screenName === 'CreateTask') {
                action.screenParams.project = attributes.project
            }

            if (action.screenName === 'UploadDocument') {
                action.screenParams.project = attributes.project
            }
        }

        //Agenda, Clients
        else if (action.verificationType === 'data-fill') {
            //Verification & update
            if (action.collection === 'Clients') { //CASE 1: doc id already exists once project is created..
                action.documentId = attributes.clientId
            }

            else if (action.collection === 'Agenda') { //CASE2: doc id is created later on after project is created.. (so we have to retrieve doc id from the action which created the document)
                //1. Get TaskId from the action which created this document
                const { phaseId, stepId, actionId } = action.creationPath //Path to find creation action
                const creationStepAllActions = process[phaseId].steps[stepId].actions
                const creationAction = creationStepAllActions.filter((action) => action.id === actionId) //<-- Action found
                const TaskId = creationAction[0].docCreatedId
                action.documentId = TaskId
            }

            //Navigation
            if (action.screenName === 'Profile') { //CASE 1: doc id already exists once project is created..
                action.screenParams.userId = attributes.clientId
            }

            else if (action.screenName === 'CreateTask') { //CASE2: doc id is created later on after project is created.. (so we have to retrieve doc id from the action which created the document)
                //1. Get TaskId from the action which created this document
                const { phaseId, stepId, actionId } = action.creationPath //Path to find creation action
                const creationStepAllActions = process[phaseId].steps[stepId].actions
                const creationAction = creationStepAllActions.filter((action) => action.id === actionId) //<-- Action found
                const TaskId = creationAction[0].docCreatedId
                action.screenParams.TaskId = TaskId
            }
        }

        else if (action.verificationType === 'multiple-choices') {
            for (let choice of action.choices) {
                if (choice.onSelectType === 'navigation') {
                    if (choice.screenName === 'CreateTask') {
                        //1. Get TaskId from the action which created this document
                        const { phaseId, stepId, actionId } = choice.creationPath //Path to find creation action
                        const creationStepAllActions = process[phaseId].steps[stepId].actions
                        const creationAction = creationStepAllActions.filter((action) => action.id === actionId) //<-- Action found
                        const TaskId = creationAction[0].docCreatedId
                        choice.screenParams.TaskId = TaskId
                    }
                }
            }
        }

        //Agenda
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

    //2. VERIFICATION TYPES
    //--> Split actions to 4 groups based on "verificationType" property
    console.log('5. Starting verifications...')
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
        console.log('actions_multipleChoices:::::::::::::', actions_multipleChoices)
        var res3 = await verifyActions_multipleChoices(actions_multipleChoices)
        allActionsValid_multipleChoices = res3.allActionsValid_multipleChoices
        actions_multipleChoices = res3.verifiedActions_multipleChoices
    }

    //VERIFICATION TYPE 4: multiple-choices
    let actions_comment = actions_groupedByVerificationType['comment'] || []
    let allActionsValid_comment = true

    if (actions_comment.length > 0) {
        console.log('actions_comment:::::::::::::', actions_comment)
        var res3 = await verifyActions_comment(actions_comment)
        allActionsValid_comment = res3.allActionsValid_comment
        actions_comment = res3.verifiedActions_comment
    }

    //VERIFICATION TYPE 5: doc-update
    let actions_docUpdate = actions_groupedByVerificationType['doc-update'] || []
    let allActionsValid_docUpdate = true

    if (actions_docUpdate.length > 0) {
        var res3 = await verifyActions_docUpdate(actions_docUpdate)
        allActionsValid_docUpdate = res3.allActionsValid_docUpdate
        actions_docUpdate = res3.verifiedActions_docUpdate
    }

    allActionsValid = allActionsValid_dataFill && allActionsValid_docCreation && allActionsValid_multipleChoices && allActionsValid_comment
    verifiedActions = verifiedActions.concat(actions_dataFill, actions_docCreation, actions_multipleChoices, actions_comment)

    return { allActionsValid, verifiedActions }
}

const verifyActions_dataFill = async (actions) => {

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

const verifyActions_docCreation = async (actions) => {

    //Verify actions for each document
    let allActionsValid_docCreation = true

    for (let action of actions) {
        const collection = action.collection //Agenda

        //Agenda:  db.collection(collection).where('project.id', '==', projectId).where('type', '==', x)
        //Document: db.collection(collection).where('project.id', '==', projectId).where('type', '==', y)

        let query = db.collection(collection)
        action.properties.forEach(({ property, operation, value }) => {
            query = query.where(property, operation, value) //exp: db.collection(collection).where('project.id', '==', projectId).where('type', '==', x)
        })

        await query.get().then((querysnapshot) => { //#task: for Agenda: add .where('type', ==, param) + do conditional query depending on collection (for example "Documents" .where('type', == 'Devis'))
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

const verifyActions_multipleChoices = async (actions) => {
    let allActionsValid_multipleChoices = true

    for (let action of actions) {
        if (action.status === 'pending')
            allActionsValid_multipleChoices = false
    }

    const verifiedActions_multipleChoices = actions
    return { allActionsValid_multipleChoices, verifiedActions_multipleChoices }
}

const verifyActions_comment = async (actions) => {
    let allActionsValid_comment = true

    for (let action of actions) {
        if (action.status === 'pending')
            allActionsValid_comment = false
    }

    const verifiedActions_comment = actions
    return { allActionsValid_comment, verifiedActions_comment }
}

const verifyActions_docUpdate = async (actions) => {
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


//Task 3. Phase/Step transition
const handleTransition = (process, currentPhaseId, currentStepId) => {

    const nextStepId = getNextStepId(process, currentPhaseId, currentStepId)
    let processEnded = false
    console.log('A.1. Next step id:', nextStepId)

    //Next step transition
    if (nextStepId)
        process = handleNextStepTransition(process, currentPhaseId, currentStepId, nextStepId)

    else {
        const nextPhaseId = getNextPhaseId(process, currentPhaseId, currentStepId)
        console.log('B.1. Next phase id:', nextPhaseId)

        //Next phase transition
        if (nextPhaseId)
            process = handleNextPhaseTransition(process, nextPhaseId)

        //End process
        else {
            handleEndProcess(process)
            processEnded = true
        }
    }

    return { process, processEnded }
}

//Task 3'.
export const getNextStepId = (process, currentPhaseId, currentStepId) => {
    const nextStepId = process[currentPhaseId].steps[currentStepId].nextStep || null
    return nextStepId
}

const handleNextStepTransition = (process, currentPhaseId, currentStepId, nextStepId) => {
    process = projectNextStepInit(process, currentPhaseId, currentStepId, nextStepId)
    return process
}

export const projectNextStepInit = (process, currentPhaseId, currentStepId, nextStepId) => {

    //0. Handle rollback

    const currentStepOrder = processModel[currentPhaseId].steps[currentStepId].stepOrder
    const nextStepOrder = processModel[currentPhaseId].steps[nextStepId].stepOrder
    if (nextStepOrder < currentStepOrder) {
        process[currentPhaseId].steps[nextStepId].actions.forEach((action) => {
            action.status = "pending"
        })
        return process
    }

    //1. Get next Step from process model
    console.log('A.2 Fetching next step model...')
    const nextStepModel = processModel[currentPhaseId].steps[nextStepId]

    //2. Concat next step to process
    process[currentPhaseId].steps[nextStepId] = nextStepModel
    console.log("A.3 Project process next step initialized:", process[currentPhaseId].steps[nextStepId])

    return process
}

//Task 3".
export const getNextPhaseId = (process, currentPhaseId, currentStepId) => {
    const nextPhaseId = process[currentPhaseId].steps[currentStepId].nextPhase || null //#rules: Only last step has "nextPhase" property
    return nextPhaseId
}

const handleNextPhaseTransition = (process, nextPhaseId) => {
    process = projectNextPhaseInit(process, nextPhaseId)
    return process
}

export const projectNextPhaseInit = (process, nextPhaseId) => {

    //1. Get next Phase from process model
    console.log('B.2 Fetching next phase model...')
    const nextPhaseModel = processModel[nextPhaseId]

    //2. Keep only first step (stepOrder = 1)
    const firstStep = getPhaseFirstStep(nextPhaseModel.steps)
    nextPhaseModel.steps = firstStep
    console.log('B.3 Restrict phase model to only the first step:', "nextPhaseModel.steps", nextPhaseModel.steps)

    //3. Concat next phase to process
    process[nextPhaseId] = nextPhaseModel
    console.log("B.4 Project process next phase initialized", "process[nextPhaseId]=", process[nextPhaseId])

    return process
}

const getPhaseFirstStep = (steps) => {
    const firstStepArray = Object.entries(steps).filter(([key, value]) => value['stepOrder'] === 1)
    const firstStep = Object.fromEntries(firstStepArray)
    return firstStep
}

//Task 4. End process
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





//Remarques:
//Maintanability:
// if the process model is changed.. for example we remove an intermediary step. The step(s) which points toward it will be broken..