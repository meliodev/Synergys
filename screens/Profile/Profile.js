import React, { Component } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Alert, Keyboard } from 'react-native'
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask'
import firebase from 'react-native-firebase'
import { connect } from 'react-redux'

import Appbar from '../../components/Appbar'
import AvatarText from '../../components/AvatarText'
import MyInput from '../../components/TextInput'
import Button from "../../components/Button"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import * as theme from "../../core/theme"
import { constants } from '../../core/constants'
import { nameValidator, emailValidator, passwordValidator, phoneValidator, updateField, setUser, load } from "../../core/utils"
import { handleSetError } from '../../core/exceptions'

const db = firebase.firestore()
const fields = ['denom', 'nom', 'prenom', 'email', 'phone']

class Profile extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.passwordValidation = this.passwordValidation.bind(this)
        this.refreshToast = this.refreshToast.bind(this)

        this.userId = this.props.navigation.getParam('userId', firebase.auth().currentUser.uid)
        this.role = this.props.role.id
        this.initialState = {}
        this.isInit = true

        this.state = {
            id: this.userId, //Not editable
            currentUser: firebase.auth().currentUser,
            isPro: false,

            denom: { value: "", error: "" },
            siret: { value: "", error: "" },

            nom: { value: '', error: '' },
            prenom: { value: '', error: '' },
            role: '',
            email: { value: '', error: '' },
            phone: { value: '', error: '' },
            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',
            currentPass: { value: '', error: '', show: false },
            newPass: { value: '', error: '', show: false },

            loading: false,
            loadingSignOut: false,
            error: '',
            toastMessage: '', //password change
            toastType: '',

            //Permissions
            canEdit: false,
            isOwner: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.setPermissions()
        this.fetchData()
        this.setState({ loading: false })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    fetchData() {
        this.unsubscribe = db.collection('Users').doc(this.userId).onSnapshot((doc) => {
            let denom = ''
            let siret = ''
            let nom = ''
            let prenom = ''

            if (doc.data().isPro) {
                denom = { value: doc.data().denom, error: "" }
                siret = { value: doc.data().siret, error: "" }
            }

            else {
                nom = { value: doc.data().nom, error: '' }
                prenom = { value: doc.data().prenom, error: '' }
            }

            let email = { value: doc.data().email, error: '' }
            let phone = { value: doc.data().phone, error: '' }
            let role = doc.data().role
            let address = doc.data().address
            let isPro = doc.data().isPro

            this.setState({ isPro, denom, siret, nom, prenom, role, email, phone, address }, () => {
                if (this.isInit)
                    this.initialState = this.state

                this.isInit = false
            })
        })
    }

    setPermissions() {
        if (this.role === 'admin')
            this.setState({ isAdmin: true })

        const isOwner = this.userId === this.state.currentUser.uid

        if (isOwner)
            this.setState({ isOwner: true })

        if (this.role === 'admin' || isOwner)
            this.setState({ canEdit: true })
    }

    validateInputs() {
        let denomError = ''
        let nomError = ''
        let prenomError = ''

        if (this.state.isPro)
            denomError = nameValidator(this.state.denom.value, '"Dénomination sociale"')

        else {
            nomError = nameValidator(this.state.nom.value, '"Nom"')
            prenomError = nameValidator(this.state.prenom.value, '"Prénom"')
        }

        let phoneError = nameValidator(this.state.phone.value, '"Téléphone"')
        let addressError = nameValidator(this.state.address.description, '"Adresse"')

        if (denomError || nomError || prenomError || phoneError || addressError) {

            let { isPro, denom, nom, prenom, phone } = this.state

            phone.error = phoneError

            if (isPro) {
                denom.error = denomError
                Keyboard.dismiss()
                this.setState({ denom, phone, addressError, loading: false })
            }

            else {
                nom.error = nomError
                prenom.error = prenomError
                Keyboard.dismiss()
                this.setState({ nom, prenom, phone, addressError, loading: false })
            }

            this.setState({ toastType: 'error', toastMessage: 'Erreur de saisie, veuillez verifier les champs.' })

            return false
        }

        return true
    }

    async handleSubmit() {
        //Handle Loading or No edit done
        if (this.state.loading || this.state === this.initialState) return

        this.setState({ loading: true })

        const isValid = this.validateInputs()

        if (isValid) {
            let userData = []
            let { isPro, nom, prenom, denom } = this.state

            Object.entries(this.state).forEach(([key, value]) => {
                if (fields.indexOf(key) !== -1)
                    userData.push([key, value.value])
            })

            userData = Object.fromEntries(userData)

            if (isPro)
                userData.fullName = `${denom.value}`
            else
                userData.fullName = `${prenom.value} ${nom.value}`

            await db.collection('Users').doc(this.userId).set(userData, { merge: true })
                .then(() => {
                    const nomChanged = this.state.nom !== this.initialState.nom
                    const prenomChanged = this.state.prenom !== this.initialState.prenom
                    const denomChanged = this.state.denom !== this.initialState.denom

                    if (nomChanged || prenomChanged || denomChanged)
                        setTimeout(async () => {
                            await firebase.auth().currentUser.reload()
                            const currentUser = firebase.auth().currentUser
                            this.setState({ currentUser })
                            setUser(this, currentUser.displayName, true)
                            load(this, false)
                            this.setState({ toastType: 'success', toastMessage: 'Modifications efféctuées !' })
                        }, 5000)

                    else {
                        load(this, false)
                        this.setState({ toastType: 'success', toastMessage: 'Modifications efféctuées !' })
                    }
                })
                .catch((e) => {
                    handleSetError(e)
                    load(this, false)
                })
        }
    }

    passwordValidation() {
        let currentPassError = passwordValidator(this.state.currentPass.value)
        let newPassError = passwordValidator(this.state.newPass.value)

        if (currentPassError || newPassError) {
            let { currentPass, newPass } = this.state
            currentPass.error = currentPassError
            newPass.error = newPassError

            this.setState({ currentPass, newPass, loading: false, toastType: 'error', toastMessage: 'Veuillez renseigner les champs mots de passe.' })
            return false
        }

        else return true
    }

    changePassword() {
        console.log('Ready to verify password...')
        this.setState({ loading: true })
        //Validate password
        const isPasswordValid = this.passwordValidation()

        if (isPasswordValid) {
            let currentPass = this.state.currentPass
            let newPass = this.state.newPass

            const emailCred = firebase.auth.EmailAuthProvider.credential(this.state.currentUser.email, currentPass.value)

            //1. RE-AUTHENTICATION
            this.state.currentUser.reauthenticateWithCredential(emailCred)
                .then(() => {
                    //2. UPDATE PASSWORD
                    return this.state.currentUser.updatePassword(newPass.value)
                        .then(() => {
                            this.setState({ toastType: 'success', toastMessage: 'Mot de passe modifié avec succès' })
                        })
                        .catch(e => {
                            let error = ''
                            if (e.code === 'auth/weak-password')
                                error = "Le nouveau mot de passe que vous avez saisi est faible."

                            else error = "Erreur, veuillez resaisir un nouveau mot de passe"

                            this.setState({ toastType: 'error', toastMessage: error })
                        })
                        .finally(() => {
                            currentPass = { value: '', error: '' }
                            newPass = { value: '', error: '' }
                            this.setState({ currentPass, newPass, loading: false, })
                        })
                })

                .catch(e => {
                    let error = ''
                    if (e.code === 'auth/wrong-password')
                        error = ("L'ancien mot de passe que vous avez saisi est incorrecte.")

                    else if (e.code === 'auth/user-not-found')
                        error = (`Aucun utilisateur associé à l'adresse email: ${this.state.email.value}`)

                    currentPass = { value: '', error: '' }
                    newPass = { value: '', error: '' }
                    this.setState({ currentPass, newPass, loading: false, toastType: 'error', toastMessage: error })
                })

        }
    }

    refreshToast(toastType, toastMessage) {
        this.setState({ toastType, toastMessage })
    }

    render() {
        let { id, isPro, denom, siret, nom, prenom, email, phone, address, addressError, newPass, currentPass, role,
            canEdit, isOwner, isAdmin,
            toastMessage, error, loading, loadingSignOut } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Appbar back={!loading} title titleText='Profil' check={canEdit} handleSubmit={this.handleSubmit} />
                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                    {!loading ?
                        <View style={{ paddingHorizontal: constants.ScreenWidth * 0.075 }}>
                            <View style={{ height: constants.ScreenHeight * 0.27, flexDirection: 'row' }}>
                                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'flex-start' }} >
                                    {this.state.currentUser.displayName && <AvatarText label={this.state.currentUser.displayName.charAt(0)} size={60} />}
                                </View>
                                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }} >

                                    {isPro ?
                                        < MyInput
                                            label="Dénomination sociale"
                                            returnKeyType="done"
                                            value={denom.value}
                                            onChangeText={text => updateField(this, denom, text)}
                                            error={!!denom.error}
                                            errorText={denom.error}
                                            editable={canEdit}
                                        />
                                        :
                                        <MyInput
                                            label="Prénom"
                                            returnKeyType="done"
                                            value={prenom.value}
                                            onChangeText={text => updateField(this, prenom, text)}
                                            error={!!prenom.error}
                                            errorText={prenom.error}
                                            editable={canEdit}
                                        />
                                    }

                                    {isPro ?
                                        < MyInput
                                            label="Siret"
                                            returnKeyType="done"
                                            value={siret.value}
                                            onChangeText={text => updateField(this, siret, text)}
                                            error={!!siret.error}
                                            errorText={siret.error}
                                            editable={false}
                                        />
                                        :
                                        < MyInput
                                            label="Nom"
                                            returnKeyType="done"
                                            value={nom.value}
                                            onChangeText={text => updateField(this, nom, text)}
                                            error={!!nom.error}
                                            errorText={nom.error}
                                            editable={canEdit}
                                        />
                                    }

                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <MyInput
                                    label="Numéro utilisateur"
                                    returnKeyType="done"
                                    value={id}
                                    onChangeText={text => console.log(text)}
                                    error={!!id.error}
                                    errorText={id.error}
                                    autoCapitalize="none"
                                    editable={false}
                                    disabled
                                />

                                <TouchableOpacity onPress={() => {
                                    if (isOwner)
                                        this.props.navigation.navigate('EditEmail', { onGoBack: this.refreshToast, userId: this.userId })
                                }}>
                                    <MyInput
                                        label="Email"
                                        returnKeyType="done"
                                        value={email.value}
                                        autoCapitalize="none"
                                        editable={false}
                                        right={isOwner && <TextInput.Icon name='pencil' color={theme.colors.primary} size={21} onPress={() =>
                                            this.props.navigation.navigate('EditEmail', { onGoBack: this.refreshToast, userId: this.userId })
                                        } />}
                                    />
                                </TouchableOpacity>

                                {isOwner &&
                                    <Button
                                        loading={loadingSignOut}
                                        mode="contained"
                                        onPress={() => {
                                            this.setState({ loadingSignOut: true })
                                            firebase.auth().signOut()
                                                .then(() => this.navigateToScreen('LoginScreen'))
                                                .catch((e) => console.error(e))
                                                .finally(() => this.setState({ loadingSignOut: false }))
                                        }}
                                        backgroundColor='#ff5153'
                                        style={{ width: constants.ScreenWidth * 0.85, alignSelf: 'center' }}>
                                        Se déconnecter
                                    </Button>
                                }

                                {isAdmin &&
                                    <TouchableOpacity onPress={() => {
                                        if (isAdmin)
                                            this.props.navigation.navigate('EditRole', { onGoBack: this.refreshToast, userId: this.userId, currentRole: this.state.role })
                                    }}>
                                        <MyInput
                                            label="Role"
                                            returnKeyType="done"
                                            value={role}
                                            autoCapitalize="none"
                                            editable={false}
                                            right={isAdmin && <TextInput.Icon name='pencil' color={theme.colors.primary} size={21} onPress={() =>
                                                this.props.navigation.navigate('EditRole', { onGoBack: this.refreshToast, userId: this.userId, currentRole: this.state.role })
                                            } />} />
                                    </TouchableOpacity>
                                }

                                <MyInput
                                    label="Téléphone"
                                    returnKeyType="done"
                                    value={phone.value}
                                    onChangeText={text => updateField(this, phone, text)}
                                    error={!!phone.error}
                                    errorText={phone.error}
                                    autoCapitalize="none"
                                    textContentType='telephoneNumber'
                                    keyboardType='phone-pad'
                                    dataDetectorTypes='phoneNumber'
                                    editable={canEdit}
                                    render={props =>
                                        <TextInputMask
                                            {...props}
                                            mask="+[00] [0] [00] [00] [00] [00]"
                                        />
                                    } />



                                <TouchableOpacity onPress={() => {
                                    if (canEdit)
                                        this.props.navigation.navigate('Address', { prevScreen: 'Profile', userId: this.userId, currentAddress: this.state.address })
                                }}>
                                    <MyInput
                                        label="Adresse"
                                        value={address.description}
                                        error={!!addressError}
                                        errorText={addressError}
                                        autoCapitalize="none"
                                        editable={false}
                                        multiline={true}

                                        right={canEdit && <TextInput.Icon name='pencil' color={theme.colors.primary} size={21} onPress={() =>
                                            this.props.navigation.navigate('Address', { prevScreen: 'Profile', userId: this.userId, currentAddress: this.state.address })
                                        } />}
                                    />
                                </TouchableOpacity>

                                {isOwner &&
                                    <View>
                                        <View style={{ paddingTop: 30, paddingBottom: 3 }}>
                                            <Text style={[theme.customFontMSsemibold.body, { marginBottom: 5 }]}>MODIFICATION DU MOT DE PASSE</Text>
                                            <Text style={[theme.customFontMSregular, { color: theme.colors.placeholder }]}>Laissez le mot de passe vide si vous ne voulez pas le changer.</Text>
                                        </View>

                                        <MyInput
                                            label="Ancien mot de passe"
                                            returnKeyType="done"
                                            value={currentPass.value}
                                            onChangeText={text => updateField(this, currentPass, text)}
                                            error={!!currentPass.error}
                                            errorText={currentPass.error}
                                            autoCapitalize="none"
                                            secureTextEntry={!currentPass.show}
                                            right={<TextInput.Icon name={currentPass.show ? 'eye-off' : 'eye'} color={theme.colors.placeholder} onPress={() => {
                                                currentPass.show = !currentPass.show
                                                this.setState({ currentPass })
                                            }} />}
                                        />

                                        <MyInput
                                            label="Nouveau mot de passe"
                                            returnKeyType="done"
                                            value={newPass.value}
                                            onChangeText={text => updateField(this, newPass, text)}
                                            error={!!newPass.error}
                                            errorText={newPass.error}
                                            autoCapitalize="none"
                                            secureTextEntry={!newPass.show}
                                            right={<TextInput.Icon name={newPass.show ? 'eye-off' : 'eye'} color={theme.colors.placeholder} onPress={() => {
                                                newPass.show = !newPass.show
                                                this.setState({ newPass })
                                            }} />}
                                        />
                                    </View>
                                }

                                {isOwner &&
                                    <Button
                                        loading={loading}
                                        mode="contained"
                                        onPress={this.changePassword}
                                        style={{ width: constants.ScreenWidth * 0.85, alignSelf: 'center' }}>
                                        Modifier le mot de passe
                                </Button>
                                }

                            </View>
                        </View>
                        :
                        <Loading style={{ marginTop: constants.ScreenHeight * 0.4 }} size='large' />
                    }
                </ScrollView >

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={toastMessage}
                    type={this.state.toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        user: state.user.user
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Profile)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4
    },
    userImage: {
        width: constants.ScreenWidth * 0.17,
        height: constants.ScreenWidth * 0.17,
    },

});

