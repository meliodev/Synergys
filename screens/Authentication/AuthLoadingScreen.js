import React, { memo, Component } from "react"
import { View, Alert, Text, StyleSheet, Linking } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import { ProgressBar } from "react-native-paper"
import RNFS from 'react-native-fs'
import firebase, { db, remoteConfig } from '../../firebase'
import notifee, { EventType } from '@notifee/react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import NetInfo from "@react-native-community/netinfo"
import SplashScreen from 'react-native-splash-screen'

import Button from "../../components/Button"
import Background from "../../components/NewBackground"
import Loading from "../../components/Loading"
import AppVersion from "../../components/AppVersion"

import { uploadFileNew } from '../../api/storage-api'
import * as theme from "../../core/theme"
import { setRole, setPermissions, userLoggedOut, resetState, setCurrentUser, setNetwork, setProcessModel } from '../../core/redux'
import { appVersion, constants, errorMessages } from "../../core/constants"
import { displayError } from "../../core/utils"


import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')


const roles = [
  { id: 'admin', value: 'Admin', level: 3 },
  { id: 'backoffice', value: 'Back office', level: 3 },
  { id: 'dircom', value: 'Directeur commercial', level: 2 },
  { id: 'com', value: 'Commercial', level: 1 },
  { id: 'poseur', value: 'Poseur', level: 1 },
  { id: 'tech', value: 'Responsable technique', level: 2 },
  { id: 'client', value: 'Client', level: 0 }
]

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props)
    this.booted = false
    this.alertDisplayed = false

    this.uploadFileNew = uploadFileNew.bind(this)

    this.state = {
      initialNotification: false,
      routeName: '',
      routeParams: {},
      progress: 0,
      requiresUpdate: false
    }
  }

  async componentDidMount() {
    SplashScreen.hide()

    // //1. Notification action listeners
    // const isUpToDate = this.checkAppVersion()
    // if (!isUpToDate) {
    //   Alert.alert('Mise à jour', "L'application n'est pas à jour. Veuillez installer la version la plus récente.")
    //   this.setState({ requiresUpdate: true })
    //   return
    // }

    await this.bootstrapNotifications()
    this.updateProgress(0.25)
    this.forgroundNotificationListener()
    this.updateProgress(0.5)
    this.backgroundNotificationListener()
    this.updateProgress(0.6)
    //2. Auth listener: Privileges setting, fcm token setting, Navigation rooter
    this.unsububscribe = this.onAuthStateChanged()
  }

  checkAppVersion() {
    const minAppVersion = remoteConfig.getValue('minAppVersion')
    console.log("", minAppVersion.asString())

    if (minAppVersion.asString() > appVersion) {
      return false
    }
    return true
  }

  updateProgress(progress) {
    this.setState({ progress })
  }

  //User action on a notification has caused app to open
  async bootstrapNotifications() {
    const initialNotification = await notifee.getInitialNotification()

    if (initialNotification) {
      const { data } = initialNotification.notification
      const routeName = data['screen']
      delete data.screen //keep only params
      const routeParams = data
      Object.entries(routeParams).forEach(([key, value]) => {
        if (value === 'true') routeParams[key] = true
        if (value === 'false') routeParams[key] = false
      })
      this.setState({ initialNotification: true, routeName, routeParams })
    }

    return initialNotification
  }

  forgroundNotificationListener() {
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
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      //const { pressAction } = notification.android
      const { currentUser } = firebase.auth()
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
          if (currentUser)
            this.props.navigation.navigate(screen, params)
          else this.props.navigation.navigate("LoginScreen")
          await notifee.cancelNotification(notification.id)
          break
      }
    })
  }

  //Auth Listener & Navigation Rooter
  onAuthStateChanged() {

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const { currentUser } = firebase.auth()
        const { isConnected } = this.props.network

        if (isConnected) {
          //1. Set role
          const idTokenResult = await currentUser.getIdTokenResult()

          if (!idTokenResult) {
            displayError({ message: errorMessages.appInit })
            return
          }

          for (const role of roles) {
            if (idTokenResult.claims[role.id]) {
              setRole(this, role)
              var roleValue = role.value
            }
          }

          //2. Set privilleges
          const remotePermissions = await this.configurePrivileges(roleValue)
          if (!remotePermissions) {
            displayError({ message: errorMessages.appInit })
            return
          }
          const action = { type: "SET_PERMISSIONS", value: remotePermissions }
          this.props.dispatch(action)

          //3. Set processModel
          const processModels = await this.fetchProcessModels()
          if (!processModels) {
            displayError({ message: errorMessages.appInit })
            return
          }
          setProcessModel(this, processModels)

          this.updateProgress(90)

          //4. Set currentUser
          const currUser = {
            id: user.uid,
            fullName: user.displayName,
            email: user.email,
            role: roleValue,
          }
          setCurrentUser(this, currUser)

          //5. Set fcm token
          const enabled = await this.requestUserPermission() //iOS only
          const res = await this.configureFcmToken()
          if (!res) {
            displayError({ message: errorMessages.appInit })
            return
          }
        }

        //4. Navigation
        const { initialNotification } = this.state //Notification
        const { params } = this.props.navigation.state //Dynamic link

        //Dynamic link (email)
        if (params && params.routeName) {
          var { routeName, ...routeParams } = params
        }

        //Notification link
        else if (initialNotification) {
          var { routeName, routeParams } = this.state
        }

        else {
          var routeName = roleValue === 'Client' || roleValue === "Poseur" ? "ProjectsStack" : "MandatMPRStack"
          var routeParams = {}
        }
      }

      else {
        resetState(this)
        const { type, isConnected } = await NetInfo.fetch()
        const network = { type, isConnected }
        setNetwork(this, network)
        var routeName = "LoginScreen"
        var routeParams = {}
      }

      let startApp = user && this.props.role.id !== '' && this.props.permissions.active || !user
      if (startApp) {
        this.updateProgress(1)
        this.props.navigation.navigate(routeName, routeParams)
      }
    })
  }

  async fetchProcessModels() {

    const querySnapshot = await db.collection('Process').get()

    let processModels = {}
    if (querySnapshot.empty) {
      return undefined
    }

    for (const doc of querySnapshot.docs) {
      const version = doc.id
      const model = doc.data()
      processModels[version] = model
    }

    return processModels
  }

  async configurePrivileges(role) {
    const query = db.collection('Permissions').doc(role)
    return query.get().then((doc) => {
      return doc.data()
    })
  }

  //FCM token configuration
  async requestUserPermission() {
    const authStatus = await firebase.messaging().requestPermission();
    const enabled = authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED || authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL
    return enabled
  }

  async configureFcmToken() {
    try {
      //Register the device with FCM 
      await firebase.messaging().registerDeviceForRemoteMessages() //iOS only

      //Get the token
      const token = await firebase.messaging().getToken()

      //Save the token
      const { uid } = firebase.auth().currentUser //user B
      const fcmTokensRef = db.collection('FcmTokens')
      const queryTokens = fcmTokensRef.where('tokens', 'array-contains', token)
      await queryTokens.get().then(async (querysnapshot) => {
        try {
          //OLD TOKEN: already belongs to a user
          if (!querysnapshot.empty) {
            const doc = querysnapshot.docs[0]
            //This device/token was used by user A
            if (doc.id !== uid) {
              //1. remove this token from user A
              const tokens = doc.data().tokens
              const index = tokens.indexOf(token)
              tokens.splice(index, 1)
              //2. update user A tokens
              await doc.ref.update({ tokens })
              //3. add this token to current user  
              await this.addTokenToCurrentUser(token, uid)
            }
          }
          //NEW TOKEN: add it to the current user
          else {
            await this.addTokenToCurrentUser(token, uid)
          }
        }

        catch (e) {
          throw new Error('Error when handling tokens...')
        }
      })

      return true
    }

    catch (e) {
      return false
    }
  }

  async addTokenToCurrentUser(token, uid) {
    try {
      var tokens = []
      const fcmTokensRef = db.collection('FcmTokens')
      const userDoc = await fcmTokensRef.doc(uid).get()
      if (userDoc.exists) {
        tokens = userDoc.data().tokens
      }
      tokens.push(token)
      await fcmTokensRef.doc(uid).set({ tokens }, { merge: true })
    }
    catch (e) {
      throw new Error("Error while adding token to current user...")
    }
  }

  downloadApp() {
    //const appDowloadLink = remoteConfig.getValue('minAppVersion')
    const appDowloadLink = "https://drive.google.com/file/d/1Hnkaf1bFyPyGEMpJ9f5egG2z-jkVpU7n/view?usp=sharing"
    Linking.openURL(appDowloadLink)
  }

  renderAppVersion() {
    return (
      <View style={{ position: "absolute", bottom: theme.padding, right: theme.padding }}>
        <AppVersion />
      </View>
    )
  }

  render() {
    const { progress, requiresUpdate } = this.state

    return (
      <Background>
        <Background style={styles.nestedBackground}>
          <View style={styles.container}>
            <ProgressBar
              progress={progress}
              color={theme.colors.primary}
              visible={true}
              style={{ alignSelf: "center" }}
            />
          </View>
        </Background>
        {requiresUpdate &&
          <Button
            mode="contained"
            onPress={this.downloadApp}
            style={{ position: 'absolute', bottom: constants.ScreenHeight * 0.2, width: constants.ScreenWidth * 0.75, alignSelf: 'center' }}
            outlinedColor={theme.colors.primary}
          >
            Mettre à jour
          </Button>
        }
        {this.renderAppVersion()}
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
  nestedBackground: {
    transform: [{ scaleY: -1 }]
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    width: constants.ScreenWidth * 0.5,
    alignSelf: "center"
  },
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
  },
})

export default connect(mapStateToProps)(AuthLoadingScreen)