import React, { memo, Component } from "react"
import { Alert, Text, StyleSheet } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import firebase from '@react-native-firebase/app'
import notifee, { EventType } from '@notifee/react-native'

import Loading from "../../components/Loading"

import * as theme from "../../core/theme"
import { setRole, setUser } from '../../core/utils'
import { connect } from 'react-redux'

const roles = [{ id: 'dircom', value: 'Directeur commercial' }, { id: 'admin', value: 'Admin' }, { id: 'com', value: 'Commercial' }, { id: 'poseur', value: 'Poseur' }, { id: 'tech', value: 'Responsable technique' }, { id: 'client', value: 'Client' }]
const db = firebase.firestore()

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props)
    this.booted = false

    this.state = {
      initialNotification: false,
      screen: '',
      params: {}
    }
  }

  async componentDidMount() {
    //Notification action listeners
    await this.bootstrap()

    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification)
          break
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification)
          break
      }
    })

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      //const { pressAction } = notification.android
      const { notification } = detail
      const { data } = notification
      const screen = data['screen']
      delete data.screen //keep only params
      const params = data

      Object.entries(params).forEach(([key, value]) => {
        if (value === 'true') params[key] = true
        if (value === 'false') params[key] = false
      })

      switch (type) {
        case EventType.PRESS:
          //console.log('NOTIFICATION PRESSED !')
          this.props.navigation.navigate(screen, data)
          await notifee.cancelNotification(notification.id)
          break
      }
    })

    //Auth listener & Navigation rooter
    this.unsububscribe = this.navigationRooterAuthListener()
  }

  navigationRooterAuthListener() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const currentUser = firebase.auth().currentUser
        setUser(this, currentUser.displayName, true)

        const idTokenResult = await currentUser.getIdTokenResult().catch(() => Alert.alert('Pas de données en cache pour un fonctionnement Hors-Ligne. Veuillez vous connecter à internet.'))

        roles.forEach((role) => {
          if (idTokenResult.claims[role.id])
            setRole(this, role)
        })

        await this.requestUserPermission() //iOS only (notifications)
        await this.configureFcmToken()

        const { initialNotification, screen, params } = this.state

        if (initialNotification)
          this.props.navigation.navigate(screen, params)

        else
          this.props.navigation.navigate("ProjectsStack")
      }

      else {
        setRole(this, '')
        setUser(this, '', false)
        this.props.navigation.navigate("HomeScreen")
      }
    })
  }

  //User action on a notification has caused app to open
  async bootstrap() {
    const initialNotification = await notifee.getInitialNotification()
    //set screen & params on asyncstorage
    if (initialNotification) {
      console.log('Notification caused application to open from quit state', initialNotification.notification)
      console.log('Press action used to open the app', initialNotification.pressAction)

      const { data } = initialNotification.notification
      const screen = data['screen']
      delete data.screen //keep only params
      const params = data

      Object.entries(params).forEach(([key, value]) => {
        if (value === 'true') params[key] = true
        if (value === 'false') params[key] = false
      })

      this.setState({ initialNotification: true, screen, params })
    }

    return initialNotification
  }

  //FCM token configuration
  async requestUserPermission() {
    const authStatus = await firebase.messaging().requestPermission();
    const enabled = authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED || authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async configureFcmToken() {
    // Register the device with FCM (iOS only)
    await firebase.messaging().registerDeviceForRemoteMessages()

    // Get the token
    const token = await firebase.messaging().getToken()
    // console.log(`Token ${token} fetched`)

    // Save the token
    const currentUserId = firebase.auth().currentUser.uid //user B
    const fcmTokensRef = db.collection('FcmTokens')

    fcmTokensRef.where('tokens', 'array-contains', token).get().then(async (querysnapshot) => {
      //Old token: already belongs to a user
      if (!querysnapshot.empty) {
        // console.log(`Token already belongs to a user`)

        const doc = querysnapshot.docs[0]

        //This device/token was used by user A
        if (doc.id !== currentUserId) {
          // console.log(`Token does not belong to current user`)

          //1. remove this token from user A
          const tokens = doc.data().tokens
          const index = tokens.indexOf(token)
          tokens.splice(index, 1)

          //2. update user A tokens
          await doc.ref.update({ tokens })
          // console.log(`Token removed from other user tokens`)

          //3. add this token to current user     
          await this.addTokenToCurrentUser(token)
        }

        //This token is already registred with current user
        else console.log(`Token ${token} already belongs to the current user ${currentUserId}`)
      }

      //New token: add it to the current user
      else await this.addTokenToCurrentUser(token)
    })
  }

  async addTokenToCurrentUser(token) {
    const fcmTokensRef = db.collection('FcmTokens')
    const currentUserId = firebase.auth().currentUser.uid
    let tokens = []

    const userDoc = await fcmTokensRef.doc(currentUserId).get()
    if (userDoc.exists) {
      tokens = userDoc.data().tokens
      // console.log(`Current user tokens fetched`)
    }

    tokens.push(token)
    // console.log(`Current user tokens ${tokens} ready to be posted`)

    await fcmTokensRef.doc(currentUserId).set({ tokens }, { merge: true })
    // console.log(`Current user tokens posted !`)
  }

  render() {
    return (
      <LinearGradient colors={['#09a500', '#69b300', '#9fbc00']} style={styles.logo}>
        <Text style={[theme.customFontMSregular.h1, styles.synergys]}>SYNERGYS</Text>
      </LinearGradient>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    role: state.roles.role,
    user: state.user.user,
    //fcmToken: state.fcmtoken
  }
}


const styles = StyleSheet.create({
  synergys: {
    textAlign: 'center',
    color: '#fff',
    marginVertical: 15,
    letterSpacing: 2,
    fontSize: 45
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(AuthLoadingScreen)
