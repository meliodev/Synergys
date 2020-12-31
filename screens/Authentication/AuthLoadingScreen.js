import React, { memo, Component } from "react";
import { Alert, Text, StyleSheet } from "react-native";
import firebase from "react-native-firebase";
import Loading from "../../components/Loading";

import * as theme from "../../core/theme";
import { setRole, setUser } from '../../core/utils'
import { connect } from 'react-redux'

import LinearGradient from 'react-native-linear-gradient'

const roles = [{ id: 'dircom', value: 'Directeur commercial' }, { id: 'admin', value: 'Admin' }, { id: 'com', value: 'Commercial' }, { id: 'poseur', value: 'Poseur' }, { id: 'tech', value: 'Responsable technique' }, { id: 'client', value: 'Client' }]
const db = firebase.firestore()

class AuthLoadingScreen extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(this, user.displayName, true)

        const idTokenResult = await user.getIdTokenResult().catch(() => Alert.alert('Aucune donnée en cache pour un fonctionnement Hors-Ligne. Veuillez vous connecter à internet.'))

        roles.forEach((role) => {
          if (idTokenResult.claims[role.id]) {
            setRole(this, role)
            return
          }
        })

        await firebase.auth().currentUser.reload()
        this.props.navigation.navigate("NewsStack")
      }

      else {
        setRole(this, '')
        setUser(this, '', false)
        this.props.navigation.navigate("HomeScreen");
      }
    })

    // db.collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {

    //   })
    // })

  }

  render() {
    return (
      <LinearGradient colors={['#09a500', '#69b300', '#9fbc00']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[theme.customFontMSregular.h1, styles.synergys]}>SYNERGYS</Text>
      </LinearGradient>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    role: state.roles.role,
    user: state.user.user,
    //fcmToken: state.fcmtoken
  }
}


const styles = StyleSheet.create({
  synergys: {
    textAlign: 'center',
    color: '#fff',
    marginVertical: 15,
    letterSpacing: 2,
    fontSize: 45
  }
})

export default connect(mapStateToProps)(AuthLoadingScreen)
