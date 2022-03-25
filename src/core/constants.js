import { Dimensions, Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { faCamera, faImages } from '@fortawesome/pro-light-svg-icons'

import { rgb } from "pdf-lib"

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const constants = {
    ScreenWidth: width,
    ScreenHeight: height
}

export const appVersion = "1.4.4"
//export const appVersionDescription = "Lorem ipsum dolor"

export const latestProcessVersion = "version7"

export const roles = [
    { id: 'admin', label: 'Admin', value: 'Admin', bool: 'isAdmin', level: 3 },
    { id: 'backoffice', label: 'Back office', value: 'Back office', bool: 'isBackOffice', level: 3 },
    { id: 'dircom', label: 'Directeur commercial', value: 'Directeur commercial', bool: 'isDirCom', level: 2 },
    { id: 'com', label: 'Commercial', value: 'Commercial', bool: 'isCom', level: 1 },
    { id: 'tech', label: 'Responsable technique', value: 'Responsable technique', bool: 'isTech', level: 1 },
    { id: 'poseur', label: 'Technicien', value: 'Poseur', bool: 'isPoseur', level: 0 },
    { id: 'client', label: 'Client', value: 'Client', bool: 'isClient', level: -1 }
]

export const highRoles = ['admin', 'backoffice', 'dircom', 'tech']
export const lowRoles = ["poseur", "com"]
export const highRolesValues = ['Admin', 'Back office', 'Directeur commercial', 'Responsable technique']


export const comSteps = ['Prospect', 'Visite technique préalable', 'Présentation étude']
export const techSteps = ['Visite technique', 'Installation', 'Maintenance']

export const downloadDir = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir
export const termsDir = `${downloadDir}/Synergys/Documents/Termes-et-conditions-générales-de-signature.pdf`
export const termsUrl = 'https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/CONDITIONS%20G%C3%89N%C3%89RALES%20DE%20VENTE%20ET%20DE%20TRAVAUX.pdf?alt=media&token=3bf07ac2-6d9e-439a-91d8-f9908003488f'

export const errorMessages = {
    appInit: "Erreur inattendue lors de l'initialisation de la session. Veuillez redémarrer l'application.",
    auth: {
        emailExist: "L'adresse email que vous avez saisi est déjà associé à un compte."
    },
    firestore: {
        get: "Erreur lors du chargement des données. Veuillez réessayer.",
        update: "Erreur lors de la mise à jour des données. Veuillez réessayer.",
        delete: "Erreur inattendue lors de la suppression."
    },
    wordpress: { posts: "Erreur lors de la connection avec le serveur du siteweb." },
    profile: {
        emailUpdate: "Erreur lors de la modification de l'adresse email. Veuillez réessayer.",
        roleUpdate: "Erreur lors de la modification du role. Veuillez réessayer.",
        passwordUpdate: "Erreur lors de la modification du mot de passe. Veuillez réessayer."
    },
    documents: { upload: "Erreur lors de l'importation de la pièce jointe, veuillez réessayer." },
    pdfGen: "Erreur lors de la génération du document. Veuillez réessayer.",
    invalidFields: "Erreur de saisie, veuillez verifier les champs.",
    network: {
        newUser: "La création d'un nouvel utilisateur nécessite une connection réseau."
    }
}

export const imageSources = [
    { label: 'Caméra', value: 'upload', icon: faCamera },
    { label: 'Gallerie', value: 'generate', icon: faImages }
]
export const generableDocTypes = ["Fiche EEB", 'PV réception', 'Mandat MaPrimeRénov', 'Mandat Synergys', 'Visite technique']
export const onlyImportableDocTypes = ["Devis", "Facture"]
export const masculinsDocTypes = ['Devis', 'Bon de commande', 'Dossier CEE', 'PV réception', 'Mandat MaPrimeRénov', 'Mandat Synergys']

export const phases = [
    { label: 'Prospect', value: 'Prospect', id: 'init' },
    { label: 'Visite technique préalable', value: 'Visite technique préalable', id: 'rd1' },
    { label: 'Présentation étude', value: 'Présentation étude', id: 'rdn' },
    { label: 'Visite technique', value: 'Visite technique', id: 'technicalVisitManagement' },
    { label: 'Installation', value: 'Installation', id: 'installation' },
    { label: 'Maintenance', value: 'Maintenance', id: 'maintenance' },
]

export const items_scrollTo = {
    "CreateProject": {
        "comContact": { x: 0, y: 1000, animated: true },
    }
}

export const lastAction = (actionOrder) => {
    return {
        id: 'endProject',
        title: "Finaliser le projet",
        instructions: "",
        actionOrder,
        type: 'manual',
        verificationType: 'validation',
        comment: '',
        responsable: 'ADV',
        status: 'pending',
        nextPhase: 'endProject',
    }
}

export const workTypes = [
    { label: 'PAC AIR/EAU', value: 'PAC AIR/EAU', selected: false },
    { label: 'PAC AIR/AIR (climatisation)', value: 'PAC AIR/AIR (climatisation)', selected: false },
    { label: 'BALLON THERMODYNAMIQUE', value: 'BALLON THERMODYNAMIQUE', selected: false },
    { label: 'BALLON SOLAIRE THERMIQUE', value: 'BALLON SOLAIRE THERMIQUE', selected: false },
    { label: 'PHOTOVOLTAÏQUE', value: 'PHOTOVOLTAÏQUE', selected: false },
    { label: 'PHOTOVOLTAÏQUE HYBRIDE', value: 'PHOTOVOLTAÏQUE HYBRIDE', selected: false },
    { label: 'ISOLATION ', value: 'ISOLATION ', selected: false },
    { label: 'VMC DOUBLE FLUX ', value: 'VMC DOUBLE FLUX ', selected: false },
    { label: 'POÊLE A GRANULES ', value: 'POÊLE A GRANULES ', selected: false },
    { label: 'RADIATEUR INERTIE ', value: 'RADIATEUR INERTIE ', selected: false },
]

export const contactForm = [
    {//33
        id: "coordinates",
        title: "COORDONNEES",
        fields: [
            {
                id: "addressNumber",
                type: "textInput",
                label: "N°",
                isNumeric: true,
                errorId: "addressNumberError",
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
            {
                id: "addressStreet",
                type: "textInput",
                label: "Rue",
                errorId: "addressStreetError",
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
            {
                id: "addressPostalCode",
                type: "textInput",
                label: "Code postal",
                errorId: "addressPostalCodeError",
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
            {
                id: "addressCity",
                type: "textInput",
                label: "Ville",
                errorId: "addressCityError",
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
            {
                id: "email",
                type: "textInput",
                label: "Email",
                errorId: "emailError",
                isEmail: true,
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
            {
                id: "phone",
                type: "textInput",
                label: "Téléphone",
                errorId: "phoneError",
                isNumeric: true,
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
            {
                id: "acceptPhoneCall",
                type: "checkbox",
                label: "Être rappelé",
                errorId: "acceptPhoneCallError",
                isNumeric: true,
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 650, pageIndex: 2 }
            },
        ],
    },
]

//Auto-Sign docs
export const autoSignDocs = ["Mandat MaPrimeRénov"]
export const docsConfig = (index) => {

    const config = {
        "Devis": {
            signatures: [
                {
                    pageIndex: 1,
                    position: {
                        x: 75,
                        y: 440,
                        size: 10,
                        lineHeight: 10,
                        color: rgb(0, 0, 0),
                    }
                },
                {
                    pageIndex: 5,
                    position: {
                        x: 250,
                        y: 137,
                        size: 10,
                        lineHeight: 10,
                        color: rgb(0, 0, 0),
                    }
                }
            ],
            genNavigation: {
                titleText: "Choix de la commande",
                listScreen: "ListOrders",
                creationScreen: "CreateOrder",
                popCount: index === 0 ? 3 : 2,
            }
        },
        "Mandat MaPrimeRénov": {
            signatures: [{
                pageIndex: 1,
                position: {
                    x: 60,
                    y: 90,
                    size: 10,
                    lineHeight: 10,
                    color: rgb(0, 0, 0),
                }
            }],
            genNavigation: {
                titleText: "Choix du formulaire",
                listScreen: "ListMandatsMPR",
                creationScreen: "CreateMandatMPR",
                popCount: index === 0 ? 2 : 1,
            }
        },
        "Mandat Synergys": {
            signatures: [{
                pageIndex: 0,
                position: {
                    x: 45,
                    y: 180,
                    size: 10,
                    lineHeight: 10,
                    color: rgb(0, 0, 0),
                }
            }]
        },
        "Facture": {
            signatures: [{
                pageIndex: 0,
                position: {
                    x: 45,
                    y: 160,
                    size: 10,
                    lineHeight: 10,
                    color: rgb(0, 0, 0),
                }
            }],
            genNavigation: {
                titleText: "Choix de la commande",
                listScreen: "ListOrders",
                creationScreen: "CreateOrder",
                popCount: index === 0 ? 3 : 2,
            }
        },
        "Fiche EEB": {
            genNavigation: {
                titleText: "Choix de la simulation",
                listScreen: "ListSimulations",
                creationScreen: "CreateSimulation",
                popCount: index === 0 ? 2 : 1,
            }
        },
        "Mandat Synergys": {
            signatures: [{
                pageIndex: 0,
                position: {
                    x: 45,
                    y: 170,
                    size: 10,
                    lineHeight: 10,
                    color: rgb(0, 0, 0),
                }
            }],
            genNavigation: {
                titleText: "Choix du formulaire",
                listScreen: "ListMandatsSynergys",
                creationScreen: "CreateMandatSynergys",
                popCount: index === 0 ? 2 : 1,
            },
        },
        "PV réception": {
            genNavigation: {
                titleText: "Choix du formulaire",
                listScreen: "ListPvReceptions",
                creationScreen: "CreatePvReception",
                popCount: index === 0 ? 2 : 1,
            },
        },
        "Visite technique": {
            genNavigation: {
                titleText: "Choix du formulaire",
                listScreen: "",
                creationScreen: "CreateFicheTech",
                popCount: index === 0 ? 2 : 1,
            },
        },
    }

    return config
}