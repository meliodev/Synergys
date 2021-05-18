import React, { memo, Component } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Keyboard, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TextInput as paperInput } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'

import Appbar from "../../components/Appbar"
import NewBackground from "../../components/NewBackground"
import Logo from "../../components/Logo"
import Button from "../../components/Button"
import TextInput from "../../components/TextInput"

import * as theme from "../../core/theme";
import { emailValidator, passwordValidator, updateField, load } from "../../core/utils";
import { constants } from '../../core/constants'
import { loginUser } from "../../api/auth-api";
import Toast from "../../components/Toast";

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)

    this.state = {
      email: { value: "", error: "" },
      password: { value: "", error: "", show: false },
      loading: false,
      error: ""
    }
  }

  //Re-initialize inputs
  componentWillUnmount() {
    let { email, password } = this.state
    email = { value: "", error: "" }
    password = { value: "", error: "", show: false }
    this.setState({ email, password }, () => Keyboard.dismiss())
  }

  validateInputs() {
    const { email, password } = this.state
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)

    if (emailError) {
      this.setState({ ...email, error: emailError })
      return false
    }

    if (passwordError) {
      this.setState({ ...password, error: passwordError })
      return false
    }

    return true
  }

  handleLogin = async () => {
    let { loading, email, password, error } = this.state
    if (loading) return
    load(this, true)

    //Inputs validation
    const isValid = this.validateInputs()
    if (!isValid) {
      load(this, false)
      return
    }

    const response = await loginUser({ email: email.value, password: password.value })
    if (response.error) {
      this.setState({ loading: false, error: response.error })
    }
  }

  forgotPassword() {
    if (this.state.loading) return
    this.props.navigation.navigate("ForgotPasswordScreen")
  }

  render() {
    let { loading, email, password, error } = this.state
    const ratio = 332 / 925
    const width = constants.ScreenWidth * 0.5
    const height = width * ratio

    return (
      <NewBackground style={{ justifyContent: 'center' }}>

        <View style={styles.container}>

          <Logo />

          <TextInput
            style={styles.credInput}
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
            editable={!loading}
          />

          <TextInput
            style={styles.credInput}
            label="Mot de passe"
            returnKeyType="done"
            value={password.value}
            onChangeText={text => updateField(this, password, text)}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={!password.show}
            autoCapitalize="none"
            editable={!loading}
            right={<paperInput.Icon name={password.show ? 'eye-off' : 'eye'} color={theme.colors.secondary} onPress={() => {
              password.show = !password.show
              this.setState({ password })
            }} />}
          />

          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={this.forgotPassword}>
              <Text style={[theme.customFontMSregular.body, styles.forgetPasswordLink]}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#33a979', '#58cb7e', '#6edd81']} style={styles.linearGradient}>
              {loading && <ActivityIndicator size='small' color={theme.colors.white} style={{ marginRight: 10 }} />}
              <Text style={[theme.customFontMSmedium.header, { color: '#fff', letterSpacing: 1, marginRight: 10 }]}>SE CONNECTER</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

        <Toast
          message={error}
          onDismiss={() => this.setState({ error: '' })}
          containerStyle={{ bottom: constants.ScreenHeight * 0.35 }} />
      </NewBackground>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: constants.ScreenWidth * 0.1,
    paddingTop: constants.ScreenWidth * 0.1,
  },
  credInput: {
    marginVertical: 0,
    zIndex: 1,
    backgroundColor: theme.colors.background
  },
  synergys: {
    textAlign: 'center',
    color: '#fff',
    marginVertical: 15,
    letterSpacing: 2
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    marginTop: 4
  },
  label: {
    color: theme.colors.secondary
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary
  },
  linearGradient: {
    flexDirection: 'row',
    height: 50,
    width: constants.ScreenWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  forgetPasswordLink: {
    color: theme.colors.secondary,
    zIndex: 1
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    zIndex: 1
  }
})

export default memo(LoginScreen);
