import React, { Component } from 'react'
import { LogBox, Text } from 'react-native'
import notifee, { AndroidImportance } from '@notifee/react-native'
import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen'
import codePush from 'react-native-code-push'

import AppToast from './components/global/AppToast'
import PdfGen from './PdfGen'
import Wrapper from './Wrapper'
import RootController from './Navigation/DrawerNavigator'

import firebase, { remoteConfig } from './firebase'
import Store from './Store/configureStore'
import { fontsConfig } from './fontConfig'
import * as theme from './core/theme'

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
    SplashScreen.hide()

  //  await this.initRemoteConfig()

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

  async initRemoteConfig() {
    await remoteConfig.setDefaults({ minAppVersion: '1.2.10', latestAppDownloadLink: "" })
    const fetchedRemotely = await remoteConfig.fetchAndActivate()
    await remoteConfig.fetch(60)


    if (fetchedRemotely) {
      console.log('Configs were retrieved from the backend and activated.');
    }
    else {
      console.log('No configs were fetched from the backend, and the local configs were already activated',)
    }
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
                <AppToast />
              </Wrapper>
            </MenuProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    )
  }
}

LogBox.ignoreAllLogs(true)


const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 10 * 60 // 10 minutes
}

export default codePush(codePushOptions)(App)
//export default App