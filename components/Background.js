import React, { memo } from "react";
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from "react-native";
import LinearGradient from 'react-native-linear-gradient'
import { constants } from '../core/constants'
import * as theme from '../core/theme'

const Background = ({ children }) => (
  <LinearGradient colors={theme.colors.linearGradientBackground} style={{ flex: 1 }}>
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </LinearGradient>
)

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    paddingHorizontal: constants.ScreenWidth * 0.12,
    width: "100%",
    //maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  stepContainer: {
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default memo(Background);
