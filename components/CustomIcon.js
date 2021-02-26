import React from "react"
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome'
import { StyleSheet } from "react-native"
import * as theme from '../core/theme'

const CustomIcon = ({ icon, onPress, style, headerLeft, headerRight, ...props }) => {
    return (
        <FontAwesome
            icon={icon}
            style={[styles.iconStyle, headerLeft && styles.headerLeft, headerRight && styles.headerRight, style]}
            onPress= {onPress} />
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 21,
        color: theme.colors.secondary
    },
    headerRight: {
        position: 'absolute',
        right: theme.padding
    },
    headerLeft: {
        paddingLeft: theme.padding
    }
})

export default CustomIcon
