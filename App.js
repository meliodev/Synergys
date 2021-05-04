import React, { Component } from 'react'
import { Button, Dimensions, Alert, Text, LogBox, Image, View, TouchableOpacity, PanResponder, StyleSheet, Platform } from 'react-native'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native'
import { connect } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash'

// // import moment from 'moment';
// // import 'moment/locale/fr'
// // moment.locale('fr')


// // import OffLineBar from './components/OffLineBar'
// // import Test from './components/Test'

// // import firebase, { db } from './firebase'
// // import Store from './Store/configureStore'
// // import { fontsConfig } from './fontConfig'
// // import * as theme from './core/theme'
// // import Wrapper from './Wrapper'
// // import RootController from './Navigation/DrawerNavigator'
// // import { processModel } from './processModel'
// // import RNFetchBlob from 'rn-fetch-blob';


// // const paperTheme = {
// //   ...DefaultTheme,
// //   fonts: configureFonts(fontsConfig),
// //   colors: {
// //     primary: theme.colors.primary,
// //     accent: theme.colors.secondary,
// //     background: theme.colors.background,
// //     surface: theme.colors.surface,
// //     text: theme.colors.secondary,
// //     disabled: theme.colors.gray_medium,
// //     placeholder: theme.colors.gray_dark,
// //     backdrop: theme.colors.white
// //   }
// // }

// // class App extends Component {

// //   async componentDidMount() {

// //     //Notification channels
// //     const channelId = await notifee.createChannel({
// //       id: 'projects',
// //       name: 'projects',
// //       lights: false,
// //       vibration: true,
// //       importance: AndroidImportance.HIGH,
// //     })

// //     this.foregroundMessages = firebase.messaging().onMessage(this.onForegroundMessageReceived)
// //   }

// //   //Forground: messages listener
// //   async onForegroundMessageReceived(message) {
// //     await notifee.displayNotification(JSON.parse(message.data.notifee))
// //   }

// //   componentWillUnmount() {
// //     this.foregroundMessages && this.foregroundMessages()
// //   }

// //   render() {
// //     let persistor = persistStore(Store)
// //     //  persistor.purge()

// //     return (
// //       <Provider store={Store}>
// //         <PersistGate persistor={persistor}>
// //           <PaperProvider theme={paperTheme}>
// //             <MenuProvider>
// //               <Wrapper>
// //                 <RootController />
// //               </Wrapper>
// //             </MenuProvider>
// //           </PaperProvider>
// //         </PersistGate>
// //       </Provider>
// //     )
// //   }
// // }


// // LogBox.ignoreAllLogs(true)

// // export default App




import CustomCrop from "react-native-perspective-image-cropper";
import ImagePicker from 'react-native-image-picker'

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      image: null,
      path: '',
      rectangleCoordinates: {
        topLeft: { x: 50, y: 50 },
        topRight: { x: 50, y: 50 },
        bottomRight: { x: 50, y: 50 },
        bottomLeft: { x: 50, y: 50 }
      }
    }
  }

  componentDidMount() {

    const imagePickerOptions = {
      title: 'Selectionner une image',
      takePhotoButtonTitle: 'Prendre une photo',
      chooseFromLibraryButtonTitle: 'Choisir de la librairie',
      cancelButtonTitle: 'Annuler',
      noData: true,
      mediaType: 'photo'
    }


    ImagePicker.launchCamera(imagePickerOptions, response => {

      if (response.didCancel) console.log('User cancelled image picker')
      else if (response.error) console.log('ImagePicker Error: ', response.error);
      else if (response.customButton) console.log('User tapped custom button: ', response.camera);

      else {

        const path = Platform.OS === 'android' ? response.path : response.uri //try without file://

        console.log(response.width, response.height)
        
        this.setState({
          path,
          imageWidth: response.width,
          imageHeight: response.height,
          image: response.uri,
        })
      }

    })

  }

  updateImage(image, newCoordinates) {
    image = `data:image/jpeg;base64,${image}`
    this.setState({
      image,
      rectangleCoordinates: newCoordinates
    });
  }

  crop() {
    this.customCrop.crop();
  }

  render() {
    const { image, imageHeight, imageWidth, path } = this.state

    if (!image || !imageWidth || !imageHeight || !path) return null

    return (
      <View>
        <CustomCrop
          updateImage={this.updateImage.bind(this)}
          //rectangleCoordinates={this.state.rectangleCoordinates}
          initialImage={this.state.image}
          path={this.state.path}
          height={5000}
          width={this.state.imageWidth}
          ref={ref => (this.customCrop = ref)}
          overlayColor="rgba(18,190,210, 1)"
          overlayStrokeColor="rgba(20,190,210, 1)"
          handlerColor="rgba(20,150,160, 1)"
          enablePanStrict={false}
        />
        <TouchableOpacity onPress={this.crop.bind(this)} style={{ marginTop: 50 }}>
          <Text>CROP IMAGE</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

