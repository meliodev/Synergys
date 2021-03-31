import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Keyboard } from "react-native";
import { TextInput } from 'react-native-paper'
import firebase from '@react-native-firebase/app';
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

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { createClient, validateClientInputs } from "../../api/firestore-api";
import { generateId, updateField, setToast, load, myAlert, navigateToScreen } from "../../core/utils"
import { handleFirestoreError } from "../../core/exceptions";

const db = firebase.firestore()

class CreateClient extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.myAlert = myAlert.bind(this)
        this.createClient = createClient.bind(this)
        this.validateClientInputs = validateClientInputs.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', 'UsersManagement')
        this.ClientId = generateId('GS-CL-')

        this.isProspect = this.props.navigation.getParam('isProspect', false)
        this.userType = this.isProspect ? 'prospect' : 'client'
        this.titleText = `Nouveau ${this.userType}`

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
            error: "",
        }
    }

    componentDidMount() {
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    handleSubmit = async (isConversion) => {
        const { error, loading } = this.state
        const { isPro, nom, prenom, denom, siret, address, phone, email, password } = this.state
        const userData = { isPro, nom, prenom, denom, siret, address, phone, email, password }
        const eventHandlers = { error, loading }
        const { isConnected } = this.props.network

        const isValid = this.validateClientInputs(userData)
        if (!isValid) return

        this.setState({ loadingDialog: true })

        const response = await createClient(userData, eventHandlers, this.ClientId, isConnected, isConversion, this.isProspect)
        if (response && response.error) {
            this.setState({ loadingDialog: false })
            Alert.alert(response.error.title, response.error.message)
        }

        else {
            setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
                this.setState({ loadingDialog: false })
                this.props.navigation.navigate(this.prevScreen)
            }, 6000) //We can reduce this timeout later on...
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
                <Appbar close={!loading} title titleText={this.titleText} check={!loading} handleSubmit={() => this.handleSubmit(false)} />

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
                            onPress={() => navigateToScreen(this, 'Address', { onGoBack: this.refreshAddress, currentAddress: address })}
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

                        <LoadDialog loading={loadingDialog} message={loadingMessage} />

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
