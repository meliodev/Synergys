import React from "react"
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome'
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import * as theme from '../core/theme'
import { Appbar } from 'react-native-paper'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCommentDots } from '@fortawesome/pro-light-svg-icons'

import PropTypes from 'prop-types'

const CustomIcon = ({ icon = faCommentDots, size = 24, color = theme.colors.secondary, secondaryColor, onPress, style, headerLeft, headerRight, ...props }) => {

    if (onPress) return (
        <TouchableOpacity onPress={onPress}>
            <FontAwesomeIcon
                icon={icon}
                style={[styles.iconStyle, style]}
                color={color}
                secondaryColor={secondaryColor}
                size={size}
            />
        </TouchableOpacity>
    )

    else return (
        <FontAwesomeIcon
            icon={icon}
            style={[styles.iconStyle, style]}
            color={color}
            secondaryColor={secondaryColor}
            size={size}
        />
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        color: theme.colors.secondary,
    },
})

export default CustomIcon
