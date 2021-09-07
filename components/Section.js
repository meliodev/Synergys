import React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Title } from 'react-native-paper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { CustomIcon } from './CustomIcon'

import * as theme from "../core/theme"
import { constants } from '../core/constants'

const Section = ({
  style,
  text,
  icon,
  onPressIcon,
  iconColor = theme.colors.gray_dark,
  iconSecondaryColor = undefined,
  rightComponent = null,
  iconSize = 21,
  textStyle,
  onPress
}) => {
  return (
    <TouchableOpacity style={[styles.section, style]} onPress={onPress}>
      <Text style={[theme.customFontMSregular.header, textStyle]}>{text}</Text>
      {rightComponent ?
        rightComponent()
        :
        (icon &&
          <TouchableOpacity onPress={onPressIcon}>
            <FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} secondaryColor={iconSecondaryColor} />
          </TouchableOpacity>
        )
      }
    </TouchableOpacity>
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
