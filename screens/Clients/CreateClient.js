import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Keyboard } from "react-native";
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask';
import { connect } from 'react-redux'
import _ from 'lodash'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from "../../components/Appbar"
import Loading from "../../components/Loading"
import LoadDialog from "../../components/LoadDialog"
import RadioButton from "../../components/RadioButton"
import MyInput from "../../components/TextInput"
import AddressInput from "../../components/AddressInput"
import Button from "../../components/Button"
import Toast from "../../components/Toast"
import { CustomIcon } from "../../components";

import { auth } from "../../firebase";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { createClient, validateClientInputs } from "../../api/firestore-api";
import { generateId, updateField, load, navigateToScreen, setAddress, displayError } from "../../core/utils"
import { faMagic } from "@fortawesome/pro-light-svg-icons";

class CreateClient extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.setAddress = setAddress.bind(this)
        this.validateClientInputs = validateClientInputs.bind(this)
        this.createClient = createClient.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', 'UsersManagement')
        this.ClientId = generateId('GS-CL-')

        this.isProspect = this.props.navigation.getParam('isProspect', false)
        this.userType = this.isProspect ? 'prospect' : 'client'
        this.titleText = `${this.userType.charAt(0).toUpperCase()}${this.userType.slice(1)}`
        this.titleText = this.isProspect ? this.titleText : `${this.titleText} en cours`

        this.state = {
            checked: 'first', //professional/Particular
            isPro: false,
            nom: { value: 'ddd', error: '' },
            prenom: { value: 'fff', error: '' },
            denom: { value: "", error: "" },
            siret: { value: "", error: "" },

            address: { description: 'qsrf', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',
            email: { value: "test19@digital-french-touch.com", error: "" },
            phone: { value: "+33 55 55 55", error: '' },

            password: { value: 'srfqdrf', error: '', show: false },

            loading: true,
            loadingDialog: false,
        }
    }



    componentDidMount() {
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    formatClient() {
        const { isPro, nom, prenom, denom, siret, address, phone, email, password, loading } = this.state

        let user = {
            isPro,
            address,
            phone: phone.value,
            email: email.value.toLowerCase(),
            password: password.value,
            ClientId: this.ClientId,
            isProspect: this.isProspect,
            createdBy: {
                id: auth.currentUser.uid,
                fullName: auth.currentUser.displayName
            },
            createdAt: moment().format(),
            userType: 'client',
            status: "pending",
            deleted: false
        }

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

        if (!this.isProspect)
            user.role = 'Client'

        return user
    }

    handleSubmit = async () => {
        Keyboard.dismiss()

        const user = this.formatClient()
        const { isConnected } = this.props.network

        const isValid = this.validateClientInputs(user)
        if (!isValid) return

        this.setState({ loadingDialog: true })

        const response = await createClient(user, isConnected)
        const { error } = response

        if (error) {
            this.setState({ loadingDialog: false })
            displayError(error)
        }

        else {
            const { navigation } = this.props
            if (navigation.state.params && navigation.state.params.onGoBack) {
                navigation.state.params.onGoBack(user)
            }
            var navScreen = this.prevScreen === "CreateProject" ? this.prevScreen : "Profile"
            var navParams = this.prevScreen === "CreateProject" ? {} : { user: { id: this.ClientId, roleId: 'client' } }
            this.setState({ loadingDialog: false }, () => {
                this.props.navigation.navigate(navScreen, navParams)
            })
        }
    }

    refreshAddress(address) {
        this.setState({ address, addressError: '' })
    }

    render() {
        let { isPro, error, loading, loadingDialog } = this.state
        let { nom, prenom, address, addressError, phone, email, password } = this.state
        let { denom, siret } = this.state
        const { isConnected } = this.props.network
        const loadingMessage = `Création du ${this.userType} en cours...`

        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                <Appbar
                    close={!loading}
                    title
                    titleText={this.titleText}
                />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.container}
                        contentContainerStyle={{ backgroundColor: '#fff', padding: constants.ScreenWidth * 0.05 }}
                    >
                        <MyInput
                            label="Identifiant client"
                            value={this.ClientId}
                            editable={false}
                            disabled
                        />

                        <RadioButton checked={this.state.checked}
                            firstChoice={{ title: 'Particulier', value: 'Particulier' }}
                            secondChoice={{ title: 'Professionnel', value: 'Professionnel' }}
                            onPress1={() => this.setState({ checked: 'first', isPro: false })}
                            onPress2={() => this.setState({ checked: 'second', isPro: true })}
                            style={{ justifyContent: 'space-between', marginTop: 20 }}
                        />

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
                                const name = isPro ? denom : nom
                                updateField(this, name, text)
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
                            onPress={() => navigateToScreen(this, 'Address', { onGoBack: this.refreshAddress, currentAddress: address })}
                            onChangeText={this.setAddress}
                            clearAddress={() => this.setAddress('')}
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
                            label="Mot de passe"
                            returnKeyType="done"
                            value={password.value}
                            onChangeText={text => updateField(this, password, text)}
                            error={!!password.error}
                            errorText={password.error}
                            // secureTextEntry={!password.show}
                            autoCapitalize="none"
                            right={
                                <TextInput.Icon
                                    name={<CustomIcon icon={faMagic} color={theme.colors.inpuIcon} />}
                                    color={theme.colors.secondary}
                                    onPress={() => {
                                        const password = { value: generateId('', 6), error: "" }
                                        this.setState({ password })
                                    }}
                                />
                            }
                            editable={false}
                        />

                        <Toast message={error} onDismiss={() => this.setState({ error: '' })} />
                        <LoadDialog loading={loadingDialog} message={loadingMessage} />

                    </ScrollView >
                }

                <Button
                    mode="contained"
                    onPress={this.handleSubmit}
                    backgroundColor={theme.colors.primary}
                    containerStyle={{ alignSelf: 'flex-end', marginTop: 25, marginRight: theme.padding }}>
                    Valider
                </Button>
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
    container: {
        flex: 1,
        backgroundColor: theme.colors.white
    }
})
