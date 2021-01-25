import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { List, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from '@react-native-firebase/app'
import RNFS from 'react-native-fs'

import Appbar from '../../components/Appbar'
import TextInput from '../../components/TextInput'
import { TextInput as MessageInput } from 'react-native'
import AutoCompleteUsers from '../../components/AutoCompleteUsers'
import UploadProgress from '../../components/UploadProgress'
import Toast from '../../components/Toast'

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { load, setToast, updateField, setAttachmentIcon, nameValidator } from '../../core/utils'

import { fetchDocs } from '../../api/firestore-api';
import { uploadFiles } from '../../api/storage-api';

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import DocumentPicker from 'react-native-document-picker';

const db = firebase.firestore()

export default class Message extends Component {
    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.title = ''
        this.isReply = this.props.navigation.getParam('isReply', false)
        this.messageGroupeId = this.props.navigation.getParam('messageGroupeId', false)
        this.tagsSelected = this.props.navigation.getParam('tagsSelected', [])

        this.uploadFiles = uploadFiles.bind(this)

        if (this.isReply)
            this.title = 'Répondre'
        else
            this.title = 'Nouveau message'

        this.state = {
            tagsSelected: [],
            suggestions: [],
            subject: { value: "", error: "" },
            message: { value: "", error: "" },
            messagesCount: 0,

            oldMessages: [],
            previousSubscribers: [],
            accordionExpanded: true,

            attachments: [], //attachments picked
            attachedFiles: [], //already attached: Stored on Firebase storage

            loading: false,
            error: "",
            toastType: '',
            toastMessage: ''
        }
    }

    async componentDidMount() {
        if (this.isReply)
            await this.replyInitializaton()

        this.fetchSuggestions()
    }

    fetchSuggestions() {
        const query = db.collection('Users')
        fetchDocs(this, query, 'suggestions', '', () => { })
    }

    replyInitializaton() {
        let { tagsSelected, subject, oldMessages, previousSubscribers } = this.state
        tagsSelected = this.tagsSelected
        subject.value = 'RE: ' + this.props.navigation.getParam('subject', '')
        oldMessages = this.props.navigation.getParam('oldMessages', [])
        previousSubscribers = this.props.navigation.getParam('subscribers', [])
        this.setState({ tagsSelected, subject, oldMessages, previousSubscribers })
    }

    renderOldMessages() {
        let { oldMessages, loading } = this.state

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
                                        oldMessages.splice(key, 1)
                                        this.setState({ oldMessages })
                                    }}
                                    multiline={true}
                                    theme={{ colors: { primary: '#fff', text: '#333' } }}
                                    selectionColor='#333'
                                    editable={!loading}
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
        let { attachments } = this.state

        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            })

            for (const res of results) {
                let fileCopied = false
                let i = 0

                console.log(results)

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
                            type: res.type,
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
                Alert.alert('Erreur lors de la séléction de fichier(s)')
        }
    }

    // async uploadFiles() {
    //     const promises = []
    //     const files = this.state.attachments
    //     const reference = firebase.storage().ref('/Inbox/Messages/')
    //     let attachedFiles = []
    //     console.log('2')

    //     for (let i = 0; i < files.length; i++) {

    //         console.log('3')
    //         const referenceFile = reference.child(files[i].name)
    //         const uploadTask = referenceFile.putFile(files[i].path)
    //         promises.push(uploadTask)

    //         uploadTask.on('state_changed', async function (snapshot) {
    //             var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    //             console.log('Upload file ' + i + ': ' + progress + '% done')
    //             files[i].progress = progress / 100
    //             this.setState({ files })
    //         }.bind(this))

    //         uploadTask.then(() => console.log('task ' + i + ' finished'))
    //     }

    //     console.log('4')

    //     return await Promise.all(promises)
    //         .then(async (results) => {

    //             for (let i = 0; i < results.length; i++) {
    //                 const downloadURL = await reference.child(files[i].name).getDownloadURL()
    //                 const { name, size, contentType } = results[i].metadata
    //                 const attachedFile = { downloadURL, name, size, contentType }
    //                 attachedFiles.push(attachedFile)
    //             }

    //             this.setState({ attachedFiles })

    //             console.log('5')
    //             console.log('ALL FILES ARE UPLOADED')
    //             return true
    //         })
    //         .catch(err => {
    //             load(this, false)
    //             console.error(err)
    //             setToast(this, 'e', "Erreur lors de l'eportation des piéces jointes, veuillez réessayer.")
    //         })
    // }

    renderAttachments() {
        let { attachments, loading } = this.state

        return attachments.map((document, key) => {
            return <UploadProgress
                attachment={document}
                showRightIcon
                rightIcon={
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
                    </View>}
            />
        })
    }

    validateInputs() {
        let { tagsSelected, subject, message } = this.state

        let tagsSelectedError = tagsSelected.length === 0 ? 'Aucun destinataire selectionné' : ''
        let subjectError = nameValidator(subject.value, '"Sujet"')
        let messageError = nameValidator(message.value, '"Message"')

        if (tagsSelectedError || subjectError || messageError) {
            Keyboard.dismiss()
            load(this, false)
            const error = tagsSelectedError || subjectError || messageError
            setToast(this, 'e', error)

            return false
        }

        return true
    }

    handleSend = async () => {
        const { loading, attachments } = this.state
        if (loading) return
        load(this, true)

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        this.title = 'Envoie du message...'

        //2. UPLOADING FILES: #task: delete all uploaded files in case one of them fails to upload.
        if (attachments.length > 0) {
            const reference = firebase.storage().ref('/Inbox/Messages/')
            const filesUploaded = await this.uploadFiles(attachments, reference, this.state.attachedFiles)
            if (!filesUploaded) return
        }

        //3. ADDING MESSAGE DOCUMENT
        let { tagsSelected, subject, message, messagesCount, oldMessages, previousSubscribers, attachedFiles } = this.state

        //Sender of this message
        let sender = { id: this.currentUser.uid, fullName: this.currentUser.displayName }

        //Receivers of this message
        const receivers = tagsSelected.map((tag) => {
            return { id: tag.id, fullName: tag.fullName }
        })

        //Speakers: Sender & receivers of this message
        let speakers = receivers.concat([{ id: this.currentUser.uid, fullName: this.currentUser.displayName }])

        //UNION: concat previous subscribers and new subscribers (if there is new ones)
        let subscribers = speakers.map(speaker => speaker.id)
        subscribers = subscribers.concat(previousSubscribers)
        subscribers = [...new Set([...subscribers, ...previousSubscribers])]

        //Initialize haveRead list: currentUser + subscribers who will not receive this message
        const receiversId = receivers.map((receiver) => receiver.id)
        let nonReceivers = subscribers.filter(f => !receiversId.includes(f))
        let haveRead = [this.currentUser.uid]
        haveRead = haveRead.concat(nonReceivers)

        //set oldMessages
        oldMessages = oldMessages.filter((msg) => msg !== '')

        const latestMessage = {
            sender: sender,
            receivers: receivers, // receivers of the last message
            //speakers: speakers, //sender + receivers
            subscribers: subscribers, //sender + receivers IDs // accumulation: ALL users involved in the discussion
            mainSubject: subject.value,
            message: message.value,
            sentAt: moment().format('lll'),
            messagesCount: messagesCount + 1,
            haveRead: haveRead //Add subscribers who are not receivers of this message (subscribers - receivers)
        }

        // if (!this.isReply)
        //     latestMessage.mainSubject = subject.value

        const msg = {
            sender: sender,
            receivers: receivers,
            speakers: speakers, //sender + receivers of the current message
            //subscribers: subscribers, //sender + receivers IDs
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

    async sendNewMessage(latestMessage, msg) {
        try {
            const docRef = await db.collection('Messages').add(latestMessage)
            await db.collection('Messages').doc(docRef.id).collection('AllMessages').add(msg)
            load(this, false)
            setToast(this, 'i', 'Message envoyé !')
        }

        catch (e) {
            load(this, false)
            setToast(this, 'e', 'Erreur de connection avec la Base de données')
        }
    }

    async sendReply(latestMessage, msg) {
        try {
            const docRef = await db.collection('Messages').doc(this.messageGroupeId).collection('AllMessages').add(msg)
            await db.collection('Messages').doc(this.messageGroupeId).set(latestMessage, { merge: true })
            load(this, false)
            setToast(this, 'i', 'Message envoyé !')
        }

        catch (e) {
            load(this, false)
            setToast(this, 'e', 'Erreur de connection avec la Base de données')
        }
    }

    render() {
        let { tagsSelected, subject, message, suggestions, accordionExpanded, oldMessages, loading, toastType, toastMessage } = this.state

        return (
            <View style={styles.container}>
                <Appbar back close title titleText={this.title} send={!loading} handleSend={this.handleSend} attach={!loading} handleAttachement={this.pickDocs.bind(this)} />
                <ScrollView style={styles.form}>

                    <View style={{ flexDirection: 'row', marginBottom: constants.ScreenHeight * 0.01 }}>
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
                        style={{ marginTop: 15 }}
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

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />
            </View >
        )
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