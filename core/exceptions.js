import { Alert } from 'react-native'

//Firestore: set operation
export const handleSetError = (e) => {

    let errorMessage = ''
    let title = ''

    switch (e.code) {
        case "firestore/permission-denied":
            title = 'Permission refusée'
            errorMessage = "Vous n'avez pas l'accès à ce type d'opérations."
            break;

        default:
            title = 'Erreur de connection'
            errorMessage = "La base de données est inaccessible, veuilez réessayer dans quelques instants..."
            break;
    }

    Alert.alert(title, errorMessage, [{ text: 'OK', style: 'cancel' }], { cancelable: false })
}

//Firestore: delete operation
export const handleDeleteError = (e) => {

    let errorMessage = ''
    let title = ''

    switch (e.code) {
        case "firestore/permission-denied":
            title = 'Permission refusée'
            errorMessage = "Vous n'avez pas l'accès à ce type d'opérations."
            break;

        default:
            title = 'Erreur de connection'
            errorMessage = "La base de données est inaccessible, veuilez réessayer dans quelques instants..."
            break;
    }

    Alert.alert(title, errorMessage, [{ text: 'OK', style: 'cancel' }], { cancelable: false })
}

//Firebase auth: reauthenticate
export const handleReauthenticateError = (e) => {

    let errorMessage = ''
    let title = ''

    switch (e.code) {
        case "auth/user-mismatch":
            title = ""
            errorMessage = "Erreur d'authentification, veuillez réessayer."
            break

        case "auth/user-not-found":
            title = 'Utilisateur introuvable'
            errorMessage = "Erreur d'authentification, veuillez réessayer."
            break

        case "auth/invalid-credential":
            title = ''
            errorMessage = "Erreur d'authentification, veuillez réessayer."
            break

        case "auth/invalid-email":
            title = ''
            errorMessage = "Erreur d'authentification, veuillez réessayer.."
            break

        case "auth/wrong-password":
            title = 'Ancien mot de passe invalide'
            errorMessage = "Erreur d'authentification, veuillez réessayer."
            break

        case "auth/invalid-verification-code":
            title = ''
            errorMessage = "Erreur d'authentification, veuillez réessayer."
            break

        case "auth/invalid-verification-id":
            title = ''
            errorMessage = "Erreur d'authentification, veuillez réessayer."
            break

        default:
            title = 'Erreur de connection'
            errorMessage = "La base de données est inaccessible, veuilez réessayer dans quelques instants..."
            break
    }

    Alert.alert(title, errorMessage, [{ text: 'OK', style: 'cancel' }], { cancelable: false })
}

export const handleUpdatePasswordError = (e) => {

    let errorMessage = ''
    let title = ''

    switch (e.code) {
        case "auth/email-already-in-use":
            return {
                error: "Cette addresse email a déjà un compte."
            }

        case "auth/invalid-email":
            return {
                error: "Adresse email invalide."
            }

        case "auth/requires-recent-login":
            title = ""
            errorMessage = "Veuillez vous réauthentifier avant d'essayer de modifier votre mot de passe."
            break

        default:
            title = 'Erreur de connection'
            errorMessage = "La base de données est inaccessible, veuilez réessayer dans quelques instants..."
            break
    }

    Alert.alert(title, errorMessage, [{ text: 'OK', style: 'cancel' }], { cancelable: false })
}

export const handleUpdateEmailError = (e) => {

    let errorMessage = ''
    let title = ''

    switch (e.code) {
        case "auth/requires-recent-login":
            title = ""
            errorMessage = "Veuillez vous réauthentifier avant d'essayer de modifier votre mot de passe."
            break

        case "auth/weak-password":
            title = 'Mot de passe faible'
            errorMessage = "Le nouveau mot de passe que vous avez saisi est faible."
            break

        default:
            title = 'Erreur de connection'
            errorMessage = "La base de données est inaccessible, veuilez réessayer dans quelques instants."
            break
    }

    return { errorMessage }
    // Alert.alert(title, errorMessage, [{ text: 'OK', style: 'cancel' }], { cancelable: false })
}