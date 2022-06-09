
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
            installationCreation: {
                title: 'Plannification installation',
                instructions: '', // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                actions: [
                    {
                        id: 'installationCreation',
                        title: 'Créer une tâche de type installation',
                        instructions: 'Créer une tâche de type installation',
                        actionOrder: 1,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Agenda',
                        documentId: "",
                        params: {
                            taskType: "Installation",
                        },
                        queryFilters: buildQueryFilters(queryFilters_Agenda_Map("Installation").create),
                        status: 'pending',
                        nextStep: 'installationChoice',
                    },
                ],
            },
            installationChoice: {
                title: "Mise à jour du statut de l'installation",
                instructions: '',
                stepOrder: 2,
                actions: [
                    {
                        id: 'installationChoice1',
                        title: "Mettre à jour le statut de l'installation (1)",
                        instructions: "Mettre à jour le statut de l'installation (1)",
                        actionOrder: 1,
                        responsable: 'Poseur',
                        collection: 'Agenda',
                        documentId: "",
                        params: {
                            taskType: "Installation",
                        },
                        queryFilters: buildQueryFilters(queryFilters_Agenda_Map("Installation").create),
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            {
                                id: 'block',
                                label: 'Bloquée',
                                onSelectType: 'validation',
                                commentRequired: true,
                                operation: {
                                    type: 'update',
                                    field: 'status',
                                    value: 'En attente',
                                },
                            },
                            {
                                id: 'confirm',
                                label: 'Finalisée',
                                nextStep: 'pvCreation',
                                onSelectType: 'transition',
                                operation: { type: 'update', field: 'status', value: 'Terminé' },
                            },
                        ],
                        status: 'pending',
                    },
                    {
                        id: 'installationChoice2',
                        title: "Mettre à jour le statut de l'installation (2)",
                        instructions: "Mettre à jour le statut de l'installation (2)",
                        actionOrder: 2,
                        responsable: 'Poseur',
                        collection: 'Agenda',
                        documentId: "",
                        params: {
                            taskType: "Installation",
                        },
                        queryFilters: buildQueryFilters(queryFilters_Agenda_Map("Installation").create),
                        verificationType: 'multiple-choices',
                        comment: '', //motif            
                        choices: [
                            {
                                label: 'Abandonnée',
                                id: 'cancel',
                                nextPhase: 'cancelProject',
                                onSelectType: 'transition',
                                commentRequired: true,
                                operation: { type: 'update', field: 'status', value: 'Annulé' },
                            },
                            {
                                label: 'En cours',
                                id: 'confirm',
                                onSelectType: 'actionRollBack',
                                operation: { type: 'update', field: 'status', value: 'En cours' },
                            },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        forceValidation: true,
                    },
                ],
            },
            pvCreation: {
                title: "Création d'un PV réception",
                instructions: '',
                stepOrder: 3,
                actions: [
                    {   //##new
                        id: 'pvCreation',
                        title: 'Créer un PV réception',
                        instructions: 'Créer un PV réception',
                        actionOrder: 1,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //creation
                        params: {
                            documentType: "PV réception",
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("PV réception").create.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("PV réception").create.onCreate),
                        status: 'pending',
                        nextStep: 'reserve',
                    },
                ],
            },
            reserve: {
                title: 'Réserve',
                instructions: '',
                stepOrder: 4,
                actions: [
                    {
                        id: 'reserve',
                        title: 'Êtes-vous satisfait de notre travail ?',
                        instructions: '',
                        actionOrder: 1,
                        type: 'manual',
                        verificationType: 'multiple-choices',
                        comment: '', //#task: comments are joined (separated by ;)
                        choices: [
                            {
                                label: 'NON',
                                id: 'comment',
                                nextStep: 'catchupCreation',
                                onSelectType: 'transition',
                                commentRequired: true,
                            }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            {
                                label: 'OUI',
                                id: 'confirm',
                                nextStep: 'poseurValidation',
                                onSelectType: 'transition',
                            },
                        ],
                        responsable: 'Client',
                        status: 'pending',
                    },
                ],
            },
            catchupCreation: {
                title: 'Plannification tâche rattrapage',
                instructions: '',
                stepOrder: 5,
                actions: [
                    {
                        id: 'catchupCreation',
                        title: 'Créer une tâche rattrapage',
                        instructions: 'Créer une tâche rattrapage',
                        actionOrder: 1,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Agenda',
                        documentId: "",
                        params: {
                            taskType: "Installation",
                        },
                        queryFilters: buildQueryFilters(queryFilters_Agenda_Map("Rattrapage").create),
                        status: 'pending',
                    },
                    {
                        id: 'catchupChoice',
                        title: 'Finaliser la tâche rattrapage',
                        instructions: 'Finaliser la tâche rattrapage',
                        actionOrder: 3,
                        responsable: 'Poseur',
                        verificationType: 'multiple-choices',
                        choices: [
                            {
                                id: 'finish',
                                label: 'Finaliser',
                                nextStep: 'reserve',
                                onSelectType: 'transition',
                                operation: { type: 'update', field: 'status', value: 'Terminé' },
                            },
                        ],
                        collection: 'Agenda',
                        documentId: "",
                        params: {
                            taskType: "Rattrapage",
                        },
                        queryFilters: buildQueryFilters(queryFilters_Agenda_Map("Rattrapage").create),
                        status: 'pending',
                    },
                ],
            },
            poseurValidation: {
                title: 'Validation du technicien',
                instructions: '',
                stepOrder: 6,
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
                stepOrder: 7,
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
                stepOrder: 8,
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
            paymentStatus: {
                //conversion
                title: 'Finalisation de la facturation',
                instructions: '',
                stepOrder: 9,
                nextStep: '',
                actions: [
                    {
                        //##task: add multiCommentsPicker
                        id: 'paymentStatus',
                        title: 'Modifier le statut du paiement',
                        instructions: '',
                        actionOrder: 1,
                        type: 'manual',
                        verificationType: 'multiple-choices',
                        onSelectType: 'multiCommentsPicker', //only in multiCommentsPicker
                        comment: '',
                        choices: [
                            {
                                label: 'Attente paiement client',
                                id: 'pending',
                                onSelectType: 'multiCommentsPicker',
                                selected: false,
                                stay: true,
                            },
                            {
                                label: 'Attente paiement financement',
                                id: 'pending',
                                onSelectType: 'multiCommentsPicker',
                                selected: false,
                                stay: true,
                            },
                            //##task: Diviser Attente paiement aide en MPR et CEE
                            {
                                label: 'Attente paiement aide MPR',
                                id: 'pending',
                                onSelectType: 'multiCommentsPicker',
                                selected: false,
                                stay: true,
                            },
                            {
                                label: 'Attente paiement aide CEE',
                                id: 'pending',
                                onSelectType: 'multiCommentsPicker',
                                selected: false,
                                stay: true,
                            },
                            {
                                label: 'Payé',
                                id: 'confirm',
                                onSelectType: 'multiCommentsPicker',
                                selected: false,
                                stay: false,
                            },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'advValidation',
                        title: "Validation de la facture par l'ADV", //#task allow adv to view devis before validating (multi-choice: voir/valider)
                        instructions: '',
                        actionOrder: 2,
                        type: 'manual',
                        //verificationType: 'validation',
                        comment: '',
                        responsable: 'ADV',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            {
                                label: 'Annuler',
                                id: 'cancel',
                                nextPhase: 'cancelProject',
                                onSelectType: 'transition',
                                commentRequired: true,
                            },
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                        ],
                    },
                    //##done:task: Ajouter montant HT + TTC ??
                    {
                        id: 'billingAmount',
                        title: 'Saisir le montant de la facture',
                        instructions: "Veuillez saisir le montant HT et TTC de la facture.",
                        actionOrder: 3,
                        //Verification
                        collection: 'Projects',
                        documentId: '', //#dynamic
                        properties: ['bill', "amount"],
                        params: {
                            screenParams: {
                                sections: { billing: { billAmount: true } },
                            }
                        },
                        screenPush: true,
                        //Comment
                        comment: '',
                        //Verification
                        type: 'auto',
                        verificationType: 'data-fill',
                        verificationValue: '',
                        //Others
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'attestationCreation',
                        title: 'Créer une attestation fluide',
                        instructions: 'Créer une attestation fluide',
                        actionOrder: 4,
                        responsable: 'Poseur',
                        verificationType: 'doc-creation',
                        collection: 'Documents',
                        documentId: "", //creation
                        params: {
                            documentType: "Attestation fluide",
                        },
                        //Updates documentId to view the "onProgress uploading document"
                        queryFilters_onProgressUpload: buildQueryFilters(queryFilters_Documents_Map("Attestation fluide").create.onProgress),
                        //Verification:
                        queryFilters: buildQueryFilters(queryFilters_Documents_Map("Attestation fluide").create.onCreate),
                        status: 'pending',
                        nextStep: 'emailBill',
                    }
                ],
            },
            emailBill: {
                title: 'Envoi facture par mail',
                instructions: '',
                stepOrder: 10,
                nextStep: '',
                actions: [
                    //task: verify if bill & attestation fluide are still existing
                    {
                        id: 'emailBill',
                        title: 'Envoi automatique de la facture finale + attestation fluide par mail en cours...',
                        instructions: '',
                        actionOrder: 2,
                        collection: 'Projects',
                        documentId: '', //#dynamic
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        properties: ['finalBillSentViaEmail'],
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: false,
                        cloudFunction: {
                            endpoint: 'sendEmail',
                            queryAttachmentsUrls: {
                                Facture: [
                                    { filter: 'project.id', operation: '==', value: '' },
                                    { filter: 'type', operation: '==', value: 'Facture' },
                                    {
                                        filter: 'attachment.downloadURL',
                                        operation: '!=',
                                        value: '',
                                    },
                                ],
                                'Attestation fluide': [
                                    { filter: 'project.id', operation: '==', value: '' },
                                    {
                                        filter: 'type',
                                        operation: '==',
                                        value: 'Attestation fluide',
                                    },
                                    {
                                        filter: 'attachment.downloadURL',
                                        operation: '!=',
                                        value: '',
                                    },
                                ],
                            },
                            params: {
                                subject: 'Facture finale et attestation fluide',
                                dest: 'sa.lyoussi@gmail.com', //#task: change it
                                projectId: '',
                                attachments: [],
                            },
                        },
                        nextStep: 'clientReview',
                    },
                ],
            },
            clientReview: {
                title: 'Satisfaction client',
                instructions:
                    "Le directeur technique devra valider la satisfaction du client vis-à-vis de l'installation",
                stepOrder: 11,
                nextStep: '',
                actions: [
                    {
                        id: 'clientReview',
                        title: 'Êtes-vous satisfait de notre service ?',
                        instructions: '',
                        actionOrder: 1,
                        type: 'manual',
                        verificationType: 'multiple-choices',
                        isReview: true,
                        comment: '',
                        choices: [
                            {
                                label: '1',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '2',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '3',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '4',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '5',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '6',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '7',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '8',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '9',
                                onSelectType: 'commentPicker',
                                selected: false,
                                saty: false,
                                nextPhase: 'maintainance',
                            },
                            {
                                label: '10',
                                onSelectType: 'commentPicker',
                                selected: false,
                                stay: false,
                                nextPhase: 'maintainance',
                            },
                        ],
                        status: 'pending',
                    },
                ],
            },
        },
    },
    'version': 0
}


