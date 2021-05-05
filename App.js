import React, { Component } from 'react'
import { LogBox, Text, View, StyleSheet, Dimensions } from 'react-native'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import Pdf from "react-native-pdf"

import notifee, { AndroidImportance } from '@notifee/react-native'
import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu';
import RNFS from 'react-native-fs'

import firebase from './firebase'
import Store from './Store/configureStore'
import { fontsConfig } from './fontConfig'
import * as theme from './core/theme'
import Wrapper from './Wrapper'
import RootController from './Navigation/DrawerNavigator'
import { processModel } from './processModel'
import { pickImage, uint8ToBase64 } from './core/utils'

// const paperTheme = {
//   ...DefaultTheme,
//   fonts: configureFonts(fontsConfig),
//   colors: {
//     primary: theme.colors.primary,
//     accent: theme.colors.secondary,
//     background: theme.colors.background,
//     surface: theme.colors.surface,
//     text: theme.colors.secondary,
//     disabled: theme.colors.gray_medium,
//     placeholder: theme.colors.gray_dark,
//     backdrop: theme.colors.white
//   }
// }

// class App extends Component {

//   async componentDidMount() {

//     //Notification channels
//     const channelId = await notifee.createChannel({
//       id: 'projects',
//       name: 'projects',
//       lights: false,
//       vibration: true,
//       importance: AndroidImportance.HIGH,
//     })

//     this.foregroundMessages = firebase.messaging().onMessage(this.onForegroundMessageReceived)
//   }

//   //Forground: messages listener
//   async onForegroundMessageReceived(message) {
//     await notifee.displayNotification(JSON.parse(message.data.notifee))
//   }

//   componentWillUnmount() {
//     this.foregroundMessages && this.foregroundMessages()
//   }

//   render() {
//     let persistor = persistStore(Store)
//     //  persistor.purge()

//     return (
//       <Provider store={Store}>
//         <PersistGate persistor={persistor}>
//           <PaperProvider theme={paperTheme}>
//             <MenuProvider>
//               <Wrapper>
//                 <RootController />
//               </Wrapper>
//             </MenuProvider>
//           </PaperProvider>
//         </PersistGate>
//       </Provider>
//     )
//   }
// }


import { PDFDocument, degrees, PageSizes } from 'pdf-lib'
import { pickDoc } from './core/utils';

// For example, `pdfBytes` can be:
//   • Written to a file in Node
//   • Downloaded from the browser
//   • Rendered in an <iframe>
class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      source: null,
      pdfBase64: '',
      loading: true
    }
  }

  async componentDidMount() {
    // These should be Uint8Arrays or ArrayBuffers
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()


    const attachments = await pickImage([])
    const attachment = attachments[0]
    const path = attachment.path

    const jpgImageBytes = await RNFS.readFile(path, 'base64')

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // Embed the JPG image bytes and PNG image bytes
    const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)

    // Get the width/height of the JPG image scaled down to 25% of its original size

    // Add a blank page to the document
    const page = pdfDoc.addPage(PageSizes.A4)

    if (jpgImage.width < jpgImage.height) {
      const jpgDims = jpgImage.scaleToFit(page.getWidth(), page.getHeight())

      page.drawImage(jpgImage, {
        x: page.getWidth() / 2 - jpgDims.width / 2,
        y: page.getHeight() / 2 - jpgDims.height / 2,
        width: jpgDims.width,
        height: jpgDims.height,
      })
    }

    else {
      const jpgDims = jpgImage.scaleToFit(page.getHeight(), page.getWidth())

      page.drawImage(jpgImage, {
        x: page.getWidth() / 2 - jpgDims.height / 2,
        y: page.getHeight() / 2 + jpgDims.width / 2,
        width: jpgDims.width,
        height: jpgDims.height,
        rotate: degrees(-90),
      })

    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    const pdfBase64 = uint8ToBase64(pdfBytes)
    const source = { uri: `data:application/pdf;base64,${pdfBase64}` }
    this.setState({ source, pdfBase64 }, () => this.setState({ loading: false }))
  }

  render() {
    const { source } = this.state

    if (!source) return <Text>Waiting...</Text>

    else return (
      <View style={{ flex: 1 }}>
        <View style={styles.container} >
          {source &&
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages, filePath, { width, height }) => {
                console.log(`number of pages: ${numberOfPages}`)
                console.log(`width: ${width}`)
                console.log(`height: ${height}`)
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`)
              }}
              onError={(error) => {
                console.log(error)
              }}
              onPressLink={(uri) => {
                console.log(`Link presse: ${uri}`)
              }}
              style={styles.pdf} />
          }
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }
})

LogBox.ignoreAllLogs(true)

export default App


