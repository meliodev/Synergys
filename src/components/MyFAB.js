import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { faPlus } from '@fortawesome/pro-light-svg-icons'

import * as theme from "../core/theme";
import { constants } from "../core/constants";

import CustomIcon from "./CustomIcon";
import { color } from "react-native-reanimated";

const MyFAB = ({ color = theme.colors.white, style, onPress, icon, ...props }) => (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress}>
        <CustomIcon icon={icon || faPlus} color={color} />
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    fab: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: constants.ScreenWidth * 0.15,
        height: constants.ScreenWidth * 0.15,
        borderRadius: constants.ScreenWidth * 0.15 / 2,
        zIndex: 2,
        ...theme.style.shadow
    }
});

export default MyFAB
