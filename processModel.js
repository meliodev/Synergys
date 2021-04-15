export const processModel = {
    'init': {
        title: 'Initialisation',
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
                        //General data
                        id: 'nom',
                        title: 'Nom',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        //Verification params
                        collection: 'Clients',
                        documentId: '', //#dynamic
                        properties: ['nom'],
                        //Navigation (Update) params
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true, isProcess: true }, //#dynamic
                        responsable: 'Commercial',
                        status: 'pending',
                        //Verification type
                        type: 'auto',
                        verificationType: 'data-fill',
                        verificationValue: ''
                    },
                    {
                        id: 'prenom',
                        title: 'Prénom',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Clients',
                        documentId: '',
                        properties: ['prenom'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: ''
                    },
                    {
                        id: 'address',
                        title: 'Adresse postale',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Clients',
                        documentId: '', // depending on the concerned project
                        properties: ['address', 'description'],
                        screenName: 'Profile',
                        screenParams: { userId: '', isClient: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: ''
                    },
                    {
                        id: 'phone',
                        title: 'Numéro de téléphone',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: 'Clients',
                        documentId: '', // depending on the concerned project
                        properties: ['phone'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true, isProcess: true },
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
                        documentId: '', // depending on the concerned project
                        properties: ['isProspect'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: true, //check if fieldValue !== verificationValue
                    },
                    {
                        id: 'comment',
                        title: 'Commentaire',
                        instructions: "Veuillez renseigner des informations utiles (exp: Informations sur l'habitation)",
                        actionOrder: 6,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Commercial',
                        status: 'pending',
                        comment: '',
                        verificationType: 'comment',
                        nextPhase: '' //#dynamic
                    },
                ]
            },
        }
    },
    'rd1': {
        title: 'Rendez-vous 1',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        followers: ['Admin', 'Directeur commercial', 'Commercial'],
        steps: {
            'priorTechnicalVisit': {
                title: 'Visite technique préalable',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                actions: [
                    {
                        id: 'createPriorTechnicalVisit',
                        title: 'Créer une visite technique préalable',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique préalable' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable', natures: ['com'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'address',
                        title: 'Lieu du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique préalable' }
                        ],
                        documentId: '', //#dynamic
                        properties: ['address', 'description'],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable', natures: ['tech'] }, dynamicType: true, isProcess: true }, //#dynamic
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: '',
                    },
                    {
                        id: 'rd1Choice',
                        title: 'Modifier le statut du rendez-vous 1',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique préalable' }
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Reporter', id: 'postpone', onSelectType: 'navigation', },
                            { label: 'Confirmer', id: 'confirm', nextStep: 'rd2Creation', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ]
                    },
                ]
            },
            'rd2Creation': {
                title: 'Initiation rendez-vous 2',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                actions: [
                    {
                        id: 'rd2Creation',
                        title: 'Créer un rendez-vous 2',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rendez-vous N' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Rendez-vous N', value: 'Rendez-vous N', natures: ['com'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'housingActionFile'
                    }
                ]
            },
            'housingActionFile': { //##ask can be optional (skipable) depending on the client accepts it or rejects it
                title: 'Dossier action logement',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                actions: [
                    {
                        id: 'eebFileCreation',
                        title: 'Créer une fiche EEB',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Fiche EEB' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Fiche EEB' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Fiche EEB', value: 'Fiche EEB', selected: false }, dynamicType: true, isProcess: true, },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'eebFileChoice',
                        title: 'Le client est-il eligible au dossier action logement ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '',
                        queryFilters: [],
                        documentId: '',
                        //properties: [], 
                        screenName: '',
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'NON', id: 'cancel', nextStep: 'aidFile', onSelectType: 'transition', commentRequired: true, operation: null }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextPhase: 'technicalVisitManagement', onSelectType: 'transition', operation: null },
                        ]
                    },
                ]
            },
            'aidFile': {
                title: 'Dossier aide',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 4,
                actions: [
                    {
                        id: 'helpFolderCreation',
                        title: 'Créer un dossier aide',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Dossier aide' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Dossier aide' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Dossier aide', value: 'Dossier aide', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'quoteCreationChoice',
                        title: 'Voulez-vous continuer la procédure du projet ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '',
                        queryFilters: [], //not used by choices
                        documentId: '',
                        //properties: [], 
                        screenName: '', 
                        screenParams: null,
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Abandonner', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Créer un devis', id: 'confirm', nextStep: 'quoteCreation', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'quoteCreation': {
                title: "Création d'un devis",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 5,
                actions: [
                    {
                        id: 'quoteCreation',
                        title: 'Créer un devis',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'primeCEEChoice',
                        title: 'Ce projet est il éligible à la prime cee ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '',
                        queryFilters: [],  //not used by choices
                        documentId: '',
                        //properties: [], 
                        screenName: '',
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'NON', id: 'cancel', nextPhase: 'rdn', onSelectType: 'transition', commentRequired: true },
                            { label: 'OUI', id: 'confirm', nextStep: 'primeCEECreation', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'primeCEECreation': {
                title: "Création d'une prime CEE",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 6,
                actions: [
                    {
                        id: 'primeCEECreation',
                        title: 'Créer une prime CEE',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Dossier CEE' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Dossier CEE' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Dossier CEE', value: 'Dossier CEE', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextPhase: 'rdn',
                    }
                ]
            },
        }
    },
    'rdn': {
        title: 'Rendez-vous N',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        followers: ['Admin', 'Directeur commercial', 'Commercial'],
        steps: {
            'rd2Creation': {
                title: 'Créer un rendez-vous 2',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                actions: [
                    {
                        id: 'rd2Creation', //1. verify if RD2 exists
                        title: 'Créer un rendez-vous 2',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rendez-vous N' },
                            { filter: 'status', operation: '!=', value: 'Annulé' } //Check if there is an active RDN
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Rendez-vous N', value: 'Rendez-vous N', natures: ['com'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'rdnChoice',
                    }
                ]
            },
            'rdnChoice': {
                title: "Modifier l'état du rendez-vous",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                actions: [
                    {
                        id: 'rdnChoice',
                        title: 'Modifier le statut du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rendez-vous N' },
                            { filter: 'status', operation: '!=', value: 'Annulé' } //Get id of active RDN (all old RDN are inactive)
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Reporter', id: 'postpone', nextStep: 'rdnCreation', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Confirmer', id: 'confirm', nextStep: 'signature', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ]
                    }
                ]
            },
            'rdnCreation': { //rdn postpone
                title: "Création d'un rendez-vous 2 (Report)",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                actions: [
                    {
                        id: 'rd2Creation', //1. verify if RD2 exists
                        title: 'Créer un rendez-vous 2 (Report)',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rendez-vous N' },
                            { filter: 'status', operation: '!=', value: 'Annulé' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Rendez-vous N', value: 'Rendez-vous N', natures: ['com'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'rdnChoice',
                    }
                ]
            },
            //
            'signature': {
                title: 'Signature du devis',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 4,
                actions: [
                    {
                        id: 'idCard1',
                        title: "Pièce d'identité 1",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Autre', value: 'Autre', selected: false }, isProcess: true },
                        type: 'manual',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Importer', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'idCard2',
                        title: "Pièce d'identité 2 (optionnel)",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Autre', value: 'Autre', selected: false }, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer', id: 'cancel', onSelectType: 'validation' },
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Importer', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'proofOfAddress',
                        title: "Justificatif de domicile",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Autre', value: 'Autre', selected: false }, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Importer', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'iban',
                        title: 'RIB',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 4,
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Autre', value: 'Autre', selected: false }, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Importer', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'paySlip',
                        title: "Bulletin de salaire",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 5,
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Autre', value: 'Autre', selected: false }, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Importer', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'accountStatement',
                        title: "Relevé de compte",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 6,
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Autre', value: 'Autre', selected: false }, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer', id: 'cancel', onSelectType: 'validation' },
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Importer', id: 'upload', onSelectType: 'navigation' },
                        ]
                    },
                    {
                        id: 'quoteCreation', //Verify if quote exists
                        title: 'Créer un devis',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 7,
                        collection: 'Documents',
                        //Verification
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'signedQuoteCreation', //#task: check if devis is still existing..
                        title: 'Signer le devis',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 8,
                        collection: 'Documents',
                        queryFilters: [ //VERIFICATION: verify if signed quote exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing quote (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le devis', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Commercial',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'comment',
                        title: 'Commentaire',
                        instructions: "Veuillez renseigner des informations utiles (exp: disponibilité du client, accessibilité....)",
                        actionOrder: 9,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Commercial',
                        status: 'pending',
                        comment: '',
                        verificationType: 'comment',
                        nextStep: 'technicalVisitCreation',
                    },
                ]
            },
            'technicalVisitCreation': {
                title: "Création d'une visite technique",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 5,
                actions: [
                    {
                        id: 'technicalVisitCreation', //1. verify if RD2 exists
                        title: 'Créer une visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'payModeValidation',
                    }
                ]
            },
            'payModeValidation': {
                title: "Validation modalité paiement",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 6,
                actions: [
                    {
                        id: 'payModeChoice',
                        title: 'Modalité de paiement',
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 1,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Commercial',
                        status: 'pending',
                        comment: '',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Paiement comptant', id: 'cashPayment', onSelectType: 'commentPicker' },
                            { label: 'Financement', id: 'financing', onSelectType: 'commentPicker' },
                        ]
                    },
                    {
                        id: 'quoteValidation',
                        title: "Validation du devis par l'ADV", //#task allow adv to view devis before validating (multi-choice: voir/valider)
                        instructions: "",
                        actionOrder: 2,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'ADV',
                        status: 'pending',
                        comment: '',
                        verificationType: 'validation',
                        nextPhase: 'technicalVisitManagement',
                    },
                ]
            }
        }
    },
    'technicalVisitManagement': {
        title: 'Visite technique',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 4,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'siteCreation': {
                title: 'Création chantier',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                actions: [
                    {
                        id: 'technicalVisitCreation', //1. verify if Visite Technique exists
                        title: 'Créer une visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'technicalVisitValidation',
                        title: "Valider la date de la visite technique",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'manual',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'transition', nextStep: 'technicalVisitChoice', },
                            { label: 'Modifier la date', id: 'edit', onSelectType: 'navigation' },
                        ],
                    },
                ]
            },
            'technicalVisitChoice': {
                title: 'Décision sur la visite technique',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 2,
                actions: [
                    {
                        id: 'technicalVisitChoice',
                        title: 'Confirmez-vous la réalisation de la visite technique ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Confirmer', id: 'confirm', nextStep: 'poseurAffectation', onSelectType: 'transition' },
                        ],
                    },
                ]
            },
            'poseurAffectation': {
                title: "Affectation à un poseur",
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 3,
                actions: [
                    {
                        id: 'poseurAffectation', //Validate "poseur" set previously
                        title: "Valider/Affecter un poseur à la visite technique",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'manual',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '',
                        choices: [
                            { label: 'Valider le poseur', id: 'confirm', nextStep: 'technicalVisitChoice2', onSelectType: 'transition' },
                            { label: 'Modifier le poseur', id: 'edit', onSelectType: 'navigation' }, //#ask: isn't the poseur already predefined with project as technical contact ?
                        ],
                    },
                ]
            },
            'technicalVisitChoice2': {
                title: 'Décision sur la visite technique',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 4,
                actions: [
                    {
                        id: 'technicalVisitChoice',
                        title: "Voulez-vous cloturer la visite technique",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Abandonner', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Oui', id: 'confirm', nextPhase: 'installation', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ]
                    }
                ]
            },
        },
    },
    'installation': {
        title: 'Installation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 5,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'installationCreation': {
                title: 'Plannification installation',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                actions: [
                    {
                        id: 'installationCreation', //1. verify if RD2 exists
                        title: 'Créer une tâche de type installation',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Installation' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Installation', value: 'Installation', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'poseurAffectation', //Validate "poseur" set previously
                        title: "Valider/Affecter un poseur à l'installation",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Installation' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', taskType: { label: 'Installation', value: 'Installation', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'manual',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '',
                        choices: [
                            { label: 'Valider le poseur', id: 'confirm', onSelectType: 'transition', nextStep: 'installationChoice' },
                            { label: "Modifier le poseur", id: 'edit', onSelectType: 'navigation' },
                        ],
                    },
                ]
            },
            'installationChoice': {
                title: "Mise à jour du statut de l'installation",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                actions: [
                    {
                        id: 'installationChoice1',
                        title: "Mettre à jour le statut de l'installation (1)",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Installation' },
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Bloquée', id: 'block', onSelectType: 'validation', commentRequired: true, operation: { type: 'update', field: 'status', value: 'En attente' } },
                            { label: 'Finalisée', id: 'confirm', nextStep: 'pvCreation', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ]
                    },
                    {
                        id: 'installationChoice2',
                        title: "Mettre à jour le statut de l'installation (2)",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Installation' },
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Abandonnée', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'En cours', id: 'confirm', onSelectType: 'actionRollBack', operation: { type: 'update', field: 'status', value: 'En cours' } },
                        ]
                    }
                ]
            },
            'pvCreation': {
                title: "Création d'un PV réception",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                actions: [
                    {
                        id: 'pvCreation', //1. verify if RD2 exists
                        title: 'Créer un PV réception',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'PV réception' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'PV réception' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'PV réception', value: 'PV réception', selected: false }, dynamicType: true, isProcess: true, },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'reserve',
                    }
                ]
            },
            'reserve': {
                title: "Réserve",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 4,
                actions: [
                    {
                        id: 'reserve',
                        title: 'Êtes-vous satisfait de notre travail ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: '', //Because manual
                        queryFilters: [],
                        documentId: '',
                        //properties: [], 
                        screenName: '',
                        screenParams: null, //Because manual
                        type: 'manual', //Check manually
                        responsable: 'Client',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //comments are joined (separated by ;)
                        choices: [
                            { label: 'NON', id: 'comment', nextStep: 'catchupCreation', onSelectType: 'transition', commentRequired: true, operation: null }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextStep: 'poseurValidation', onSelectType: 'transition', operation: null },
                        ]
                    },
                ]
            },
            'catchupCreation': {
                title: "Plannification tâche rattrapage",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 5,
                actions: [
                    {
                        id: 'catchupCreation', //1. verify if RD2 exists
                        title: 'Créer une tâche rattrapage',
                        // instructions: 'Créer une tâche rattrapage. Ensuite, changer le statut en "Terminé" après avoir finalisé la tâche.',
                        instructions: 'Créer une tâche rattrapage.',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rattrapage' },
                            { filter: 'status', operation: '==', value: 'En cours' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Rattrapage', value: 'Rattrapage', natures: ['tech'] }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'catchupChoice',
                        title: 'Finaliser la tâche rattrapage',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rattrapage' },
                            { filter: 'status', operation: '==', value: 'En cours' }
                        ],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', isProcess: true },
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Finaliser', id: 'finish', nextStep: 'reserve', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminer' } },
                        ]
                    },
                ]
            },
            'poseurValidation': {
                title: "Validation du poseur",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 6,
                actions: [
                    {
                        id: 'quoteValidation',
                        title: "Valider l'absence de réserve",
                        instructions: "",
                        actionOrder: 1,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Poseur',
                        status: 'pending',
                        comment: '',
                        verificationType: 'validation',
                    },
                    {
                        id: 'maintainanceContractChoice',
                        title: 'Voulez-vous initier le contrat de maintenance ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '', //Because manual
                        queryFilters: [],
                        documentId: '',
                        //properties: [], 
                        screenName: '',
                        screenParams: null,
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Décidez plus tard', id: 'cancel', nextStep: 'quoteVerification', onSelectType: 'transition', commentRequired: true, operation: null }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextStep: 'maintainanceContract', onSelectType: 'transition', operation: null },
                        ]
                    },
                ]
            },
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
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: '', //creation
                        screenParams: {},
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'quoteVerification', onSelectType: 'transition' },
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ]
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'quoteVerification', onSelectType: 'transition' },
                            { label: 'Importer le document', id: 'upload', onSelectType: 'navigation' },
                        ]
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'quoteVerification', onSelectType: 'transition', commentRequired: true },
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'skip', nextStep: 'quoteVerification', onSelectType: 'transition' },
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'quoteVerification', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'quoteVerification'
                    },
                    //#task: Add last action multi-choice (contrat "en cours" or "terminé")
                ]
            },
            'quoteVerification': {
                title: "Vérification automatique de l'existence d'un devis généré",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 8,
                //#task: hide it from steps to no show on UI (hidden = true)
                actions: [
                    //Devis verification #ask: It is possible that a project starts from Installation phase so quote does not exist -> cannot create bill from quote. Is it possible that somebody deletes the signed quote ? Or is it possible that If yes should we do quote existance verification to import/sign it again before moving to billing ?
                    {
                        id: 'quoteVerification',
                        title: "Vérification de l'existence d'un devis généré",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'generation' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //  responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        events: { onDocFound: { nextStep: '' }, onDocNotFound: { nextStep: 'facturationOption1' } }
                    },
                    { //Doc found
                        id: 'billingChoice',
                        title: "Voulez-vous créer la facture à partir du devis existant de ce projet ?",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '', //Because manual
                        queryFilters: [],
                        documentId: '',
                        //properties: [], 
                        screenName: '',
                        screenParams: null, //Because manual
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'NON', id: 'cancel', nextStep: 'facturationOption1', onSelectType: 'transition', commentRequired: true, operation: null }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextStep: 'facturationOption2', onSelectType: 'transition', operation: null },
                        ]
                    },
                ]
            },
            'facturationOption1': { //no conversion
                title: "Facturation",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 9,
                nextStep: '',
                actions: [
                    {
                        id: 'billCreation',
                        title: 'Créer une facture',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Facture', value: 'Facture', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'signedBillCreation', //#task: check if devis is still existing..
                        title: 'Signer la facture',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents',
                        queryFilters: [ //VERIFICATION: verify if signed bill exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing bill (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Facture', value: 'Facture', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer la facture', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'paymentStatus'
                    },
                ]
            },
            'facturationOption2': { //conversion
                title: "Facturation",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 9,
                nextStep: '',
                actions: [
                    {
                        id: 'billConversion',
                        title: 'Convertir le devis en facture',
                        instructions: 'Appuyez sur le bouton "Convertir en devis". Cette opération va créer une facture à partir du devis. Le devis original ne sera ainsi ni altéré ni supprimé.',
                        actionOrder: 1,
                        collection: 'Documents',
                        queryFilters: [ //VERIFICATION: verify if bill exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing quote (to generate bill from it) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Voir le devis', id: 'view', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'signBill', //#task: check if devis is still existing..
                        title: 'Signer la facture',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents',
                        queryFilters: [ //VERIFICATION: verify if signed bill exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing bill (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Facture', value: 'Facture', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer la facture', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'paymentStatus',
                    },
                ]
            },
            'paymentStatus': { //conversion
                title: "Finalisation de la facturation",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 10,
                nextStep: '',
                actions: [
                    {
                        id: 'paymentStatus',
                        title: 'Modifier le statut du paiement',
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 1,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'Poseur',
                        status: 'pending',
                        comment: '',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Attente paiement client', id: 'pending', onSelectType: 'commentPicker', selected: false, stay: true },
                            { label: 'Attente paiement financement', id: 'pending', onSelectType: 'commentPicker', selected: false, stay: true },
                            { label: 'Attente paiement aide', id: 'pending', onSelectType: 'commentPicker', selected: false, stay: true },
                            { label: 'Payé', id: 'confirm', onSelectType: 'commentPicker', selected: false, stay: false },
                        ]
                    },
                    {
                        id: 'advValidation',
                        title: "Validation de la facture par l'ADV", //#task allow adv to view devis before validating (multi-choice: voir/valider)
                        instructions: "",
                        actionOrder: 2,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'ADV',
                        status: 'pending',
                        comment: '',
                        verificationType: 'validation',
                    },
                    {
                        id: 'attestationCreation',
                        title: 'Créer une attestation fluide',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Documents',
                        //Verification:
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Attestation fluide' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Attestation fluide' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Attestation fluide', value: 'Attestation fluide', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'emailBill'
                    },
                ]
            },
            'emailBill': {
                title: "Envoi facture par mail",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 11,
                nextStep: '',
                actions: [
                    //task: verify if bill & attestation fluide are still existing
                    {
                        id: 'emailBill',
                        title: 'Envoi automatique de la facture finale + attestation fluide par mail en cours...',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Projects',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                        ],
                        documentId: '', //#dynamic
                        properties: ['finalBillSentViaEmail'],
                        status: 'pending',
                        verificationType: 'data-fill',
                        verificationValue: false,
                        cloudFunction: {
                            endpoint: 'sendEmail',
                            queryAttachmentsUrls: {
                                'Facture': [
                                    { filter: 'project.id', operation: '==', value: '' },
                                    { filter: 'type', operation: '==', value: 'Facture' },
                                    { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                                ],
                                'Attestation fluide': [
                                    { filter: 'project.id', operation: '==', value: '' },
                                    { filter: 'type', operation: '==', value: 'Attestation fluide' },
                                    { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                                ]
                            },
                            params: {
                                subject: "Facture finale et attestation fluide",
                                dest: 'sa.lyoussi@gmail.com', //#task: change it
                                projectId: '',
                                attachments: []
                            }
                        },
                        nextStep: 'clientReview'
                    },
                ]
            },
            'clientReview': {
                title: "Satisfaction client",
                instructions: "Le directeur technique devra valider la satisfaction du client vis-à-vis de l'installation",
                stepOrder: 12,
                nextStep: '',
                actions: [
                    {
                        id: 'clientReview',
                        title: 'Êtes-vous satisfait de notre service ?',
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 1,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        status: 'pending',
                        comment: '',
                        verificationType: 'multiple-choices',
                        isReview: true,
                        choices: [
                            { label: '1', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '2', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '3', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '4', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '5', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '6', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '7', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '8', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '9', onSelectType: 'commentPicker', selected: false, saty: false, nextPhase: 'maintainance' },
                            { label: '10', onSelectType: 'commentPicker', selected: false, stay: false, nextPhase: 'maintainance' },
                        ],
                    }
                ]
            }
        },
    },
    //Init maintainance from previous step: Installation/maintainanceContract 
    'maintainance': {
        title: 'Maintenance',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 6,
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
                        collection: '',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: '', //creation
                        screenParams: {},
                        type: 'manual', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ]
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto', //Check manually
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Importer le document', id: 'upload', onSelectType: 'navigation' },
                        ]
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
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
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    {
                        id: 'endProject',
                        title: "Finaliser le projet",
                        instructions: "",
                        actionOrder: 6,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: 'ADV',
                        status: 'pending',
                        comment: '',
                        verificationType: 'validation',
                        nextPhase: 'endProject',
                    },
                ]
            },
        }
    },
    'endProject': {
        title: 'Finalisation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 7,
        followers: ['Admin', 'Directeur commercial', 'Commercial', 'Responsable technique', 'Poseur'],
        steps: {
            'endProject': {
                title: "Projet finalisé",
                instructions: '',
                stepOrder: 1,
                actions: [
                    {
                        id: 'endProject',
                        title: 'Le process du projet est terminé.',
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 1,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        comment: '',
                        verificationType: 'no-verification',
                    },
                ]
            },
        }
    },
    'cancelProject': {
        title: 'Annulation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 7,
        followers: ['Admin', 'Directeur commercial', 'Commercial', 'Responsable technique', 'Poseur'],
        steps: {
            'cancelProject': {
                title: "Projet annulé",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                actions: [
                    {
                        id: 'cancelProject',  //#task: rollback (Resume project)
                        title: 'Le projet a été annulé', //#task put: "Voulez-vous reprendre le projet ?""
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 1,
                        collection: '',
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        comment: '',
                        verificationType: 'no-verification', //#task: put rollback
                    },
                ]
            },
        }
    },
    'version': 1
}