import React, { Component } from 'react'
import { Button, Dimensions } from 'react-native'
import notifee, { EventType, AndroidImportance } from '@notifee/react-native'

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import '@react-native-firebase/functions'
import '@react-native-firebase/messaging'

import { Provider } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu';
import Store from './Store/configureStore'

import RootController from './Navigation/DrawerNavigator'
import CustomClaims from './api/CustomClaims'

import Video from './VideoPlayer'

const db = firebase.firestore()

class App extends Component {

  componentDidMount() {
    this.foregroundMessages = firebase.messaging().onMessage(this.onForegroundMessageReceived)
  }

  //Forground state: messages listener
  async onForegroundMessageReceived(message) {
    const channelId = await notifee.createChannel({
      id: 'projects',
      name: 'projects',
      lights: false,
      vibration: true,
      importance: AndroidImportance.DEFAULT,
    })

    await notifee.displayNotification(JSON.parse(message.data.notifee))
  }

  componentWillUnmount() {
    this.foregroundMessages()
  }

  render() {
    return (
      <Provider store={Store}>
        <MenuProvider>
          {/* <Video /> */}
          <RootController />
        </MenuProvider>
      </Provider>
    )
  }
}

console.disableYellowBox = true;

export default App;

















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


