import React, { Component } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Keyboard, FlatList, Alert, RefreshControl } from 'react-native'
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask'
import NetInfo from "@react-native-community/netinfo"
import _ from 'lodash'
import { faUser, faUserSlash } from '@fortawesome/pro-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/pro-duotone-svg-icons'
import { faBullseyeArrow, faConstruction, faLock, faRedo } from '@fortawesome/pro-light-svg-icons'
import { connect } from 'react-redux'

import TurnoverGoalsContainer from '../../containers/TurnoverGoalsContainer'
import Appbar from '../../components/Appbar'
import CustomIcon from '../../components/CustomIcon'
import FormSection from '../../components/FormSection'
import MyInput from '../../components/TextInput'
import AddressInput from '../../components/AddressInput'
import Button from "../../components/Button"
import ProjectItem2 from "../../components/ProjectItem2"
import TurnoverGoal from "../../components/TurnoverGoal"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"
import LoadDialog from "../../components/LoadDialog"
import EmptyList from "../../components/EmptyList"

import firebase, { db, auth } from '../../firebase'
import * as theme from "../../core/theme"
import { constants, highRoles } from '../../core/constants'
import { fetchDocs, fetchTurnoverData, validateClientInputs, createClient, fetchDocument, fetchDocuments } from '../../api/firestore-api'
import { sortMonths, navigateToScreen, nameValidator, passwordValidator, updateField, load, setToast, formatRow, generateId, refreshAddress, setAddress, displayError, countDown } from "../../core/utils"
import { handleReauthenticateError, handleUpdatePasswordError } from '../../core/exceptions'
import { analyticsQueriesBasedOnRole, initTurnoverObjects, setTurnoverArr, setMonthlyGoals } from '../Dashboard/helpers'
import { setCurrentUser } from '../../core/redux'

const fields = ['denom', 'nom', 'prenom', 'email', 'phone']

class Profile extends Component {

    constructor(props) {
        super(props)
        this.fetchProfile = this.fetchProfile.bind(this)
        this.fetchClientProjects = this.fetchClientProjects.bind(this)
        this.clientConversion = this.clientConversion.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.passwordValidation = this.passwordValidation.bind(this)
        this.refreshToast = this.refreshToast.bind(this)
        // this.fetchDocs = fetchDocs.bind(this)
        this.validateClientInputs = validateClientInputs.bind(this)
        this.refreshMonthlyGoals = this.refreshMonthlyGoals.bind(this)
        this.refreshAddress = refreshAddress.bind(this)
        this.setAddress = setAddress.bind(this)

        this.isRoot = this.props.navigation.getParam('isRoot', false)
        this.roleId = this.props.role.id
        this.userParam = this.props.navigation.getParam('user', { id: firebase.auth().currentUser.uid, roleId: this.roleId })
        this.isClient = this.userParam.roleId === 'client'
        this.dataCollection = this.isClient ? 'Clients' : 'Users'
        this.isProcess = this.props.navigation.getParam('isProcess', false)
        this.project = this.props.navigation.getParam('project', null)
        this.initialState = {}

        if (this.userParam.roleId === 'com') {
            this.queries = analyticsQueriesBasedOnRole('com', this.userParam.id)
        }

        this.state = {
            id: this.userParam.id, //Not editable
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

            loadingClientProjects: true,
            clientProjectsList: [],
            monthlyGoals: [],

            refreshing: false,
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

    //##GET
    async componentDidMount() {
        try {
            await this.fetchProfile()

            if (this.isClient)
                this.fetchClientProjects()

            // DC can view/add Coms goals
            if (this.userParam.roleId === 'com') {
                const initialTurnoverObjects = initTurnoverObjects()
                const turnoverObjects = await fetchTurnoverData(this.queries.turnover, initialTurnoverObjects, this.userParam.id)
                let turnoverArr = setTurnoverArr(turnoverObjects)
                turnoverArr = sortMonths(turnoverArr)
                const monthlyGoals = setMonthlyGoals(turnoverArr)
                this.setState({ monthlyGoals })
            }
            this.initialState = _.cloneDeep(this.state)
            load(this, false)
        }
        catch (e) {
            const { message } = e
            displayError({ message })
        }
    }

    async fetchProfile(count) {
        this.setState({ refreshing: true })
        if (count) {
            await countDown(count)
        }
        let user = await fetchDocument(this.dataCollection, this.userParam.id)
        user = this.setUser(user)
        this.setState({ refreshing: false })
        if (!user) return
    }

    async setUser(user) {
        if (!user)
            this.setState({ docNotFound: true })
        else {
            user = this.formatUser(user)
            this.setState(user)
        }
        return user
    }

    formatUser(user) {
        if (this.isClient)
            var isProspect = user.isProspect

        const email = { value: user.email, error: '' }
        const phone = { value: user.phone, error: '' }
        const { role, address, isPro, deleted } = user
        const formatedUser = { isPro, role, email, phone, address, isProspect, deleted }

        if (user.isPro) {
            var denom = { value: user.denom, error: "" }
            var siret = { value: user.siret, error: "" }
            formatedUser.denom = denom
            formatedUser.siret = siret
        }
        else {
            var nom = { value: user.nom, error: '' }
            var prenom = { value: user.prenom, error: '' }
            formatedUser.nom = nom
            formatedUser.prenom = prenom
        }
        return formatedUser
    }

    async fetchClientProjects() {
        this.setState({ loadingClientProjects: true })

        var query = db
            .collection('Projects')
            .where('client.id', '==', this.userParam.id)
            .where('deleted', '==', false)
            .orderBy('createdAt', 'DESC')

        const clientProjectsList = await fetchDocuments(query)
        this.setState({
            clientProjectsList,
            clientProjectsCount: clientProjectsList.length,
            loadingClientProjects: false
        })
    }

    //##VALIDATE
    validateInputs() {
        let denomError = ''
        let nomError = ''
        let prenomError = ''

        const { isPro, denom, nom, prenom, phone, email, address, isProspect } = this.state

        if (isPro)
            denomError = nameValidator(denom.value, '"Dénomination sociale"')

        else {
            nomError = nameValidator(nom.value, '"Nom"')
            prenomError = nameValidator(prenom.value, '"Prénom"')
        }

        const phoneError = nameValidator(phone.value, '"Téléphone"')
        const addressError = nameValidator(address.description, '"Adresse"')
        const emailError = isProspect ? '' : nameValidator(email.value, '"Email"')

        if (denomError || nomError || prenomError || phoneError || emailError || addressError) {

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

            this.setState({ phone, email, addressError, loading: false })
            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
            return false
        }

        return true
    }

    //##POST
    handleSubmit() {

        Keyboard.dismiss()
        if (this.state.loading || _.isEqual(this.state, this.initialState)) return
        load(this, true)

        //Validation
        const isValid = this.validateInputs()
        if (!isValid) return { error: 'Veuillez vérifier les champs' }

        //Format data
        let userData = []
        let { isPro, nom, prenom, denom, phone, address } = this.state
        const { isConnected } = this.props.network
        const fullName = isPro ? denom.value : `${prenom.value} ${nom.value}`

        let user = {
            fullName,
            phone: phone.value,
            address,
        }

        if (isPro) {
            user.denom = denom.value
            user.siret = siret.value
        }
        else {
            user.nom = nom.value
            user.prenom = prenom.value
        }

        //Persist data
        db.collection(this.dataCollection).doc(this.userParam.id).set(user, { merge: true })
        const nomChanged = nom.value !== this.initialState.nom.value
        const prenomChanged = prenom.value !== this.initialState.prenom.value
        const denomChanged = denom.value !== this.initialState.denom.value

        //A cloud function updating firebase auth displayName is triggered -> give it some time to finish...
        if (nomChanged || prenomChanged || denomChanged) {
            //Update redux state
            let { currentUser } = this.props
            currentUser.fullName = fullName
            setCurrentUser(this, currentUser)
            setTimeout(() => {
                firebase.auth().currentUser.reload()
            }, 5000)
        }

        load(this, false)
        this.setState({ toastType: 'success', toastMessage: 'Modifications efféctuées !' })
    }

    //##CONVERT PROSPECT TO CLIENT
    async clientConversion() {

        const resp = this.handleSubmit()
        if (resp && resp.error) return

        const { isConnected } = this.props.network
        const { isPro, nom, prenom, denom, siret, address, phone, email, loading } = this.state
        const userData = { isPro, nom, prenom, denom, siret, address, phone, email, password: { value: '' } }
        userData.password.value = generateId('', 6)

        this.setState({ loadingDialog: true })
        const response = await createClient(userData, this.userParam.id, isConnected, true, true)
        if (response && response.error) {
            this.setState({ loadingDialog: false })
            const { title, message } = response.error
            Alert.alert(title, message)
        }

        else {
            setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
                this.setState({ loadingDialog: false })

                if (this.props.navigation.state.params && this.props.navigation.state.params.onGoBack) {
                    this.props.navigation.state.params.onGoBack()
                }

                if (this.project)
                    this.props.navigation.pop()

                this.props.navigation.goBack()
            }, 6000) //We can reduce this timeout later on...
        }
    }

    //##PASSWORD CHANGE
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
        try {
            load(this, true)

            //Validate passwords (old pass & new pass)
            const isPasswordValid = this.passwordValidation()
            if (!isPasswordValid) return

            let { currentPass, newPass, email } = this.state
            const { currentUser } = firebase.auth()
            const emailCred = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPass.value)

            //Re-authenticate user (for security)
            await currentUser.reauthenticateWithCredential(emailCred)
                .catch(e => { throw new Error(handleReauthenticateError(e)) })

            //Update password
            await currentUser.updatePassword(newPass.value)
                .catch(e => { throw new Error(handleUpdatePasswordError(e)) })

            setToast(this, 's', 'Mot de passe modifié avec succès')
        }

        catch (e) {
            const { message } = e
            displayError({ message })
        }

        finally {
            const init = { value: '', error: '' }
            this.setState({ currentPass: init, newPass: init, loading: false })
        }
    }

    refreshToast(toastType, toastMessage) {
        this.setState({ toastType, toastMessage })
    }

    //##SIGNOUT
    handleSignout() {
        this.setState({ loadingSignOut: true })
        firebase.auth().signOut()
    }

    //##RENDERERS
    renderAvatar() {
        const { deleted } = this.state
        const icon = deleted ? faUserSlash : faUser
        const iconColor = deleted ? theme.colors.error : theme.colors.primary

        return (
            <View style={styles.avatar} >
                <CustomIcon icon={icon} color={iconColor} size={30} />
                {deleted && <Text style={[theme.customFontMSregular.extraSmall, { position: 'absolute', bottom: 15, color: theme.colors.gray_dark, textAlign: 'center' }]}>Utilisateur supprimé</Text>}
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

    renderProject(project) {
        if (project.empty)
            return <View style={styles.invisibleItem} />
        else return <ProjectItem2 project={project} onPress={() => this.onPressProject(project.id)} />
    }

    onPressProject(ProjectId) {
        this.props.navigation.navigate('CreateProject', { ProjectId, onGoBack: () => this.fetchProfile(1000) })
    }

    renderClientProjects(currentUser) {
        const isProfileOwner = this.userParam.id === currentUser.uid
        const mes = isProfileOwner ? 'Mes ' : ''
        const { loadingClientProjects, clientProjectsList, isPro, denom, nom, prenom, email, address } = this.state

        const client = {
            id: this.userParam.id,
            fullName: isPro ? denom.value : `${prenom.value} ${nom.value}`,
            email: email.value,
            role: 'Client',
        }

        return (
            <View style={{ flex: 1, marginTop: 16 }}>
                <FormSection
                    sectionTitle={`${mes}Projets`}
                    sectionRightComponent={
                        () => {
                            return (
                                <View style={{ flexDirection: 'row' }}>
                                    <CustomIcon
                                        icon={faRedo}
                                        size={28}
                                        color={theme.colors.primary}
                                        onPress={this.fetchClientProjects}
                                        style={{ marginRight: theme.padding * 1.5 }}
                                    />
                                    <CustomIcon
                                        icon={faPlusCircle}
                                        size={28}
                                        color={theme.colors.white}
                                        secondaryColor={theme.colors.primary}
                                        onPress={() => this.props.navigation.navigate('CreateProject', { client, address, onGoBack: () => this.fetchProfile(1000) })}
                                    />
                                </View>
                            )
                        }
                    }
                    form={null}
                    containerStyle={{ width: constants.ScreenWidth, alignSelf: 'center', marginBottom: 15 }}
                />
                {loadingClientProjects ?
                    <Loading style={{ marginTop: 33 }} />
                    :
                    <FlatList
                        data={formatRow(true, clientProjectsList, 3)}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => this.renderProject(item)}
                        style={{ zIndex: 1 }}
                        numColumns={3}
                        columnWrapperStyle={{ justifyContent: 'space-between' }} />
                }

            </View>
        )
    }

    onPressNewGoal() {
        this.props.navigation.navigate('AddGoal', { userId: this.userParam.id, onGoBack: this.refreshMonthlyGoals })
    }

    onPressGoal(goal, index) {
        const navParams = {
            userId: this.userParam.id,
            GoalId: goal.id,
            currentTurnover: goal.current,
            incomeSources: goal.sources,
            monthYear: goal.monthYear,
            onGoBack: this.refreshMonthlyGoals
        }
        this.props.navigation.navigate('AddGoal', navParams)
    }

    async refreshMonthlyGoals() {
        try {
            const initialTurnoverObjects = initTurnoverObjects()
            let turnoverObjects = await fetchTurnoverData(this.queries.turnover, initialTurnoverObjects, this.userParam.id)
            const turnoverArr = setTurnoverArr(turnoverObjects)
            const monthlyGoals = setMonthlyGoals(turnoverArr)
            this.setState({ monthlyGoals })
        }
        catch (e) {
            const { message } = e
            displayError({ message })
        }
    }

    renderCommercialGoals(monthlyGoals, isCom) {
        return (
            <View>
                <FormSection
                    sectionTitle='Objectifs'
                    sectionIcon={faBullseyeArrow}
                    form={null}
                    containerStyle={{ width: constants.ScreenWidth, alignSelf: 'center', marginBottom: 20 }}
                />
                <TurnoverGoalsContainer
                    monthlyGoals={monthlyGoals}
                    onPressNewGoal={this.onPressNewGoal.bind(this)}
                    onPressGoal={this.onPressGoal.bind(this)}
                    navigation={this.props.navigation}
                    isCom={isCom}
                />
            </View>
        )
    }

    render() {
        let { id, email, phone, address, addressError, newPass, currentPass, role, toastMessage, error, loading, loadingDialog, loadingSignOut, clientProjectsList, monthlyGoals, isProspect, userNotFound } = this.state
        const { isConnected } = this.props.network

        const { currentUser } = firebase.auth()
        if (currentUser) var { uid } = currentUser

        const isProfileOwner = this.userParam.id === uid
        const isAdmin = this.roleId === 'admin'
        const isCom = this.roleId === 'com'

        let { canUpdate } = this.props.permissions.users
        canUpdate = (canUpdate || isProfileOwner)

        const showGoalsSection = this.userParam.roleId === 'com' && highRoles.includes(this.roleId) && !isProfileOwner
        const showMenu = isProfileOwner && this.isRoot

        return (
            <View style={{ flex: 1 }}>
                <Appbar
                    menu={showMenu}
                    back={!showMenu}
                    title
                    titleText='Profil'
                    check={!userNotFound && (canUpdate || this.isClient)}
                    handleSubmit={this.handleSubmit}
                />

                {userNotFound || !currentUser ?
                    <EmptyList icon={faUserSlash} header='Utilisateur introuvable' description='Cet utilisateur est introuvable dans la base de données.' offLine={!isConnected} />
                    :
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={styles.container}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.fetchProfile}
                                />
                            }
                        >
                            {loading ?
                                <Loading style={{ marginTop: constants.ScreenHeight * 0.4 }} size='large' />
                                :
                                <View style={{ paddingHorizontal: theme.padding }}>
                                    <View style={{ height: 130, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                        {this.renderAvatar()}
                                        {this.renderMetadata(canUpdate, isConnected)}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <MyInput
                                            label="Numéro utilisateur"
                                            returnKeyType="done"
                                            value={id}
                                            onChangeText={text => console.log(text)}
                                            autoCapitalize="none"
                                            editable={false}
                                            disabled
                                        />

                                        <MyInput
                                            label="Email"
                                            returnKeyType="done"
                                            value={email.value}
                                            multiline={true}
                                            onChangeText={text => updateField(this, email, text)}
                                            autoCapitalize="none"
                                            error={!!email.error}
                                            errorText={email.error}
                                            autoCapitalize="none"
                                            textContentType='emailAddress'
                                            keyboardType='email-address'
                                            editable={this.isClient && isProspect}
                                            disabled={false}
                                        />

                                        {isAdmin && !isProspect &&
                                            <TouchableOpacity onPress={() => {
                                                if (!isConnected || !isAdmin || this.isClient) return
                                                navigateToScreen(this, 'EditRole', { onGoBack: this.refreshToast, userId: this.userParam.id, currentRole: role, dataCollection: this.dataCollection })
                                            }}>
                                                <MyInput
                                                    label="Role"
                                                    returnKeyType="done"
                                                    value={role}
                                                    autoCapitalize="none"
                                                    editable={false}
                                                    right={isAdmin && isConnected && !this.isClient && <TextInput.Icon name='pencil' color={theme.colors.gray_medium} size={21} onPress={() =>
                                                        navigateToScreen(this, 'EditRole', { onGoBack: this.refreshToast, userId: this.userParam.id, currentRole: role, dataCollection: this.dataCollection })
                                                    } />}
                                                />
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
                                            }
                                        />

                                        <AddressInput
                                            offLine={!isConnected}
                                            onPress={() => navigateToScreen(this, 'Address', { currentAddress: this.state.address, onGoBack: this.refreshAddress })}
                                            address={address}
                                            onChangeText={this.setAddress}
                                            clearAddress={() => this.setAddress('')}
                                            addressError={addressError}
                                            editable={canUpdate || this.isProcess}
                                            isEdit={true}
                                        />

                                        {isProfileOwner &&
                                            <Button
                                                loading={loadingSignOut}
                                                mode="contained"
                                                onPress={this.handleSignout.bind(this)}
                                                backgroundColor='#ff5153'
                                                style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center', marginVertical: 24 }}>
                                                Se déconnecter
                                            </Button>
                                        }

                                        {this.isClient && this.renderClientProjects(currentUser)}
                                        {showGoalsSection && this.renderCommercialGoals(monthlyGoals, isCom)}

                                        {isProfileOwner &&
                                            <FormSection
                                                sectionTitle='Modification du mot de passe'
                                                sectionIcon={faLock}
                                                containerStyle={{ width: constants.ScreenWidth, alignSelf: 'center' }}
                                                form={
                                                    <View>
                                                        <View style={{ paddingTop: 15 }}>
                                                            <Text style={[theme.customFontMSregular.body, { color: theme.colors.placeholder }]}>Laissez le mot de passe vide si vous ne voulez pas le changer.</Text>
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

                                                        <Button
                                                            loading={loading}
                                                            mode="contained"
                                                            onPress={this.changePassword}
                                                            style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center', marginTop: 24 }}>
                                                            Modifier le mot de passe
                                                        </Button>
                                                    </View>
                                                }
                                            />
                                        }

                                    </View>

                                </View>
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
        network: state.network,
        currentUser: state.currentUser
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

