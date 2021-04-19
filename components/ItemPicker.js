import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons'

import CustomIcon from './CustomIcon'

import * as theme from "../core/theme";
import { constants } from "../core/constants";

const ItemPicker = ({ label, value, errorText, onPress, showAvatarText = true, icon = faPlusCircle, editable, style, ...props }) => {

    const noError = errorText === '' || typeof (errorText) === 'undefined' || !errorText
    const noValue = value === '' || typeof (value) === 'undefined' || !value

    const onPressItem = () => {
        if (!editable) return
        else onPress()
    }

    const AvatarText = ({ text }) => (
        <View style={[styles.avatarText]} >
            <Text style={[theme.customFontMSregular.small, { color: theme.colors.white }]}>{text}</Text>
        </View >
    )

    const borderBottomColor = noError ? theme.colors.gray_extraLight : theme.colors.error
    const placeholderColor = noError ? theme.colors.secondary : theme.colors.error
    const labelColor = noError ? placeholderColor : theme.colors.error

    const renderLabel = (font, isPlaceholder) => {
        const paddingTop = isPlaceholder ? 0 : 15
        return <Text numberOfLines={1} style={[font, { color: labelColor, paddingTop }]}>{label}</Text>
    }

    let avatarText = ''

    if (!noValue) {
        //Nom et prénom(s)
        const avatarTextArray = value.split(' ')

        avatarTextArray.forEach(element => {
            if (avatarText.length < 2)
                avatarText = `${avatarText}${element.charAt(0).toUpperCase()}`
        })
    }

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={onPressItem} style={[styles.pickerContainer, { borderBottomColor, paddingTop: !noValue ? 0 : 15, paddingBottom: 10 }]}>

                {!noValue ?
                    <View>
                        {renderLabel(theme.customFontMSregular.caption, false)}
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            {showAvatarText &&
                                <View style={styles.left}>
                                    <AvatarText text={avatarText} />
                                </View>
                            }
                            <View style={{ flex: showAvatarText ? 0.8 : 0.89, flexDirection: 'row' }}>
                                <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{value}</Text>
                            </View>

                            <View style={{ flex: 0.11 }}>
                                <CustomIcon icon={icon} color={theme.colors.inpuIcon} style={{ marginLeft: 5 }} />
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{ height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 11 }}>

                        <View style= {{flex: 0.9}}>
                            {renderLabel(theme.customFontMSregular.body, true)}
                        </View>
                        <View style={{ flex: 0.1 }}>
                            <CustomIcon icon={icon} color={theme.colors.inpuIcon} />
                        </View>
                    </View>
                }


            </TouchableOpacity>

            {!noError ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //backgroundColor: 'green',
    },
    pickerContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth * 3,
        //  backgroundColor: 'purple'
    },
    left: {
        flex: 0.09,
        // marginRight: 7,
        //justifyContent: 'center',
        // backgroundColor: 'blue'
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
