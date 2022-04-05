

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
    'rdn': {
        title: 'Présentation étude',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        followers: ['Admin', 'Directeur commercial', 'Commercial'],
        steps: {
            'signature': {
                title: 'Signature des documents',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                actions: [
                    {
                        id: 'mandatMPRCreation',
                        title: 'Créer un mandat MaPrimeRénov',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat MaPrimeRénov' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat MaPrimeRénov' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Mandat MaPrimeRénov', value: 'Mandat MaPrimeRénov', selected: false }, dynamicType: true },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        responsable: 'Commercial',
                        status: 'pending',
                    },
                    {
                        id: 'signedMandatMPRCreation', //#task: check if devis is still existing..
                        title: 'Signer le mandat MaPrimeRénov',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Documents',
                        queryFilters: [ //VERIFICATION: verify if signed quote exists
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat MaPrimeRénov' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachmentSource', operation: '==', value: 'signature' }
                        ],
                        queryFiltersUpdateNav: [ //NAVIGATION: Get id of the existing quote (to update signature) 
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Mandat MaPrimeRénov' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument',
                        screenParams: { DocumentId: '', onSignaturePop: 2, project: null, documentType: { label: 'Mandat MaPrimeRénov', value: 'Mandat MaPrimeRénov', selected: false }, dynamicType: true, isSignature: true }, //requires TaskId from { filter: 'project.id', operation: '==', value: '' },  { filter: 'type', operation: '==', value: 'Devis' },
                        type: 'auto',
                        choices: [
                            { label: 'Annuler', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true },
                            { label: 'Signer le mandat MaPrimeRénov', id: 'sign', onSelectType: 'navigation' },
                        ],
                        responsable: 'Client',
                        status: 'pending',
                        verificationType: 'doc-creation',
                        nextStep: 'payModeValidation'
                    },
                ]
            },
            'payModeValidation': {
                title: "Modalité de paiement",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                actions: [
                    {
                        id: 'payModeChoice',
                        title: 'Modalité de paiement',
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 1,
                        type: 'manual',
                        comment: '',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Paiement comptant', id: 'cashPayment', onSelectType: 'commentPicker' },
                            { label: 'Financement', id: 'financing', onSelectType: 'commentPicker' },
                        ],
                        responsable: 'Commercial',
                        status: 'pending',
                    },
                    {
                        id: 'financingWebsite',
                        title: 'Propositions de financement',
                        instructions: "Lorem ipsum dolor",
                        actionOrder: 2,
                        type: 'manual',
                        comment: '',
                        verificationType: 'multiple-choices',
                        choices: [
                            { label: 'Adhefi.com', id: 'cashPayment', image: "sofincoLogo", onSelectType: 'openLink', link: 'https://www.adhefi.com' },
                            { label: 'Moncofidispro.fr', id: 'financing', image: "cofidisLogo", onSelectType: 'openLink', link: 'https://www.moncofidispro.fr' },
                            { label: 'Continuer', id: 'confirm', nextStep: 'technicalVisitCreation', onSelectType: 'transition' },
                        ],
                        responsable: 'Commercial',
                        status: 'pending',
                    },
                    //Montant de l'acompte? (zone de saisie) //operation: add it to bill sub attributes
                ]
            },
            'technicalVisitCreation': {
                title: "Création d'une visite technique",
                instructions: 'Lorem ipsum dolor',
                stepOrder: 3,
                actions: [
                    {
                        id: 'technicalVisitCreation', //1. verify if RD2 exists
                        title: 'Créer une visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'status', operation: '!=', value: 'Annulé' },
                        ],
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        responsable: 'Commercial',
                        status: 'pending',
                        nextPhase: 'technicalVisitManagement',
                    }
                ]
            },
        }
    },
    'version': 0
}


