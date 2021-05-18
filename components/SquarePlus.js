import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { faPlus } from '@fortawesome/pro-light-svg-icons'

import * as theme from "../core/theme";
import { constants } from "../core/constants";

import CustomIcon from "./CustomIcon";

const SquarePlus = ({ style, onPress, icon, title = '', ...props }) => (
    <TouchableOpacity style={[styles.imagesBox, style]} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomIcon icon={faPlus} color={theme.colors.gray_dark} size= {21}/>
            {title !== '' && <Text style={[theme.customFontMSregular.caption, { marginLeft: 5, color: theme.colors.gray_dark }]}>{title}</Text>}
        </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    imagesBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 90,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: theme.colors.gray_dark,
        borderRadius: 1
    }
})

export default SquarePlus
