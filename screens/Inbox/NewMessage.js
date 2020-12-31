import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { List, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'react-native-firebase'


import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import ImagePicker from 'react-native-image-picker'
import FilePickerManager from 'react-native-file-picker';


import Appbar from '../../components/Appbar'
import TextInput from '../../components/TextInput'
import { TextInput as MessageInput } from 'react-native'
// import { TextInput as MessageInput } from 'react-native-paper'
import AutoCompleteUsers from '../../components/AutoCompleteUsers'

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { load, setToast, updateField } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api';

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import DocumentPicker from 'react-native-document-picker';
import { ThemeColors } from 'react-navigation';

const db = firebase.firestore()
const reference = firebase.storage().ref()

export default class Message extends Component {
    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.title = ''
        this.isReply = this.props.navigation.getParam('isReply', false)
        this.messageGroupeId = this.props.navigation.getParam('messageGroupeId', false)
        this.tagsSelected = this.props.navigation.getParam('tagsSelected', [])

        if (this.isReply)
            this.title = 'Répondre'
        else
            this.title = 'Nouveau message'

        this.state = {
            tagsSelected: [],
            suggestions: 0,
            subject: { value: "", error: "" },
            message: { value: "", error: "" },
            messagesCount: 0,

            selectedMessage: {},
            oldMessages: [],
            previousFollowers: [],
            accordionExpanded: true,

            attachments: [], //attachments picked
            attachedFiles: [], //already attached: Stored on Firebase storage

            loading: false,
            error: "",
        }
    }

    async componentDidMount() {
        if (this.isReply)
            await this.replyInitializaton()

        await this.fetchSuggestions()
    }

    async fetchSuggestions() {
        let query = db.collection('Users')
        await fetchDocs(this, query, 'suggestions', '', () => { })
    }


    async replyInitializaton() {
        console.log('reply initialization...')
        let { tagsSelected, subject, selectedMessage, oldMessages, previousFollowers } = this.state
        tagsSelected = this.tagsSelected
        subject.value = 'RE: ' + this.props.navigation.getParam('subject', '')
        selectedMessage = this.props.navigation.getParam('selectedMessage', {})
        oldMessages = this.props.navigation.getParam('oldMessages', [])
        previousFollowers = this.props.navigation.getParam('followers', [])
        await this.setState({ tagsSelected, subject, selectedMessage, oldMessages, previousFollowers })
    }

    renderOldMessages() {
        let { selectedMessage, oldMessages } = this.state


        return (
            <View style={{ marginBottom: 15, marginLeft: constants.ScreenWidth * 0.045 }}>
                <View>
                    {oldMessages.map((msg, key) => {
                        let sentAtDate = moment(msg.sentAt).format('ll')
                        let sentAtTime = moment(msg.sentAt).format('LT')
                        let sender = msg.sender.fullName
                        let message = msg.message

                        return (
                            <View style={{ borderLeftWidth: 1, borderLeftColor: theme.colors.gray2, marginLeft: key * 5, marginBottom: 5 }}>
                                <MessageInput
                                    style={styles.messageInput}
                                    underlineColor="transparent"
                                    returnKeyType="done"
                                    value={'Le ' + sentAtDate + ' à ' + sentAtTime + ' \n ' + sender + ' a écrit : ' + '\n ' + message}
                                    onChangeText={text => {
                                        let updatedOldMessages = oldMessages
                                        oldMessages.splice(key, 1)
                                        this.setState({ oldMessages: updatedOldMessages })
                                    }}
                                    multiline={true}
                                    theme={{ colors: { primary: '#fff', text: '#333' } }}
                                    selectionColor='#333'
                                    editable={!this.state.loading}
                                />
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }


    //PICKER
    async pickDocs() {
        let attachments = this.state.attachments

        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            })

            var file

            for (const res of results) {
                let fileCopied = false
                let i = 0

                if (res.uri.startsWith('content://')) {
                    const uriComponents = res.uri.split('/')
                    const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                    const destPath = `${RNFS.TemporaryDirectoryPath}/${'temporaryDoc'}${Date.now()}${i}`

                    fileCopied = await RNFS.copyFile(res.uri, destPath)
                        .then(() => { return true })
                        .catch((e) => setToast(this, 'e', 'Erreur de séléction de pièce jointe, veuillez réessayer'))

                    if (fileCopied) {
                        const document = {
                            path: destPath,
                            type: 'application/pdf',
                            name: res.name,
                            size: res.size,
                            progress: 0
                        }

                        attachments.push(document)
                        this.setState({ attachments })
                    }
                }

                fileCopied = false
                i = i + 1
            }
        }
        catch (err) {
            if (DocumentPicker.isCancel(err))
                console.log('User has canceled picker')
            else
                alert('Erreur lors de la séléction de fichier(s)')
        }
    }

    async uploadFiles() {
        const promises = []
        const files = this.state.attachments
        let attachedFiles = []
        console.log('2')

        for (let i = 0; i < files.length; i++) {

            console.log('3')
            const reference = firebase.storage().ref('/Inbox/Messages/' + files[i].name)
            const uploadTask = reference.putFile(files[i].path)

            promises.push(uploadTask) //Use batch instead

            uploadTask.on('state_changed', async function (snapshot) {
                var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                console.log('Upload file ' + i + ': ' + progress + '% done')
                files[i].progress = progress / 100
                this.setState({ files })
            }.bind(this))

            uploadTask.then(() => console.log('task ' + i + ' finished'))

        }

        console.log('4')

        return await Promise.all(promises)
            .then(async (result) => {
                console.log(result)
                console.log('4-1')

                attachedFiles = result.map((res) => ({ downloadURL: res.downloadURL, name: res.metadata.name, size: res.metadata.size, contentType: res.metadata.contentType }))

                console.log('4-2')
                this.setState({ attachedFiles }, () => { console.log(this.state.attachedFiles) })

                console.log('5')

                console.log('ALL FILES ARE UPLOADED')
                return true
            })
            .catch(err => {
                load(this, false)
                setToast(this, 'e', "Erreur lors de l'eportation des piéces jointes, veuillez réessayer.")
            })
    }

    renderAttachments() {
        let { attachments, loading } = this.state

        return attachments.map((document, key) => {
            let icon = ''
            let color = ''

            switch (document.type) {
                case 'application/pdf': {
                    icon = 'pdf-box'
                    color = '#da251b'
                }
                    break

                case 'application/msword': {
                    icon = 'file-word-box'
                    color = '#295699'
                }
                    break

                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                    icon = 'file-word-box'
                    color = '#295699'
                }
                    break

                case 'image/jpeg': {
                    icon = 'image'
                    color = theme.colors.primary
                }
                    break

                case 'image/png': {
                    icon = 'image'
                    color = theme.colors.primary
                }
                    break

                case 'application/zip':
                    icon = 'zip'
                    break

                default:
                    break
            }

            let readableSize = document.size / 1000
            readableSize = readableSize.toFixed(2)

            return (
                <View style={{ flex: 1, elevation: 1, backgroundColor: theme.colors.gray50, width: '100%', borderRadius: 5, marginBottom: 5 }}>
                    <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.17, justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={icon} size={24} color={color} />
                        </View>

                        <View style={{ flex: 0.68 }}>
                            <Text numberOfLines={1} ellipsizeMode='middle' style={[theme.customFontMSmedium.body]}>{document.name}</Text>
                            <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>{readableSize} KB</Text>
                        </View>

                        <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                            {!loading && <MaterialCommunityIcons
                                name='close'
                                size={21}
                                color={theme.colors.placeholder}
                                style={{ paddingVertical: 19, paddingHorizontal: 5 }}
                                onPress={() => {
                                    attachments.splice(key, 1)
                                    this.setState({ attachments })
                                }}
                            />}
                        </View>
                    </View>
                    <View style={{ flex: 0.1, justifyContent: 'flex-end' }}>
                        <ProgressBar progress={document.progress} color={theme.colors.primary} visible={true} />
                    </View>
                </View>
            )
        })
    }

    handleSend = async () => {

        //1. Validate inputs
        //this.validateInputs()

        if (loading) return
        load(this, true)
        this.title = 'Envoie du message...'

        //2. UPLOADING FILES: #task: delete all uploaded files in case one of them fails to upload.
        console.log('1')
        if (this.state.attachments.length > 0) {
            // await this.uploadFiles()
            const filesUploaded = await this.uploadFiles()
            console.log('filesUploaded: ' + filesUploaded)
            if (!filesUploaded) return
        }

        console.log('6')

        //3. ADDING MESSAGE DOCUMENT
        let { error, loading } = this.state
        let { tagsSelected, subject, message, messagesCount, oldMessages, previousFollowers, attachedFiles } = this.state

        //Sender of this message
        let sender = { id: this.currentUser.uid, fullName: this.currentUser.displayName }

        //Receivers of this message
        const receivers = tagsSelected.map((tag) => {
            return { id: tag.id, fullName: tag.fullName }
        })

        //Speakers: Sender & receivers of this message
        let speakers = receivers.concat([{ id: this.currentUser.uid, fullName: this.currentUser.displayName }])

        //UNION: concat previous followers and new followers (if there is new ones)
        let followers = speakers.map(speaker => speaker.id)
        followers = followers.concat(previousFollowers)
        followers = [...new Set([...followers, ...previousFollowers])]

        //Initialize haveRead list: currentUser + followers who will not receive this message
        const receiversId = receivers.map((receiver) => receiver.id)
        let nonReceivers = followers.filter(f => !receiversId.includes(f))
        let haveRead = [this.currentUser.uid]
        haveRead = haveRead.concat(nonReceivers)

        //set oldMessages
        oldMessages = oldMessages.filter((msg) => msg !== '')

        let latestMessage = {
            sender: sender,
            receivers: receivers, // receivers of the last message
            //speakers: speakers, //sender + receivers
            followers: followers, //sender + receivers IDs // accumulation: ALL users involved in the discussion
            mainSubject: subject.value,
            message: message.value,
            sentAt: moment().format('lll'),
            messagesCount: messagesCount + 1,
            haveRead: haveRead //Add followers who are not receivers of this message (followers - receivers)
        }

        // if (!this.isReply)
        //     latestMessage.mainSubject = subject.value

        let msg = {
            sender: sender,
            receivers: receivers,
            speakers: speakers, //sender + receivers of the current message
            //followers: followers, //sender + receivers IDs
            subject: subject.value,
            message: message.value,
            sentAt: moment().format('lll'),

            oldMessages: oldMessages,

            attachments: this.state.attachedFiles
        }

        console.log('Ready to send message...')

        if (this.isReply)
            await this.sendReply(latestMessage, msg)

        else
            await this.sendNewMessage(latestMessage, msg)

        this.props.navigation.goBack()
    }

    async sendReply(latestMessage, msg) {
        await db.collection('Messages').doc(this.messageGroupeId).collection('AllMessages').add(msg)
            .then((docRef) => db.collection('Messages').doc(this.messageGroupeId).set(latestMessage, { merge: true }))
            .then(() => {
                load(this, false)
                setToast(this, 'i', 'Message envoyé !')
            })
            .catch((e) => {
                load(this, false)
                setToast(this, 'e', 'Erreur de connection avec la Base de données')
            })
    }

    async sendNewMessage(latestMessage, msg) {
        await db.collection('Messages').add(latestMessage)
            .then((docRef1) => db.collection('Messages').doc(docRef1.id).collection('AllMessages').add(msg))
            .then(() => {
                load(this, false)
                setToast(this, 'i', 'Message envoyé !')
            })
            .catch((e) => {
                load(this, false)
                setToast(this, 'e', 'Erreur de connection avec la Base de données')
            })
    }

    render() {
        let { subject, message, suggestions, tagsSelected, accordionExpanded, oldMessages, loading } = this.state

        return (
            <View style={styles.container}>
                <Appbar back close title titleText={this.title} send={!loading} handleSend={this.handleSend} attach={!loading} handleAttachement={this.pickDocs.bind(this)} />
                <ScrollView style={styles.form}>

                    <View style={{ flexDirection: 'row', marginBottom: constants.ScreenHeight*0.01 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>De         </Text>
                            <Text>{this.currentUser.displayName}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginTop: 10 }}>À         </Text>
                        <AutoCompleteUsers
                            suggestions={suggestions}
                            tagsSelected={tagsSelected}
                            main={this}
                            placeholder="Ajouter un destinataire"
                            autoFocus={false}
                            showInput={true}
                            editable={!loading}
                        />

                        <Icon style={{ marginTop: 10 }} name='chevron-down' size={15} color={theme.colors.placeholder} />
                    </View>

                    <TextInput
                        label="Sujet"
                        returnKeyType="done"
                        value={subject.value}
                        onChangeText={text => updateField(this, subject, text)}
                        error={!!subject.error}
                        errorText={subject.error}
                        editable={!this.isReply && !loading}
                        style= {{marginTop: 15}}
                    />

                    <View style={{ flex: 1, backgroundColor: '#fff', elevation: 0 }}>
                        <MessageInput
                            // label="Message"
                            ref={ref => { this.messageInputRef = ref }}
                            placeholder='Rédigez votre message'
                            underlineColor="transparent"
                            returnKeyType="done"
                            value={message.value}
                            onChangeText={text => updateField(this, message, text)}
                            error={!!message.error}
                            errorText={message.error}
                            multiline={true}
                            theme={{ colors: { primary: '#fff', text: '#333' } }}
                            selectionColor='#333'
                            style={styles.messageInput}
                            editable={!loading}
                        //autoFocus={this.isReply}
                        />

                        <View style={{ paddingTop: 30 }}>
                            {this.renderAttachments()}
                        </View>

                        {this.isReply && oldMessages.length > 0 &&
                            <List.Accordion
                                id={message.id}
                                expanded={accordionExpanded}
                                onPress={() => this.setState({ accordionExpanded: !accordionExpanded })}
                                //style={{ paddingVertical: constants.ScreenHeight * 0.03, borderBottomWidth: !isExpanded ? StyleSheet.hairlineWidth * 0.5 : 0, borderBottomColor: theme.colors.gray2 }}
                                titleComponent={<Text style={[theme.customFontMSbold.h1, { color: theme.colors.primary }]}>...</Text>}
                                arrowColor={theme.colors.primary}
                                // description={message.message}
                                theme={{ colors: { primary: '#333' } }}
                                style={{ marginLeft: - constants.ScreenWidth * 0.04 }}
                            >

                                {this.renderOldMessages()}

                            </List.Accordion>
                        }
                    </View>

                    {!accordionExpanded &&
                        <TouchableOpacity style={{ width: '100%', height: 300 }} onPress={() => this.messageInputRef.focus()} />
                    }

                </ScrollView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 15,
        backgroundColor: theme.colors.background
    },
    form: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        paddingTop: 30,
        paddingBottom: 15
    },
    messageInput: {
        width: "100%",
        //alignSelf: 'center',
        backgroundColor: 'transparent',
        //textAlign: 'center',
        paddingVertical: 0,
    },
});