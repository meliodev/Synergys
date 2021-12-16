import React, { Component } from 'react'
import { LogBox, StyleSheet, Text } from 'react-native'
import notifee, { AndroidImportance } from '@notifee/react-native'
import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen'
import codePush from 'react-native-code-push'
import { SafeAreaView } from 'react-native-safe-area-context'

import AppToast from './components/global/AppToast'
import Wrapper from './Wrapper'
import RootController from './Navigation/DrawerNavigator'

import firebase, { remoteConfig } from './firebase'
import Store from './Store/configureStore'
import { fontsConfig } from '../fontConfig'
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
                <SafeAreaView style={styles.safeviewArea}>
                  <RootController />
                  <AppToast />
                </SafeAreaView>
              </Wrapper>
            </MenuProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    )
  }
}

LogBox.ignoreAllLogs(true)

const styles = StyleSheet.create({
  safeviewArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
}

export default codePush(codePushOptions)(App)
//export default App