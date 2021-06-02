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
import { PDFDocument, degrees, PageSizes } from 'pdf-lib'
import _ from 'lodash'
import { faCheck, faFlag, faTimes, faClock, faUpload, faFileSignature, faSackDollar, faEnvelopeOpenDollar, faEye, faPen, faBan, faPauseCircle } from '@fortawesome/pro-light-svg-icons'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import * as theme from './theme'
import { downloadDir, roles } from './constants'

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
    if (moment(time1, 'hh:mm').isBefore(moment(time2, 'hh:mm'), 'hour')) return "L'heure d'échéance doit être supérieure à l'heure de début."
  }
}

export const checkOverlap = (timeSegments) => {
  console.log(timeSegments)
  if (timeSegments.length === 1) return false;

  timeSegments.sort((timeSegment1, timeSegment2) =>
    timeSegment1[0].localeCompare(timeSegment2[0])
  );

  for (let i = 0; i < timeSegments.length - 1; i++) {
    const currentEndTime = timeSegments[i][1];
    const nextStartTime = timeSegments[i + 1][0];

    if (currentEndTime > nextStartTime) {
      return true;
    }
  }

  return false;
};

//##NAVIGATION
export const navigateToScreen = (main, screen, params) => {
  main.props.navigation.navigate(screen, params)
}

//##HELPERS

export const getMinObjectProp = (arrObjects, property) => {
  return arrObjects.reduce((min, object) => object[property] < min ? object[property] : min, arrObjects[0][property])
}

export const getMaxObjectProp = (arrObjects, property) => {
  return arrObjects.reduce((max, object) => object[property] > max ? object[property] : max, arrObjects[0][property])
}

export const formatRow = (active, data, numColumns) => { //Format rows to display 3 columns grid
  if (!active) return data
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
  else if (element.id === 'pending') { element.icon = faPauseCircle; element.iconColor = theme.colors.gray_dark }
  return element
}

export const articles_fr = (masc, masculins, target) => {

  let resp
  if (masc === 'du') {
    resp = masculins.includes(target) ? 'du' : 'de la'
  }
  else if (masc === 'un') {
    resp = masculins.includes(target) ? "un" : "une"
  }
  else if (masc === "d'un") {
    resp = masculins.includes(target) ? "d'un" : "une"
  }
  else if (masc === 'le') {
    resp = masculins.includes(target) ? 'le' : 'la'
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

export const countDown = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
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

export const sortMonths = (monthYearArray) => {

  const months = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.']
  //  const months2 = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre']

  const sorter = (a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year
    }
    else {
      return months.indexOf(a.month) - months.indexOf(b.month)
    }
  }

  monthYearArray.sort(sorter)

  return monthYearArray
}

export const getRoleIdFromValue = (roleValue) => {
  for (const role of roles) {
    if (role.value === roleValue)
      return role.id
  }
}

export const formatDocument = (document, properties) => {
  if (!document) return null
  let formatedDocument = _.pick(document, properties)
  return formatedDocument
}

export const unformatDocument = (thisState, properties, currentUser, isEdit) => {
  let doc = _.pick(thisState, properties)
  doc.editedAt = moment().format()
  doc.editedBy = currentUser
  doc.deleted = false
  if (!isEdit) {
    doc.createdAt = moment().format()
    doc.createdBy = currentUser
  }
  return doc
}

export const removeDuplicateObjects = (arr) => {
  const seen = new Set()

  const filteredArr = arr.filter(object => {
    const duplicate = seen.has(object.id)
    seen.add(object.id)
    return !duplicate
  })

  return filteredArr
}

//##WARNINGS
export const isEditOffline = (isEdit, isConnected) => {
  if (!isConnected && isEdit) {
    Alert.alert("", "La mise à jour des données n'est pas disponible en mode hors-ligne. Veuillez vous connecter à internet.")
    return true
  }
  return false
}

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

export const displayError = (error) => {
  const showError = error && error.message !== "ignore"
  if (showError) Alert.alert('', error.message)
}

export const downloadFile = async (main, fileName, url) => {

  try {
    const path = await setDestPath(fileName)
    const fileExist = await RNFetchBlob.fs.exists(path)

    //Open file...
    if (fileExist) {
      FileViewer.open(path, { showOpenWithDialog: true })
      return true
    }

    //Download file...
    else {
      setToast(main, 'i', 'Début du téléchargement...')

      let options = {
        fileCache: true,
        //path, //#ios
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path,
          description: 'Image',
        },
      }

      return config(options)
        .fetch('GET', url)
        .then(res => {
          main.title = ''
          return true
        })
    }
  }

  catch (error) {
    return false
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

  main.setState({ toastType, toastMessage })
}

export const load = (main, bool) => {
  main.setState({ loading: bool })
}

export const loadLog = (main, bool, message) => {
  main.setState({ loading: bool, loadingMessage: message })
}

//##PDF
export const base64ToArrayBuffer = (base64) => {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
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

export const convertImageToPdf = async (attachment) => {

  let errorMessage = null

  try {
    const isPng = attachment.type === 'image/png'
    const isJpeg = attachment.type === 'image/jpeg'
    if (!isPng && !isJpeg) {
      errorMessage = "Format non compatible pour une conversion en pdf. Veuillez importer un fichier PNG ou JPEG"
      throw new Error(errorMessage)
    }

    const path = attachment.path
    const imageBytes = await RNFS.readFile(path, 'base64')
    const pdfDoc = await PDFDocument.create()
    const image = isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes)
    const page = pdfDoc.addPage(PageSizes.A4)

    const scaleToFit_x = page.getWidth()
    const scaleToFit_y = page.getHeight()
    const jpgDims = image.scaleToFit(scaleToFit_x, scaleToFit_y)
    const image_dx = - jpgDims.width / 2
    const image_dy = - jpgDims.height / 2

    page.drawImage(image, {
      x: page.getWidth() / 2 + image_dx,
      y: page.getHeight() / 2 + image_dy,
      width: jpgDims.width,
      height: jpgDims.height,
    })

    const pdfBytes = await pdfDoc.save()
    const pdfBase64 = uint8ToBase64(pdfBytes)
    return pdfBase64
  }

  catch (e) {
    throw new Error(errorMessage || "Erreur lors de la conversion de l'image en pdf.")
  }
}

//##File system
export const setDestPath = async (fileName) => {
  try {
    const destFolder = `${downloadDir}/Synergys/Documents`
    await RNFS.mkdir(destFolder)
    const destPath = `${destFolder}/${fileName}`
    return destPath
  }

  catch (e) {
    throw new Error('RNFS mkdir error has occured.')
  }
}

export const saveFile = async (file, fileName, encoding) => {
  try {
    const destPath = await setDestPath(fileName)
    await RNFS.writeFile(destPath, file, encoding)
    return destPath
  }
  catch (e) {
    const errorMessage = "Erreur lors de l'enregistrement du document"
    throw new Error(errorMessage)
  }
}

//##IMAGE PICKER
export const pickImage = (previousAttachments, isCamera = false, addPathSuffix = true) => {
  const options = {
    title: 'Selectionner une image',
    takePhotoButtonTitle: 'Prendre une photo',
    chooseFromLibraryButtonTitle: 'Choisir de la librairie',
    cancelButtonTitle: 'Annuler',
    noData: true,
    rotation: 360
  }

  const imagePickerHandler = (response, resolve, reject) => {

    let errorMessage = null

    if (response.didCancel) {
      resolve(previousAttachments)
    }

    else if (response.error) {
      errorMessage = "Erreur lors de la sélection du fichier. Veuillez réessayer."
      reject(new Error(errorMessage))
    }
    
    else {
      const image = {
        type: response.type,
        name: response.fileName,
        size: response.fileSize,
        local: true,
        progress: 0,
        originalRotation: response.originalRotation
      }

      let { path, uri } = response
      if (Platform.OS === 'android') {
        const pathSuffix = addPathSuffix ? 'file://' : ''
        path = pathSuffix + path
        image.path = path
      }
      else image.uri = uri

      let attachments = previousAttachments
      attachments.push(image)
      resolve(attachments)
    }
  }

  return new Promise(((resolve, reject) => {
    if (isCamera) ImagePicker.launchCamera(options, (response) => imagePickerHandler(response, resolve, reject))
    else ImagePicker.showImagePicker(options, (response) => imagePickerHandler(response, resolve, reject))
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
        const destPath = await setDestPath(res.name)
        fileMoved = await RNFS.moveFile(res.uri, destPath).then(() => { return true })
        if (!fileMoved) throw new Error('')

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
    let errorMessage = 'Erreur lors de la sélection du fichier. Veuillez réessayer.'
    if (DocumentPicker.isCancel(error))
      return attachments
    else throw new Error(errorMessage)
  }
}

export const pickDoc = async (genName = false, type = [DocumentPicker.types.allFiles]) => {
  try {
    const res = await DocumentPicker.pick({ type })
    //Android only
    if (res.uri.startsWith('content://')) {
      const attachmentName = genName ? `Scan-${moment().format('DD-MM-YYYY-HHmmss')}.pdf` : res.name
      const destPath = await setDestPath(attachmentName)
      const fileMoved = await RNFS.moveFile(res.uri, destPath).then(() => { return true })

      if (!fileMoved) throw new Error('')

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
    let errorMessage = 'Erreur lors de la sélection du fichier. Veuillez réessayer.'
    if (DocumentPicker.isCancel(error))
      return null
    throw new Error(errorMessage)
  }
}

import { faCloudUploadAlt, faMagic, faFileInvoice, faFileInvoiceDollar, faBallot, faFileCertificate, faFile, faFolderPlus, faHandHoldingUsd, faHandshake, faHomeAlt, faGlobeEurope, faReceipt, faFilePlus, faFileSearch, faFileAlt, faFileEdit, fal } from '@fortawesome/pro-light-svg-icons'
import { highRoles } from './constants'

const publicDocTypes = [
  { label: 'Bon de commande', value: 'Bon de commande', icon: faBallot },
  { label: 'Aide et subvention', value: 'Aide et subvention', icon: faHandshake },
  { label: 'Autre', value: 'Autre', icon: faFile },
]

const allDocTypes = [
  { label: 'Bon de commande', value: 'Bon de commande', icon: faBallot },
  { label: 'Devis', value: 'Devis', icon: faFileInvoice },
  { label: 'Facture', value: 'Facture', icon: faFileInvoiceDollar },
  { label: 'Dossier CEE', value: 'Dossier CEE', icon: faFileCertificate },
  { label: 'Fiche EEB', value: 'Fiche EEB', icon: faFileAlt },
  { label: 'Dossier aide', value: 'Dossier aide', icon: faFolderPlus },
  { label: 'Prime de rénovation', value: 'Prime de rénovation', icon: faHandHoldingUsd },
  { label: 'Aide et subvention', value: 'Aide et subvention', icon: faHandshake },
  { label: 'Action logement', value: 'Action logement', icon: faHomeAlt },
  { label: 'PV réception', value: 'PV réception', icon: faReceipt },
  { label: 'Mandat SEPA', value: 'Mandat SEPA', icon: faGlobeEurope },
  { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV', icon: faFileEdit },
  { label: 'Attestation fluide', value: 'Attestation fluide', icon: faFileEdit },
  { label: 'Autre', value: 'Autre', icon: faFile },
]

let publicTaskTypes = [
  { label: 'Normale', value: 'Normale', natures: ['com', 'tech'] }, //#static
  { label: 'Panne', value: 'Panne', natures: ['com', 'tech'] }, //#static
  { label: 'Entretien', value: 'Entretien', natures: ['com', 'tech'] }, //#static
]

let alltaskTypes = [
  { label: 'Normale', value: 'Normale', natures: ['com', 'tech'] }, //#static
  { label: 'Rendez-vous 1', value: 'Rendez-vous 1', natures: ['com'] }, //#dynamic
  { label: 'Visite technique préalable', value: 'Visite technique préalable', natures: ['com'] }, //#dynamic
  { label: 'Visite technique', value: 'Visite technique', natures: ['tech'] }, //#dynamic
  { label: 'Installation', value: 'Installation', natures: ['tech'] }, //#dynamic
  { label: 'Rattrapage', value: 'Rattrapage', natures: ['tech'] }, //#dynamic
  { label: 'Panne', value: 'Panne', natures: ['tech'] }, //#static
  { label: 'Entretien', value: 'Entretien', natures: ['tech'] }, //#static
  { label: 'Rendez-vous N', value: 'Rendez-vous N', natures: ['com'] }, //restriction: user can not create rdn manually (only during the process and only DC can posptpone it during the process)
]

export const setPickerDocTypes = (currentRole, dynamicType, documentType) => {
  return setPickerTypes(currentRole, dynamicType, documentType, publicDocTypes, allDocTypes)
}

export const setPickerTaskTypes = (currentRole, dynamicType, documentType) => {
  return setPickerTypes(currentRole, dynamicType, documentType, publicTaskTypes, alltaskTypes)
}

const setPickerTypes = (currentRole, dynamicType, documentType, publicTypes, allTypes) => {
  let types = publicTypes

  if (dynamicType && documentType) {
    types.push(documentType)
  }

  //Normal case
  else {
    if (highRoles.includes(currentRole))
      types = allTypes
  }

  return types
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
    if (field.value !== "") {
      outputList = outputList.filter(createFilter(field.value, [field.label]))
    }
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

  inputList.forEach(taskItems => {

    for (const field of fields) {
      taskItems = taskItems.filter(createFilter(field.value, field.label))
    }

    if (taskItems.length > 0)
      outputList.push(taskItems)

  })

  return outputList
}


//## Refresh inputs
export function refreshClient(user) {
  const client = refreshUser(user)
  const address = user.address
  this.setState({ client, address })
}

export function refreshComContact(user) {
  const comContact = refreshUser(user)
  this.setState({ comContact })
}

export function refreshTechContact(user) {
  const techContact = refreshUser(user)
  this.setState({ techContact })
}

export function refreshAssignedTo(user) {
  const assignedTo = refreshUser(user)
  this.setState({ assignedTo, assignedToError: "" })
}

export const refreshUser = (user) => {
  const { isPro, id, denom, nom, prenom, role, email } = user
  const fullName = isPro ? nom : `${prenom} ${nom}`
  const userObject = { id, fullName, email, role }
  return userObject
}

export function refreshAddress(address) {
  this.setState({ address })
}

export function setAddress(description) {
  const address = {
    description,
    marker: { latitude: '', longitude: '' },
    place_id: ''
  }
  this.setState({ address })
}

export function refreshProject(projectObject, setState = true) {
  const { id, name, client, step, address, comContact, techContact, intervenant } = projectObject
  const project = { id, name, client, step, address, comContact, techContact, intervenant }
  if (setState) this.setState({ project, address, client, projectError: '', addressError: '' })
  return project
}




