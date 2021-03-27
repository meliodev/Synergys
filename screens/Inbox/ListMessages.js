import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList, Text } from 'react-native'
import { List } from 'react-native-paper';
import { withNavigation } from 'react-navigation'
import firebase from '@react-native-firebase/app'
import { faPen, faEnvelope } from '@fortawesome/pro-light-svg-icons'

import Background from '../../components/NewBackground'
import ListSubHeader from '../../components/ListSubHeader'
import MessageItem from '../../components/MessageItem'
import MyFAB from '../../components/MyFAB'
import EmptyList from '../../components/EmptyList'

import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { configureQuery } from '../../core/privileges'

import { fetchDocs } from "../../api/firestore-api";

const db = firebase.firestore()

class ListMessages extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)
        this.markAsReadAndNavigate = this.markAsReadAndNavigate.bind(this)
        this.currentUser = firebase.auth().currentUser

        this.state = {
            messagesList: [],
            messagesCount: 0,
        }
    }

    async componentDidMount() {

        const { queryFilters } = this.props.permissions
        if (queryFilters === []) this.setState({ messagesList: [], messagesCount: 0 })
        else {
            const params = { role: this.props.role.value }
            const query = configureQuery('Messages', queryFilters, params)
            this.fetchDocs(query, 'messagesList', 'messagesCount', () => { })
        }

        //  const query = db.collection('Messages').where('subscribers', 'array-contains', this.currentUser.uid).orderBy('sentAt', 'desc')
        // this.fetchDocs(query, 'messagesList', 'messagesCount', () => { })
    }


    renderMessage(item) {
        const message = item.item

        return (
            <TouchableOpacity onPress={() => this.markAsReadAndNavigate(message)}>
                <MessageItem message={message} />
            </TouchableOpacity>
        )
    }

    markAsReadAndNavigate = async (message) => {
        let haveRead = message.haveRead.find((id) => id === this.currentUser.uid)

        if (!haveRead) {
            let usersHaveRead = message.haveRead
            usersHaveRead = usersHaveRead.concat([this.currentUser.uid])
            await db.collection('Messages').doc(message.id).update({ haveRead: usersHaveRead })
        }

        this.props.navigation.navigate('ViewMessage', { message: message })
    }


    render() {
        let { messagesCount } = this.state

        const s = messagesCount > 1 ? 's' : ''

        return (
            <Background style={styles.container}>
                <ListSubHeader>{messagesCount} message{s}</ListSubHeader>

                {messagesCount > 0 ?
                    < FlatList
                        style={styles.root}
                        contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.1 }}
                        data={this.state.messagesList}
                        extraData={this.state}
                        keyExtractor={(item) => { return item.id }}
                        renderItem={(item) => this.renderMessage(item)}
                    />
                    :
                    <EmptyList icon={faEnvelope} iconColor={theme.colors.miInbox} header='Messages' description="Aucun message pour le moment." offLine={this.props.offLine} />
                }
                <MyFAB icon={faPen} onPress={() => this.props.navigation.navigate('NewMessage')} />
            </Background >
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    root: {
        zIndex: 1,
        backgroundColor: "#fff",
    }
})



const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default withNavigation(ListMessages)
