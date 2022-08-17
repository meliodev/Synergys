/**
 * @format
 */

import React from "react"
 import { AppRegistry, Platform, Text } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import notifee, { AndroidImportance } from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging'

//Background & quit state: messages listener   
async function onBackgroundMessageReceived(message) {
    const channelId = await notifee.createChannel({
        id: 'projects',
        name: 'projects',
        lights: false,
        vibration: true,
        importance: AndroidImportance.HIGH,
    })
    await notifee.displayNotification(JSON.parse(message.data.notifee))
}

messaging().setBackgroundMessageHandler(onBackgroundMessageReceived)


AppRegistry.registerComponent(Platform.OS === "ios" ? 'AsanaWorld' : appName, () => gestureHandlerRootHOC(App));