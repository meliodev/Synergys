import React, { Component } from 'react'
import { GiftedChat, Bubble, Send, SystemMessage, Day, Actions } from 'react-native-gifted-chat'
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import { IconButton } from 'react-native-paper'
import firebase from '@react-native-firebase/app'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'

import * as theme from '../../core/theme'
import { constants } from '../../core/constants'

import Appbar from '../../components/Appbar'

const db = firebase.firestore()

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.currentUser = firebase.auth().currentUser
        this.fetchMessages = this.fetchMessages.bind(this)
        this.handleSend = this.handleSend.bind(this)
        this.handlePickImage = this.handlePickImage.bind(this)

        this.currentUser = firebase.auth().currentUser
        this.chatId = this.props.navigation.getParam('chatId', '')
        console.log('id ' + this.chatId)
        this.state = {
            messages: [],
            loading: false,
            error: '',
            imageSource: '',
            //imageSource: "https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"
        }

    }

    sendSystemMessage(message) {
        db.collection('Chats').doc(this.chatId)
            .collection('Messages').add({
                text: message,
                createdAt: new Date().getTime(),
                system: true
            })
    }

    componentDidMount() {
        this.fetchMessages()
    }

    fetchMessages() {
        this.messagesListener =
            db.collection('Chats').doc(this.chatId)
                .collection('Messages').orderBy('createdAt', 'desc')
                .onSnapshot(querySnapshot => {
                    const messages = querySnapshot.docs.map(doc => {
                        const firebaseData = doc.data()

                        const data = {
                            id: doc.id,
                            text: '',
                            createdAt: new Date().getTime(),
                            ...firebaseData
                        };

                        if (!firebaseData.system) {
                            data.user = {
                                ...firebaseData.user,
                                name: firebaseData.user.email
                            }
                        }

                        return data;
                    })

                    this.setState({ messages })
                })
    }

    async handleSend(messages) {

        const text = messages[0].text

        const msg = {
            text,
            createdAt: new Date().getTime(),
            user: {
                id: this.currentUser.uid,
                email: this.currentUser.email
            }
        }

        if (this.state.imageSource !== '')
            msg.image = this.state.imageSource

        const latestMsg = {
            latestMessage: {
                text,
                createdAt: new Date().getTime()
            }
        }

        db.collection('Chats').doc(this.chatId).collection('Messages')
            .add(msg)

        await db.collection('Chats').doc(this.chatId)
            .set(latestMsg, { merge: true })

    }

    renderDay(props) {
        return
        <View style={{ flex: 1, backgroundColor: 'green', width: 500, height: 500 }}>
            <Text>Hey</Text>
        </View>
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#C5E1A5',
                        borderRadius: 7
                        // backgroundColor: theme.colors.secondary,
                    }
                }}
                textStyle={{
                    right: [theme.customFontMSmedium.body, {
                        color: '#333'
                    }]
                }}

                timeTextStyle={{
                    right: [theme.customFontMSregular.caption, {
                        color: theme.colors.placeholder
                    }]
                }}

            />
        );
    }

    renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        )
    }

    renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton icon='send-circle' size={33} color={theme.colors.primary} />
                </View>
            </Send>
        )
    }

    scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
            </View>
        )
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                wrapperStyle={styles.systemMessageWrapper}
                textStyle={[theme.customFontMSmedium.caption, styles.systemMessageText]}
                containerStyle={{ marginHorizontal: 25, }}
            />
        );
    }

    componentWillUnmount() {
        this.messagesListener()
    }

    handlePickImage() {
        const options = {
            title: 'Choisissez une image',
            takePhotoButtonTitle: 'Prendre une photo',
            cancelButtonTitle: 'Annuler',
            chooseFromLibraryButtonTitle: 'Choisir de la librairie',
            mediaType: 'image',
            //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }

            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }

            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }

            else {
                const source = { uri: response.uri };
                this.setState({
                    imageSource: source,
                }, () => console.log(this.state.imageSource))
            }
        })
    }

    renderActions(props) {
        return (
            <Actions
                {...props}
                // options={{
                //     ['Choisir une image']: this.handlePickImage,
                // }}
                icon={() => (
                    <Icon name={'attachment'} size={28} color={theme.colors.primary} />
                )}
                onPressActionButton={this.handlePickImage}
            />
        )
    }

    render() {
        let { messages } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Appbar back title titleText='Espace messagerie' />
                <GiftedChat
                    messagesContainerStyle={{ backgroundColor: theme.colors.chatBackground }}
                    messages={messages}
                    onSend={this.handleSend}
                    user={{ id: this.currentUser.uid }}
                    placeholder='Tapez un message'
                    alwaysShowSend
                    showUserAvatar={false}
                    scrollToBottom
                    renderBubble={this.renderBubble}
                    renderLoading={this.renderLoading}
                    renderSend={this.renderSend}
                    renderActions={(props) => this.renderActions()}
                    scrollToBottomComponent={this.scrollToBottomComponent}
                    renderSystemMessage={this.renderSystemMessage}
                    renderDay={(props) => <Day {...props} dateFormat={'Do MMM YYYY'} textStyle={[{ color: '#fafafa' }]} />}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    systemMessageWrapper: {
        backgroundColor: '#BBDEFB',
        borderRadius: 4,
        padding: 5,
        paddingHorizontal: 7
    },
    systemMessageText: {
        color: theme.colors.placeholder,
        textAlign: 'center'
    }
});