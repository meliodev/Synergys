

import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native'
import firebase from '@react-native-firebase/app'
import { faUserPlus, faUserFriends } from '@fortawesome/pro-light-svg-icons'

import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { load, myAlert } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api'

import UserItem from '../../components/UserItem'
import EmptyList from '../../components/EmptyList'
import MyFAB from '../../components/MyFAB'

import { withNavigation } from 'react-navigation'

import SearchInput, { createFilter } from 'react-native-search-filter'
import Loading from '../../components/Loading'
import ListSubHeader from '../../components/ListSubHeader'

const KEYS_TO_FILTERS = ['id', 'fullName', 'nom', 'prenom', 'denom', 'role']
const db = firebase.firestore()

class ListUsers extends Component {

  constructor(props) {
    super(props);
    this.myAlert = myAlert.bind(this)
    this.renderUser = this.renderUser.bind(this)
    this.fetchDocs = fetchDocs.bind(this)

    this.state = {
      usersList: [],
      usersCount: 0,

      loading: true
    }
  }

  async componentDidMount() {
    const query = this.props.query
    this.fetchDocs(query, 'usersList', 'usersCount', () => load(this, false))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  alertDeleteUser(user) {
    const title = "Supprimer l'utilisateur"
    const message = 'Etes-vous sûr de vouloir supprimer cet utilisateur ? Cette opération est irreversible.'
    const handleConfirm = () => this.deleteUser(user)
    this.myAlert(title, message, handleConfirm)
  }

  deleteUser(user) {

    const batch = db.batch()
    const { userType } = this.props

    if (userType === 'utilisateur') {
      //1. Remove user from his team
      if (user.hasTeam) {
        const teamRef = db.collection('Teams').doc(user.teamId)
        batch.update(teamRef, { members: firebase.firestore.FieldValue.arrayRemove(user.id) })
      }

      //2. Update User (deleted = false)
      const userRef = db.collection('Users').doc(user.id)
      batch.update(userRef, { deleted: true, hasTeam: false })
    }

    else if (userType === 'client' || userType === 'prospect') {
      //1. Update Client/Prospect (deleted = false)
      const userRef = db.collection('Clients').doc(user.id)
      batch.update(userRef, { deleted: true })
    }

    // Commit the batch
    batch.commit()
      .then(() => console.log("Batch succeeded !"))
      .catch(e => console.error(e))
  }

  renderUser = (user) => {
    const onPressUser = (item) => {
      if (item.isPro)
        this.props.onPress(item.isPro, item.id, item.denom, '', item.role)
      else
        this.props.onPress(item.isPro, item.id, item.nom, item.prenom, item.role)
    }

    const { userType, permissions, offLine } = this.props
    const { canRead, canUpdate, canDelete } = permissions
    const isClient = userType === 'client' || userType === 'prospect'

    const viewUser = () => this.props.navigation.navigate('Profile', { userId: user.id, isClient })
    const editUser = () => this.props.navigation.navigate('Profile', { userId: user.id, isClient })
    const deleteUser = () => {
      if (offLine) Alert.alert('', 'Impossible de supprimer un utilisateur en mode hors-ligne')
      else this.alertDeleteUser(user)
    }

    let functions = []
    let options = []

    if (canRead) {
      functions.push(viewUser); options.push({ id: 0, title: 'Voir le profil' })
    }

    if (canUpdate) {
      functions.push(editUser); options.push({ id: 1, title: "Modifier" })
    }

    if (canDelete) {
      functions.push(deleteUser); options.push({ id: 2, title: 'Supprimer' })
    }

    return (
      <UserItem
        userType={this.props.userType}
        item={user}
        onPress={() => onPressUser(user)}
        options={options}
        functions={functions}
      />
    )
  }


  onPressFAB() {
    const { prevScreen, userType } = this.props
    const nextScreen = userType === 'utilisateur' ? 'CreateUser' : 'CreateClient'
    const isProspect = userType === 'prospect' ? true : false
    this.props.navigation.navigate(nextScreen, { prevScreen, isProspect })
  }

  render() {
    let { usersCount, usersList, loading } = this.state
    const { userType } = this.props
    const s = usersCount > 1 ? 's' : ''

    const filteredUsers = usersList.filter(createFilter(this.props.searchInput, KEYS_TO_FILTERS))
    const { canCreate } = this.props.permissions

    return (
      <View style={styles.container}>
        {loading ?
          <View style={styles.container}>
            <Loading />
          </View>
          :
          <View style={styles.container}>

            {usersCount > 0 && <ListSubHeader style={{ backgroundColor: theme.colors.background }}>{usersCount} {userType}{s}</ListSubHeader>}
            {usersCount > 0 ?
              <FlatList
                enableEmptySections={true}
                data={filteredUsers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => this.renderUser(item)}
                style={{ paddingHorizontal: theme.padding }}
                contentContainerStyle={{ paddingBottom: 75 }} />
              :
              <EmptyList icon={this.props.emptyListIcon || faUserFriends} iconColor={theme.colors.miUsers} header={this.props.emptyListHeader} description={this.props.emptyListDesc} offLine={this.props.offLine} />
            }

            {canCreate && this.props.showButton && !this.props.offLine &&
              <MyFAB icon={faUserPlus} onPress={this.onPressFAB.bind(this)} />
            }

          </View>}
      </View>
    )
  }
}

export default withNavigation(ListUsers)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  usersCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: constants.ScreenWidth * 0.04,
    paddingLeft: constants.ScreenWidth * 0.05
  }
})