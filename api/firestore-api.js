
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import '@react-native-firebase/functions'
import { Alert, Keyboard } from 'react-native'

import { checkEmailExistance } from './auth-api'
import { nameValidator, emailValidator, passwordValidator, phoneValidator, generateId, updateField, setToast, load, myAlert, navigateToScreen } from "../core/utils"

const db = firebase.firestore()

//#FETCH DOS BY QUERY
export function fetchDocs(query, MyList, MyCount, MyCallBack) {
  this.unsubscribe = query.onSnapshot((querysnapshot) => {
    var List = []
    var Count = 0

    if (querysnapshot)
      querysnapshot.forEach((doc) => {
        var hasPendingWrites = doc.metadata.hasPendingWrites ? true : false

        let document = doc.data()
        document.id = doc.id
        document.hasPendingWrites = hasPendingWrites

        List.push(document)
        Count = Count + 1
      })

    const update1 = {}
    update1[MyList] = List
    this.setState(update1, () => MyCallBack())

    if (MyCount) {
      const update2 = {}
      update2[MyCount] = Count
      this.setState(update2)
    }
  })
}

//#TEAMS
export const deleteTeam = async (team) => {
  // Get a new write batch
  const batch = db.batch()
  const members = team.members

  //1. Update users belonging to this team (detach them from it)
  if (members.length > 0)
    for (const memberId of members) {
      const memberRef = db.collection('Users').doc(memberId)
      batch.update(memberRef, { hasTeam: false, teamId: '' })
    }

  const teamRef = db.collection('Teams').doc(team.id)
  batch.update(teamRef, { deleted: true })

  // //2. Set Deleted team
  // const dltTeamRef = db.collection('DeletedTeams').doc(team.id)
  // batch.set(dltTeamRef, team)

  // //3. Delete the Team
  // const teamRef = db.collection('Teams').doc(team.id)
  // batch.delete(teamRef)

  // Commit the batch
  return await batch.commit()
  // .then(() => console.log('Batch succeeded !'))
  // .catch(e => console.error(e))
}

//#CLIENTS 
export const validateClientInputs = function validateClientInputs(userData, checkPassord = true) {
  let denomError = ''
  let siretError = ''
  let nomError = ''
  let prenomError = ''

  let { isPro, denom, siret, nom, prenom, phone, email, password } = userData

  if (isPro) {
    denomError = nameValidator(denom.value, '"Dénomination sociale"')
    siretError = nameValidator(siret.value, 'Siret')
  }

  else {
    nomError = nameValidator(nom.value, '"Nom"')
    prenomError = nameValidator(prenom.value, '"Prénom"')
  }

  const phoneError = nameValidator(phone.value, '"Téléphone"')
  // const addressError = nameValidator(address.description, '"Adresse"')
  const emailError = emailValidator(email.value)
  const passwordError = checkPassord ? passwordValidator(password.value) : ""

  if (denomError || siretError || nomError || prenomError || phoneError || emailError || passwordError) {

    phone.error = phoneError
    email.error = emailError
    password.error = passwordError

    if (isPro) {
      denom.error = denomError
      siret.error = siretError
      this.setState({ denom, siret, phone, email, password, loading: false })
    }

    else {
      nom.error = nomError
      prenom.error = prenomError
      this.setState({ nom, prenom, phone, email, password, loading: false })
    }

    Keyboard.dismiss()

    setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')

    return false
  }

  return true
}

export const createClient = async function createClient(userData, eventHandlers, ClientId, isConnected, isConversion, isProspect) {
  let { isPro, nom, prenom, denom, siret, address, phone, email, password } = userData
  let { error, loading } = eventHandlers

  //2. ADDING USER DOCUMENT
  let client = {
    address,
    phone: phone.value,
    email: email.value.toLowerCase(),
    isProspect,
    password: password.value,
    userType: 'client',
    deleted: false
  }

  if (isPro) {
    client.denom = denom.value
    client.siret = siret.value
    client.isPro = true
    client.fullName = denom.value
  }

  else if (!isPro) {
    client.nom = nom.value
    client.prenom = prenom.value
    client.isPro = false
    client.fullName = `${prenom.value} ${nom.value}`
  }

  //3'. CREATE CLIENT or CONVERT PROSPECT TO CLIENT (account + document)
  if (!isProspect || isConversion) {

    if (!isConnected) {
      return { error: { title: "Pas de connection internet", message: "Veuillez vous connecter au réseau pour pouvoir créer un nouvel utilisateur." } }
    }

    //Validate if email address already exist
    const emailExist = await checkEmailExistance(email.value)
    if (emailExist) {
      return { error: { title: "", message: "L'adresse email que vous avez saisi est déjà associé à un compte." } }
    }

    if (!isConnected) {
      return { error: { title: "Pas de connection internet", message: "Veuillez vous connecter au réseau pour pouvoir créer un nouvel utilisateur." } }
    }

    client.role = 'Client'
    await db.collection('newUsers').doc(ClientId).set(client)
  }

  //3". CREATE PROSPECT (document only)
  else {
    db.collection('Clients').doc(ClientId).set(client)
  }
}