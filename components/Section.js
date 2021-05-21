import React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Title } from 'react-native-paper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { CustomIcon } from './CustomIcon'

import * as theme from "../core/theme"
import { constants } from '../core/constants'

const Section = ({ style, text, icon, onPressIcon, iconColor = theme.colors.gray_dark, textStyle }) => {
  return (
    <View style={[styles.section, style]}>
      <Text style={[theme.customFontMSregular.header, textStyle]}>{text}</Text>
      {icon &&
        <TouchableOpacity onPress={onPressIcon}>
          <FontAwesomeIcon icon={icon} size={21} color={iconColor} />
        </TouchableOpacity>
      }
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
    //marginBottom: theme.padding / 2,
    backgroundColor: theme.colors.section
  }
})

export default Section
