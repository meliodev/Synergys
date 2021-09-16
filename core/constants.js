import { Dimensions, Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { rgb } from "pdf-lib"

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const constants = {
    ScreenWidth: width,
    ScreenHeight: height
}

export const appVersion = "1.2.24.1"
export const latestProcessVersion = "version5"

export const roles = [
    { id: 'admin', label: 'Admin', value: 'Admin', bool: 'isAdmin', level: 3 },
    { id: 'backoffice', label: 'Back office', value: 'Back office', bool: 'isBackOffice', level: 3 },
    { id: 'dircom', label: 'Directeur commercial', value: 'Directeur commercial', bool: 'isDirCom', level: 2 },
    { id: 'com', label: 'Commercial', value: 'Commercial', bool: 'isCom', level: 1 },
    { id: 'tech', label: 'Responsable technique', value: 'Responsable technique', bool: 'isTech', level: 1 },
    { id: 'poseur', label: 'Poseur', value: 'Poseur', bool: 'isPoseur', level: 0 },
    { id: 'client', label: 'Client', value: 'Client', bool: 'isClient', level: -1 }
]

export const highRoles = ['admin', 'backoffice', 'dircom', 'tech']
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
    documents: { upload: "Erreur lors de l'exportation de la pièce jointe, veuillez réessayer." },
    pdfGen: "Erreur lors de la génération du document. Veuillez réessayer.",
    invalidFields: "Erreur de saisie, veuillez verifier les champs."
}

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

export const autoSignDocs = ["Devis", "Mandat MaPrimeRénov", "Mandat Synergys", "Mandat SEPA", "Contrat CGU-CGV", "Facture"]
export const signPositions = {
    "Devis": [
        {
            pageIndex: 1,
            position: {
                x: 200,
                y: 300,
                size: 10,
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        }
    ],
    "Mandat MaPrimeRénov": [
        {
            pageIndex: 0,
            position: {
                x: 200,
                y: 300,
                size: 10,
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        }
    ],
    "Mandat Synergys": [
        {
            pageIndex: 0,
            position: {
                x: 200,
                y: 300,
                size: 10,
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        }
    ],
    "Mandat SEPA": [
        {
            pageIndex: 0,
            position: {
                x: 200,
                y: 300,
                size: 10,
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        }
    ],
    "Contrat CGU-CGV": [
        {
            pageIndex: 0,
            position: {
                x: 200,
                y: 300,
                size: 10,
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        }
    ],
    "Facture": [
        {
            pageIndex: 0,
            position: {
                x: 200,
                y: 300,
                size: 10,
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        }
    ],
}