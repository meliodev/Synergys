import React, { memo, Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import LinearGradient from 'react-native-linear-gradient'

import NewBackground from "../../components/NewBackground";
import Appbar from "../../components/Appbar";
import Logo from "../../components/Logo"
import TextInput from "../../components/TextInput"
import Button from "../../components/Button"
import Toast from "../../components/Toast"

import { sendEmailWithPassword } from "../../api/auth-api"
import { updateField, emailValidator, load, setToast } from "../../core/utils"
import * as theme from "../../core/theme"
import { constants } from "../../core/constants"

class ForgotPasswordScreen extends Component {

  constructor(props) {
    super(props)
    this.handleSendEmail = this.handleSendEmail.bind(this)
    this.state = {
      email: { value: "", error: "" },
      toastType: '',
      toastMessage: '',
      loading: false,
    }
  }

  handleSendEmail = async () => {
    let { loading, email, toast } = this.state

    if (loading) return
    load(this, true)

    const emailError = emailValidator(email.value)

    if (emailError) {
      setToast(this, 'e', emailError)
      load(this, false)
      return
    }

    const response = await sendEmailWithPassword(email.value);
    load(this, false)

    if (response.error)
      setToast(this, 'e', response.error)

    else
      setToast(this, 'i', 'Un email pour modifier le mot de passe a été envoyé.')
  }

  render() {
    let { loading, email, toastType, toastMessage } = this.state

    return (
      <NewBackground>
        <Appbar back title titleText='Mot de passe oublié' />

        <View style={styles.container}>
          <Logo />

          <TextInput
            style={{ zIndex: 1, backgroundColor: theme.colors.background }}
            label="Adresse email"
            returnKeyType="done"
            value={email.value}
            onChangeText={text => updateField(this, email, text)}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, zIndex: 1 }} onPress={this.handleSendEmail}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#33a979', '#58cb7e', '#6edd81']} style={styles.linearGradient}>
              {loading && <ActivityIndicator size='small' color={theme.colors.white} style={{ marginRight: 10 }} />}
              <Text style={[theme.customFontMSmedium.header, { color: '#fff', letterSpacing: 1, marginLeft: 10 }]}>Envoyer un email</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Toast
            type={toastType}
            message={toastMessage}
            onDismiss={() => this.setState({ toastType: '', toastMessage: '' })}
          />
          
        </View>

      </NewBackground>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: constants.ScreenWidth * 0.1,
    zIndex: 2,

  },
  button: {
    marginTop: 12
  },
  linearGradient: {
    flexDirection: 'row',
    width: constants.ScreenWidth * 0.8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
})

export default memo(ForgotPasswordScreen);
