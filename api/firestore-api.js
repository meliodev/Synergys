
import { Alert, Keyboard } from 'react-native'
import { auth, db } from '../firebase'
import { checkEmailExistance } from './auth-api'
import { sortMonths, nameValidator, emailValidator, passwordValidator, phoneValidator, generateId, updateField, setToast, load, myAlert, navigateToScreen } from "../core/utils"
import moment from 'moment'
import 'moment/locale/fr'
import { errorMessages } from '../core/constants'
moment.locale('fr')

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
    this.setState(update1)

    if (MyCount) {
      const update2 = {}
      update2[MyCount] = Count
      this.setState(update2, () => MyCallBack())
    }
  })
}

export function fetchDocuments(query) {
  return query.get()
    .then((querySnapshot) => {
      let documents = []
      if (querySnapshot.empty) return documents
      for (const doc of querySnapshot.docs) {
        let data = doc.data()
        data.id = doc.id
        documents.push(data)
      }
      return documents
    })
    .catch((e) => { throw new Error(e) })
}

export function fetchDocument(collection, id, subCollection, subId) {
  let query = db.collection(collection).doc(id)
  if (subCollection) query = query.collection(subCollection).doc(subId)
  return query.get()
    .then((doc) => {
      if (!doc.exists) return null
      let data = doc.data()
      data.id = doc.id
      return data
    })
    .catch((e) => { throw new Error('Erreur lors de la connection avec la base de données. Veuillez réessayer plus tard.') })
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

  // Commit the batch
  return await batch.commit()
}

//#CLIENTS 
export const validateClientInputs = function validateClientInputs(userData, checkPassord = true) {
  let denomError = ''
  let siretError = ''
  let nomError = ''
  let prenomError = ''

  let { isPro, denom, siret, nom, prenom, phone, email, password, address } = userData

  if (isPro) {
    denomError = nameValidator(denom.value, '"Dénomination sociale"')
    siretError = nameValidator(siret.value, 'Siret')
  }

  else {
    nomError = nameValidator(nom.value, '"Nom"')
    prenomError = nameValidator(prenom.value, '"Prénom"')
  }

  const phoneError = nameValidator(phone.value, '"Téléphone"')
  const emailError = emailValidator(email.value)
  const passwordError = checkPassord ? passwordValidator(password.value) : ""
  const addressError = nameValidator(address.description, '"Adresse"')

  if (denomError || siretError || nomError || prenomError || phoneError || emailError || passwordError || addressError) {

    phone.error = phoneError
    email.error = emailError
    password.error = passwordError

    if (isPro) {
      denom.error = denomError
      siret.error = siretError
      this.setState({ denom, siret, phone, email, password, addressError, loading: false })
    }

    else {
      nom.error = nomError
      prenom.error = prenomError
      this.setState({ nom, prenom, phone, email, password, addressError, loading: false })
    }

    setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
    return false
  }

  return true
}

export const createClient = async function createClient(userData, ClientId, isConnected, isConversion, isProspect) {
  let { isPro, nom, prenom, denom, siret, address, phone, email, password } = userData

  //2. ADDING USER DOCUMENT
  let client = {
    address,
    phone: phone.value,
    email: email.value.toLowerCase(),
    isProspect,
    password: password.value,
    userType: 'client',
    createdBy: { id: auth.currentUser.uid, fullName: auth.currentUser.displayName },
    createdAt: moment().format(),
    isPro,
    deleted: false
  }

  if (isPro) {
    client.denom = denom.value
    client.siret = siret.value
    client.fullName = denom.value
  }

  else if (!isPro) {
    client.nom = nom.value
    client.prenom = prenom.value
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

export const fetchTurnoverData = async function fetchTurnoverData(query, turnoverObjects, userId) {
  try {
    let turnoverdata = []
    let chartDataObjects = []
    let chartDataSets = []
    const currentMonth = moment().format('MM-YYYY')

    const querySnapshot = await query.get().catch((e) => { throw new Error(errorMessages.firestore.get) })
    for (const doc of querySnapshot.docs) {
      const monthsTurnovers = doc.data()
      delete monthsTurnovers.target
      delete monthsTurnovers.current

      for (const month in monthsTurnovers) {
        //Update user income for "month"
        let currentIncome = turnoverObjects[month] && turnoverObjects[month].current || 0
        const projectsIncome = monthsTurnovers[month].projectsIncome || {}
        for (var projectId in projectsIncome) {
          currentIncome += Number(projectsIncome[projectId].amount)
        }

        //Update Income sources
        let sources = turnoverObjects[month] && turnoverObjects[month].sources || []
        for (var projectId in projectsIncome) {
          let source = {}
          source.projectId = projectId
          source.amount = projectsIncome[projectId].amount
          sources.push(source)
        }

        const year = moment(month, 'MM-YYYY').format('YYYY')
        const monthLowerCase = moment(month, 'MM-YYYY').format('MMM')
        const monthUpperCase = monthLowerCase.charAt(0).toUpperCase() + monthLowerCase.slice(1)
        // const { target } = monthsTurnovers[month]

        const monthTurnover = {
          id: year,
          month: monthUpperCase,
          year,
          monthYear: month,
          //target,
          isCurrent: month === moment().format('MM-YYYY'),
          current: currentIncome,
          sources,
        }

        turnoverObjects[month] = monthTurnover
      }
    }

    //Each user has his target (DC's monthly target is the global turnover of month) (Com's monthly target is his own turnover)
    const querySnapshotUsers = await db
      .collection('Users')
      .doc(userId)
      .collection('Turnover')
      .get()
      .catch((e) => { throw new Error(errorMessages.firestore.get) })

    for (const doc of querySnapshot.docs) {
      const monthsTurnovers = doc.data()
      delete monthsTurnovers.target
      delete monthsTurnovers.current

      for (const month in monthsTurnovers) {
        turnoverObjects[month].target = monthsTurnovers[month].target
      }
    }

    return turnoverObjects
  }

  catch (e) {
    throw new Error(e)
  }
}
