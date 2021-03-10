import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { faPlus } from '@fortawesome/pro-light-svg-icons'

import * as theme from "../core/theme";
import { constants } from "../core/constants";

import CustomIcon from "./CustomIcon";

const AddAttachment = ({ style, onPress, icon, ...props }) => (
    <TouchableOpacity style={[styles.imagesBox, style]} onPress={onPress}>
        <CustomIcon icon={faPlus}  color= {theme.colors.gray_dark} />
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

export default AddAttachment
