import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '@react-native-firebase/app'

import Menu from './Menu'
import CustomIcon from './CustomIcon'
import { faParkingCircle } from '@fortawesome/pro-light-svg-icons'

import * as theme from '../core/theme'
import { constants } from '../core/constants'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

const db = firebase.firestore()

const NotificationItem = ({ notification, ...props }) => {

    const setLeftIcon = (topic) => {
        switch (topic) {
            case 'projects':
                return (
                    <View style={styles.leftIcon}>
                        <CustomIcon icon={faParkingCircle} />
                    </View>
                )
        }
    }

    //menu config
    const options = [
        { id: 0, title: 'Archiver' },
    ]

    const functions = [
        () => db.collection('Users').doc(firebase.auth().currentUser.uid)
            .collection('Notifications').doc(notification.id).update({ deleted: true }),
    ]

    return (
        <View style={[styles.container, { backgroundColor: notification.read ? theme.colors.white : '#DCEDC8' }]}>

            {setLeftIcon(notification.topic)}

            <View style={styles.content}>

                <View style={{ flex: 1 }}>
                    <Text style={[theme.robotoMedium.body]} numberOfLines={1}>{notification.title}</Text>
                    <Text style={[theme.robotoRegular.caption]} numberOfLines={3}>{notification.body}</Text>
                    <Text style={[theme.robotoRegular.caption, { color: theme.colors.gray_dark }]}>{moment(notification.sentAt).format('LLL')}</Text>
                </View>

                {/* #task:  use the menu component */}
                {/* <View style={{ flex: 0.15, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Menu options={options} functions={functions} />
                </View> */}

            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'pink'
    },
    leftIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.gray_light,
        borderWidth: StyleSheet.hairlineWidth,
        width: 50,
        height: 50,
        borderRadius: 25,
        elevation: 1
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 0,
    },
})

export default NotificationItem
