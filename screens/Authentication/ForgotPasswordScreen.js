import React, { memo, Component } from "react";
import { Text, StyleSheet, View } from "react-native";

import Appbar from "../../components/Appbar";
import Background from "../../components/Background"
import Logo from "../../components/Logo"
import Header from "../../components/Header"
import TextInput from "../../components/TextInput"
import Button from "../../components/Button"
import Toast from "../../components/Toast"

import { sendEmailWithPassword } from "../../api/auth-api"
import { emailValidator } from "../../core/utils"
import * as theme from "../../core/theme"
import { constants } from "../../core/constants"

class ForgotPasswordScreen extends Component {

  constructor(props) {
    super(props)
    this._onSendPressed = this._onSendPressed.bind(this)
    this.state = {
      email: { value: "", error: "" },
      toast: { value: "", error: "" },
      loading: false,
    }
  }

  _onSendPressed = async () => {
    let { loading, email, toast } = this.state

    if (loading) return

    const emailError = emailValidator(email.value);

    if (emailError) {
      this.setState({ ...email, error: emailError });
      return
    }

    this.setState({ loading: true })
    const response = await sendEmailWithPassword(email.value);
    this.setState({ loading: false })

    if (response.error)
      setToast(this, 'e', response.error)

    else
      setToast(this, 'i', 'Un email pour modifier le mot de passe a été envoyé.')
  }

  render() {
    let { loading, email, toast } = this.state

    return (
      <View style={{ flex: 1 }}>
        <Appbar back title titleText='Mot de passe oublié' />

        <View style={styles.container}>
          <Logo style= {{alignSelf: 'center'}}/>

          <TextInput
            label="Adresse email"
            returnKeyType="done"
            value={email.value}
            onChangeText={text => {
              email.value = text
              email.error = ""
              this.setState({ email })
            }}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <Button
            loading={loading}
            mode="contained"
            onPress={this._onSendPressed}
            style={styles.button}
          >
            Envoyer un email
          </Button>

          <Toast
            type={toast.type}
            message={toast.value}
            onDismiss={() => {
              toast.type = ""
              toast.value = ""
              this.setState({ toast })
            }
            }
          />
        </View>

      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: constants.ScreenHeight*0.1,
    paddingHorizontal: constants.ScreenWidth*0.1
  },
  back: {
    width: "100%",
    marginTop: 12
  },
  button: {
    marginTop: 12
  },
});

export default memo(ForgotPasswordScreen);
