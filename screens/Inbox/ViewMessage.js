

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { List, Headline } from 'react-native-paper'
import { faArrowAltToBottom, faReply, faShare } from '@fortawesome/pro-solid-svg-icons'
import Entypo from 'react-native-vector-icons/Entypo'

import firebase, { db, functions } from '../../firebase'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { downloadFile, setToast, load } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import Button from '../../components/Button'
import UploadProgress from '../../components/UploadProgress'
import CustomIcon from '../../components/CustomIcon'
import Toast from '../../components/Toast'

export default class ViewMessage extends Component {

    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.message = this.props.navigation.getParam('message', '')
        this.fetchDocs = fetchDocs.bind(this)

        this.state = {
            messagesList: [],
            messagesCount: 0,
            expandedId: '',
            showOldMessages: false,
            toastMessage: '',
            toastType: '',
            loading: true
        }
    }

    componentDidMount() {

        //Static query
        const query = db
            .collection('Messages')
            .doc(this.message.id)
            .collection('AllMessages')
            .where('speakersIds', 'array-contains', this.currentUser.uid)
            .orderBy('sentAt', 'desc')

        this.fetchDocs(query, 'messagesList', 'messagesCount', () => { load(this, false) })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    goToReply(sender, messagesRendered) {
        const tagsSelected = [sender]
        this.setState({ expandedId: '' })
        this.props.navigation.navigate('NewMessage', {
            isReply: true,
            messageGroupeId: this.message.id,
            tagsSelected,
            subject: `RE: ${this.message.mainSubject}`,
            oldMessages: messagesRendered,
            subscribers: this.message.subscribers
        })
    }

    goToReplyAll(speakers, messagesRendered) {
        const allSpeakers = speakers.filter((subscriber) => subscriber.id !== this.currentUser.uid)
        this.setState({ expandedId: '' })
        this.props.navigation.navigate('NewMessage', {
            isReply: true,
            messageGroupeId: this.message.id,
            tagsSelected: allSpeakers,
            subject: `RE: ${this.message.mainSubject}`,
            oldMessages: messagesRendered,
            subscribers: this.message.subscribers
        })
    }

    //renderers
    renderMessage(selectedMessage) {
        const { sender, message, sentAt, oldMessages } = selectedMessage
        const { showOldMessages } = this.state
        const messagesRendered = [{ sender, message, sentAt }].concat(oldMessages)
        const showHideText = showOldMessages ? 'Masquer le texte des messages précédents' : 'Afficher le texte des messages précédents'

        return (
            <View style={{ marginBottom: 15, marginHorizontal: constants.ScreenWidth * 0.045 }}>

                <View>
                    {messagesRendered.map((msg, key) => {

                        const sentAtDate = moment(msg.sentAt).format('ll')
                        const sentAtTime = moment(msg.sentAt).format('LT')

                        return (
                            <View>
                                {key === 0 &&
                                    <View>
                                        <Text style={[theme.customFontMSregular.body, { marginBottom: 20 }]}>{msg.message}</Text>
                                        {messagesRendered.length > 1 && <Text style={[theme.customFontMSregular.caption, { marginBottom: 5, color: theme.colors.primary }]} onPress={showOldMessages => this.setState({ showOldMessages: !this.state.showOldMessages })}>{showHideText}</Text>}
                                    </View>
                                }
                                {key > 0 && showOldMessages &&
                                    <View>
                                        <Text style={theme.customFontMSregular.caption, { color: theme.colors.placeholder, marginTop: 4, marginBottom: 2 }}>Le <Text style={theme.customFontMSregular.body}>{sentAtDate}</Text> à <Text style={theme.customFontMSregular.body}>{sentAtTime}</Text>, <Text style={theme.customFontMSregular.body}>{msg.sender.fullName}</Text> a écrit:</Text>
                                        <Text style={[theme.customFontMSregular.body, { marginBottom: 15 }]}>{msg.message}</Text>
                                    </View>
                                }
                            </View>
                        )
                    })}
                </View>

                {selectedMessage.attachments && this.renderAttachments(selectedMessage.attachments)}

                {/* {selectedMessage.sender.id !== this.currentUser.uid && */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <Button loading={false} mode="outlined" onPress={() => this.goToReply(selectedMessage.sender, messagesRendered)}
                        style={{ width: '39%', alignSelf: 'center' }}>
                        <Text style={[theme.customFontMSregular.body, { color: theme.colors.primary }]}>Répondre</Text>
                    </Button>

                    <Button loading={false} mode="contained" onPress={() => this.goToReplyAll(selectedMessage.speakers, messagesRendered)}
                        style={{ width: '55%', alignSelf: 'center', marginLeft: 5 }}>
                        <Text style={[theme.customFontMSregular.body, { color: theme.colors.white }]}>Répondre à tous</Text>
                    </Button>
                </View>
                {/* } */}

            </View>
        )
    }

    renderAttachments(attachments) {
        return attachments.map((document, key) => {
            const rightIconStyle = { flex: 0.15, justifyContent: 'center', alignItems: 'center' }

            return <UploadProgress
                attachment={document}
                showRightIcon
                showProgress={false}
                rightIcon={
                    <TouchableOpacity style={rightIconStyle} onPress={() => {
                        setToast(this, 'i', 'Début du téléchargement...')
                        downloadFile(document.name, document.downloadURL)
                    }}>
                        <CustomIcon icon={faArrowAltToBottom} color={theme.colors.gray_dark} size={20} />
                    </TouchableOpacity>
                }
            />
        })
    }

    setArrowStyle(message) {
        let arrowStyle = {}

        if (message.sender.id === this.currentUser.uid) {
            arrowStyle.icon = faReply
            arrowStyle.color = theme.colors.primary
        }

        else {
            arrowStyle.icon = faShare
            arrowStyle.color = 'blue'
        }

        return arrowStyle
    }

    renderMessages() {
        const { expandedId, messagesList } = this.state

        return (
            <List.AccordionGroup
                expandedId={expandedId}
                onAccordionPress={(expandedId) => {
                    if (this.state.expandedId === expandedId)
                        this.setState({ expandedId: '', showOldMessages: false })
                    else
                        this.setState({ expandedId })
                }}>

                {messagesList.map((message, key) => {

                    const isExpanded = (expandedId === message.id)
                    const arrowStyle = this.setArrowStyle(message)
                    let receivers = message.receivers.map((receiver) => receiver.fullName)
                    receivers = receivers.join(', ')

                    return (
                        <List.Accordion
                            id={message.id}
                            showArrow
                            style={{ paddingVertical: constants.ScreenHeight * 0.015, borderBottomWidth: !isExpanded ? StyleSheet.hairlineWidth * 2 : 0, borderBottomColor: theme.colors.grey_300 }}
                            titleComponent={
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text numberOfLines={1} style={[theme.customFontMSregular.header, { marginRight: isExpanded ? 3 : 5 }]}>{message.sender.fullName}</Text>
                                    <Text style={[theme.customFontMSregular.caption, { color: theme.colors.placeholder, marginHorizontal: 5, marginTop: 3 }]}>{moment(message.sentAt).format('lll')}</Text>
                                    <CustomIcon icon={arrowStyle.icon} color={arrowStyle.color} size={15} style={{ marginTop: 1, marginLeft: 5 }} />
                                </View>
                            }
                            description={!isExpanded ? message.message : 'à ' + receivers}
                            theme={{ colors: { primary: '#333' } }}
                            titleStyle={theme.customFontMSregular.header}
                            descriptionStyle={theme.customFontMSregular.caption}>

                            {this.renderMessage(message)}

                        </List.Accordion>
                    )
                })
                }

            </List.AccordionGroup>
        )
    }

    render() {
        const { toastMessage, toastType } = this.state

        return (
            <View style={styles.container}>
                <Appbar back title titleText='File des messages' />
                <View style={styles.container}>
                    <Headline style={[theme.customFontMSmedium.h3, { paddingLeft: constants.ScreenWidth * 0.038, marginBottom: 5 }]}>{this.message.mainSubject}</Headline>
                    <ScrollView style={styles.container} >
                        {this.renderMessages()}
                    </ScrollView >
                </View>

                <Toast
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })}
                    containerStyle={{ bottom: 10 }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    content: {
        flex: 1,
        padding: 5,
        paddingTop: 20
    },
})
