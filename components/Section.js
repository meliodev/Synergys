import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Title } from 'react-native-paper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { CustomIcon } from './CustomIcon'

import * as theme from "../core/theme"
import { constants } from '../core/constants'

const Section = ({ style, text, icon }) => {
  return (
    <View style={[styles.section, style]}>
      <Text style={theme.customFontMSregular.header}>{text}</Text>
     {icon && <FontAwesomeIcon icon={icon} size={21} color={theme.colors.gray_dark} />}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: constants.ScreenHeight * 0.02,
    paddingHorizontal: theme.padding,
    marginBottom: theme.padding / 2,
    backgroundColor: theme.colors.gray_light
  }
})

export default Section
