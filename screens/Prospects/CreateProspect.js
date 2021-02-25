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
import Button from "../../components/Button"
import Toast from "../../components/Toast"

import _ from 'lodash'

import * as theme from "../../core/theme";
import { constants, rolesRedux } from "../../core/constants";
import { nameValidator, emailValidator, passwordValidator, phoneValidator, generateId, updateField, setToast, load, myAlert } from "../../core/utils"
import { handleFirestoreError } from "../../core/exceptions";

const db = firebase.firestore()

class CreateProspect extends Component {
    constructor(props) {
        super(props)
        // this.isProspectArchived = this.isProspectArchived.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleConversion = this.handleConversion.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.myAlert = myAlert.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', 'UsersManagement')
        this.ProspectId = this.props.navigation.getParam('ProspectId', '')
        this.isEdit = this.ProspectId ? true : false
        this.ProspectId = this.isEdit ? this.ProspectId : generateId('GS-US-')
        this.titleText = this.isEdit ? 'Détails du prospect' : 'Nouveau prospect'
        this.role = this.props.role.id

        this.state = {
            checked: 'first', //professional/Particular
            isPro: false,
            nom: { value: '', error: '' },
            prenom: { value: '', error: '' },
            denom: { value: "", error: "" },
            siret: { value: "", error: "" },

            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',
            email: { value: "", error: "" },
            phone: { value: "", error: '' },

            password: { value: '', error: '', show: false },

            loading: true,
            error: "",
        }
    }

    async componentDidMount() {
        if (this.isEdit)
            await this.fetchProspect()

        else this.initialState = this.state

        load(this, false)
    }

    async fetchProspect() {
        await db.collection('Prospects').doc(this.ProspectId).get().then((doc) => {
            if (doc.exists) {
                let { checked, isPro, nom, prenom, denom, siret, address, email, password, phone } = this.state
                let { createdAt, createdBy, editedAt, editedBy } = this.state

                //General info
                const prospect = doc.data()
                checked = prospect.isPro ? 'second' : 'first'
                isPro = prospect.isPro
                nom.value = prospect.nom
                prenom.value = prospect.prenom
                denom.value = prospect.denom
                siret.value = prospect.siret
                address = prospect.address
                email.value = prospect.email
                password.value = prospect.password
                phone.value = prospect.phone

                //َActivity
                createdAt = prospect.createdAt
                createdBy = prospect.createdBy
                editedAt = prospect.editedAt
                editedBy = prospect.editedBy

                this.setState({ checked, isPro, nom, prenom, denom, siret, address, email, password, phone, createdAt, createdBy, editedAt, editedBy }, () => {
                    //if (this.isInit)
                    this.initialState = this.state

                    //this.isInit = false
                })
            }
        })
    }

    validateInputs() {
        let denomError = ''
        let siretError = ''

        let nomError = ''
        let prenomError = ''

        let { isPro, denom, siret, nom, prenom, phone, address, email, password } = this.state

        if (isPro) {
            denomError = nameValidator(denom.value, '"Dénomination sociale"')
            siretError = nameValidator(siret.value, 'Siret')
        }

        else {
            nomError = nameValidator(nom.value, '"Nom"')
            prenomError = nameValidator(prenom.value, '"Prénom"')
        }

        const phoneError = nameValidator(phone.value, '"Téléphone"')
        const addressError = nameValidator(address.description, '"Adresse"')
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)

        if (denomError || siretError || nomError || prenomError || phoneError || addressError || emailError || passwordError) {

            phone.error = phoneError
            email.error = emailError
            password.error = passwordError

            if (isPro) {
                denom.error = denomError
                siret.error = siretError
                this.setState({ denom, siret, phone, addressError, email, password, loading: false })
            }

            else {
                nom.error = nomError
                prenom.error = prenomError
                this.setState({ nom, prenom, phone, addressError, email, password, loading: false })
            }

            Keyboard.dismiss()

            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')

            return false
        }

        return true
    }

    handleSubmit = async (persist, convert) => {
        let { role, isPro, error, loading } = this.state
        let { nom, prenom, address, phone, email, password } = this.state
        let { denom, siret } = this.state

        const { isConnected } = this.props.network

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        load(this, true)
        this.titleText = convert ? "Création du client" : "Création du prospect..."

        //2. ADDING USER DOCUMENT
        let prospect = {
            address: address,
            phone: phone.value,
            email: email.value.toLowerCase(),
            role: role,
            hasTeam: false,
            password: password.value,
            deleted: false
        }

        if (isPro) {
            prospect.denom = denom.value
            prospect.siret = siret.value
            prospect.isPro = true
            prospect.fullName = denom.value
        }

        else if (!isPro) {
            prospect.nom = nom.value
            prospect.prenom = prenom.value
            prospect.isPro = false
            prospect.fullName = prenom.value + ' ' + nom.value
        }

        prospect.isClient = role === 'Client' ? true : false

        if (persist) {
            db.collection('Prospects').doc(this.ProspectId).set(prospect).catch(e => handleFirestoreError(e))
        }

        if (convert) {
            await this.convertProspectToClient(prospect)
        }

        load(this, false)
        this.titleText = "Créer un prospect"
        this.props.navigation.goBack()
    }

    refreshAddress(address) {
        this.setState({ address, addressError: '' })
    }

    handleConversion() {
        const { isConnected } = this.props.network

        if (!isConnected) {
            Alert.alert("", "La conversion d'un propect en client nécessite une connection à internet. Veuillez rétablir votre connection réseau.")
            return
        }

        const initialState = _.cloneDeep(this.initialState)
        const state = _.cloneDeep(this.state)
        delete initialState.loading
        delete state.loading

        if (!_.isEqual(initialState, state)) {
            const title = "Sauvegarder les modifications"
            const message = "Vous venez d'éffectuer de nouvelles modifications. Voulez-vous les appliquer avant de créer un nouveau client ?"
            const confirmText = 'OK'
            const cancelText = 'Ne pas appliquer'
            const handleSubmitOption1 = () => this.handleSubmit(true, true)
            const handleSubmitOption2 = () => this.handleSubmit(false, true)
            const extraButton = { text: 'Annuler', onPress: () => console.log('cancel'), style: 'cancel' }
            this.myAlert(title, message, handleSubmitOption1, handleSubmitOption2, confirmText, cancelText, extraButton)
        }

        else this.handleSubmit(false, true)
    }

    async convertProspectToClient(prospect) {
        prospect.role = 'Client'
        prospect.isClient = true

        const batch = db.batch()
        const prospectsRef = db.collection('Prospects').doc(this.ProspectId)
        const newusersRef = db.collection('newUsers').doc(this.ProspectId)

        batch.delete(prospectsRef)
        batch.set(newusersRef, prospect)
        batch.commit()

        const promise = new Promise((resolve, reject) => {
            setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
                load(this, false)
                this.titleText = this.isEdit ? 'Nouveau prospect' : 'Détails du prospect'
                this.props.navigation.navigate('UsersManagement')
                resolve(true)
            }, 6000) //We can reduce this timeout later on...X
        })

        return promise
    }

    render() {
        let { role, isPro, error, loading } = this.state
        let { nom, prenom, address, addressError, phone, email, password } = this.state
        let { denom, siret } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Appbar back={!loading} close title titleText={this.titleText} check={!loading} handleSubmit={() => this.handleSubmit(true, false)} />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView style={styles.container} contentContainerStyle={{ backgroundColor: '#fff', padding: constants.ScreenWidth * 0.05 }}>
                        <MyInput
                            label="Identifiant prospect"
                            value={this.ProspectId}
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
                                label="Prénom"
                                returnKeyType="done"
                                value={prenom.value}
                                onChangeText={text => updateField(this, prenom, text)}
                                error={!!prenom.error}
                                errorText={prenom.error}
                            />}

                        <MyInput
                            label={isPro ? 'Dénomination sociale' : 'Nom'}
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
                                label='Numéro siret'
                                returnKeyType="next"
                                value={siret.value}
                                onChangeText={text => updateField(this, siret, text)}
                                error={!!siret.error}
                                errorText={siret.error}
                                render={props => <TextInputMask {...props} mask="[000] [000] [000] [00000]" />}
                            />}

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress, title: "Adresse de l'utilisateur", currentAddress: this.state.address })}>
                            <MyInput
                                label="Adresse"
                                returnKeyType="done"
                                value={address.description}
                                autoCapitalize="none"
                                multiline={true}
                                editable={false}
                                error={!!addressError}
                                errorText={addressError}
                            />
                        </TouchableOpacity>

                        <MyInput
                            label="Téléphone"
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
                            label="Email"
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
                            label="Mot de passe"
                            returnKeyType="done"
                            value={password.value}
                            onChangeText={text => updateField(this, password, text)}
                            error={!!password.error}
                            errorText={password.error}
                            autoCapitalize="none"
                            secureTextEntry={!password.show}
                            right={<TextInput.Icon name={password.show ? 'eye-off' : 'eye'} color={theme.colors.placeholder} onPress={() => {
                                password.show = !password.show
                                this.setState({ password })
                            }} />}
                        />

                        <Button mode="contained" onPress={this.handleConversion} style={{ width: constants.ScreenWidth * 0.7, alignSelf: 'center', marginTop: 30, backgroundColor: theme.colors.secondary }} >
                            Convertir en client
                        </Button>

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

export default connect(mapStateToProps)(CreateProspect)

const styles = StyleSheet.create({
})
