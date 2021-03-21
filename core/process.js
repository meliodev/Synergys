import firebase from '@react-native-firebase/app'
import _ from 'lodash'
import { Text } from 'react-native'

const db = firebase.firestore()
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
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
                        //responsable: '',
                        status: 'pending',
                        comment: '',
                        verificationType: 'comment'
                    },
                    //other actions...
                ]
            },
            'clientConversion': {
                title: 'Création identifiant client',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                nextStep: '',
                nextPhase: '', //#rules: First phase of the processModel has nextPhase set dynamiclly depending on which phase the project has started on
                actions: [
                    {
                        id: 'nom',
                        title: 'Convertir le prospect en client',
                        instructions: 'Appuyez sur le bouton "Convertir en client"',
                        actionOrder: 1,
                        collection: 'Clients', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: ['isProspect'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill',
                        dataFillType: { type: 'bool', value: false }
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
                nextStep: '',
                nexPhase: '',
                actions: [
                    {
                        id: 'createPriorTechnicalVisit',
                        title: 'Créer une visite technique préalable',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Visite technique préalable' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Visite technique préalable', project: null },
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
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Visite technique préalable' }],
                        documentId: '', // filled dynamiccly
                        properties: ['address', 'description'],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '' },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'data-fill',
                    },
                    {
                        id: 'rd1Choice',
                        title: 'Modifier le statut du rendez-vous 1',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Agenda',
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Visite technique préalable' }],
                        documentId: '',
                        //properties: [],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '' },
                        type: 'manual', //Check manually
                        responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Reporter', id: 'postpone', onSelectType: 'navigation', },
                            { label: 'Confirmer', id: 'confirm', nextStep: 'rd2Creation', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ]
                    },
                ]
            },
            'rd2Creation': {
                title: 'Création du rendez-vous 2',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: 'housingActionFile',
                nexPhase: '',
                actions: [
                    {
                        id: 'rd2Creation',
                        title: 'Créer un rendez-vous 2',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Rendez-vous N' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Rendez-vous N', project: null },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    }
                ]
            },
            'housingActionFile': { //##ask can be optional (skipable) depending on the client accepts it or rejects it
                title: 'Dossier action logement',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                nextStep: '', //will be set dynamiclly depending on the multiple choice decision (choice = NON)
                nextPhase: '', //will be set dynamiclly depending on the multiple choice decision (choice = OUI)
                actions: [
                    {
                        id: 'eebFileCreation',
                        title: 'Créer une fiche EEB',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Fiche EEB' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Fiche EEB', project: null },
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
                        collection: 'Documents', //Because manual
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Fiche EEB' }],
                        documentId: '',
                        //properties: [], 
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '' }, //Because manual
                        type: 'manual', //Check manually
                        responsable: '',
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
                nextStep: '',
                actions: [
                    {
                        id: 'helpFolderCreation',
                        title: 'Créer un dossier aide',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Dossier aide' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Dossier aide', project: null },
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
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true },
                            { label: 'Créer un devis', id: 'confirm', nextStep: 'quoteCreation', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'quoteCreation': {
                title: "Création d'un devis",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 5,
                nextStep: '',
                actions: [
                    {
                        id: 'quoteCreation',
                        title: 'Créer un devis',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Devis' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Devis', project: null },
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
                nextPhase: 'rdn',
                actions: [
                    {
                        id: 'primeCEECreation',
                        title: 'Créer une prime CEE',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }, { filter: 'type', operation: '==', value: 'Dossier CEE' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Dossier CEE', project: null },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
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
            'rd2Creation': { //creation action + multiple choice action
                title: 'Créer un rendez-vous 2',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                nextStep: 'rdnChoice',
                nextPhase: '',
                actions: [
                    {
                        id: 'rd2Creation', //1. verify if RD2 exists
                        title: 'Créer un rendez-vous 2',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rendez-vous N' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Rendez-vous N', project: null, enableRDN: true },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    }
                ]
            },
            'rdnChoice': {
                title: "Modifier l'état du rendez-vous",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: '',
                nextPhase: '',
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
                        screenParams: { TaskId: '' },
                        type: 'manual', //Check manually
                        responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
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
                nextStep: 'rdnChoice',
                //nextPhase: '',
                actions: [
                    {
                        id: 'rd2Creation', //1. verify if RD2 exists
                        title: 'Créer un rendez-vous 2 (Report)',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rendez-vous N' },
                            { filter: 'status', operation: '!=', value: 'Annulé' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Rendez-vous N', project: null, enableRDN: true },
                        type: 'auto',
                        responsable: { id: 'GS-US-xQ6s' },
                        status: 'pending',
                        verificationType: 'doc-creation',
                    }
                ]
            },
            'signature': {
                title: 'Signature du devis',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 4,
                nextStep: 'technicalVisitCreation',
                actions: [
                    {
                        id: 'idCard1',
                        title: "Pièce d'identité 1",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
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
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
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
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
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
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
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
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
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
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
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
                        id: 'signedQuoteCreation',
                        title: 'Signer le devis',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 7,
                        collection: 'Documents',
                        queryFilters: [ //verify if signed quote exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdate: [ //Get id of the existing quote (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Devis' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { TaskId: '' }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true },
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
                        actionOrder: 8,
                        collection: '', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        comment: '',
                        verificationType: 'comment'
                    },
                ]
            },
            'technicalVisitCreation': {
                title: "Créeation d'une visite technique",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 5,
                nextStep: 'payModeValidation',
                actions: [
                    {
                        id: 'technicalVisitCreation', //1. verify if RD2 exists
                        title: 'Créer une visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Visite technique', project: null },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    }
                ]
            },
            'payModeValidation': {
                title: "Validation modalité paiement",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 6,
                nextStep: '',
                nextPhase: 'technicalVisitManagement',
                actions: [
                    {
                        id: 'payModeChoice',
                        title: 'Modalité de paiement',
                        instructions: "Veuillez renseigner des informations utiles (exp: Informations sur l'habitation)",
                        actionOrder: 1,
                        collection: '', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        comment: '',
                        actionData: {},
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Paiement comptant', id: 'cashPayment', onSelectType: 'actionDataPicker' },
                            { label: 'Financement', id: 'financing', onSelectType: 'actionDataPicker' },
                        ]
                    },
                    {
                        id: 'quoteValidation',
                        title: "Validation du devis par l'ADV",
                        instructions: "",
                        actionOrder: 2,
                        collection: '', // In case of subcollection: Projects/SubCollection
                        documentId: '', // depending on the concerned project
                        properties: [],
                        screenName: '', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: null,
                        type: 'manual',
                        responsable: { id: 'GS-US-xQ6s' }, //ADV is the responsable
                        status: 'pending',
                        comment: '',
                        verificationType: 'validation',
                    },
                ]
            }
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
                nextStep: 'technicalVisitChoice',
                nextPhase: '',
                actions: [
                    {
                        id: 'technicalVisitValidation',
                        title: "Valider la date de la visite technique",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { TaskId: '' },
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Voire la visite technique', id: 'view', onSelectType: 'navigation' },
                        ]
                    },
                ]
            },
            'technicalVisitChoice': {
                title: 'Décision sur la visite technique',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 2,
                nextStep: 'poseurAffectation',
                nextPhase: '',
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
                        screenParams: { TaskId: '' },
                        type: 'manual', //Check manually
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Refuser', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Accepter', id: 'confirm', nextStep: 'poseurAffectation', onSelectType: 'transition' },
                        ]
                    },
                ]
            },
            'poseurAffectation': {
                title: "Affectation à poseur",
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 3,
                nextStep: 'technicalVisitChoice2',
                nextPhase: '',
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
                        screenParams: { TaskId: '' },
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '',
                        choices: [
                            { label: 'Valider le poseur', id: 'confirm', onSelectType: 'validation' },
                            { label: 'Voire la visite technique', id: 'view', onSelectType: 'navigation' },
                        ]
                    },
                ]
            },
            'technicalVisitChoice2': {
                title: 'Décision sur la visite technique',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 4,
                nextStep: '',
                nextPhase: '',
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
                        screenParams: { TaskId: '' },
                        type: 'manual', //Check manually
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Abandonner', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Oui', id: 'confirm', nextPhase: 'installation', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ]
                    }
                ]
            },
        },
    },
    'installation': {
        title: 'Gestion installation',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 5,
        steps: {
            'installationCreation': {
                title: 'Plannification installation',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                nextStep: 'installationChoice',
                nextPhase: '',
                actions: [
                    {
                        id: 'installationCreation', //1. verify if RD2 exists
                        title: 'Créer une tâche de type installation',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Installation' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Installation', project: null },
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
                        screenParams: { TaskId: '' },
                        type: 'manual',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '',
                        choices: [
                            { label: 'Valider le poseur', id: 'confirm', onSelectType: 'validation' },
                            { label: "Voire l'installation", id: 'view', onSelectType: 'navigation' },
                        ]
                    },
                ]
            },
            'installationChoice': {
                title: "Mise à jour du statut de l'installation",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                nextStep: '',
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
                        screenParams: { TaskId: '' },
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
                        screenParams: { TaskId: '' },
                        type: 'manual', //Check manually
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Abandonnée', id: 'cancel', nextPhase: 'endProcess', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'En cours', id: 'confirm', onSelectType: 'actionRollBack', operation: { type: 'update', field: 'status', value: 'En cours' } },
                        ]
                    }
                ]
            },
            'pvCreation': {
                title: "Création d'un PV réception",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                nextStep: 'reserve',
                actions: [
                    {
                        id: 'pvCreation', //1. verify if RD2 exists
                        title: 'Créer un PV réception',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'PV réception' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'PV réception', project: null },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    }
                ]
            },
            'reserve': {
                title: "Réserve",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 4,
                nextStep: '',
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
                nextStep: 'reserve',
                actions: [
                    {
                        id: 'catchupCreation', //1. verify if RD2 exists
                        title: 'Créer une tâche rattrapage',
                        // instructions: 'Créer une tâche rattrapage. Ensuite, changer le statut en "Terminé" après avoir finalisé la tâche.',
                        instructions: 'Créer une tâche rattrapage.',
                        actionOrder: 1,
                        collection: 'Agenda', // In case of subcollection: Projects/SubCollection
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Rattrapage' },
                            { filter: 'status', operation: '==', value: 'En cours' }
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'CreateTask', //creation
                        screenParams: { taskType: 'Rattrapage', project: null },
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
                        screenParams: { TaskId: '' },
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
                nextStep: '',
                actions: [
                    {
                        id: 'quoteValidation',
                        title: "Valider l'absence de réserve",
                        instructions: "",
                        actionOrder: 1,
                        collection: '', // In case of subcollection: Projects/SubCollection
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
                        id: 'maintenanceContractChoice',
                        title: 'Voulez-vous initier le contrat de maintenance ?',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: '', //Because manual
                        queryFilters: [],
                        documentId: '',
                        //properties: [], 
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '' }, //Because manual
                        type: 'manual', //Check manually
                        responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'NON', id: 'cancel', nextStep: 'facturation', onSelectType: 'transition', commentRequired: true, operation: null }, //User's manual choice will route to next step (confirmRd2, postponeRd2 or cancelRd2) (it will technically set "nextStep" property)
                            { label: 'OUI', id: 'confirm', nextPhase: 'maintainanceContract', onSelectType: 'transition', operation: null },
                        ]
                    },
                ]
            },
            'maintainanceContract': {
                title: "Contrat maintenance",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 7,
                nextStep: '',
                actions: [
                    {
                        id: 'commercialPropositionChoice',
                        title: "Accepter la proposition commerciale",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: '', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: '' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Autre', project: null },
                        type: 'manual', //Check manually
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer', id: 'cancel', nextStep: 'facturation', onSelectType: 'transition' },
                            { label: 'Accepter', id: 'confirm', onSelectType: 'validation' },
                        ]
                    },
                    {
                        id: 'mandatSepaCreation',
                        title: "Créer/Importer un mandat SEPA",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: 'Mandat SEPA' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', //creation
                        screenParams: { documentType: 'Mandat SEPA', project: null },
                        type: 'auto', //Check manually
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer', id: 'cancel', nextStep: 'facturation', onSelectType: 'transition' },
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
                        queryFiltersUpdate: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat SEPA' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { TaskId: '' }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Ignorer', id: 'cancel', nextStep: 'facturation', onSelectType: 'transition', commentRequired: true },
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
                        collection: 'Documents', // In case of subcollection: Projects/SubCollection
                        queryFilters: [{ filter: 'project.id', operation: '==', value: 'Contrat CGU-CGV' }],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument', 
                        screenParams: { documentType: 'Contrat CGU-CGV', project: null },
                        type: 'auto',
                        //responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        comment: '', //motif
                        choices: [
                            { label: 'Ignorer', id: 'cancel', nextStep: 'facturation', onSelectType: 'transition' },
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
                        queryFiltersUpdate: [ //Get id of the existing signed mandat (to update signature)
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Contrat CGU-CGV' },
                        ],
                        //properties: [],
                        //documentId: '',
                        screenName: 'UploadDocument',
                        screenParams: { TaskId: '' }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Ignorer', id: 'cancel', nextStep: 'facturation', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le contrat', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: '',
                        status: 'pending',
                        verificationType: 'doc-creation',
                    },
                    //Add last action multi-choice (contrat "en cours" or "terminé")
                ]
            },
            'facturation': {
                title: "Contrat maintenance",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 8,
                nextStep: '',
                actions: [
                    {
                        id: 'quoteValidation',
                        title: "Valider l'absence de réserve",
                        instructions: "",
                        actionOrder: 1,
                        collection: '', // In case of subcollection: Projects/SubCollection
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
                ]
            },
        }
    },
    'maintenance': {
        title: 'Fin du process',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 6,
        steps: {}
    },
    'endProcess': {
        title: 'Fin du process',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 7,
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

    while (loopHandler) {

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
        let allActionsValid = true

        if (actions.length > 0) {
            console.log(`3. Configuring actions...`)
            actions = await configureActions(actions, attributes, process)

            console.log(`4. Verifying actions...`)
            var verification_res = await verifyActions(actions, attributes, process)

            console.log('5. Verification result:', verification_res)
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
    }

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

        //Agenda, Documents
        if (action.verificationType === 'doc-creation') {
            if (action.collection === 'Agenda') {
                for (const item of action.queryFilters) {
                    if (item.filter === 'project.id') {
                        item.value = attributes.project.id
                        action.screenParams.project = attributes.project
                    }
                }
            }

            else if (action.collection === 'Documents') {
                for (const item of action.queryFilters) {
                    if (item.filter === 'project.id')
                        item.value = attributes.project.id
                }

                //Navigate to UploadDocument: Update mode
                if (action.queryFiltersUpdate) {
                    for (const item of action.queryFiltersUpdate) {
                        if (item.filter === 'project.id')
                            item.value = attributes.project.id
                    }

                    query = db.collection(action.collection)
                    action.queryFiltersUpdate.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })
                    await query.get().then((querysnapshot) => {
                        if (!querysnapshot.empty) {
                            action.screenParams.DocumentId = querysnapshot.docs[0].id
                        }
                    })
                }

                //Navigate to UploadDocument: Creation mode
                else {
                    action.screenParams.project = attributes.project
                }
            }
        }

        //Agenda, Clients
        else if (action.verificationType === 'data-fill') {

            //Verification params
            if (action.collection === 'Clients') { //CASE 1: doc id already exists once project is created..
                action.documentId = attributes.clientId
                action.screenParams.userId = attributes.clientId
            }

            else if (action.collection === 'Agenda') { //CASE2: doc id is created later on after project is created.. (so we have to retrieve doc id using a query) #task: force user to overwrite existing task to avoid same task duplicates
                for (const item of action.queryFilters) {
                    if (item.filter === 'project.id')
                        item.value = attributes.project.id
                }

                query = db.collection(action.collection)
                action.queryFilters.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })
                await query.get().then((querysnapshot) => {
                    if (!querysnapshot.empty) {
                        action.documentId = querysnapshot.docs[0].id
                        action.screenParams.TaskId = querysnapshot.docs[0].id
                    }
                })
            }
        }

        else if (action.verificationType === 'multiple-choices') {

            if (action.queryFilters)
                for (const item of action.queryFilters) {
                    if (item.filter === 'project.id') {
                        item.value = attributes.project.id
                    }
                    action.screenParams.project = attributes.project
                }

            if (action.collection) {
                query = db.collection(action.collection)
                action.queryFilters.forEach(({ filter, operation, value }) => { query = query.where(filter, operation, value) })
                await query.get().then((querysnapshot) => {
                    if (querysnapshot.empty) return

                    if (action.collection === 'Agenda') {
                        action.screenParams.TaskId = querysnapshot.docs[0].id
                    }

                    else if (action.collection === 'Documents') {
                        action.screenParams.DocumentId = querysnapshot.docs[0].id
                    }

                    action.documentId = querysnapshot.docs[0].id
                })

            }

        }
    }

    return actions
}

//Task 3. Verifications & Status Update
const verifyActions = async (actions, attributes, process) => {

    let allActionsValid = true
    let verifiedActions = []

    //1. Split actions to 4 groups based on "verificationType" property
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

    //VERIFICATION TYPE 4: multiple-choices
    let actions_comment = actions_groupedByVerificationType['comment'] || []
    let allActionsValid_comment = true

    if (actions_comment.length > 0) {
        var res3 = await verifyActions_comment(actions_comment)
        allActionsValid_comment = res3.allActionsValid_comment
        actions_comment = res3.verifiedActions_comment
    }

    //VERIFICATION TYPE 4: validation
    let actions_validation = actions_groupedByVerificationType['validation'] || []
    let allActionsValid_validation = true

    if (actions_validation.length > 0) {
        var res3 = await verifyActions_validation(actions_validation)
        allActionsValid_validation = res3.allActionsValid_validation
        actions_validation = res3.verifiedActions_validation
    }

    allActionsValid = allActionsValid_dataFill && allActionsValid_docCreation && allActionsValid_multipleChoices && allActionsValid_comment && allActionsValid_validation
    verifiedActions = verifiedActions.concat(actions_dataFill, actions_docCreation, actions_multipleChoices, actions_comment, actions_validation)

    return { allActionsValid, verifiedActions }
}

const verifyActions_dataFill = async (actions) => {

    //Issue: cannot access same document same collection multiple times in a very short delay
    //Solution: Sort by 'Document-Id' to access and verify one time all actions concerning same document (use verifyActions_dataFill_sameDoc).
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

    return { verifiedActionsSameDoc, allActionsSameDocValid }
}

const verifyActions_docCreation = async (actions) => {

    //Verify actions for each document
    let allActionsValid_docCreation = true

    for (let action of actions) {

        const collection = action.collection

        let query = db.collection(collection)
        action.queryFilters.forEach(({ filter, operation, value }) => {
            query = query.where(filter, operation, value) //exp: db.collection(collection).where('project.id', '==', projectId).where('type', '==', x)
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

const verifyActions_validation = async (actions) => {
    let allActionsValid_validation = true

    for (let action of actions) {
        if (action.status === 'pending')
            allActionsValid_validation = false
    }

    const verifiedActions_validation = actions
    return { allActionsValid_validation, verifiedActions_validation }
}

//Task 4. Phase/Step transition
const handleTransition = (process, currentPhaseId, currentStepId) => {

    const nextStepId = getNextStepId(process, currentPhaseId, currentStepId)
    let processEnded = false
    console.log('A.1. Next step id:', nextStepId)

    //Next step transition
    if (nextStepId)
        process = projectNextStepInit(process, currentPhaseId, currentStepId, nextStepId)

    else {
        const nextPhaseId = getNextPhaseId(process, currentPhaseId, currentStepId)
        console.log('B.1. Next phase id:', nextPhaseId)

        //Next phase transition
        if (nextPhaseId)
            process = projectNextPhaseInit(process, nextPhaseId)

        //End process
        else {
            handleEndProcess(process)
            processEnded = true
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
    console.log('A.2 Fetching next step model...')
    const nextStepModel = processModel[currentPhaseId].steps[nextStepId]

    //2. Concat next step to process
    process[currentPhaseId].steps[nextStepId] = nextStepModel
    console.log("A.3 Project process next step initialized:", process[currentPhaseId].steps[nextStepId])

    return process
}

//Task 4".
export const getNextPhaseId = (process, currentPhaseId, currentStepId) => {
    const nextPhaseId = process[currentPhaseId].steps[currentStepId].nextPhase || null //#rules: Only last step has "nextPhase" property
    return nextPhaseId
}

export const projectNextPhaseInit = (process, nextPhaseId) => {

    //1. Get next Phase from process model
    console.log('B.2 Fetching next phase model...')
    const copyProcessModel = _.cloneDeep(processModel)
    const nextPhaseModel = copyProcessModel[nextPhaseId]

    //2. Keep only first step (stepOrder = 1)
    const firstStep = getPhaseFirstStep(nextPhaseModel.steps)
    nextPhaseModel.steps = firstStep
    console.log('B.3 NextPhaseModel first step only:', nextPhaseModel.steps)

    //3. Concat next phase to process
    process[nextPhaseId] = nextPhaseModel
    console.log("B.4 Project process next phase initialized:", process[nextPhaseId])

    return process
}

const getPhaseFirstStep = (steps) => {
    const firstStepArray = Object.entries(steps).filter(([key, value]) => value['stepOrder'] === 1)
    const firstStep = Object.fromEntries(firstStepArray)
    return firstStep
}

//Task 5. End process
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