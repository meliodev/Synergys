import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons'

import CustomIcon from './CustomIcon'

import * as theme from "../core/theme";
import { constants } from "../core/constants";

const ItemPicker = ({ label, value, errorText, onPress, showAvatarText = true, icon = faPlusCircle, style, pickerStyle, editable, ...props }) => {

    const noError = errorText === '' || typeof (errorText) === 'undefined' || !errorText

    const onPressItem = () => {
        if (!editable) return
        else onPress()
    }

    const AvatarText = ({ text }) => (
        <View style={styles.avatarText} >
            <Text style={[theme.customFontMSregular.small, { color: theme.colors.white }]}>{text}</Text>
        </View>
    )

    const borderBottomColor = noError ? theme.colors.gray_extraLight : theme.colors.error
    const placeholderColor = noError ? theme.colors.secondary : theme.colors.error
    const labelColor = noError ? placeholderColor : theme.colors.error

    const renderLabel = () => {
        return (
            <View>
                <Text numberOfLines={1} style={[theme.customFontMSregular.body, { color: labelColor }]}>{label}</Text>
            </View>
        )
    }

    let avatarText = ''

    if (value) {
        //Nom et prénom(s)
        const avatarTextArray = value.split(' ')

        avatarTextArray.forEach(element => {
            if (avatarText.length < 2)
                avatarText = `${avatarText}${element.charAt(0).toUpperCase()}`
        })
    }

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={onPressItem} style={[styles.pickerContainer, { height: 60, borderBottomColor }, pickerStyle]}>

                {renderLabel()}

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {showAvatarText && value &&
                        <View style={styles.left}>
                            <AvatarText text={avatarText} />
                        </View>
                    }

                    <View style={[styles.center, { justifyContent: value ? 'space-between' : 'flex-end' }]}>
                        {value !== '' && <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{value}</Text>}
                        <CustomIcon icon={icon} color={theme.colors.inpuIcon} />
                    </View>

                </View>

            </TouchableOpacity>

            {!noError ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        //backgroundColor: 'black',
    },
    pickerContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        //backgroundColor: 'pink'
    },
    left: {
        marginRight: 7,
        justifyContent: 'center',
        // backgroundColor: 'pink'
    },
    center: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: theme.padding / 1.25,
        // backgroundColor: 'green'
    },
    error: {
        paddingTop: 10,
        color: theme.colors.error
    },
    avatarText: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary
    }
})

export default ItemPicker
