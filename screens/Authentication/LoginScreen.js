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





// import React, { Component } from "react"
// import { StyleSheet, Dimensions, View } from "react-native"
// import { PDFDocument, PageSizes, StandardFonts, rgb, values, PDFTextField, degrees, grayscale } from 'pdf-lib'
// import Pdf from "react-native-pdf"
// import RNFS from 'react-native-fs'
// import RNFetchBlob from 'rn-fetch-blob'

// import { db } from '../../firebase'
// import Appbar from '../../components/Appbar'
// import Button from "../../components/Button"
// import LoadDialog from '../../components/LoadDialog'
// import { ficheEEBBase64 } from "../../core/files";

// import moment, { months } from 'moment';
// import 'moment/locale/fr'
// moment.locale('fr')

// // import { fetchAsset, writePdf } from './assets'
// import { logoBase64 } from '../../assets/logoBase64'
// import { termsBase64 } from '../../assets/termsAndConditionsBase64'
// import { uint8ToBase64, base64ToArrayBuffer, articles_fr, setToast, saveFile, displayError } from '../../core/utils'
// import { sizes } from '../../core/theme'
// import * as theme from '../../core/theme'
// import { constants, downloadDir, errorMessages } from "../../core/constants"
// import { Alert } from "react-native"
// import { requestRESPermission, requestWESPermission } from "../../core/permissions"

// //urls
// const urlForm = "https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/Templates%2Fdod_character.pdf?alt=media&token=b2c00766-4377-4d31-ad38-fad84eac5376"
// const urlMario = "https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/Templates%2FAssets%2Fsmall_mario.png?alt=media&token=505b1663-13c5-49b7-91ec-2a4afa0f1bb9"
// const urlEmblem = "https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/Templates%2FAssets%2Fmario_emblem.png?alt=media&token=28813b1e-06c5-487a-bedb-489a0c3f6ed1"

// //local paths
// const formPath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/dod_character`
// const marioImagePath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/small_mario`
// const emblemImagePath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/mario_emblem`

// const { base, font, radius, padding, h1, h2, h3, header, body } = sizes
// const caption = 10
// const lineHeight = 12

// export default class PdfGen extends Component {

//   constructor(props) {
//     super(props)
//     this.titleText = "Test formulaire"

//     this.state = {
//       path: '',
//       pdfBase64: null,
//       loading: true
//     }
//   }

//   async componentDidMount() {
//     await this.generatePurchaseDoc()
//   }

//   // async generatePurchaseDoc() {
//   //   try {
//   //     // Create a new PDFDocument
//   //     const pdfDoc = await PDFDocument.create()

//   //     // Add a blank page to the document
//   //     const page = pdfDoc.addPage([550, 750])

//   //     // Get the form so we can add fields to it
//   //     const form = pdfDoc.getForm()

//   //     // Add the superhero text field and description
//   //     page.drawText('Enter your favorite superhero:', { x: 50, y: 700, size: 20 })

//   //     const superheroField = form.createTextField('favorite.superhero')
//   //     superheroField.setText('One Punch Man')
//   //     superheroField.addToPage(page, { x: 55, y: 640 })

//   //     // Add the rocket radio group, labels, and description
//   //     page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 })

//   //     page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 })
//   //     page.drawText('Saturn IV', { x: 120, y: 500, size: 18 })
//   //     page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 })
//   //     page.drawText('Space Launch System', { x: 340, y: 500, size: 18 })

//   //     const rocketField = form.createRadioGroup('favorite.rocket')
//   //     rocketField.addOptionToPage('Falcon Heavy', page, { x: 55, y: 540 })
//   //     rocketField.addOptionToPage('Saturn IV', page, { x: 55, y: 480 })
//   //     rocketField.addOptionToPage('Delta IV Heavy', page, { x: 275, y: 540 })
//   //     rocketField.addOptionToPage('Space Launch System', page, { x: 275, y: 480 })
//   //     rocketField.select('Delta IV Heavy')

//   //     // Add the gundam check boxes, labels, and description
//   //     page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 })

//   //     page.drawText('Exia', { x: 120, y: 400, size: 18 })
//   //     page.drawText('Kyrios', { x: 120, y: 340, size: 18 })
//   //     page.drawText('Virtue', { x: 340, y: 400, size: 18 })
//   //     page.drawText('Dynames', { x: 340, y: 340, size: 18 })

//   //     const exiaField = form.createCheckBox('gundam.exia')
//   //     const kyriosField = form.createCheckBox('gundam.kyrios')
//   //     const virtueField = form.createCheckBox('gundam.virtue')
//   //     const dynamesField = form.createCheckBox('gundam.dynames')

//   //     exiaField.addToPage(page, { x: 55, y: 380 })
//   //     kyriosField.addToPage(page, { x: 55, y: 320 })
//   //     virtueField.addToPage(page, { x: 275, y: 380 })
//   //     dynamesField.addToPage(page, { x: 275, y: 320 })

//   //     exiaField.check()
//   //     dynamesField.check()

//   //     // Add the planet dropdown and description
//   //     page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 })

//   //     const planetsField = form.createDropdown('favorite.planet')
//   //     planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto'])
//   //     planetsField.select('Pluto')
//   //     planetsField.addToPage(page, { x: 55, y: 220 })

//   //     // Add the person option list and description
//   //     page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 })

//   //     const personField = form.createOptionList('favorite.person')
//   //     personField.addOptions([
//   //       'Julius Caesar',
//   //       'Ada Lovelace',
//   //       'Cleopatra',
//   //       'Aaron Burr',
//   //       'Mark Antony',
//   //     ])
//   //     personField.select('Ada Lovelace')
//   //     personField.addToPage(page, { x: 55, y: 70 })

//   //     // Just saying...
//   //     page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 })

//   //     // Serialize the PDFDocument to bytes (a Uint8Array)
//   //     const pdfBytes = await pdfDoc.save()
//   //     const pdfBase64 = uint8ToBase64(pdfBytes)
//   //     const path = `${downloadDir}/Synergys/Documents/Scan signé ${moment().format('DD-MM-YYYY HHmmss')}.pdf`
//   //     this.setState({ pdfBase64 })
//   //     // console.log('............')
//   //     // RNFS.writeFile(path, pdfBase64, "base64")
//   //     //   .then((success) => this.setState({ path }, () =>console.log('555')))
//   //     //   .catch((err) => console.log(err))
//   //   }

//   //   catch (e) {
//   //     console.log(e)
//   //     displayError({ message: errorMessages.pdfGen })
//   //   }
//   // }


//   async generatePurchaseDoc() {
//     try {
//       const pdfDoc = await PDFDocument.load(ficheEEBBase64)
//       const pages = pdfDoc.getPages()
//       const firstPage = pages[0]

//       firstPage.drawSquare({
//         x: firstPage.getWidth()-396,
//         y: firstPage.getHeight()-104,
//         size: 7,
//         color: rgb(0, 0, 0),
//       })

//       firstPage.drawSquare({
//         x: firstPage.getWidth()-319,
//         y: firstPage.getHeight()-104,
//         size: 7,
//         color: rgb(0, 0, 0),
//       })

//       firstPage.drawSquare({
//         x: firstPage.getWidth()-319,
//         y: firstPage.getHeight()-117,
//         size: 7,
//         color: rgb(0, 0, 0),
//       })

//       const pdfBytes = await pdfDoc.save()
//       const pdfBase64 = uint8ToBase64(pdfBytes)
//       this.setState({ pdfBase64 })
//     }

//     catch (e) {
//       console.log(e)
//     }
//   }

//   render() {
//     const { path, pdfBase64, loading } = this.state
//     if (pdfBase64)
//       var source = { uri: `data:application/pdf;base64,${pdfBase64}` }

//     return (
//       <View style={{ flex: 1 }}>
//         <Appbar back title titleText={this.titleText} />
//         <View style={styles.container} >
//           {
//             pdfBase64 &&
//             <Pdf
//               source={source}
//               style={styles.pdf} />
//           }
//         </View>
//       </View>
//     )
//   }

// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f4f4f4"
//   },
//   pdf: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   }
// })













