

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
    'technicalVisitManagement': {
        title: 'Visite technique',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'siteCreation': {
                title: 'Planification visite technique',
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
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'status', operation: '!=', value: 'Annulé' },
                        ],
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true },
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
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'status', operation: '!=', value: 'Annulé' },
                        ],
                        screenName: 'CreateTask', //creation
                        screenParams: { project: null, TaskId: '', taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true },
                        type: 'manual',
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Valider', id: 'confirm', onSelectType: 'validation', operation: { collection: "Clients", docId: "", type: 'update', field: 'status', value: "active" } },
                            { label: 'Modifier la date', id: 'edit', onSelectType: 'navigation' },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'poseurAffectation', //Validate "poseur" set previously
                        title: "Affecter un technicien à la visite technique",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 3,
                        collection: 'Agenda',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'status', operation: '!=', value: 'Annulé' },
                        ],
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '', taskType: { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, dynamicType: true },
                        type: 'manual',
                        verificationType: 'multiple-choices',
                        comment: '',
                        choices: [
                            { label: 'Valider le technicien', id: 'confirm', nextStep: 'technicalVisitFile', onSelectType: 'transition' },
                            { label: 'Modifier le technicien', id: 'edit', onSelectType: 'navigation' }, //#ask: isn't the poseur already predefined with project as technical contact ?
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                ]
            },
            'technicalVisitFile': {
                title: 'Remplissage visite technique',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2,
                actions: [
                    //#task: add Visite technique (montant de l'accompte available) (dynamic: false, public: true)
                    {
                        id: 'technicalVisitFileCreation',
                        title: 'Remplir la visite technique',
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 1,
                        collection: 'Documents',
                        //Verification
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'attachment.downloadURL', operation: '!=', value: '' }
                        ],
                        //Navigation
                        queryFiltersUpdateNav: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                        ],
                        screenName: 'UploadDocument', //creation
                        screenParams: { project: null, documentType: { label: 'Visite technique', value: 'Visite technique', selected: false }, dynamicType: true },
                        type: 'auto',
                        verificationType: 'doc-creation',
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                    {
                        id: 'technicalVisitChoice',
                        title: "Voulez-vous cloturer la visite technique",
                        instructions: 'Lorem ipsum dolor',
                        actionOrder: 2,
                        collection: 'Agenda',
                        documentId: '',
                        queryFilters: [
                            { filter: 'project.id', operation: '==', value: '' },
                            { filter: 'type', operation: '==', value: 'Visite technique' },
                            { filter: 'deleted', operation: '==', value: false },
                            { filter: 'status', operation: '!=', value: 'Annulé' },
                        ],
                        type: 'manual', //Check manually
                        verificationType: 'multiple-choices',
                        comment: '', //motif
                        choices: [
                            { label: 'Abandonner', id: 'cancel', nextPhase: 'cancelProject', onSelectType: 'transition', commentRequired: true, operation: { type: 'update', field: 'status', value: 'Annulé' } },
                            { label: 'Oui', id: 'confirm', nextPhase: 'installation', onSelectType: 'transition', operation: { type: 'update', field: 'status', value: 'Terminé' } },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    }
                ]
            },
        },
    },
    'version': 0
}


