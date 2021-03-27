import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { List } from 'react-native-paper';
import { faBell } from '@fortawesome/pro-light-svg-icons'

import firebase from '@react-native-firebase/app'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'

import Background from '../../components/NewBackground'
import ListSubHeader from '../../components/ListSubHeader'
import NotificationItem from '../../components/NotificationItem'
import EmptyList from '../../components/EmptyList'
import MyFAB from '../../components/MyFAB'

import { fetchDocs } from "../../api/firestore-api";
import { myAlert } from "../../core/utils";

import { withNavigation } from 'react-navigation'

const db = firebase.firestore()

class ListNotifications extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)
        this.myAlert = myAlert.bind(this)
        this.markAsReadAndNavigate = this.markAsReadAndNavigate.bind(this)
        this.currentUser = firebase.auth().currentUser

        this.state = {
            notificationsList: [],
            notificationsCount: 0,
        }
    }

    async componentDidMount() {
        let query = db.collection('Users').doc(this.currentUser.uid).collection('Notifications').where('deleted', '==', false).orderBy('sentAt', 'desc')
        this.fetchDocs(query, 'notificationsList', 'notificationsCount', () => { })
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
        const params = notification.navigation
        const screen = params.screen

        if (!notification.read) {
            await db.collection('Users').doc(this.currentUser.uid).collection('Notifications').doc(notification.id).update({ read: true })
        }

        this.props.navigation.navigate(screen, params) //generic form
    }


    render() {
        let { notificationsCount } = this.state
        const s = notificationsCount > 1 ? 's' : ''

        return (
            <Background style={styles.container}>
                <ListSubHeader style={{ marginBottom: 10 }}>{notificationsCount} notification{s}</ListSubHeader>

                {notificationsCount > 0 ?
                    <FlatList
                        style={styles.root}
                        contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.1 }}
                        data={this.state.notificationsList}
                        extraData={this.state}
                        keyExtractor={(item) => { return item.id }}
                        renderItem={(item) => this.renderNotification(item.item)}
                    />
                    :
                    <EmptyList icon={faBell} iconColor={theme.colors.miInbox} header='Notifications' description='Aucune notification pour le moment.' offLine={this.props.offLine} />
                }
            </Background >
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    root: {
        //  marginTop: 10,
        zIndex: 1,
        paddingHorizontal: theme.padding,
        backgroundColor: "#ffffff",
    }
})


export default withNavigation(ListNotifications)