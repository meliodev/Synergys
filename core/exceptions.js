import { Alert } from 'react-native'

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