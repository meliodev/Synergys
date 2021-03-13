import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput as Input, ThemeProvider } from "react-native-paper";
import { faPlusCircle } from '@fortawesome/pro-light-svg-icons'

import CustomIcon from './CustomIcon'

import * as theme from "../core/theme";


const ItemPicker = ({ label, value, errorText, onPress, showAvatarText = true, icon = faPlusCircle, ...props }) => {

    const AvatarText = ({ text }) => (
        <View style={styles.avatarText} >
            <Text style={[theme.customFontMSregular.small, { color: theme.colors.white }]}>{text}</Text>
        </View>
    )

    const borderBottomColor = errorText && errorText !== '' ? theme.colors.error : theme.colors.gray_extraLight
    const placeholderColor = errorText && errorText !== '' ? theme.colors.error : theme.colors.secondary

    if (value) {

        //Nom et prénoms
        const avatarTextArray = value.split(' ')

        let avatarText = ''
        avatarTextArray.forEach(element => {
            if (avatarText.length < 2)
                avatarText = `${avatarText}${element.charAt(0).toUpperCase()}`
        })

        return (
            <TouchableOpacity onPress={onPress} style={[styles.container, { marginBottom: 15, marginTop: 30 }]}>

                <View >
                    <Text style={theme.customFontMSregular.caption}>{label}</Text>
                    <View style={[styles.textArea, { borderBottomColor: borderBottomColor }]}>
                        {showAvatarText &&
                            <View style={styles.left}>
                                <AvatarText text={avatarText} />
                            </View>
                        }
                        <View style={[styles.center, { flex: showAvatarText ? 0.82 : 0.9 }]}>
                            <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{value}</Text>
                        </View>
                        <View style={styles.right}>
                            <CustomIcon icon={icon} color={theme.colors.inpuIcon} />
                        </View>
                    </View>
                </View>

                {/* {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null} */}

            </TouchableOpacity>
        )
    }

    else return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { marginVertical: 5 }]}>
            <View style={[styles.placeholderArea, { borderBottomColor: borderBottomColor }]}>
                <View style={{ flex: 0.9 }}>
                    <Text style={[theme.customFontMSregular.body, { color: placeholderColor }]}>{label}</Text>
                </View>
                <View style={{ flex: 0.1 }}>
                    <CustomIcon icon={icon} color={theme.colors.inpuIcon} />
                </View>
            </View>

            {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'green'
    },
    textArea: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth*2,
        // backgroundColor: 'yellow',
    },
    placeholderArea: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth*2,
    },
    left: {
        flex: 0.08,
        justifyContent: 'center',
        //backgroundColor: 'pink'
    },
    center: {
        flex: 0.82,
        justifyContent: 'center',
        // backgroundColor: 'green'
    },
    right: {
        flex: 0.1,
        justifyContent: 'center',
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
