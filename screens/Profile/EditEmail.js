
import React, { Component } from 'react'
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import Appbar from '../../components/Appbar'
import AddressSearch from '../../components/AddressSearch'
import MyInput from '../../components/TextInput'
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import * as theme from "../../core/theme"
import { constants } from '../../core/constants'

import { emailValidator, updateField } from "../../core/utils"

import firebase from 'react-native-firebase'
import Dialog from "react-native-dialog"

const db = firebase.firestore()

export default class Address extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderDialog = this.renderDialog.bind(this)

        this.userId = this.props.navigation.getParam('userId', '')
        this.currentUser = firebase.auth().currentUser

        this.state = {
            newEmail: { value: '', error: '' },
            password: { value: '', error: '' },

            toastType: '',
            toastMessage: '',

            showDialog: false,

            loading: false,
            statusLabel: "Confirmation de l'identité"
        }
    }


    async handleSubmit() {
        let { newEmail, toastType, toastMessage } = this.state

        const emailError = this.verifyEmail()
        if (emailError)
            return

        this.setState({ showDialog: true })
    }

    verifyEmail() {
        let { newEmail } = this.state

        const emailError = emailValidator(newEmail.value)
        newEmail.error = emailError

        if (emailError)
            this.setState({ newEmail })

        return emailError
    }

    renderDialog = () => {
        let { password, showDialog, toastType, toastMessage, loading } = this.state

        if (loading)
            return (
                <View style={styles.dialogContainer}>
                    <Dialog.Container visible={this.state.showDialog}>
                        <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{this.state.statusLabel}</Dialog.Title>
                        <ActivityIndicator color={theme.colors.primary} size='small' />
                    </Dialog.Container>
                </View>
            )

        else
            return (
                <View style={styles.dialogContainer}>
                    <Dialog.Container visible={this.state.showDialog}>
                        <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>Confirmation de l'identité</Dialog.Title>
                        <Dialog.Input
                            label="Votre mot de passe actuel"
                            returnKeyType="done"
                            value={password.value}
                            onChangeText={text => updateField(this, password, text)}
                            secureTextEntry
                            autoFocus={showDialog} />
                        <Dialog.Button label="Annuler" onPress={() => this.setState({ showDialog: false })} />
                        <Dialog.Button
                            label="Confirmer"
                            onPress={async () => await this.changeEmail()} />

                    </Dialog.Container>
                </View>
            )
    }

    async changeEmail() {

        let { newEmail, password } = this.state

        let emailCred = null

        if (newEmail.value && password.value)
            emailCred = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, password.value)

        else return

        this.setState({ loading: true })

        await this.currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                this.setState({ statusLabel: "Modification de l'adresse email" })

                return this.currentUser.updateEmail(newEmail.value)
                    .then(() => db.collection('Users').doc(this.userId).update({ email: newEmail.value }))
                    .then(function () {
                        newEmail = { value: '', error: '' }
                        this.setState({ newEmail, showDialog: false }, () => {
                            this.props.navigation.state.params.onGoBack('success', 'Adresse email modifié avec succès')
                            this.props.navigation.goBack()
                        })
                    }.bind(this))
                    .catch(e => {
                        let error = ''
                        if (e.code === 'auth/invalid-email')
                            error = ("Le nouvel email que vous avez saisi est incorrecte.")

                        else if (e.code === 'auth/email-already-in-use')
                            error = (`Aucun utilisateur associé à l'adresse email: ${this.state.newEmail.value}`)

                        else if (e.code === 'auth/requires-recent-login')
                            error = (`Veuillez essayer de vous déconnecter puis vous reconnecter avant d'essayer de nouveau cette opération.`)

                        else error = "Erreur, veuillez réessayer plus tard."

                        this.setState({ password, showDialog: false, toastType: 'error', toastMessage: error })
                    })
            })
            .catch(e => {
                let error = ''
                if (e.code === 'auth/wrong-password')
                    error = ("Le mot de passe que vous avez saisi est invalide.")

                else if (e.code === 'auth/user-not-found')
                    error = (`Aucun utilisateur associé à l'adresse email: ${this.state.newEmail.value}`)

                else error = "Erreur lors de l'authentification, veuillez réessayer."

                this.setState({ password, loading: false, showDialog: false, toastType: 'error', toastMessage: error, })
            })
            .finally(() => this.setState({ loading: false, statusLabel: "Confirmation de l'identité" }))
    }


    render() {
        let { newEmail } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Appbar back title titleText="Changer l'adresse email" check handleSubmit={this.handleSubmit} />
                <View style={{ flex: 1, padding: 20 }}>
                    <MyInput
                        label="Nouvelle adresse email"
                        returnKeyType="done"
                        value={newEmail.value}
                        onChangeText={text => updateField(this, newEmail, text)}
                        error={!!newEmail.error}
                        errorText={newEmail.error}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        keyboardType="email-address" />
                    {this.renderDialog()}
                </View>

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={this.state.toastMessage}
                    type={this.state.toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    dialogContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
    }
})