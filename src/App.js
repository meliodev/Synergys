import React, { Component } from 'react'
import { LogBox, StatusBar, StyleSheet, Text, View, Dimensions } from 'react-native'
import notifee, { AndroidImportance } from '@notifee/react-native'
import { LineChart } from 'react-native-chart-kit'

import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen'
import codePush from 'react-native-code-push'

import AppToast from './components/global/AppToast'
import NetworkStatus from './NetworkStatus'
import RootController from './Navigation/DrawerNavigator'

import firebase, { crashlytics, remoteConfig } from './firebase'
import Store from './Store/configureStore'
import { fontsConfig } from '../fontConfig'
import * as theme from './core/theme'
import MyStatusBar from './components/MyStatusBar'
import Settings from './screens/Settings/Settings'
import ModalTest from './components/ModalTest'

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
        ////  persistor.purge()

        return (
            <Provider store={Store}>
                <PersistGate persistor={persistor}>
                    <PaperProvider theme={paperTheme}>
                        <MenuProvider>
                            <MyStatusBar>
                                <NetworkStatus>
                                    <RootController />
                                    <AppToast />
                                </NetworkStatus>
                            </MyStatusBar>
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
        flex: 1
    }
})

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.IMMEDIATE,
}


export default codePush(codePushOptions)(App)