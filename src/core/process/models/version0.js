

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
    'installation': {
        title: 'Installation',
        instructions: '',
        phaseOrder: 2,
        followers: ['Admin', 'Responsable technique', 'Poseur'],
        steps: {
            'paymentStatus': { //conversion
                title: "Finalisation de la facturation",
                instructions: '',
                stepOrder: 1,
                nextStep: '',
                actions: [
                    {
                        //##task: add multiCommentsPicker
                        id: 'paymentStatus',
                        title: 'Modifier le statut du paiement',
                        instructions: "",
                        actionOrder: 1,
                        type: 'manual',
                        verificationType: 'multiple-choices',
                        comment: '',
                        choices: [
                            { label: 'Attente paiement client', id: 'pending', onSelectType: 'multiCommentsPicker', selected: false, stay: true },
                            { label: 'Attente paiement financement', id: 'pending', onSelectType: 'multiCommentsPicker', selected: false, stay: true },
                            //##done:task: Diviser Attente paiement aide en MPR et CEE
                            { label: 'Attente paiement aide en MPR', id: 'pending', onSelectType: 'multiCommentsPicker', selected: false, stay: true },
                            { label: 'Attente paiement aide en CEE', id: 'pending', onSelectType: 'multiCommentsPicker', selected: false, stay: true },
                            { label: 'Payé', id: 'confirm', onSelectType: 'multiCommentsPicker', selected: false, stay: false },
                        ],
                        responsable: 'Poseur',
                        status: 'pending',
                    },
                ]
            },
        },
    },
    'version': 0
}


