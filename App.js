import React, { Component } from 'react'
import { Button, Dimensions, Alert, Text, LogBox } from 'react-native'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native'
import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import '@react-native-firebase/functions'
import '@react-native-firebase/messaging'

import OffLineBar from './components/OffLineBar'
import Test from './components/Test'

import Store from './Store/configureStore'
import { fontsConfig } from './fontConfig'
import * as theme from './core/theme'
import Wrapper from './Wrapper'
import RootController from './Navigation/DrawerNavigator'
import { processModel } from './processModel'


const db = firebase.firestore()
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  // persistence: false,
  // host: 'localhost:8080',
  // ssl: false,
})

const paperTheme = {
  ...DefaultTheme,
  fonts: configureFonts(fontsConfig),
  colors: {
    primary: theme.colors.primary,
    accent: theme.colors.secondary,
    background: theme.colors.background,
    surface: theme.colors.surface,
    text: theme.colors.secondary,
    disabled: theme.colors.gray_medium,
    placeholder: theme.colors.gray_dark,
    backdrop: theme.colors.white
  }
}

class App extends Component {

  async componentDidMount() {
    //Notification channels
    const channelId = await notifee.createChannel({
      id: 'projects',
      name: 'projects',
      lights: false,
      vibration: true,
      importance: AndroidImportance.HIGH,
    })

    this.foregroundMessages = firebase.messaging().onMessage(this.onForegroundMessageReceived)
  }

  //Forground: messages listener
  async onForegroundMessageReceived(message) {
    await notifee.displayNotification(JSON.parse(message.data.notifee))
  }

  componentWillUnmount() {
    this.foregroundMessages && this.foregroundMessages()
  }

  render() {
    let persistor = persistStore(Store)
    //  persistor.purge()

    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <PaperProvider theme={paperTheme}>
            <MenuProvider>
              <Wrapper>
                <RootController />
                {/* <Text>Hello world !</Text> */}
              </Wrapper>
            </MenuProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    )
  }
}


LogBox.ignoreAllLogs(true)

export default App

















// import { createAppContainer } from "react-navigation";
// import { createStackNavigator } from "react-navigation-stack";

// export default createAppContainer(Router);

// console.disableYellowBox = true;

 //Token: 1/871957774648702:7cbeb89d7d0f667a2c52d8f2b499fec9
    //id client: 1189147966277746
    //secret du client: bd601cb4bb2de75b18a8848cde7aa12c
    //Octroyer un code d’autorisation: https://app.asana.com/-/oauth_authorize?response_type=code&client_id=1189147966277746&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&state=<STATE_PARAM>


  // fetch("https://app.asana.com/api/1.0/workspaces/855356051669655/projects", {
    //   body: '{"data": {"name": "PRIMERA TAREA", "team": "1170903365365273"}}',

    //   headers: {
    //     Accept: "application/json",
    //     Authorization: "Bearer 1/871957774648702:7cbeb89d7d0f667a2c52d8f2b499fec9",..
    //     "Content-Type": "application/json"
    //   },
    //   method: "POST"
    // }).then(response => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson)
    //   })
    //   .catch(error => console.log(error))







    // 'prenom': {
    //   id: 'prenom',
    //   title: 'Prénom',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // }, ##PROJECT.CLIENT
    // 'address': {
    //   id: 'address',
    //   title: 'Adresse postale',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // }, ##PROJECT.CLIENT
    // 'phone': {
    //   id: 'phone',
    //   title: 'Numéro de téléphone',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // }, ##PROJECT.CLIENT
    // 'comment': {
    //   id: 'comment',
    //   title: 'Commentaire',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // }, ##PROJECT.NOTE



      //   const clients = {
  //     canCreate: false,
  //     canRead: false,
  //     canUpdate: false,
  //     canDelete: false
  //   }

  //   // //documents
  //   // const queryFilters = [
  //   //   { filterOrder: 1, clause: 'where', filter: 'project.subscribers', operation: 'array-contains', value: { id: '', fullName: '', email: '', role: '' }, valueSource: 'currentUser' },
  //   //   { filterOrder: 2, clause: 'orderBy', field: 'createdAt', sort: 'desc' },
  //   // ]

  //   // //client
  //   // const queryFilters = [
  //   //   { filterOrder: 1, clause: 'where', filter: 'client.id', operation: '==', value: '', valueSource: 'currentUser' },
  //   //   { filterOrder: 2, clause: 'orderBy', field: 'createdAt', sort: 'desc' },
  //   // ]

  //   // const queryFilters = [
  //   //   { filterOrder: 1, clause: 'where', filter: 'client.id', operation: '==', value: '', valueSource: '' },
  //   //   { filterOrder: 2, clause: 'where', filter: 'type', operation: '==', value: '', valueSource: 'type' },
  //   //   { filterOrder: 3, clause: 'orderBy', field: 'createdAt', sort: 'desc' },
  //   // ]


  //   // //messages
  //   // const queryFilters = [
  //   //   { filterOrder: 1, clause: 'where', filter: 'subscribers', operation: 'array-contains', value: '', valueSource: 'currentUser' },
  //   //   { filterOrder: 2, clause: 'orderBy', field: 'sentAt', sort: 'desc' },
  //   // ]


  //   //Tasks
  //   // const queryFilters = [
  //   //   { filterOrder: 1, clause: 'where', filter: 'natures', operation: 'array-contains', value: 'tech' },
  //   //   { filterOrder: 2, clause: 'orderBy', field: 'createdAt', sort: 'desc' },
  //   // ]

  //   // //orderBy only
  //   // const queryFilters = [
  //   //   { filterOrder: 1, clause: 'orderBy', field: 'createdAt', sort: 'desc' },
  //   // ]

  // //  db.collection('Permissions').doc('Client').update({ 'requests.queryFilters': queryFilters })