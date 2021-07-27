import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Keyboard } from "react-native";
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask';
import { connect } from 'react-redux'
import _ from 'lodash'

import Appbar from "../../components/Appbar"
import Loading from "../../components/Loading"
import LoadDialog from "../../components/LoadDialog"
import RadioButton from "../../components/RadioButton"
import MyInput from "../../components/TextInput"
import AddressInput from "../../components/AddressInput"
import Button from "../../components/Button"
import Toast from "../../components/Toast"
import { CustomIcon } from "../../components";

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { createClient, validateClientInputs } from "../../api/firestore-api";
import { generateId, updateField, load, navigateToScreen, setAddress } from "../../core/utils"
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
        this.titleText = `${this.userType.charAt(0).toUpperCase()}${this.userType.slice(1)} en cours`

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
            loadingDialog: false,
        }
    }

    componentDidMount() {
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    handleSubmit = async (isConversion) => {
        Keyboard.dismiss()

        const { isPro, nom, prenom, denom, siret, address, phone, email, password, loading } = this.state

        let userData = { isPro, nom, prenom, denom, siret, address, phone, email, password }
        const { isConnected } = this.props.network

        const isValid = this.validateClientInputs(userData)
        if (!isValid) return

        this.setState({ loadingDialog: true })

        const response = await createClient(userData, this.ClientId, isConnected, isConversion, this.isProspect)
        if (response && response.error) {
            this.setState({ loadingDialog: false })
            const { title, message } = response.error
            Alert.alert(title, message)
        }

        else {
            setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
                this.setState({ loadingDialog: false })
                if (this.props.navigation.state.params && this.props.navigation.state.params.onGoBack) {
                    const user = {
                        id: this.ClientId,
                        isPro,
                        denom: denom.value,
                        nom: nom.value,
                        prenom: prenom.value,
                        role: 'Client',
                        email: email.value,
                        address
                    }
                    this.props.navigation.state.params.onGoBack(user)
                }
                this.props.navigation.navigate(this.prevScreen)
            }, 6000)
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
            <View style={{ flex: 1 }}>
                <Appbar
                    close={!loading}
                    title
                    titleText={this.titleText}
                />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView keyboardShouldPersistTaps="always" style={styles.container} contentContainerStyle={{ backgroundColor: '#fff', padding: constants.ScreenWidth * 0.05 }}>
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
                    onPress={() => this.handleSubmit(false)}
                    backgroundColor={theme.colors.primary}
                    style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center', marginTop: 25 }}>
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
        flex: 1
    }
})
