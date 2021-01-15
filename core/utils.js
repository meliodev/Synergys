//Input validators
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import '@react-native-firebase/functions'

import { Alert, Platform } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'
import FileViewer from 'react-native-file-viewer'
import { decode as atob, encode as btoa } from "base-64"
import SearchInput, { createFilter } from 'react-native-search-filter'


export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "Le champs email est obligatoire.";
  if (!re.test(email)) return "Adresse email non valide.";

  return "";
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return "Le champs mot de passe est obligatoire.";

  return "";
};

export const nameValidator = (name, label) => {
  if (!name || name.length <= 0) return "Le champs " + label + " est obligatoire.";
  // if (!name || name.length <= 0) return "Le champs nom est obligatoire.";

  return "";
};

export const arrayValidator = (array, label) => {
  if (array.length === 0) return `Le champs ${label} est obligatoire`

  return ''
}

export const priceValidator = (price) => {
  price = Number(price)
  console.log(price)
  if (price <= 0) return `Le champs "Prix unitaire" est obligatoire`
  return ""
}

export const phoneValidator = phone => {
  const re = /^((\+)33|0)[1-9](\d{2}){4}$/;

  if (!phone || phone.length <= 0) return "Le champs téléphone est obligatoire.";
  if (!re.test(phone)) return "Numéro de téléphone non valide.";

  return "";
}


//Miscelaneous

export const checkPlural = (arrayLength, string) => {
  let str = ''
  if (arrayLength === 0)
    str = ''

  else if (arrayLength === 1)
    str = arrayLength + string

  else
    str = arrayLength + string + 's'

  return str
}


// export const generatetId = async (main, projectRequestId, docId, field, suffix) => {
//   main.unsubscribe = await firebase.firestore().collection('IdCounter').doc(docId).onSnapshot((doc) => {
//     let increment = 0

//     if (doc.exists)
//       increment = doc.data()[field] + 1


//     else
//       increment = 1

//     let id = projectRequestId
//     projectRequestId.value = suffix + increment
//     main.setState({ projectRequestId, idCount: increment })
//   })
// }

import ShortUniqueId from 'short-unique-id'
import UUIDGenerator from 'react-native-uuid-generator';

export const generatetId = (suffix) => {
  const options = { length: 4 }
  const uid = new ShortUniqueId(options)
  const customId = suffix + uid()
  return customId
}

export const uuidGenerator = () => {
  return UUIDGenerator.getRandomUUID().then((uuid) => {
    return uuid
  })
}

export const updateField = (main, field, text) => {
  field.value = text
  field.error = ''
  main.setState({ field })
}

export const myAlert = function myAlert(title, message, handleConfirm) {
  Alert.alert(
    title,
    message,
    [
      { text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'Confirmer', onPress: handleConfirm }
    ],
    { cancelable: false }
  )
}

export const downloadFile = async (main, fileName, url) => { //#task configure for ios

  //if file already exists in this device read it..
  console.log('fileName', fileName)

  try {
    const { config, fs } = RNFetchBlob
    const Dir = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir
    const path = `${Dir}/Synergys/Documents/Messagerie/${fileName}`

    let fileExist = await RNFetchBlob.fs.exists(path)

    //Open file...
    if (fileExist) {
      FileViewer.open(path, { showOpenWithDialog: true })
        .then(() => console.log('OPENING FILE...'))
        .catch(e => console.log(e))
    }

    //Download file...
    else {
      setToast(main, 'i', 'Début du téléchargement...')

      let options = {
        fileCache: true,
        //path: path, //#ios
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
        },
      }

      return config(options)
        .fetch('GET', url)
        .then(res => {
          //Showing alert after successful downloading
          console.log('res -> ', JSON.stringify(res))
          main.title = ''
        })
        .catch((e) => console.error(e))
      // .catch(() => setToast(main, 'e', 'Erreur lors du téléchargement du fichier, veuillez réessayer.'))
      //.finally(() => load(main, false))
    }
  }

  catch (error) {
    console.error(error)
  }
}

export const setToast = (main, type, toastMessage) => {
  let toastType = ''
  if (type === 'e')
    toastType = 'error'
  else if (type === 's')
    toastType = 'success'
  else if (type === 'i')
    toastType = 'info'

  console.log(toastType, toastMessage)
  main.setState({ toastType, toastMessage })
}

export const load = (main, bool) => {
  main.setState({ loading: bool })
}

export const loadLog = (main, bool, message) => {
  main.setState({ loading: bool, loadingMessage: message })
}

export const setRole = (main, role) => {
  const action = { type: "ROLE", value: role }
  main.props.dispatch(action)
}

export const setUser = (main, displayName, connected) => {
  const action = { type: "DISPLAYNAME", value: { displayName, connected } }
  main.props.dispatch(action)
}

export const base64ToArrayBuffer = (base64) => {
  const binary_string = atob(base64);
  // console.log('binary_string', binary_string)
  const len = binary_string.length;
  //console.log('len', len)
  const bytes = new Uint8Array(len);
  // console.log('bytes', bytes)

  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  console.log(bytes.buffer)

  return bytes.buffer;
}

export const uint8ToBase64 = (u8Arr) => {
  const CHUNK_SIZE = 0x8000; //arbitrary number
  let index = 0;
  const length = u8Arr.length;
  let result = "";
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

//Image picker
const imagePickerOptions = {
  title: 'Selectionner une image',
  takePhotoButtonTitle: 'Prendre une photo',
  chooseFromLibraryButtonTitle: 'Choisir de la librairie',
  cancelButtonTitle: 'Annuler',
  noData: true,
}

export const pickImage = async (previousAttachments) => {
  return new Promise(((resolve, reject) => {

    ImagePicker.showImagePicker(imagePickerOptions, response => {

      if (response.didCancel) reject('User cancelled image picker')
      else if (response.error) reject('ImagePicker Error: ', response.error);
      else if (response.customButton) reject('User tapped custom button: ', response.camera);

      else {
        let attachments = previousAttachments

        const image = {
          type: response.type,
          name: response.fileName,
          size: response.fileSize,
          local: true,
          progress: 0,
        }

        let { path, uri } = response
        if (Platform.OS === 'android') {
          path = 'file://' + path
          image.path = path
        }

        else image.uri = uri

        attachments.push(image)
        resolve(attachments)
      }
    })

  }))
}

//FILTERS
export const setFilter = (main, field, value) => {
  const update = {}
  update[field] = value
  main.setState(update)
}

export const toggleFilter = (main) => {
  main.setState({ filterOpened: !main.state.filterOpened })
}

export const handleFilter = (inputList, outputList, fields, searchInput, KEYS_TO_FILTERS) => {
  outputList = inputList

  for (const field of fields) {
    outputList = outputList.filter(createFilter(field.value, field.label))
  }

  outputList = outputList.filter(createFilter(searchInput, KEYS_TO_FILTERS))
  return outputList
}


export const handleFilterAgenda = (inputList, outputList, fields, KEYS_TO_FILTERS) => {
  outputList = JSON.parse(JSON.stringify(inputList))

  for (let key in outputList) {
    let items = outputList[key]

    for (const field of fields) {
      items = items.filter(createFilter(field.value, field.label))
    }

    outputList[key] = items
  }

  return outputList
}


export const handleFilterTasks = (inputList, fields, KEYS_TO_FILTERS) => {

  let outputList = []

  console.log('inputList', inputList)

  inputList.forEach(taskItems => {

    for (const field of fields) {
      taskItems = taskItems.filter(createFilter(field.value, field.label))
    }

    if (taskItems.length > 0)
      outputList.push(taskItems)

  })

  return outputList
}







