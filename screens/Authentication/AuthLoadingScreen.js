import React, { memo, Component } from "react"
import { View, Alert, Text, StyleSheet } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import RNFS from 'react-native-fs'
import firebase from '@react-native-firebase/app'
import notifee, { EventType } from '@notifee/react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import Background from "../../components/NewBackground"
import Loading from "../../components/Loading"

import { uploadFileNew } from '../../api/storage-api'
import * as theme from "../../core/theme"
import { setRole, setPermissions, userLoggedOut, resetState } from '../../core/redux'

const roles = [{ id: 'admin', value: 'Admin', level: 3 }, { id: 'backoffice', value: 'Back office', level: 3 }, { id: 'dircom', value: 'Directeur commercial', level: 2 }, { id: 'com', value: 'Commercial', level: 1 }, { id: 'poseur', value: 'Poseur', level: 1 }, { id: 'tech', value: 'Responsable technique', level: 2 }, { id: 'client', value: 'Client', level: 0 }]
const db = firebase.firestore()

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props)
    this.booted = false
    this.alertDisplayed = false

    this.uploadFileNew = uploadFileNew.bind(this)

    this.state = {
      initialNotification: false,
      screen: '',
      params: {}
    }
  }

  async componentDidMount() {
    console.log('1. authloading screen did mount..................................')
    //1. Notification action listeners
    await this.bootstrapNotifications()
    console.log('Notifications bootstraped..........................')
    this.forgroundNotificationListener()
    console.log('forgroundNotificationListener is now running...................')

    this.backgroundNotificationListener()
    console.log('backgroundNotificationListener is now running...................')

    //2. Auth listener & Navigation rooter
    console.log('5. ready to start navigationRooterAuthListener...................')
    this.unsububscribe = this.navigationRooterAuthListener()
  }

  //User action on a notification has caused app to open
  async bootstrapNotifications() {
    console.log('2. Bootstraping notifications...................')
    const initialNotification = await notifee.getInitialNotification()
    //set screen & params on asyncstorage
    if (initialNotification) {
      // console.log('Notification caused application to open from quit state', initialNotification.notification)
      // console.log('Press action used to open the app', initialNotification.pressAction)

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

  forgroundNotificationListener() {
    console.log('3. forgroundNotificationListener launch...................')
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
  }

  backgroundNotificationListener() {
    console.log('4. backgroundNotificationListener launch...................')

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
  }

  //Auth Listener & Navigation Rooter
  navigationRooterAuthListener() {

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {

        const { currentUser } = firebase.auth()
        const { isConnected } = this.props.network

        if (isConnected) {
          //1. Set role
          const idTokenResult = await currentUser.getIdTokenResult()

          if (idTokenResult) {
            for (const role of roles) {
              if (idTokenResult.claims[role.id]) {
                setRole(this, role)
                var roleValue = role.value
              }
            }
          }

          //2. Set privilleges
          const remotePermissions = await this.configurePrivileges(roleValue)
          const action = { type: "SET_PERMISSIONS", value: remotePermissions }
          this.props.dispatch(action)

          //3. Set fcm token
          await this.requestUserPermission() //iOS only
          await this.configureFcmToken()
        }

        //4. Navigation
        const { initialNotification, screen, params } = this.state

        if (initialNotification)
          this.props.navigation.navigate(screen, params)

        else this.props.navigation.navigate("ListProjects")
      }

      else {
        this.props.navigation.navigate("LoginScreen")
      }
    })
  }

  async configurePrivileges(role) {
    //A. Compare & Update permissions config
    //A.1. Get permissions config from server
    // const remotePermissions = (await this.fetchPermissionsConfig()).data
    const remotePermissions = await db.collection('Permissions').doc(role).get().then((doc) => {
      return doc.data()
    })
    const localPermissions = this.props.permissions
    //A.2. Compare local permissions config & server permissions config
    const permissionsChanged = JSON.stringify(remotePermissions) !== JSON.stringify(localPermissions)
    //A.3 Update local config if different from server config
    //if (permissionsChanged)
    // console.log('READY TO SET PERMISSONS...', remotePermissions)
    return remotePermissions
  }

  //FCM token configuration
  async requestUserPermission() {
    const authStatus = await firebase.messaging().requestPermission();
    const enabled = authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED || authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL
  }

  async configureFcmToken() {
    //Register the device with FCM (iOS only)
    await firebase.messaging().registerDeviceForRemoteMessages()

    //Get the token
    const token = await firebase.messaging().getToken()

    //Save the token
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
        //else console.log(`Token ${token} already belongs to the current user ${currentUserId}`)
      }

      //New token: add it to the current user
      else await this.addTokenToCurrentUser(token)
    })
  }

  async addTokenToCurrentUser(token) {
    const fcmTokensRef = db.collection('FcmTokens')
    const { uid } = firebase.auth().currentUser
    var tokens = []

    const userDoc = await fcmTokensRef.doc(uid).get()
    if (userDoc.exists) {
      tokens = userDoc.data().tokens
      // console.log(`Current user tokens fetched`)
    }

    tokens.push(token)
    // console.log(`Current user tokens ${tokens} ready to be posted`)

    await fcmTokensRef.doc(uid).set({ tokens }, { merge: true })
    // console.log(`Current user tokens posted !`)
  }

  render() {
    return (
      <Background>
        <Background style={{ transform: [{ scaleY: -1 }] }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', transform: [{ scaleY: -1 }] }}>
            <Text style={[theme.customFontMSregular.h1, styles.synergys]}>SYNERGYS</Text>
          </View>
        </Background>
      </Background>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    role: state.roles.role,
    permissions: state.permissions,
    network: state.network,
    state: state,
    //fcmToken: state.fcmtoken
  }
}

const styles = StyleSheet.create({
  synergys: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginVertical: 15,
    letterSpacing: 2,
    fontSize: 45
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white
  }
})

export default connect(mapStateToProps)(AuthLoadingScreen)




  //OLD
  // async fetchPermissionsConfig() {
  //   console.log('fetching permissions config...')
  //   const fetchPermissionsConfig = firebase.functions().httpsCallable('fetchPermissionsConfig')
  //   const permissions = await fetchPermissionsConfig({})
  //   return permissions
  // }