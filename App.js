import React, { Component } from 'react'
import { Button, Dimensions, Alert, Text } from 'react-native'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native'
import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import '@react-native-firebase/functions'
import '@react-native-firebase/messaging'

import OffLineBar from './components/OffLineBar'

const settings = {
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
}

firebase.firestore().settings(settings)

import { Provider } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu';
import Store from './Store/configureStore'

import RootController from './Navigation/DrawerNavigator'
import { fontsConfig } from './fontConfig'
import * as theme from './core/theme'
import Wrapper from './Wrapper'
import Test from './components/Test'

const db = firebase.firestore()


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

  createProcessPhases() {

    const process = {
      'init': {
        title: 'Initialisation',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 1,
        previousPhase: '',
        progress: 0,
        isCurrent: false,
        steps: { //One step
          'prospect-creation': {
            title: 'Création prospect',
            status: 'pending',
            instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
            stepOrder: 1,
            previousStep: '',
            progress: 0,
            isCurrent: false,
            actions: {
              'nom': {
                title: 'Nom',
                instructions: 'Lorem ipsum dolor',
                screenName: 'Profile',
                screenParams: { userId: '', isClient: true },
                type: 'auto',
                responsable: '',
              },
              //others...
            }
          }
        }
      },
      'rd1': {
        title: 'Rendez-vous 1',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 2,
        previousPhase: 'init',
        progress: 0,
        isCurrent: false,
        steps: {
          'prior-technical-visit': { //STEP 1
            title: 'Visite technique préalable',
            status: 'pending',
            instructions: 'Lorem ipsum dolor',
            stepOrder: 1,
            previousStep: '',
            progress: 0,
            isCurrent: false,
            actions: {
              'rd1-date': {
                title: 'Date du rendez-vous',
                instructions: 'Lorem ipsum dolor',
                screenName: 'CreateTask',
                screenParams: { TaskId: '' },
                type: 'auto',
                responsable: '',
              },
              //others...
            }
          },
          'aid-file': { //STEP 2'
            title: 'Dossier aidé',
            status: 'pending',
            instructions: 'Lorem ipsum dolor',
            stepOrder: 2.1,
            previousStep: 'prior-technical-visit',
            progress: 0,
            isCurrent: false,
            actions: {}
          },
          'housing-action-file': { //STEP 2"
            title: 'Dossier action logement',
            status: 'pending',
            instructions: 'Lorem ipsum dolor',
            stepOrder: 2.2,
            previousStep: 'prior-technical-visit',
            progress: 0,
            isCurrent: false,
            actions: {
              'eeb-file': {
                title: 'Fiche EEB',
                instructions: 'Lorem ipsum dolor',
                screenName: 'UploadDocument',
                screenParams: { project: '', DocumentType: '' },
                type: 'auto',
                responsable: '',
              }
            }
          },

        }
      },
      'rdn': {
        id: 'rdn',
        title: 'Rendez-vous N',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 3,
        previousPhase: 'Rendez-vous 1',
        progress: 0,
        isCurrent: false,
        steps: {}
      },
      'technical-visit-management': {
        id: 'gestion-visite-technique',
        title: 'Gestion visite technique',
        status: 'pending',
        instructions: 'Lorem ipsum dolor',
        phaseOrder: 4,
        previousPhase: 'Rendez-vous N',
        progress: 0,
        isCurrent: false,
        steps: {
          'site-creation': {
            title: 'Création chantier',
            status: 'pending',
            instructions: 'Lorem ipsum dolor',  // Example: process.init.create-prospect.nom.title
            stepOrder: 1,
            previousStep: '',
            progress: 0,
            isCurrent: false,
            actions: {
              'tv-date-validation': {
                title: 'Valider la date de la visite technique',
                instructions: 'Lorem ipsum dolor',
                // screenName: 'CreateTask',
                // screenParams: { TaskId: '' },
                type: 'manual',                                                                                                                    //##ask: is it manual or auto -> if manual.. does it require a defined responsable to handle it ?
                responsable: '', //Define responsable of validating date
              },
              //other actions...
            }
          },
          //other steps...
        }
      }
    }

    db.collection('Process').doc('processModel-1').set(process)
  }


  render() {
    let persistor = persistStore(Store)
    // persistor.purge()

    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <PaperProvider theme={paperTheme}>
            <MenuProvider>
              <Wrapper>
                <RootController />
                {/* <Test /> */}
              </Wrapper>
            </MenuProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    )
  }
}


console.disableYellowBox = true;

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
    // },
    // 'address': {
    //   id: 'address',
    //   title: 'Adresse postale',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // },
    // 'phone': {
    //   id: 'phone',
    //   title: 'Numéro de téléphone',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // },
    // 'comment': {
    //   id: 'comment',
    //   title: 'Commentaire',
    //   instructions: 'Lorem ipsum dolor',
    //   screenName: 'Profile',
    //   screenParams: { userId: '', isClient: true },
    //   type: 'auto',
    //   responsable: '',
    // },