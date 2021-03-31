import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { Text } from 'react-native'
import { stringifyUndefined } from './utils'

const db = firebase.firestore()
const functions = firebase.functions()
//#task add listener on project process property to handle multiple users updating process

//#PROCESS MODEL
const processModel = {
    'init': {
        title: 'Initialisation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 1,
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
                        responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        screenParams: { project: null, taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable' }, dynamicType: true, isProcess: true }, //#dynamic
                        type: 'auto',
                        //responsable: '',
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
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable' }, dynamicType: true, isProcess: true },
                        type: 'manual', //Check manually
                        responsable: '',
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
                        screenParams: { project: null, taskType: { label: 'Rendez-vous N', value: 'Rendez-vous N' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Fiche EEB' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Fiche EEB', value: 'Fiche EEB', selected: false }, dynamicType: true, isProcess: true, },
                        type: 'auto',
                        //responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Dossier aide' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Dossier aide', value: 'Dossier aide', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Dossier CEE' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Dossier CEE', value: 'Dossier CEE', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        screenParams: { project: null, taskType: { label: 'Rendez-vous N', value: 'Rendez-vous N' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        responsable: '',
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
                        screenParams: { project: null, taskType: { label: 'Rendez-vous N', value: 'Rendez-vous N' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                       // responsable: { id: 'GS-US-xQ6s', role: 'dircom' }, //#task: set id of DC (use it to render avatarText icon to reprensent role)
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing quote (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le devis', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                        //responsable: '',
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
                        screenParams: { project: null, taskType: { label: 'Visite technique', value: 'Visite technique' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        //responsable: '',
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
                     //   responsable: { id: 'GS-US-xQ6s' }, //ADV is the responsable
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
                        screenParams: { project: null, taskType: { label: 'Visite technique', value: 'Visite technique' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique', value: 'Visite technique' }, dynamicType: true, isProcess: true },
                        type: 'manual',
                        //responsable: '',
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
                        title: 'Acceptez-vous la réalisation de la visite technique ?',
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
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Refuser', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Accepter', id: 'confirm', nextStep: 'poseurAffectation', onSelectType: 'transition' },
                        ],
                    },
                ]
            },
            'poseurAffectation': {
                title: "Affectation à poseur",
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
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique', value: 'Visite technique' }, dynamicType: true, isProcess: true },
                        type: 'manual',
                        //responsable: '',
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
                        //responsable: '',
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
                        screenParams: { project: null, taskType: { label: 'Installation', value: 'Installation' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        screenParams: { TaskId: '', taskType: { label: 'Installation', value: 'Installation' }, dynamicType: true, isProcess: true },
                        type: 'manual',
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'PV réception' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'PV réception', value: 'PV réception', selected: false }, dynamicType: true, isProcess: true, },
                        type: 'auto',
                        //responsable: '',
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
                        //responsable: { id: ''}, //#task: set dynamiclly client id   + add role to know which role representative icon to show
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
                        screenParams: { project: null, taskType: { label: 'Rattrapage', value: 'Rattrapage' }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        responsable: '',
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
                        //responsable:'',
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
                        responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto', //Check manually
                        //responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Ignorer', id: 'cancel', nextStep: 'quoteVerification', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le mandat SEPA', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Ignorer (Passer à la facturation)', id: 'cancel', nextStep: 'quoteVerification', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'generation' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Devis', value: 'Devis', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Facture', value: 'Facture', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing bill (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Facture', value: 'Facture', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer la facture', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing quote (to generate bill from it) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
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
                        responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing bill (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Facture' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Facture', value: 'Facture', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer la facture', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                        //responsable: '',
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
                       // responsable: { id: 'GS-US-xQ6s' }, //ADV is the responsable
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Attestation fluide' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Attestation fluide', value: 'Attestation fluide', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto', //Check manually
                        //responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Mandat SEPA', value: 'Mandat SEPA', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Signer le mandat SEPA', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { project: null, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true },
                        type: 'auto',
                        //responsable: '',
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
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, documentType: { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', selected: false }, dynamicType: true, isProcess: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
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
                        //responsable: { id: 'GS-US-xQ6s' }, //ADV is the responsable
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
    }
}

//#PROCESS ALGORITHM/LOGIC
export const projectProcessHandler = async (currentProcess, projectSecondPhase, clientId, project) => {

    const attributes = { clientId, project }
    let process = _.cloneDeep(currentProcess)

    let loopHandler = true

    while (loopHandler) {

        //0. Initialize process with 1st phase/1st step
        if (_.isEmpty(process)) {
            console.log('0. Initialisation')
            process = initProcess(process, projectSecondPhase)
        }

        var { currentPhaseId, currentStepId } = getCurrentStep(process)
        let { actions } = process[currentPhaseId].steps[currentStepId] //Actions of current step
        let allActionsValid = true
        let nextStep = ''
        let nextPhase = ''

        if (actions.length > 0) {
            console.log('1. Configure actions...')

            actions = await configureActions(actions, attributes, process) //fill empty params (projectId, clienId, TaskId...)

            //Handle cloud function
            if (actions[0].cloudFunction) {
                console.log('Handling cloud function...')
                const sendEmail = functions.httpsCallable('sendEmail')
                const { subject, dest, projectId, attachments } = actions[0].cloudFunction.params
                const html = `<b>${subject} du projet ${attributes.project.name}</b>`

                const isSent = await sendEmail({ receivers: dest, subject, html, attachments })

                if (isSent.data)
                    await db.collection(actions[0].collection).doc(projectId).update({ finalBillSentViaEmail: true }).then(() => console.log('FINAL BILL SENT !!!!'))

                else console.log('Email was not sent......................')
                //else return error and handle it on UI (MAKE SURE NOT UPDATE PROCESS BY ERROR)
            }

            console.log('2. verify actions...')
            var verif_res = await verifyActions(actions, attributes, process)

            actions = verif_res.verifiedActions
            allActionsValid = verif_res.allActionsValid
            nextStep = verif_res.nextStep
            nextPhase = verif_res.nextPhase

            console.log('3. verification result:')
            console.log('allActionsValid:', allActionsValid)
            console.log('nextStep:', nextStep)
            console.log('nextPhase:', nextPhase)

            console.log('4. verified actions:')
            actions.forEach((action) => {
                console.log(action.id, action.actionOrder, action.status)
            })

            process[currentPhaseId].steps[currentStepId].actions = actions
        }

        //3'. Found nextStep/nextPhase -> All actions valid -> Transition
        if (nextStep || nextPhase) { //Next step/phase found means we are on last action of current step -> we do transition.
            console.log('transition...')
            const transitionRes = handleTransition(process, currentPhaseId, currentStepId, nextStep, nextPhase, attributes.project.id)
            process = transitionRes.process
            const { processEnded } = transitionRes
            if (processEnded) loopHandler = false
            else console.log('LOOP...')
        }

        //3". No nextStep/nextPhase found -> At least one action is not valid -> No transition & Break loop
        else {
            loopHandler = false
        }
    }

    return process
}

//#PROCESS TASKS:
//Task 1. Init
const initProcess = (process, projectSecondPhase) => {

    //Init project with first phase/first step
    let firstPhaseId = getFirstPhaseIdFromModel()
    console.log('0.1 Première phase du modèle:', firstPhaseId)
    process = projectNextPhaseInit(process, firstPhaseId)

    //Set "nextPhase" dynamiclly for last action of last step
    Object.keys(process[firstPhaseId].steps).forEach((stepId) => {
        let actions = process[firstPhaseId].steps[stepId].actions
        actions[actions.length - 1].nextPhase = projectSecondPhase
        process[firstPhaseId].steps[stepId].actions = actions
    })

    return process
}

const getFirstPhaseIdFromModel = () => {
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

        //1. Complete missing params
        console.log('configuring action:', action.id, action.verificationType, action.status, action.actionOrder)
        console.log('1.1 configuring missing project filter value:')

        if (action.screenParams) {
            for (let item in action.screenParams) {
                if (item === 'project') action.screenParams.project = attributes.project //#task : make it dynamic (screenparams field name should be same as attributes field name)
            }
            console.log('1.1.3...................................... action.screenParams configured', action.screenParams)
        }

        if (action.cloudFunction) {
            const { params, queryAttachmentsUrls } = action.cloudFunction

            if (action.collection === 'Projects')
                action.documentId = attributes.project.id

            for (let item in params) {
                if (item === 'projectId') {
                    params.projectId = attributes.project.id
                }
            }

            for (let attachmentKey in queryAttachmentsUrls) {

                for (let item of queryAttachmentsUrls[attachmentKey]) {
                    if (item.filter === 'project.id')
                        item.value = attributes.project.id
                }

                query = db.collection('Documents')
                queryAttachmentsUrls[attachmentKey].forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })

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

            console.log('1.1.1 action.cloudFunction configured:', action.cloudFunction)
        }

        if (action.queryFilters) {
            for (let item of action.queryFilters) {
                if (item.filter === 'project.id') {
                    item.value = attributes.project.id
                }
            }
            console.log('1.1.2 action.queryFilters configured', action.queryFilters)
        }


        //Agenda, Documents
        console.log('1.2 configuring missing documentId')

        if (action.verificationType === 'doc-creation') {

            if (action.queryFiltersUpdateNav) {
                for (let item of action.queryFiltersUpdateNav) {
                    if (item.filter === 'project.id')
                        item.value = attributes.project.id
                }

                query = db.collection(action.collection)
                action.queryFiltersUpdateNav.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })

                await query.get().then((querysnapshot) => {

                    if (!querysnapshot.empty) {
                        if (action.collection === 'Agenda')
                            action.screenParams.TaskId = querysnapshot.docs[0].id

                        if (action.collection === 'Documents')
                            action.screenParams.DocumentId = querysnapshot.docs[0].id
                    }
                })
            }

        }

        //Agenda, Clients
        else if (action.verificationType === 'data-fill') {

            if (action.collection === 'Clients') { //CASE 1: doc id already exists once project is created..
                action.documentId = attributes.clientId
                action.screenParams.userId = attributes.clientId
            }

            else { //CASE2: doc id is created later on after project is created.. (so we have to retrieve doc id using a query) #task: force user to overwrite existing task to avoid same task duplicates
                query = db.collection(action.collection)
                action.queryFilters.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })
                await query.get().then((querysnapshot) => {

                    if (querysnapshot.empty) return

                    if (action.collection === 'Agenda')
                        action.screenParams.TaskId = querysnapshot.docs[0].id

                    else if (action.collection === 'Documents')
                        action.screenParams.DocumentId = querysnapshot.docs[0].id

                    action.documentId = querysnapshot.docs[0].id
                })

                console.log('1.2.1 action.screenParams configured', action.screenParams)
            }
        }

        else if (action.verificationType === 'multiple-choices') {

            if (action.collection) {
                query = db.collection(action.collection)
                action.queryFilters.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })
                await query.get().then((querysnapshot) => {
                    if (querysnapshot.empty) return

                    if (action.collection === 'Agenda')
                        action.screenParams.TaskId = querysnapshot.docs[0].id

                    else if (action.collection === 'Documents')
                        action.screenParams.DocumentId = querysnapshot.docs[0].id

                    action.documentId = querysnapshot.docs[0].id
                })

                console.log('1.2.1 action.screenParams configured', action.screenParams)
            }
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
    let actions_manual = actions_multipleChoices.concat(actions_comment, actions_validation)
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

const verifyActions_docCreation = async (actions) => {
    //Verify actions for each document
    let allActionsValid_docCreation = true
    let nextStep = ''
    let nextPhase = ''

    for (let action of actions) {

        const collection = action.collection

        let query = db.collection(collection)
        action.queryFilters.forEach(({ filter, operation, value }) => {
            query = query.where(filter, operation, value) //exp: db.collection(collection).where('project.id', '==', projectId).where('type', '==', x)
        })

        await query.get().then((querysnapshot) => {

            if (querysnapshot.empty) {
                if (action.events && action.events.onDocNotFound) {  //CASE1: Conditional transition (2 options) depending on doc found or not
                    nextStep = action.events.onDocNotFound.nextStep
                    nextPhase = action.events.onDocNotFound.nextPhase
                }

                action.status = 'pending' //CASE2: No transition if doc not found
                allActionsValid_docCreation = false
            }

            else {
                if (action.events && action.events.onDocFound) { //CASE1: Conditional transition (2 options) depending on doc found or not
                    nextStep = action.events.onDocFound.nextStep
                    nextPhase = action.events.onDocFound.nextPhase
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
export const handleTransition = (process, currentPhaseId, currentStepId, nextStepId, nextPhaseId, ProjectId) => {

    let processEnded = false

    //Next step transition
    if (nextStepId) {
        console.log('Transition to next step:', nextStepId)
        process = projectNextStepInit(process, currentPhaseId, currentStepId, nextStepId)
    }

    //Next phase transition
    else if (nextPhaseId) {
        console.log('Transition to next phase:', nextPhaseId)

        //Update project (status/step)
        if (nextPhaseId === 'cancelProject') {
            cancelProject(ProjectId)
            processEnded = true
        }

        else if (nextPhaseId === 'endProject') {
            endProject(ProjectId)
            processEnded = true
        }

        else {
            updateProjectPhase(nextPhaseId, ProjectId)
        }

        //Phase transition
        if (nextPhaseId === 'maintainance' && process['installation'].steps['maintainanceContract']) {
            process = resumeMaintainance(process)
        }

        else {
            process = projectNextPhaseInit(process, nextPhaseId)
        }
    }

    return { process, processEnded }
}

//Task 4'.
export const getNextStepId = (process, currentPhaseId, currentStepId) => {
    const nextStepId = process[currentPhaseId].steps[currentStepId].nextStep || null
    return nextStepId
}

export const projectNextStepInit = (process, currentPhaseId, currentStepId, nextStepId) => {

    //0. Handle rollback (report rdn loop)
    if (nextStepId) {
        const currentStepOrder = processModel[currentPhaseId].steps[currentStepId].stepOrder
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

export const projectNextPhaseInit = (process, nextPhaseId) => {
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

const resumeMaintainance = (process) => {
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
const updateProjectPhase = (nextPhaseId, ProjectId) => {
    const phaseTitle = processModel[nextPhaseId].title
    db.collection('Projects').doc(ProjectId).update({ step: phaseTitle })
}

const endProject = (ProjectId) => {
    db.collection('Projects').doc(ProjectId).update({ status: 'Terminé' })
}

const cancelProject = (ProjectId) => {
    db.collection('Projects').doc(ProjectId).update({ status: 'Annulé' })
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
        if (!currentAction && (action.status === 'pending' || action.status === 'done' && action.isAnimation))
            //if (!currentAction && action.status === 'pending')
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




/*
Documentation:
Verification types:
A. Automatic
1. doc-creation:
1.1. Verify existence of a document by Id

1.2 Verify existence of a document by query
Params: collection, queryFilters
collection: The collection name of the document we want to verify
queryFilters: the query fields to fiter on using "WHERE" (example: query.where('project.id', '==', 'abcd'))

2. data-fill
2.1 Verify if a field of a document is empty (get document by Id or by query)
Params: collection, documentId, properties
collection: The collection name of the document we want to verify
documentId: The Id of the document we want to verify
properties: The nested key of the field we want to check if empty (example: client.id)


B. Manual
1. Comment
1.1 Verify if comment has been added
Params: comment



*/










// const getFirstStepIdFromModel = () => {
//     const firstPhaseId = getFirstPhaseIdFromModel()
//     let firstStepId
//     Object.keys(processModel[firstPhaseId].steps).forEach(stepId => {
//         if (processModel[firstPhaseId].steps[stepId].stepOrder === 1) firstStepId = stepId
//     })
//     return { firstPhaseId, firstStepId }
// }



// const verifyActions_docUpdate = async (actions) => {
//     //Verify actions for each document
//     let allActionsValid_docCreation = true

//     for (let action of actions) {
//         const collection = action.collection //Agenda
//         const documentId = action.documentId

//         await db.collection(collection).doc(documentId).get().then((doc) => {
//             const data = doc.data()

//             const nestedVal = action.properties.reduce((a, prop) => a[prop], data)
//             if (nestedVal) action.status = 'done' //Exp: nestedVal = startDate
//         })
//     }

//     const verifiedActions_docCreation = actions
//     return { allActionsValid_docCreation, verifiedActions_docCreation }
// }



//#idea put icon/tag on action defining role responsable for action
//assign to each role a representative icon/color to help users recognize each role






// if (querysnapshot.empty) {
//     console.log('0000000000000')
//     if (action.events && action.events.onDocNotFound && action.events.onDocNotFound.screenParams) {
//         console.log('0000000000000-...............')
//           action.screenParams.project = attributes.project
//           console.log('screen params', action.screenParams)
//     }
// }

// else {
//     console.log('11111111111111111111')

//     if (action.events && action.events.onDocFound && action.events.onDocFound.screenParams) {
//         console.log('11111111111111111111-......................')
//         action.screenParams.DocumentId = querysnapshot.docs[0].id
//     }

//     else action.screenParams.DocumentId = querysnapshot.docs[0].id
// }










// validateAction = async (comment, choices, stay, nextStep, nextPhase) => {
//     const { process, currentPhaseId, currentStepId, currentAction } = this.state
//     const { project } = this.props

//     //Update action fields
//     let processTemp = _.cloneDeep(process)
//     // let actionTemp

//     processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
//         // actionTemp = action

//         if (action.id === currentAction.id) {
//             //Update comment
//             if (comment)
//                 action.comment = comment

//             //Update selected choice (selected = true -> UI displays it green colored)
//             if (choices)
//                 action.choices = choices

//             //Update action status
//             if (!stay) {
//                 action.status = "done"
//                 action.isAnimation = false
//                 //  actionTemp.isAnimation = true
//             }
//         }
//     })

//     processTemp[currentPhaseId].steps[currentStepId].actions.forEach((action) => {
//         console.log(action.id, action.actionOrder, action.status, action.isAnimation)
//     })


//     this.setState({
//         loadingModal: false, showModal: false,
//         //currentAction: actionTemp
//     })  //isAnimation = true

//     // console.log('Do animation now !')

//     // await this.countDown(1000)

//     if (nextStep || nextPhase) {
//         const transitionRes = handleTransition(processTemp, currentPhaseId, currentStepId, nextStep, nextPhase, this.props.project.id)
//         processTemp = transitionRes.process
//     }

//     this.updatePhaseStepAction(processTemp)

//     await db.collection('Projects').doc(project.id).update({ process: processTemp })
// }


//TESTS
// 'signQuote': {
//     title: 'Signature',
//     instructions: 'Lorem ipsum dolor',
//     phaseOrder: 1,
//     steps: { //One step
//         'signQuote': {
//             title: 'Signer le devis',
//             instructions: 'Lorem ipsum dolor',
//             stepOrder: 1,
//             actions: [
//                 {
//                     id: 'quoteCreation',
//                     title: 'Créer un devis',
//                     instructions: 'Lorem ipsum dolor',
//                     actionOrder: 1,
//                     collection: 'Documents',
//                     //Verification
//                     queryFilters: [
//                         { filter: 'project.id', operation: '==', value: '' },
//                         { filter: 'type', operation: '==', value: 'Devis' },
//                     //    { filter: 'attachment.downloadURL', operation: '!=', value: '' }
//                     ],
//                     //Navigation
//                     queryFiltersUpdateNav: [
//                         { filter: 'project.id', operation: '==', value: '' },
//                         { filter: 'type', operation: '==', value: 'Devis' },
//                     ],
//                     properties: [],
//                     documentId: '',
//                     screenName: 'UploadDocument', //creation
//                     screenParams: { documentType: 'Devis', project: null },
//                     type: 'auto',
//                     responsable: '',
//                     status: 'pending',
//                     verificationType: 'doc-creation',
//                 },
//                 {
//                     id: 'signedQuoteCreation', //#task: check if devis is still existing..
//                     title: 'Signer le devis',
//                     instructions: 'Lorem ipsum dolor',
//                     actionOrder: 2,
//                     collection: 'Documents',
//                     queryFilters: [ //VERIFICATION: verify if signed quote exists
//                         { filter: 'project.id', operation: '==', value: '' },
//                         { filter: 'type', operation: '==', value: 'Devis' },
//                         { filter: 'attachmentSource', operation: '==', value: 'signature' }
//                     ],
//                     queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing quote (to update signature) 
//                         { filter: 'project.id', operation: '==', value: '' },
//                         { filter: 'type', operation: '==', value: 'Devis' },
//                     ],
//                     //properties: [],
//                     //documentId: '',
//                     screenName: 'UploadDocument',
//                     screenParams: { DocumentId: '', onSignaturePop: 2 }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
//                     type: 'auto',
//                     choices: [
//                         { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
//                         { label: 'Signer le devis', id: 'sign', onSelectType: 'navigation' },
//                     ],
//                     responsable: '',
//                     status: 'pending',
//                     verificationType: 'doc-creation',
//                 },
//                 {
//                     id: 'quoteValidation',
//                     title: "Finaliser le test", //#task allow adv to view devis before validating (multi-choice: voir/valider)
//                     instructions: "",
//                     actionOrder: 3,
//                     collection: '',
//                     documentId: '', // depending on the concerned project
//                     properties: [],
//                     screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
//                     screenParams: null,
//                     type: 'manual',
//                     responsable: { id: 'GS-US-xQ6s' }, //ADV is the responsable
//                     status: 'pending',
//                     comment: '',
//                     verificationType: 'validation',
//                     nextPhase: 'technicalVisitManagement',
//                 },
//             ]
//         }
//     }
// }