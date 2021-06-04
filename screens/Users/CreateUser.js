import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Keyboard } from "react-native";
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask';
import { connect } from 'react-redux'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from "../../components/Appbar"
import AddressInput from "../../components/AddressInput"
import Loading from "../../components/Loading"
import Picker from "../../components/Picker"
import RadioButton from "../../components/RadioButton"
import MyInput from "../../components/TextInput"
import Toast from "../../components/Toast"
import LoadDialog from "../../components/LoadDialog"

import { auth, db } from '../../firebase'
import * as theme from "../../core/theme";
import { constants, errorMessages, roles as allRoles } from "../../core/constants";
import { nameValidator, emailValidator, passwordValidator, generateId, updateField, setToast, load, setAddress, displayError } from "../../core/utils"
import { checkEmailExistance } from "../../api/auth-api";

const rolesPicker = {
  3: [
    { label: 'Admin', value: 'Admin' },
    { label: 'Directeur commercial', value: 'Directeur commercial' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Responsable technique', value: 'Responsable technique' },
    { label: 'Poseur', value: 'Poseur' },
    { label: 'Back office', value: 'Back office' },
  ],
  2: [
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Poseur', value: 'Poseur' },
  ],
  1: [],
  0: []
}

class CreateUser extends Component {
  constructor(props) {
    super(props)

    this.addUser = this.addUser.bind(this)
    this.refreshAddress = this.refreshAddress.bind(this)
    this.setAddress = setAddress.bind(this)

    this.prevScreen = this.props.navigation.getParam('prevScreen', 'UsersManagement')
    this.title = 'Créer un utilisateur'
    this.role = this.props.role.id
    this.userId = generateId('GS-US-')

    this.state = {
      role: 'Admin',
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

      loading: false,
      loadingDialog: false,
      error: "",
      toastType: '',
      toastMessage: '',
    }
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

    const phoneError = nameValidator(this.state.phone.value, '"Téléphone"')
    const addressError = nameValidator(this.state.address.description, '"Adresse"')
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)

    if (denomError || siretError || nomError || prenomError || phoneError || addressError || emailError || passwordError) {
      phone.error = phoneError
      email.error = emailError
      password.error = passwordError

      if (isPro) {
        denom.error = denomError
        siret.error = siretError
        this.setState({ denom, siret, phone, email, password, addressError })
      }

      else {
        nom.error = nomError
        prenom.error = prenomError
        this.setState({ nom, prenom, phone, email, password, addressError })
      }
      setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
      return false
    }

    return true
  }

  async addUser(uid, overWrite) {
    Keyboard.dismiss()

    const { isConnected } = this.props.network
    if (!isConnected) {
      Alert.alert('Pas de connection internet', "Veuillez vous connecter au réseau pour pouvoir créer un nouvel utilisateur.")
      return
    }

    this.setState({ loadingDialog: true })
    let { role, isPro, nom, prenom, denom, siret, address, phone, email, password } = this.state

    //1. Validate inputs
    const isValid = await this.validateInputs()
    if (!isValid) {
      this.setState({ loadingDialog: false })
      return
    }

    //Validate if email address already exist
    const emailExist = await checkEmailExistance(email.value)
    if (emailExist) {
      this.setState({ loadingDialog: false })
      displayError({ message: errorMessages.auth.emailExist })
      return
    }

    //2. ADDING USER DOCUMENT
    let user = {
      address,
      phone: phone.value,
      email: email.value.toLowerCase(),
      role,
      password: password.value,
      userType: 'utilisateur',
      createdBy: this.props.currentUser,
      createdAt: moment().format(),
    }

    if (isPro) {
      user.denom = denom.value
      user.siret = siret.value
      user.isPro = true
      user.fullName = denom.value
    }

    else if (!isPro) {
      user.nom = nom.value
      user.prenom = prenom.value
      user.isPro = false
      user.fullName = prenom.value + ' ' + nom.value
    }

    if (!isConnected) {
      Alert.alert('Pas de connection internet', "Veuillez vous connecter au réseau pour pouvoir créer un nouvel utilisateur.")
      return
    }

    await db.collection('newUsers').doc(this.userId).set(user)
    setTimeout(() => { //wait for a triggered cloud function to end (creating user...)
      this.setState({ loadingDialog: false })
      this.props.navigation.navigate(this.prevScreen)
    }, 6000)
  }

  refreshAddress(address) {
    this.setState({ address, addressError: '' })
  }

  render() {
    let { role, isPro, error, loading, loadingDialog, toastType, toastMessage } = this.state
    let { nom, prenom, address, addressError, phone, email, password } = this.state
    let { denom, siret } = this.state
    const { isConnected } = this.props.network

    const showUserTypeRadio = (role === 'Poseur' || role === 'Client')
    const roleLevel = this.props.role.level
    const roles = rolesPicker[roleLevel]

    return (
      <View style={{ flex: 1 }}>
        <Appbar close={!loading} title titleText={this.title} check={!loading} handleSubmit={this.addUser} />

        {loading ?
          <Loading size='large' />
          :
          <ScrollView keyboardShouldPersistTaps="always" style={styles.container} contentContainerStyle={{ backgroundColor: '#fff', padding: constants.ScreenWidth * 0.05 }}>
            <MyInput
              label="Identifiant utilisateur"
              value={this.userId}
              editable={false}
              disabled
            />

            {roles &&
              <Picker
                label="Rôle *"
                returnKeyType="next"
                value={this.state.role}
                error={!!role.error}
                errorText={role.error}
                selectedValue={this.state.role}
                onValueChange={(role) => this.setState({ role })}
                title="Type d'utilisateur *"
                elements={roles}
              />
            }

            {showUserTypeRadio &&
              <RadioButton
                checked={this.state.checked}
                firstChoice={{ title: 'Particulier', value: 'Particulier' }}
                secondChoice={{ title: 'Professionnel', value: 'Professionnel' }}
                onPress1={() => this.setState({ checked: 'first', isPro: false })}
                onPress2={() => this.setState({ checked: 'second', isPro: true })}
                style={{ justifyContent: 'space-between', marginTop: 20 }}
              />
            }

            {!isPro &&
              <MyInput
                label="Prénom *"
                returnKeyType="done"
                value={prenom.value}
                onChangeText={text => updateField(this, prenom, text)}
                error={!!prenom.error}
                errorText={prenom.error}
              />
            }

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

            <AddressInput
              label='Adresse postale'
              offLine={!isConnected}
              onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress })}
              address={address}
              onChangeText={this.setAddress}
              clearAddress={() => this.setAddress('')}
              addressError={addressError}
              isEdit={false}
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
              label="Mot de passe *"
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

            <Toast
              message={toastMessage}
              type={toastType}
              onDismiss={() => this.setState({ toastMessage: '' })} />

            <LoadDialog loading={loadingDialog} message="Création de l'utilisateur en cours..." />

          </ScrollView >
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    role: state.roles.role,
    network: state.network,
    currentUser: state.currentUser
    //fcmToken: state.fcmtoken
  }
}

export default connect(mapStateToProps)(CreateUser)

const styles = StyleSheet.create({
})


