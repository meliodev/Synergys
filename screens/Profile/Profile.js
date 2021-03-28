import React, { Component } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Keyboard, FlatList, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask'
import firebase from '@react-native-firebase/app'
import NetInfo from "@react-native-community/netinfo"
import { faUser, faUserSlash } from '@fortawesome/pro-solid-svg-icons'

import Appbar from '../../components/Appbar'
import CustomIcon from '../../components/CustomIcon'
import FormSection from '../../components/FormSection'
import AvatarText from '../../components/AvatarText'
import MyInput from '../../components/TextInput'
import AddressInput from '../../components/AddressInput'
import Button from "../../components/Button"
import ProjectItem2 from "../../components/ProjectItem2"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"
import LoadDialog from "../../components/LoadDialog"
import EmptyList from "../../components/EmptyList"

import * as theme from "../../core/theme"
import { constants } from '../../core/constants'
import { resetState, setNetwork } from '../../core/redux'
import { fetchDocs, validateClientInputs, createClient } from '../../api/firestore-api'
import { navigateToScreen, nameValidator, emailValidator, passwordValidator, phoneValidator, updateField, load, setToast, formatRow, generateId } from "../../core/utils"
import { handleFirestoreError, handleReauthenticateError, handleUpdatePasswordError } from '../../core/exceptions'
import { connect } from 'react-redux'
import { faConstruction } from '@fortawesome/pro-light-svg-icons'

const db = firebase.firestore()
const fields = ['denom', 'nom', 'prenom', 'email', 'phone']

class Profile extends Component {

    constructor(props) {
        super(props)
        this.clientConversion = this.clientConversion.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.passwordValidation = this.passwordValidation.bind(this)
        this.refreshToast = this.refreshToast.bind(this)
        this.handleReauthenticateError = this.handleReauthenticateError.bind(this)
        this.fetchDocs = fetchDocs.bind(this)
        this.validateClientInputs = validateClientInputs.bind(this)

        this.userId = this.props.navigation.getParam('userId', firebase.auth().currentUser.uid)
        this.role = this.props.role.id
        this.isClient = this.props.navigation.getParam('isClient', false)
        this.isClient = this.isClient || this.role === 'client'
        this.dataCollection = this.isClient ? 'Clients' : 'Users'
        this.isProcess = this.props.navigation.getParam('isProcess', false)
        this.initialState = {}

        this.state = {
            id: this.userId, //Not editable
            currentUser: firebase.auth().currentUser,

            isPro: false,
            denom: { value: "", error: "" },
            siret: { value: "", error: "" },
            nom: { value: '', error: '' },
            prenom: { value: '', error: '' },
            isProspect: false,

            role: '',

            email: { value: '', error: '' },
            phone: { value: '', error: '' },
            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',

            currentPass: { value: '', error: '', show: false },
            newPass: { value: '', error: '', show: false },

            clientProjectsList: [],

            loading: true,
            loadingDialog: false,
            loadingSignOut: false,
            error: '',
            toastMessage: '', //password change
            toastType: '',
            userNotFound: false,
            deleted: false
        }
    }

    async componentDidMount() {
        await this.fetchUserData()
        if (this.isClient) await this.fetchClientProjects()
        load(this, false)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    //Fetch data...
    fetchUserData() {
        this.unsubscribe = db.collection(this.dataCollection).doc(this.userId).onSnapshot((doc) => {

            if (!doc.exists) {
                this.setState({ userNotFound: true })
                return
            }

            const user = doc.data()

            let denom = ''
            let siret = ''
            let nom = ''
            let prenom = ''

            if (user.isPro) {
                denom = { value: user.denom, error: "" }
                siret = { value: user.siret, error: "" }
            }

            else {
                nom = { value: user.nom, error: '' }
                prenom = { value: user.prenom, error: '' }
            }

            if (this.isClient) {
                var isProspect = user.isProspect
            }

            const email = { value: user.email, error: '' }
            const phone = { value: user.phone, error: '' }
            const role = user.role
            const address = user.address
            const isPro = user.isPro
            const deleted = user.deleted

            this.setState({ isPro, denom, siret, nom, prenom, role, email, phone, address, isProspect, deleted }, () => {
                this.initialState = this.state //keep the initial state to compare changes
            })
        })
    }

    fetchClientProjects() {
        var query = db.collection('Projects').where('client.id', '==', this.userId).where('deleted', '==', false).orderBy('createdAt', 'DESC')
        this.fetchDocs(query, 'clientProjectsList', 'clientProjectsCount', () => load(this, false))
    }

    //Submit data
    validateInputs() {
        let denomError = ''
        let nomError = ''
        let prenomError = ''

        const { isPro, denom, nom, prenom, phone, email, isProspect } = this.state

        if (isPro)
            denomError = nameValidator(denom.value, '"Dénomination sociale"')

        else {
            nomError = nameValidator(nom.value, '"Nom"')
            prenomError = nameValidator(prenom.value, '"Prénom"')
        }

        const phoneError = nameValidator(phone.value, '"Téléphone"')
        // const addressError = nameValidator(address.description, '"Adresse"')
        const emailError = isProspect ? '' : nameValidator(email.value, '"Email"')

        if (denomError || nomError || prenomError || phoneError || emailError) {

            phone.error = phoneError
            email.error = emailError

            if (isPro) {
                denom.error = denomError
                this.setState({ denom })
            }

            else {
                nom.error = nomError
                prenom.error = prenomError
                this.setState({ nom, prenom })
            }

            this.setState({ phone, email, loading: false })
            Keyboard.dismiss()
            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
            return false
        }

        return true
    }

    async handleSubmit() {
        //Handle Loading or No edit done
        if (this.state.loading || this.state === this.initialState) return

        load(this, true)

        //Validation
        const isValid = this.validateInputs()
        if (!isValid) return { error: 'Veuillez vérifier les champs' }

        //Format data
        let userData = []
        let { isPro, nom, prenom, denom, phone } = this.state
        const { isConnected } = this.props.network

        let user = {
            phone: phone.value
        }

        if (isConnected) {
            if (isPro) {
                user.denom = denom.value
                user.siret = siret.value
                user.fullName = denom.value
            }

            else if (!isPro) {
                user.nom = nom.value
                user.prenom = prenom.value
                user.fullName = `${prenom.value} ${nom.value}`
            }
        }

        //Persist data
        db.collection(this.dataCollection).doc(this.userId).set(user, { merge: true })

        if (!isConnected) return

        const nomChanged = nom !== this.initialState.nom
        const prenomChanged = prenom !== this.initialState.prenom
        const denomChanged = denom !== this.initialState.denom

        //A cloud function updating firebase auth displayName is triggered -> give it some time to finish...
        if (nomChanged || prenomChanged || denomChanged)
            setTimeout(async () => {
                await firebase.auth().currentUser.reload()
                const currentUser = firebase.auth().currentUser
                this.setState({ currentUser })
            }, 5000)

        load(this, false)
        this.setState({ toastType: 'success', toastMessage: 'Modifications efféctuées !' })
    }

    //Prospect to client conversion
    async clientConversion() {

        const resp = await this.handleSubmit()
        if (resp && resp.error) return

        const { error, loading } = this.state
        const { isPro, nom, prenom, denom, siret, address, phone, email } = this.state
        const userData = { isPro, nom, prenom, denom, siret, address, phone, email, password: { value: '' } }
        //autogen password
        userData.password.value = generateId('', 7) //#task: generate it backend side
        const eventHandlers = { error, loading }
        const { isConnected } = this.props.network

        const isValid = this.validateClientInputs(userData, false)
        if (!isValid) return

        this.setState({ loadingDialog: true })
        const response = await createClient(userData, eventHandlers, this.userId, isConnected, true, true)
        if (response && response.error) {
            this.setState({ loadingDialog: false })
            Alert.alert(response.error.title, response.error.message)
        }

        else {
            setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
                this.setState({ loadingDialog: false })
                this.props.navigation.goBack()
            }, 6000) //We can reduce this timeout later on...
        }
    }

    //Password change
    passwordValidation() {
        const { currentPass, newPass } = this.state
        const currentPassError = passwordValidator(currentPass.value)
        const newPassError = passwordValidator(newPass.value)

        if (currentPassError || newPassError) {
            currentPass.error = currentPassError
            newPass.error = newPassError

            this.setState({ currentPass, newPass, loading: false, toastType: 'error', toastMessage: 'Veuillez renseigner les champs mots de passe.' })
            return false
        }

        else return true
    }

    async changePassword() {
        load(this, true)

        //Validate passwords (old pass & new pass)
        const isPasswordValid = this.passwordValidation()
        if (!isPasswordValid) return

        let { currentPass, newPass, currentUser, email } = this.state
        const emailCred = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPass.value)

        //Re-authenticate user (for security)
        const userCredential = await currentUser.reauthenticateWithCredential(emailCred).catch(e => this.handleReauthenticateError(e))
        if (!userCredential) {
            load(this, false)
            return
        }

        //Update password
        await currentUser.updatePassword(newPass.value)
            .then(() => {
                setToast(this, 's', 'Mot de passe modifié avec succès')
                const init = { value: '', error: '' }
                this.setState({ currentPass: init, newPass: init })
            })
            .catch(e => handleUpdatePasswordError(e))
            .finally(() => load(this, false))
    }

    handleReauthenticateError(e) {
        handleReauthenticateError(e)
        const currentPass = { value: '', error: '' }
        const newPass = { value: '', error: '' }
        this.setState({ currentPass, newPass, loading: false })
    }

    refreshToast(toastType, toastMessage) {
        this.setState({ toastType, toastMessage })
    }

    //Signout handler
    handleSignout() {
        this.setState({ loadingSignOut: true })
        firebase.auth().signOut().then(async () => {
            resetState(this)
            const { type, isConnected } = await NetInfo.fetch()
            const network = { type, isConnected }
            setNetwork(this, network)
        })
    }

    //Renderers
    renderAvatar(deleted) {
        const icon = deleted ? faUserSlash : faUser
        const iconColor = deleted ? theme.colors.error : theme.colors.primary

        return (
            <View style={styles.avatar} >
                <CustomIcon icon={icon} color={iconColor} size={30} />
                {deleted && <Text style={[theme.customFontMSregular.small, { position: 'absolute', bottom: 5, color: theme.colors.gray_dark, textAlign: 'center' }]}>Utilisateur supprimé</Text>}
            </View>
        )
    }

    renderMetadata(canUpdate, isConnected) {
        const { isPro, nom, prenom, denom, siret } = this.state

        return (
            <View style={styles.metadataContainer} >
                {isPro ?
                    < MyInput
                        label="Dénomination sociale"
                        returnKeyType="done"
                        value={denom.value}
                        onChangeText={text => updateField(this, denom, text)}
                        error={!!denom.error}
                        errorText={denom.error}
                        editable={isConnected && canUpdate || this.isProcess}
                    />
                    :
                    <MyInput
                        label="Prénom"
                        returnKeyType="done"
                        value={prenom.value}
                        onChangeText={text => updateField(this, prenom, text)}
                        error={!!prenom.error}
                        errorText={prenom.error}
                        editable={isConnected && canUpdate || this.isProcess}
                        disabled={!isConnected}
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
                        editable={isConnected && canUpdate || this.isProcess}
                    />
                    :
                    < MyInput
                        label="Nom"
                        returnKeyType="done"
                        value={nom.value}
                        onChangeText={text => updateField(this, nom, text)}
                        error={!!nom.error}
                        errorText={nom.error}
                        editable={isConnected && canUpdate || this.isProcess}
                        disabled={!isConnected}
                    />
                }

            </View>

        )
    }

    onPressProject(ProjectId) {
        this.props.navigation.navigate('CreateProject', { ProjectId })
    }

    renderProject(project) {
        if (project.empty) {
            return <View style={styles.invisibleItem} />
        }

        else return <ProjectItem2 project={project} onPress={() => this.onPressProject(project.id)} />
    }

    renderClientProjects() {
        const { clientProjectsList } = this.state
        const isProfileOwner = this.userId === firebase.auth().currentUser.uid
        const mes = isProfileOwner ? 'Mes ' : ''

        return (
            <View style={{ flex: 1 }}>
                <FormSection sectionTitle={`${mes}Projets`} sectionIcon={faConstruction} form={null} containerStyle={{ width: constants.ScreenWidth, alignSelf: 'center' }} />
                <FlatList
                    data={formatRow(clientProjectsList, 3)}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => this.renderProject(item)}
                    style={{ zIndex: 1 }}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between' }} />
            </View>
        )
    }

    render() {
        let { id, email, phone, address, addressError, newPass, currentPass, role, toastMessage, error, loading, loadingDialog, loadingSignOut, clientProjectsList, isProspect, userNotFound, deleted } = this.state
        const { isConnected } = this.props.network
        const { displayName, uid } = firebase.auth().currentUser

        const isProfileOwner = this.userId === uid
        const isAdmin = this.role === 'admin'
        let { canUpdate } = this.props.permissions.users
        canUpdate = (canUpdate || isProfileOwner)


        return (
            <View style={{ flex: 1 }}>
                <Appbar menu={isProfileOwner} back={!isProfileOwner} title titleText='Profil' check={canUpdate || this.isClient} handleSubmit={this.handleSubmit} />

                {userNotFound ?
                    <EmptyList icon={faUserSlash} header='Utilisateur introuvable' description='Cet utilisateur est introuvable dans la base de données.' offLine={!isConnected} />
                    :
                    <View style={{ flex: 1 }}>
                        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                            {!loading ?
                                <View style={{ paddingHorizontal: theme.padding }}>
                                    <View style={{ height: 130, flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
                                        {this.renderAvatar(deleted)}
                                        {this.renderMetadata(canUpdate, isConnected)}
                                    </View>

                                    <View style={{ flex: 1, marginBottom: 30 }}>
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

                                        {/* <TouchableOpacity onPress={() => {
                               if (isProfileOwner)
                           this.props.navigation.navigate('EditEmail', { onGoBack: this.refreshToast, userId: this.userId })
                   }}> */}

                                        <MyInput
                                            label="Email"
                                            returnKeyType="done"
                                            value={email.value}
                                            multiline={true}
                                            right={<TextInput.Icon name={<CustomIcon icon={faUser} color={theme.colors.inpuIcon} />} style={{ marginTop: 30 }} />}

                                            onChangeText={text => updateField(this, email, text)}
                                            autoCapitalize="none"
                                            error={!!email.error}
                                            errorText={email.error}
                                            autoCapitalize="none"
                                            textContentType='emailAddress'
                                            keyboardType='email-address'
                                            editable={false}
                                            disabled={false}
                                        // right={isProfileOwner && <TextInput.Icon name='pencil' color={theme.colors.primary} size={21} onPress={() =>
                                        //     this.props.navigation.navigate('EditEmail', { onGoBack: this.refreshToast, userId: this.userId })
                                        // } />}
                                        />
                                        {/* </TouchableOpacity> */}

                                        {isProfileOwner &&
                                            <Button
                                                loading={loadingSignOut}
                                                mode="contained"
                                                onPress={this.handleSignout.bind(this)}
                                                backgroundColor='#ff5153'
                                                style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center', marginTop: 25 }}>
                                                Se déconnecter
                                            </Button>
                                        }

                                        {isAdmin && !isProspect &&
                                            <TouchableOpacity onPress={() => {
                                                if (!isConnected || !isAdmin) return
                                                navigateToScreen(this, 'EditRole', { onGoBack: this.refreshToast, userId: this.userId, currentRole: role, dataCollection: this.dataCollection })
                                            }}>
                                                <MyInput
                                                    label="Role"
                                                    returnKeyType="done"
                                                    value={role}
                                                    autoCapitalize="none"
                                                    editable={false}
                                                    right={isAdmin && isConnected && <TextInput.Icon name='pencil' color={theme.colors.gray_medium} size={21} onPress={() =>
                                                        navigateToScreen(this, 'EditRole', { onGoBack: this.refreshToast, userId: this.userId, currentRole: role, dataCollection: this.dataCollection })
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
                                            editable={canUpdate || this.isProcess}
                                            render={props =>
                                                <TextInputMask
                                                    {...props}
                                                    mask="+[00] [0] [00] [00] [00] [00]"
                                                />
                                            } />

                                        <AddressInput
                                            offLine={!isConnected}
                                            onPress={() => navigateToScreen(this, 'Address', { prevScreen: 'Profile', userId: this.userId, collection: this.isClient ? 'Clients' : 'Users', currentAddress: this.state.address })}
                                            address={address}
                                            addressError={addressError}
                                            editable={canUpdate || this.isProcess}
                                        />

                                        {isProfileOwner &&
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

                                        {isProfileOwner &&
                                            <Button
                                                loading={loading}
                                                mode="contained"
                                                onPress={this.changePassword}
                                                style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center' }}>
                                                Modifier le mot de passe
                                            </Button>
                                        }

                                    </View>

                                    {this.isClient && clientProjectsList.length > 0 && this.renderClientProjects()}

                                </View>
                                :
                                <Loading style={{ marginTop: constants.ScreenHeight * 0.4 }} size='large' />
                            }
                        </ScrollView >

                        {this.isClient && isProspect && !loading &&
                            <Button
                                mode="contained"
                                onPress={this.clientConversion}
                                backgroundColor={theme.colors.primary}
                                style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center', marginTop: 25 }}>
                                Convertir en client
                            </Button>
                        }
                        <LoadDialog loading={loadingDialog} message="Conversion du prospect en client en cours..." />

                    </View>

                }

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={toastMessage}
                    type={this.state.toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />
            </View >
        )
    }
}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Profile)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    avatar: {
        width: 130,
        height: 130,
        marginTop: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: theme.colors.gray_light,
        justifyContent: 'center',
        alignItems: 'center'
    },
    metadataContainer: {
        flex: 0.7,
        alignItems: 'center',
        paddingLeft: 25
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
    invisibleItem: { //Same shape of ProjectItem2
        width: constants.ScreenWidth * 0.24,
        height: constants.ScreenWidth * 0.24,
        borderRadius: constants.ScreenWidth * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'transparent'
    }
})

