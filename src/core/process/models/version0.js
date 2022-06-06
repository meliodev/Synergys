
const queryFilters_Documents_Map = (documentType) => {
    const map = {
        create: {
            onProgress: {
                collection: "Documents",
                operation: "create",
                params: {
                    documentType,
                    isOnProgress: true
                }
            },
            onCreate: {
                collection: "Documents",
                operation: "create",
                params: {
                    documentType
                }
            }
        },
        sign: {
            onProgress: {
                collection: "Documents",
                operation: "sign",
                params: {
                    isOnProgress: true,
                    documentType
                }
            },
            onCreate: {
                collection: "Documents",
                operation: "sign",
                params: {
                    documentType
                }
            }
        }
    }
    return map
}

const queryFilters_Agenda_Map = (taskType) => {
    const map = {
        create: {
            collection: "Agenda",
            params: {
                taskType,
            }
        },
        update: {
            collection: "Agenda",
            params: {
                taskType,
            }
        }
    }
    return map
}

const buildQueryFilters = (config) => {
    const { collection, operation, params } = config
    let queryFilters = null

    if (collection === "Documents") {
        const { isOnProgress, documentType } = params
        if (operation === "create") {
            if (isOnProgress)
                queryFilters = [
                    { filter: 'project.id', operation: '==', value: '' },
                    { filter: 'type', operation: '==', value: documentType },
                    { filter: 'deleted', operation: '==', value: false },
                    { filter: 'attachment.downloadURL', operation: '!=', value: '' },
                ]
            else
                queryFilters = [
                    { filter: 'project.id', operation: '==', value: '' },
                    { filter: 'type', operation: '==', value: documentType },
                    { filter: 'deleted', operation: '==', value: false },
                ]
        }

        else if (operation === "sign") {
            if (isOnProgress)
                queryFilters = [
                    //VERIFICATION: verify if signed quote exists
                    { filter: 'project.id', operation: '==', value: '' },
                    { filter: 'type', operation: '==', value: documentType },
                    { filter: 'deleted', operation: '==', value: false },
                    { filter: 'attachmentSource', operation: '==', value: 'signature' },
                ]
            else queryFilters = [
                //NAVIGATION: Get id of the existing quote (to update signature)
                { filter: 'project.id', operation: '==', value: '' },
                { filter: 'type', operation: '==', value: documentType },
                { filter: 'deleted', operation: '==', value: false },
            ]
        }
    }

    else if (collection === "Agenda") {
        const { taskType } = params
        queryFilters = [
            { filter: 'project.id', operation: '==', value: '' },
            { filter: 'type', operation: '==', value: taskType },
            { filter: 'deleted', operation: '==', value: false },
            { filter: 'status', operation: '!=', value: 'Annulé' },
        ]
    }

    return queryFilters
}


export const version0 = {
    'init': {
        title: 'Prospect',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 1,
        followers: ['Admin', 'Directeur commercial', 'Commercial'],
        steps: { //One step
            'prospectCreation': {
                title: 'Création prospect',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                actions: [
                    {
                        //General
                        id: 'nom',
                        title: 'Nom',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        //Verification
                        collection: 'Clients',
                        documentId: '', //#dynamic
                        properties: ['nom'],
                        //Navigation
                        screenName: 'Profile',
                        screenParams: { user: { id: '', roleId: 'client' }, project: null },
                        screenPush: true,
                        //Verification
                        type: 'auto',
                        verificationType: 'data-fill',
                        verificationValue: '',
                        responsable: 'Commercial',
                        status: 'pending',
                    },
                    {
                        //General
                        id: 'prenom',
                        title: 'Prénom',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        //Verification
                        collection: 'Clients',
                        documentId: '',
                        properties: ['prenom'],
                        //Navigation
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { user: { id: '', roleId: 'client' }, project: null },
                        screenPush: true,
                        //Verification
                        type: 'auto',
                        verificationType: 'data-fill',
                        verificationValue: '',
                        responsable: 'Commercial',
                        status: 'pending',
                    },
                    {
                        id: 'address',
                        title: 'Adresse postale',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Clients',
                        documentId: '', //dynamic
                        properties: ['address', 'description'],
                        screenName: 'Profile',
                        screenParams: { user: { id: '', roleId: 'client' }, project: null },
                        screenPush: true,
                        type: 'auto',
                        verificationType: 'data-fill',
                        verificationValue: '',
                        responsable: 'Commercial',
                        status: 'pending',
                    },
                    {
                        id: 'phone',
                        title: 'Numéro de téléphone',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Clients',
                        documentId: '', // dynamic
                        properties: ['phone'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { user: { id: '', roleId: 'client' }, project: null },
                        screenPush: true,
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: ''
                    },
                    {
                        id: 'conversionClient',
                        title: 'Convertir le prospect en client',
                        instructions: 'Appuyez sur le bouton "Convertir en client"',
                        actionOrder: 5,
                        collection: 'Clients',
                        documentId: '', // dynamic
                        properties: ['isProspect'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { user: { id: '', roleId: 'client' }, project: null },
                        screenPush: true,
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: true, //check if fieldValue !== verificationValue
                    },
                ]
            },
        }
    },
    installation: {
        title: 'Installation',
        instructions: '',
        phaseOrder: 2,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            poseurValidation: {
                title: 'Validation du technicien',
                instructions: '',
                stepOrder: 1,
                actions: [
                    {
                        id: 'maintainanceContractChoice',
                        title: 'Voulez-vous initier le contrat de maintenance ?',
                        instructions: '',
                        actionOrder: 1,
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            {
                                label: 'Décider plus tard, passer à la facturation',
                                id: 'cancel',
                                nextStep: 'facturationOption1',
                                onSelectType: 'transition',
                                commentRequired: true,
                            }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            {
                                label: 'OUI',
                                id: 'confirm',
                                nextStep: 'maintainanceContract',
                                onSelectType: 'transition',
                            },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                ],
            },
            maintainanceContract: {
                title: 'Contrat maintenance',
                instructions: '',
                stepOrder: 2,
                actions: [
                    {
                        id: 'commercialPropositionChoice',
                        title: 'Accepter la proposition commerciale',
                        instructions: '',
                        actionOrder: 1,
                        type: 'manual', //Check manually
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            {
                                label: 'Décider plus tard, passer à la facturation',
                                id: 'skip',
                                nextStep: 'facturationOption1',
                                onSelectType: 'transition',
                            },
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {   //##new
                        id: 'mandatSepaCreation',
                        title: 'Créer/Importer un mandat SEPA',
                        instructions: 'Créer/Importer un mandat SEPA',
                        actionOrder: 2,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //creation
                        params: {
                            documentType: "Mandat SEPA",
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("Mandat SEPA").create.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("Mandat SEPA").create.onCreate),
                        comment: '', //motif
                        choices: [
                            {
                                id: 'skip',
                                label: 'Décider plus tard, passer à la facturation',
                                nextStep: 'facturationOption1',
                                onSelectType: 'transition',
                            },
                            {
                                id: 'upload',
                                label: 'Importer le document',
                                onSelectType: 'navigation',
                            },
                        ],
                        status: 'pending',
                        nextStep: 'reserve',
                    },
                    {   //##new
                        id: 'signedSEPACreation',
                        title: 'Signer le mandat SEPA',
                        instructions: 'Signer le mandat SEPA',
                        actionOrder: 3,
                        responsable: 'Client',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //edit
                        params: {
                            documentType: "Mandat SEPA",
                            isSignature: true
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("Mandat SEPA").sign.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("Mandat SEPA").sign.onCreate),
                        comment: "",
                        choices: [
                            {
                                id: 'cancel',
                                label: 'Décider plus tard, passer à la facturation',
                                nextStep: 'facturationOption1',
                                onSelectType: 'transition',
                                commentRequired: true,
                            },
                            {
                                id: 'sign',
                                label: 'Signer le mandat SEPA',
                                onSelectType: 'navigation',
                            },
                        ],
                        status: 'pending',
                    },
                    {   //##new
                        id: 'contractCreation',
                        title: 'Créer/Importer un contrat',
                        instructions: 'Créer/Importer un contrat',
                        actionOrder: 4,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //creation
                        params: {
                            documentType: "Contrat CGU-CGV",
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("Contrat CGU-CGV").create.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("Contrat CGU-CGV").create.onCreate),
                        comment: '', //motif
                        choices: [
                            {
                                label: 'Décider plus tard, passer à la facturation',
                                id: 'skip',
                                nextStep: 'facturationOption1',
                                onSelectType: 'transition',
                            },
                            {
                                label: 'Importer le contrat',
                                id: 'upload',
                                onSelectType: 'navigation',
                            },
                        ],
                        status: 'pending',
                    },
                    {   //##new
                        id: 'signedContractCreation',
                        title: 'Signer le contrat',
                        instructions: 'Signer le contrat',
                        actionOrder: 5,
                        responsable: 'Client',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //edit
                        params: {
                            documentType: "Contrat CGU-CGV",
                            isSignature: true
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("Contrat CGU-CGV").sign.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("Contrat CGU-CGV").sign.onCreate),
                        comment: "",
                        choices: [
                            {
                                label: 'Décider plus tard, passer à la facturation',
                                id: 'cancel',
                                nextStep: 'facturationOption1',
                                onSelectType: 'transition',
                                commentRequired: true,
                            },
                            {
                                label: 'Signer le contrat',
                                id: 'sign',
                                onSelectType: 'navigation',
                            },
                        ],
                        status: 'pending',
                        nextStep: 'facturationOption1',
                    },
                    //#task: Add last action multi-choice (contrat "en cours" or "terminé")
                ],
            },
            facturationOption1: {
                //no conversion
                title: 'Facturation',
                instructions: '',
                stepOrder: 3,
                nextStep: '',
                actions: [
                    {
                        id: 'billCreation',
                        title: 'Créer une facture',
                        instructions: 'Créer une facture',
                        actionOrder: 1,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //creation
                        params: {
                            documentType: "Facture",
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("Facture").create.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("Facture").create.onCreate),
                        status: 'pending',
                        nextStep: 'paymentStatus',
                    }
                    //##done:task: Delete "Signer la facture"
                ],
            },
        },
    },
    'version': 0
}


