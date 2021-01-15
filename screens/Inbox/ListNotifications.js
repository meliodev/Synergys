import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { List } from 'react-native-paper';

import firebase from '@react-native-firebase/app'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'

import NotificationItem from '../../components/NotificationItem'
import MyFAB from '../../components/MyFAB'

import { fetchDocs } from "../../api/firestore-api";
import { myAlert } from "../../core/utils";

import { withNavigation } from 'react-navigation'

const db = firebase.firestore()

class ListNotifications extends Component {
    constructor(props) {
        super(props)
        this.myAlert = myAlert.bind(this)
        this.markAsReadAndNavigate = this.markAsReadAndNavigate.bind(this)
        this.currentUser = firebase.auth().currentUser

        this.state = {
            notificationsList: [],
            notificationsCount: 0,
        }
    }

    async componentDidMount() {
        let query = db.collection('Users').doc(this.currentUser.uid).collection('Notifications').where('deleted', '==', false).orderBy('sentAt', 'asc')
        await fetchDocs(this, query, 'notificationsList', 'notificationsCount', () => { })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    renderNotification(item) {
        const notification = item

        return (
            <TouchableOpacity onPress={() => this.markAsReadAndNavigate(notification)}>
                <NotificationItem notification={notification} />
            </TouchableOpacity>
        )
    }

    markAsReadAndNavigate = async (notification) => {
        const { screen, params } = notification.navigation

        if (!notification.read) {
            await db.collection('Users').doc(this.currentUser.uid).collection('Notifications').doc(notification.id).update({ read: true })
        }

        this.props.navigation.navigate(screen, params) //generic form
    }


    render() {
        let { notificationsCount } = this.state

        let s = ''
        if (notificationsCount > 1)
            s = 's'

        return (
            <View style={styles.container}>
                <List.Subheader>{notificationsCount} notification{s}</List.Subheader>
                <FlatList
                    style={styles.root}
                    contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.1 }}
                    data={this.state.notificationsList}
                    extraData={this.state}
                    keyExtractor={(item) => { return item.id }}
                    renderItem={(item) => this.renderNotification(item.item)}
                />
            </View >
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    root: {
        backgroundColor: "#fff",
    }
})


export default withNavigation(ListNotifications)