import React from "react"
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome'
import { StyleSheet, Text } from "react-native"
import * as theme from '../core/theme'
import { Appbar } from 'react-native-paper'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import PropTypes from 'prop-types'

const CustomIcon = ({ icon, size = 24, color = theme.colors.secondary, onPress, style, headerLeft, headerRight, ...props }) => {

    return (
        <FontAwesomeIcon
            icon={icon}
            style={[
                styles.iconStyle,
                //headerLeft && styles.headerLeft,
                //headerRight && styles.headerRight,
                style
            ]}
            color={color}
            size={size}
        // onPress={onPress}
        />
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        color: theme.colors.secondary,
    },
})

export default CustomIcon
