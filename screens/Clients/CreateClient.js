import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Keyboard } from "react-native";
import { TextInput } from 'react-native-paper'
import firebase from '@react-native-firebase/app';
import TextInputMask from 'react-native-text-input-mask';
import { connect } from 'react-redux'

import Appbar from "../../components/Appbar"
import Loading from "../../components/Loading"
import RadioButton from "../../components/RadioButton"
import MyInput from "../../components/TextInput"
import AddressInput from "../../components/AddressInput"
import Button from "../../components/Button"
import Toast from "../../components/Toast"

import _ from 'lodash'

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { nameValidator, emailValidator, passwordValidator, phoneValidator, generateId, updateField, setToast, load, myAlert, navigateToScreen } from "../../core/utils"
import { handleFirestoreError } from "../../core/exceptions";

const db = firebase.firestore()

class CreateClient extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.myAlert = myAlert.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', 'UsersManagement')
        this.ClientId = generateId('GS-CL-')

        this.isProspect = this.props.navigation.getParam('isProspect', false)
        this.userType = this.isProspect ? 'prospect' : 'client'
        this.titleText = `Nouveau ${this.userType}`

        this.state = {
            checked: 'first', //professional/Particular
            isPro: false,
            nom: { value: '2', error: '' },
            prenom: { value: 'Client', error: '' },
            denom: { value: "", error: "" },
            siret: { value: "", error: "" },

            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',
            email: { value: "client2@eqx-software.com", error: "" },
            phone: { value: "+33111111111", error: '' },

            password: { value: 'Aaaa111', error: '', show: false },

            loading: true,
            error: "",
        }
    }

    componentDidMount() {
        this.initialState = this.state
        load(this, false)
    }

    validateInputs() {
        let denomError = ''
        let siretError = ''
        let nomError = ''
        let prenomError = ''

        let { isPro, denom, siret, nom, prenom, phone, email, password } = this.state

        if (isPro) {
            denomError = nameValidator(denom.value, '"Dénomination sociale"')
            siretError = nameValidator(siret.value, 'Siret')
        }

        else {
            nomError = nameValidator(nom.value, '"Nom"')
            prenomError = nameValidator(prenom.value, '"Prénom"')
        }

        const phoneError = nameValidator(phone.value, '"Téléphone"')
        // const addressError = nameValidator(address.description, '"Adresse"')
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)

        if (denomError || siretError || nomError || prenomError || phoneError || emailError || passwordError) {

            phone.error = phoneError
            email.error = emailError
            password.error = passwordError

            if (isPro) {
                denom.error = denomError
                siret.error = siretError
                this.setState({ denom, siret, phone, email, password, loading: false })
            }

            else {
                nom.error = nomError
                prenom.error = prenomError
                this.setState({ nom, prenom, phone, email, password, loading: false })
            }

            Keyboard.dismiss()

            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')

            return false
        }

        return true
    }

    async checkEmailExistance(email) {
        const methods = await firebase.auth().fetchSignInMethodsForEmail(email)
        const emailExist = methods.length > 0 ? true : false
        return emailExist
    }

    handleSubmit = async (persist, convert) => {
        let { isPro, error, loading } = this.state
        let { nom, prenom, address, phone, email, password } = this.state
        let { denom, siret } = this.state

        const { isConnected } = this.props.network

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        load(this, true)
        this.titleText = convert ? "Création du client" : `Création du ${this.userType}`

        //2. ADDING USER DOCUMENT
        let client = {
            address,
            phone: phone.value,
            email: email.value.toLowerCase(),
            isProspect: this.isProspect,
            password: password.value,
            userType: 'client',
            deleted: false
        }

        if (isPro) {
            client.denom = denom.value
            client.siret = siret.value
            client.isPro = true
            client.fullName = denom.value
        }

        else if (!isPro) {
            client.nom = nom.value
            client.prenom = prenom.value
            client.isPro = false
            client.fullName = `${prenom.value} ${nom.value}`
        }

        if (this.isProspect)
            db.collection('Clients').doc(this.ClientId).set(client)

        else {
            if (!isConnected) {
                Alert.alert('Pas de connection internet', "Veuillez vous connecter au réseau pour pouvoir créer un nouvel utilisateur.")
                return
            }

            //Validate if email address already exist
            const emailExist = await this.checkEmailExistance(email.value)
            if (emailExist) {
                email.error = "Cette adresse email est déjà associé à un compte."
                this.setState({ email, loading: false })
                return
            }

            client.role = 'Client'
            await db.collection('newUsers').doc(this.ClientId).set(client)
            setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
                load(this, false)
                this.title = "Créer un utilisateur"
                this.props.navigation.navigate(this.prevScreen)
            }, 6000) //We can reduce this timeout later on...
        }

        load(this, false)
        this.titleText = `Créer un ${this.userType}`
        this.props.navigation.goBack()
    }

    refreshAddress(address) {
        this.setState({ address, addressError: '' })
    }

    render() {
        let { isPro, error, loading } = this.state
        let { nom, prenom, address, addressError, phone, email, password } = this.state
        let { denom, siret } = this.state
        const { isConnected } = this.props.network

        return (
            <View style={{ flex: 1 }}>
                <Appbar close={!loading} title titleText={this.titleText} check={!loading} handleSubmit={() => this.handleSubmit(true, false)} />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView style={styles.container} contentContainerStyle={{ backgroundColor: '#fff', padding: constants.ScreenWidth * 0.05 }}>
                        <MyInput
                            label="Identifiant client"
                            value={this.ClientId}
                            editable={false}
                            style={{ marginBottom: 15 }}
                            disabled
                        />

                        <RadioButton checked={this.state.checked}
                            firstChoice={{ title: 'Particulier', value: 'Particulier' }}
                            secondChoice={{ title: 'Professionnel', value: 'Professionnel' }}
                            onPress1={() => this.setState({ checked: 'first', isPro: false })}
                            onPress2={() => this.setState({ checked: 'second', isPro: true })}
                            style={{ justifyContent: 'space-between', marginVertical: 5 }} />

                        {!isPro &&
                            <MyInput
                                label="Prénom *"
                                returnKeyType="done"
                                value={prenom.value}
                                onChangeText={text => updateField(this, prenom, text)}
                                error={!!prenom.error}
                                errorText={prenom.error}
                            />}

                        <MyInput
                            label={isPro ? 'Dénomination sociale *' : 'Nom *'}
                            returnKeyType="next"
                            value={isPro ? denom.value : nom.value}
                            onChangeText={text => {
                                if (isPro)
                                    updateField(this, denom, text)
                                else
                                    updateField(this, nom, text)
                            }}
                            error={isPro ? !!denom.error : !!nom.error}
                            errorText={isPro ? denom.error : nom.error}
                        />

                        {isPro &&
                            <MyInput
                                label='Numéro siret *'
                                returnKeyType="next"
                                value={siret.value}
                                onChangeText={text => updateField(this, siret, text)}
                                error={!!siret.error}
                                errorText={siret.error}
                                render={props => <TextInputMask {...props} mask="[000] [000] [000] [00000]" />}
                            />}

                        <AddressInput
                            offLine={!isConnected}
                            onPress={() => navigateToScreen(this, true, 'Address', { onGoBack: this.refreshAddress, currentAddress: address })}
                            address={address}
                            addressError={addressError}
                        />

                        <MyInput
                            label="Téléphone *"
                            returnKeyType="done"
                            value={phone.value}
                            onChangeText={text => updateField(this, phone, text)}
                            error={!!phone.error}
                            errorText={phone.error}
                            textContentType='telephoneNumber'
                            keyboardType='phone-pad'
                            dataDetectorTypes='phoneNumber'
                            render={props => <TextInputMask {...props} mask="+33 [0] [00] [00] [00] [00]" />} />

                        <MyInput
                            label="Email *"
                            returnKeyType="next"
                            value={email.value}
                            onChangeText={text => updateField(this, email, text)}
                            error={!!email.error}
                            errorText={email.error}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                        />

                        <MyInput
                            style={{ marginVertical: 0, zIndex: 1, backgroundColor: theme.colors.background }}
                            label="Mot de passe"
                            returnKeyType="done"
                            value={password.value}
                            onChangeText={text => updateField(this, password, text)}
                            error={!!password.error}
                            errorText={password.error}
                            secureTextEntry={!password.show}
                            autoCapitalize="none"

                            right={<TextInput.Icon name={password.show ? 'eye-off' : 'eye'} color={theme.colors.secondary} onPress={() => {
                                password.show = !password.show
                                this.setState({ password })
                            }} />}
                        />

                        <Toast message={error} onDismiss={() => this.setState({ error: '' })} />

                    </ScrollView >
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        network: state.network
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateClient)

const styles = StyleSheet.create({
})
