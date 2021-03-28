//Input validators
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import '@react-native-firebase/functions'

import { Alert, Platform } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import FileViewer from 'react-native-file-viewer'
import { decode as atob, encode as btoa } from "base-64"
import SearchInput, { createFilter } from 'react-native-search-filter'
import ShortUniqueId from 'short-unique-id'
import UUIDGenerator from 'react-native-uuid-generator'
import _ from 'lodash'
import { faCheck, faFlag, faTimes, faClock, faUpload, faFileSignature, faSackDollar, faEnvelopeOpenDollar, faEye, faPen, faBan, faSpinner } from '@fortawesome/pro-light-svg-icons'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import * as theme from './theme'

//##VALIDATORS
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

export const compareDates = (date1, date2, operator) => {

  if (operator === 'isBefore') {
    if (moment(date1).isBefore(moment(date2))) return "La date d'échéance doit être supérieure à la date de début."
  }

  else if (operator === 'isAfter') {
    if (moment(date1).isAfter(moment(date2))) return "La date d'échéance doit être supérieure à la date de début."
  }

  else if (operator === 'isSame') {
    if (moment(date1).isSame(moment(date2))) return "La date d'échéance doit être supérieure à la date de début."
  }

  else if (operator === 'isSameOrAfter') {
    if (moment(date1).isSameOrAfter(moment(date2))) return "La date d'échéance doit être supérieure à la date de début."
  }

  else if (operator === 'isSameOrBefore') {
    if (moment(date1).isSameOrBefore(moment(date2))) return "La date d'échéance doit être supérieure à la date de début."
  }

  return "";
}

export const compareDays = (day1, day2, operator) => {
  if (operator === 'isBefore') {
    if (moment(day1).isBefore(moment(day2), 'days')) return "Le jour de fin doit être supérieur au jour de début."
  }
}

export const compareTimes = (time1, time2, operator) => {
  if (operator === 'isBefore') {
    if (moment(time1).isBefore(moment(time2), 'hour')) return "L'heure d'échéance doit être supérieure à l'heure de début."
  }
}

//##NAVIGATION
export const navigateToScreen = (main, screen, params) => {
  main.props.navigation.navigate(screen, params)
}

//##HELPERS

export const formatRow = (data, numColumns) => { //Format rows to display 3 columns grid
  const numberOfFullRows = Math.floor(data.length / numColumns)
  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns)
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true })
    numberOfElementsLastRow++
  }

  return data
}

export const stringifyUndefined = (data) => {
  const stringifiedData = typeof (data) !== 'undefined' ? data : ''
  return stringifiedData
}

export const configChoiceIcon = (choice) => {
  const element = _.cloneDeep(choice)
  if (element.id === 'confirm') { element.icon = faCheck; element.iconColor = theme.colors.primary }
  else if (element.id === 'finish') { element.icon = faFlag; element.iconColor = theme.colors.primary }
  else if (element.id === 'cancel') { element.icon = faTimes; element.iconColor = theme.colors.error }
  else if (element.id === 'skip') { element.icon = faTimes; element.iconColor = theme.colors.error }
  else if (element.id === 'comment') { element.icon = faTimes; element.iconColor = theme.colors.error }
  else if (element.id === 'postpone') { element.icon = faClock; element.iconColor = theme.colors.secondary }
  else if (element.id === 'upload') { element.icon = faUpload; element.iconColor = theme.colors.secondary }
  else if (element.id === 'view') { element.icon = faEye; element.iconColor = theme.colors.secondary }
  else if (element.id === 'edit') { element.icon = faPen; element.iconColor = theme.colors.secondary }
  else if (element.id === 'sign') { element.icon = faFileSignature; element.iconColor = theme.colors.secondary }
  else if (element.id === 'cashPayment') { element.icon = faSackDollar; element.iconColor = theme.colors.secondary }
  else if (element.id === 'financing') { element.icon = faEnvelopeOpenDollar; element.iconColor = theme.colors.secondary }
  else if (element.id === 'block') { element.icon = faBan; element.iconColor = theme.colors.error }
  else if (element.id === 'pending') { element.icon = faSpinner; element.iconColor = theme.colors.gray_dark }
  return element
}

export const articles_fr = (masc, masculins, docType) => {

  let resp
  if (masc === 'du') {
    resp = masculins.includes(docType) ? 'du' : 'de la'
  }
  else if (masc === 'un') {
    console.log('....')
    resp = masculins.includes(docType) ? "un" : "une"
  }
  else if (masc === "d'un") {
    resp = masculins.includes(docType) ? "d'un" : "une"
  }
  else if (masc === 'le') {
    resp = masculins.includes(docType) ? 'le' : 'la'
  }

  return resp
}

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

export const setAttachmentIcon = (type) => {

  switch (type) {
    case 'application/pdf':
      return { name: 'pdf-box', color: '#da251b' }
      break

    case 'application/msword':
      return { name: 'file-word-box', color: '#295699' }
      break

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return { name: 'file-word-box', color: '#295699' }
      break

    case 'image/jpeg':
      return { name: 'image', color: theme.colors.primary }
      break

    case 'image/png':
      return { name: 'image', color: theme.colors.primary }
      break


    case 'application/zip':
      return { name: 'zip', color: theme.colors.primary }
      break

    default:
      return { name: 'image', color: theme.colors.primary }
      break
  }

}

//##WARNINGS
export const isEditOffline = (isEdit, isConnected) => {
  if (!isConnected && isEdit) {
    Alert.alert("", "La mise à jour des données n'est pas disponible en mode hors-ligne. Veuillez vous connecter à internet.")
    return true
  }
  return false
};


// export const generateId = async (main, projectRequestId, docId, field, suffix) => {
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

export const generateId = (suffix, length = 4) => {
  const options = { length }
  const uid = new ShortUniqueId(options)
  const customId = suffix + uid()
  return customId
}

export const uuidGenerator = async () => {
  const uuid = await UUIDGenerator.getRandomUUID()
  return uuid
}

export const updateField = (main, field, text) => {
  field.value = text
  field.error = ''
  main.setState({ field })
}

export const myAlert = function myAlert(title, message, handleConfirm, handleCancel, confirmText = 'Confirmer', cancelText = 'Annuler', extraButton) {
  Alert.alert(
    title,
    message,
    [
      extraButton,
      { text: cancelText, onPress: handleCancel, style: 'cancel' },
      { text: confirmText, onPress: handleConfirm },
    ],
    { cancelable: false }
  )
}

export const downloadFile = async (main, fileName, url) => { //#task configure for ios

  //if file already exists in this device read it..

  try {
    const { config, fs } = RNFetchBlob
    const Dir = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir
    const path = `${Dir}/Synergys/Documents/${fileName}`

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

//##IMAGE PICKER
export const pickImage = async (previousAttachments) => {

  const imagePickerOptions = {
    title: 'Selectionner une image',
    takePhotoButtonTitle: 'Prendre une photo',
    chooseFromLibraryButtonTitle: 'Choisir de la librairie',
    cancelButtonTitle: 'Annuler',
    noData: true,
  }

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

//##FILE PICKER
export const pickDocs = async (attachments, type = [DocumentPicker.types.allFiles]) => {

  try {
    const results = await DocumentPicker.pickMultiple({ type })

    for (const res of results) {
      var fileMoved = false
      var i = 0

      if (res.uri.startsWith('content://')) {

        const Dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
        const destFolder = `${Dir}/Synergys/Documents`
        await RNFS.mkdir(destFolder) //create directory if it doesn't exist
        const destPath = `${destFolder}/${res.name}` //#diff

        fileMoved = await RNFS.moveFile(res.uri, destPath)
          .then(() => { return true })

        if (!fileMoved) throw 'Erreur lors de la séléction du fichier. Veuillez réessayer.'

        const attachment = {
          path: destPath,
          type: res.type,
          name: res.name,
          size: res.size,
          progress: 0
        }

        attachments.push(attachment)
      }

      fileMoved = false
      i = i + 1
    }

    return attachments
  }

  catch (error) {
    if (DocumentPicker.isCancel(error)) return
    return { error }
  }
}

export const pickDoc = async (genName = false, type = [DocumentPicker.types.allFiles]) => {

  try {
    const res = await DocumentPicker.pick({ type })

    //Android only
    if (res.uri.startsWith('content://')) { //#task: remove this condition (useless..)

      const Dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
      const destFolder = `${Dir}/Synergys/Documents`
      await RNFS.mkdir(destFolder)
      const attachmentName = genName ? `Scan-${moment().format('DD-MM-YYYY-HHmmss')}.pdf` : res.name
      const destPath = `${destFolder}/${attachmentName}`

      const fileMoved = await RNFS.moveFile(res.uri, destPath)
        .then(() => { return true })

      if (!fileMoved) throw 'Erreur lors de la séléction du fichier. Veuillez réessayer.'

      const attachment = {
        path: destPath,
        type: res.type,
        name: attachmentName,
        size: res.size,
        progress: 0,
        downloadURL: ''
      }

      return attachment
    }
  }

  catch (error) {
    if (DocumentPicker.isCancel(error)) return
    return { error }
  }
}

//##FILTERS
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
      console.log('field', field)
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










// //File Picker
// export const pickDocs = async (attachments, type = [DocumentPicker.types.allFiles]) => {

//   try {
//     const results = await DocumentPicker.pickMultiple({ type: type })

//     for (const res of results) {
//       var fileMoved = false
//       var i = 0

//       if (res.uri.startsWith('content://')) {

//         const Dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
//         const destFolder = `${Dir}/Synergys/Documents`
//         await RNFS.mkdir(destFolder) //create directory if it doesn't exist
//         const destPath = `${destFolder}/${res.name}` //#diff

//         fileMoved = await RNFS.moveFile(res.uri, destPath)
//           .then(() => { return true })

//         if (!fileMoved) throw 'Erreur lors de la séléction du fichier. Veuillez réessayer.'

//         const attachment = {
//           path: destPath,
//           type: res.type,
//           name: res.name,
//           size: res.size,
//           progress: 0
//         }

//         attachments.push(attachment)
//       }

//       fileMoved = false
//       i = i + 1
//     }

//     return attachments
//   }

//   catch (err) {
//     console.error(err)
//     return { error: err }
//     if (DocumentPicker.isCancel(err))
//       console.log('User has canceled picker')
//     else
//       Alert.alert('Erreur lors de la séléction de fichier(s)')
//   }
// }