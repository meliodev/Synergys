const processModel = {
    'init': {
        title: 'Initialisation',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 1,
        previousPhase: '',
        progress: 0,
        isCurrent: false,
        steps: {
            'prospectCreation': {
                title: 'Création prospect',
                status: 'pending', 
                instructions: 'Lorem ipsum dolor',  
                stepOrder: 1,
                previousStep: '',
                progress: 0,
                isCurrent: false,
                actions: [
                    {
                        id: 'nom',
                        title: 'Nom',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'Projects', // In case of subcollection: Projects/SubCollection
                        documentId: '', // (documentId is during the process)
                        properties: ['client', 'fullName'],
                        screenName: 'Profile', //onPress step: navigate to screen "Profile"
                        screenParams: { userId: '', isClient: true }, //required navigation params to display client data on "Profile" screen (userId is updated once the project process is initialized)
                        type: 'auto',
                        responsable: '',
                        status: 'pending'
                    },
                    {
                        id: 'prenom',
                        title: 'Prénom',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'Projects', // In case of subcollection: Projects/SubCollection
                        documentId: 'GS-PR-0W02', // depending on the concerned project
                        properties: ['client', 'fullName'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending'
                    },
                    {
                        id: 'address',
                        title: 'Adresse postale',
                        instructions: 'Lorem ipsum dolor',
                        collection: 'Projects', // In case of subcollection: Projects/SubCollection
                        documentId: 'GS-PR-0W02', // depending on the concerned project
                        properties: ['client', 'address'],
                        screenName: 'Profile', //#task OnUpdate client name on his profile: triggered cloud function should run to update all documents containing this client data.
                        screenParams: { userId: '', isClient: true },
                        type: 'auto',
                        responsable: '',
                        status: 'pending'
                    },
                    //other actions...
                ]
            }
        }
    },
    'rd1': {
        title: 'Rendez-vous 1',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        previousPhase: 'init',
        progress: 0,
        isCurrent: false,
        steps: {
            'priorTechnicalVisit': {
                title: 'Visite technique préalable',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 1,
                previousStep: '',
                progress: 0,
                isCurrent: false,
                actions: {
                    'rd1Date': {
                        title: 'Date du rendez-vous',
                        instructions: 'Lorem ipsum dolor',
                        screenName: 'CreateTask',
                        screenParams: { TaskId: '' },
                        type: 'auto',
                        responsable: '',
                    },
                    //others actions...
                }
            },
            'aidFile': {
                title: 'Dossier aidé',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2.1,
                previousStep: 'prior-technical-visit',
                progress: 0,
                isCurrent: false,
                actions: {}
            },
            'housingActionFile': { 
                title: 'Dossier action logement',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',
                stepOrder: 2.2,
                previousStep: 'prior-technical-visit',
                progress: 0,
                isCurrent: false,
                actions: {
                    'eebFile': {
                        title: 'Fiche EEB',
                        instructions: 'Lorem ipsum dolor',
                        screenName: 'UploadDocument',
                        screenParams: { project: '', DocumentType: '' },
                        type: 'auto',
                        responsable: '',
                    }
                }
            },
            //other steps...
        }
    },
    'rdn': {
        title: 'Rendez-vous N',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        previousPhase: 'Rendez-vous 1',
        progress: 0,
        isCurrent: false,
        steps: {}
    },
    'technicalVisitManagement': {
        title: 'Gestion visite technique',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 4,
        previousPhase: 'Rendez-vous N',
        progress: 0,
        isCurrent: false,
        steps: {
            'siteCreation': {
                title: 'Création chantier',
                status: 'pending',
                instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
                stepOrder: 1,
                previousStep: '',
                progress: 0,
                isCurrent: false,
                actions: {
                    'tvDateValidation': {
                        title: 'Valider la date de la visite technique',
                        instructions: 'Lorem ipsum dolor',
                        // screenName: 'CreateTask',
                        // screenParams: { TaskId: '' },
                        type: 'manual',                                                                                                                    //##ask: is it manual or auto -> if manual.. does it require a defined responsable to handle it ?
                        responsable: '', //Define responsable of validating date
                    },
                    //other actions...
                }
            },
            //other steps...
        }
    },
    //other phase...
}
