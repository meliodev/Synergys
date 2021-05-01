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


import OffLineBar from './components/OffLineBar'
import Test from './components/Test'

import firebase, { db } from './firebase'
import Store from './Store/configureStore'
import { fontsConfig } from './fontConfig'
import * as theme from './core/theme'
import Wrapper from './Wrapper'
import RootController from './Navigation/DrawerNavigator'
import { processModel } from './processModel'
import RNFetchBlob from 'rn-fetch-blob';


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

    const Dir = RNFetchBlob.fs.dirs.DownloadDir
    const path = `${Dir}/Synergys/Documents/Tessst`

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









