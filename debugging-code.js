//Resume maitainance
const processModel = {
    'installation': {
        title: 'Installation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'maintainanceContract': {
                title: "Contrat maintenance",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 7,
                actions: [
                    {
                        id: 'commercialPropositionChoice',
                        title: "Accepter la proposition commerciale",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        type: 'manual', //Check manually
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'facturationOption1', onSelectType: 'transition' },
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'mandatSepaCreation',
                        title: "Créer/Importer un mandat SEPA",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true },
                        type: 'auto', //Check manually
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'facturationOption1', onSelectType: 'transition' },
                            { label: 'Importer le document', id: 'upload', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'signedSEPACreation',
                        title: 'Signer le mandat SEPA',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed mandat SEPA exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'facturationOption1', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le mandat SEPA', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'contractCreation',
                        title: "Créer/Importer un contrat",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'facturationOption1', onSelectType: 'transition' },
                            { label: 'Importer le contrat', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'signedContractCreation',
                        title: 'Signer le contrat',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 5,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed mandat SEPA exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'facturationOption1', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        nextStep: 'facturationOption1'
                    },
                    //#task: Add last action multi-choice (contrat "en cours" or "terminé")
                ]
            }
        },
    },
    'maintainance': {
        title: 'Maintenance',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'maintainanceContract': {
                title: "Contrat maintenance",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                actions: [
                    {
                        id: 'commercialPropositionChoice',
                        title: "Accepter la proposition commerciale",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        type: 'manual', //Check manually
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'mandatSepaCreation',
                        title: "Créer/Importer un mandat SEPA",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true },
                        type: 'auto', //Check manually
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Importer le document', id: 'upload', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'signedSEPACreation',
                        title: 'Signer le mandat SEPA',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed mandat SEPA exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Signer le mandat SEPA', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'contratCreation',
                        title: "Créer/Importer un contrat",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Importer le contrat', id: 'upload', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'signedContractCreation',
                        title: 'Signer le contrat',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 5,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed mandat SEPA exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        choices: [
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'endProject',
                        title: "Finaliser le projet",
                        instructions: "",
                        actionOrder: 6,
                        type: 'manual',
                        verificationType: 'validation',
                        comment: '',
                        responsable: 'ADV',
                        status: 'pending',
                        nextPhase: 'endProject',
                    },
                ]
            },
        }
    }
}


let process = {
    'installation': {
        title: 'Installation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'maintainanceContract': {
                title: "Contrat maintenance",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 7,
                actions: [
                    {
                        id: 'commercialPropositionChoice',
                        title: "Accepter la proposition commerciale",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        type: 'manual', //Check manually
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'facturationOption1', onSelectType: 'transition' },
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ],
                        responsable: 'Poseur',
                        status: 'done',
                    },
                    {
                        id: 'mandatSepaCreation',
                        title: "Créer/Importer un mandat SEPA",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true },
                        type: 'auto', //Check manually
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'facturationOption1', onSelectType: 'transition' },
                            { label: 'Importer le document', id: 'upload', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'done',
                    },
                    {
                        id: 'signedSEPACreation',
                        title: 'Signer le mandat SEPA',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed mandat SEPA exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'facturationOption1', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le mandat SEPA', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'contractCreation',
                        title: "Créer/Importer un contrat",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'facturationOption1', onSelectType: 'transition' },
                            { label: 'Importer le contrat', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'signedContractCreation',
                        title: 'Signer le contrat',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 5,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed mandat SEPA exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'facturationOption1', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        nextStep: 'facturationOption1'
                    },
                    //#task: Add last action multi-choice (contrat "en cours" or "terminé")
                ]
            }
        },
    },
}

process['maintainance'] = {}
process['maintainance'].title = _.clone(processModel['maintainance'].title)
process['maintainance'].instructions = _.clone(processModel['maintainance'].instructions)
process['maintainance'].phaseOrder = _.clone(processModel['maintainance'].phaseOrder)
process['maintainance'].steps = {}
process['maintainance'].steps['maintainanceContract'] = _.cloneDeep(process['installation'].steps['maintainanceContract'])

process['maintainance'].steps['maintainanceContract'].actions.forEach((action, actionIndex) => {
    if (action.nextStep)
        delete action.nextStep
    if (action.nextPhase)
        delete action.nextPhase
    if (action.choices)
        action.choices = action.choices.filter((choice) => choice.id !== "cancel" && choice.id !== "skip")
})

const lastAction = {
    id: 'endProject',
    title: "Finaliser le projet",
    instructions: "",
    actionOrder: process['maintainance'].steps['maintainanceContract'].actions.length,
    type: 'manual',
    verificationType: 'validation',
    comment: '',
    responsable: 'ADV',
    status: 'pending',
    nextPhase: 'endProject',
}

process['maintainance'].steps['maintainanceContract'].actions.push(lastAction)

console.log("MAINTAINANCE*****************************")
for (const action of process['maintainance'].steps['maintainanceContract'].actions) {
    console.log(action.id, action.status)
}

let { actions } = process['installation'].steps['maintainanceContract']
actions = actions.filter((action) => action.status !== "pending")
process['installation'].steps['maintainanceContract'].actions = actions

console.log("INSTALLATION**************************")
for (const action of process['installation'].steps['maintainanceContract'].actions) {
    console.log(action.id, action.status)
}