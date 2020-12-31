import React, { Component, memo } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StyleSheet } from 'react-native'
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import LinearGradient from 'react-native-linear-gradient'
import * as theme from '../core/theme';
import { constants } from '../core/constants';

class HomeScreen extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.navigation.setParams({ title: 'Bienvenue' })
  }

  render() {
    return (

      <View style={styles.background}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Logo />
          <Header></Header>

          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate("LoginScreen")}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#09a500', '#69b300', '#9fbc00']} style={[styles.linearGradient, styles.stepContainer]}>
              <Text style={[theme.customFontMSbold.header, { color: '#fff' }]}>CONNECTION</Text>
            </LinearGradient>
          </TouchableOpacity>


        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  linearGradient: {
    //flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 25,
    width: constants.ScreenWidth * 0.8,
    borderRadius: 5
  },
  stepContainer: {
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default memo(HomeScreen);

















// import React, { memo, useEffect } from "react";
// import Background from "../components/Background";
// import Logo from "../components/Logo";
// import Header from "../components/Header";
// import Button from "../components/Button";
// import Paragraph from "../components/Paragraph";

// const HomeScreen = ({ navigation }) => {

//   useEffect(() => {
//  //   navigation.setParams({ title: 'Bienvenue' })
//   })

//   return (
//     <Background>
//       <Logo />
//       <Header>Firebase Login</Header>

//       <Paragraph>
//         This template supports Firebase authorization out of the box.
//     </Paragraph>
//       <Button mode="contained" onPress={() => navigation.navigate("LoginScreen")}>
//         Login
//     </Button>
//       <Button
//         mode="outlined"
//         onPress={() => navigation.navigate("RegisterScreen")}
//       >
//         Sign Up
//     </Button>
//     </Background>
//   );
// };

// export default memo(HomeScreen);

