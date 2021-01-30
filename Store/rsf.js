import firebase from '@react-native-firebase/app'
// import '@react-native-firebase/auth'
import '@react-native-firebase/firestore' // 👈 If you're using firestore
// import '@react-native-firebase/storage'
// import '@react-native-firebase/functions'
// import '@react-native-firebase/messaging' 
import ReduxSagaFirebase from 'redux-saga-firebase'

const rsf = new ReduxSagaFirebase(firebase)

export default rsf