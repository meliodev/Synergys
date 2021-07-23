import { Dimensions, Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const constants = {
    ScreenWidth: width,
    ScreenHeight: height
}

export const appVersion = "1.2.10"

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
    pdfGen: "Erreur lors de la génération du document. Veuillez réessayer."
}