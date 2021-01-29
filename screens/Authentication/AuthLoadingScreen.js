import React, { memo, Component } from "react"
import { Alert, Text, StyleSheet, Image, ImageBackground, Dimensions, View } from "react-native"
import firebase from "react-native-firebase"
import Loading from "../../components/Loading"

import * as theme from "../../core/theme"
import { setRole, setUser } from '../../core/utils'
import { connect } from 'react-redux'

import LinearGradient from 'react-native-linear-gradient'
// import { View } from "react-native-ui-lib"

const roles = [{ id: 'dircom', value: 'Directeur commercial' }, { id: 'admin', value: 'Admin' }, { id: 'com', value: 'Commercial' }, { id: 'poseur', value: 'Poseur' }, { id: 'tech', value: 'Responsable technique' }, { id: 'client', value: 'Client' }]
const db = firebase.firestore()

class AuthLoadingScreen extends Component {

  componentDidMount() {
    this.unsububscribe = firebase.auth().onAuthStateChanged(async user => {
      console.log("auth changed")
      if (user) {
        setUser(this, user.displayName, true)
       
        const idTokenResult = await user.getIdTokenResult().catch(() => Alert.alert('Aucune donnée en cache pour un fonctionnement Hors-Ligne. Veuillez vous connecter à internet.'))
    
        roles.forEach((role) => {
          if (idTokenResult.claims[role.id])
            setRole(this, role)
        })
      
       firebase.auth().currentUser.reload()
       .then(res => console.log("res ", res))
       .catch(err => console.log("error ", err))

        await firebase.auth().currentUser.reload()
        this.props.navigation.navigate("AgendaStack")
      }

      else {
        console.log("else ")
        setRole(this, '')
        setUser(this, '', false)
        this.props.navigation.navigate("LoginScreen")
      }
    })
  }

  // componentWillUnmount() {
  //   this.unsububscribe()
  // }

  render() {
    return (
      // <LinearGradient colors={['#09a500', '#69b300', '#9fbc00']} style={styles.logo}>
      //   <Text style={[theme.customFontMSregular.h1, styles.synergys]}>HELLO</Text>
      // </LinearGradient>
      <View style={{flex:1, backgroundColor:'white'}}>
        <View>
          <ImageBackground source={require('../../assets/login1.png')} style={{width:'100%', position:'absolute', height:Dimensions.get('window').height, top:450}}>
          </ImageBackground>
          <ImageBackground source={require('../../assets/login2.png')} style={{width:'100%', position:'absolute', height:Dimensions.get('window').height,top:-450}}>
          </ImageBackground>
        </View>
        <View style={{display:'flex', flex:1, alignItems:'center', justifyContent:'center'}}>
          <Image source={require('../../assets/splash_logo.png')}/>
        </View>
      </View>
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
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(AuthLoadingScreen)
