import React, { memo } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Picker } from '@react-native-picker/picker'
import * as theme from "../core/theme";
import { constants } from "../core/constants";
import CustomIcon from './CustomIcon'
import { Caption } from './typography/Typography'
import { faAngleDown } from "@fortawesome/pro-light-svg-icons";

const MyPicker = ({ containerStyle, style, pickerContainerStyle, elements, title, showTitle = true, errorText, enabled = true, ...props }) => {

    const picker = () => {
        return (
            <Picker
                //style={[styles.input]}
                enabled={enabled}
                dropdownIconColor={theme.colors.gray_dark}
                {...props}
            >
                {elements.map((item, index) => <Picker.Item key={index.toString()} label={item.label} value={item.value} />)}
            </Picker>
        )
    }

    renderPicker = () => {
        if (Platform.OS === "android")
            return picker()

        else return (
            <View style={styles.iosPicker}>
                <Caption text="Hello world"/>
                <CustomIcon icon={faAngleDown} color={theme.colors.gray_dark} />
            </View>
        )
    }

    return (
        <View style={[styles.container, style]}>

            <View style={[styles.pickerContainer, pickerContainerStyle]}>
                {showTitle && <Text style={theme.customFontMSregular.caption}>{title}</Text>}
                {renderPicker()}
            </View>

            {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingTop: 15,
    },
    pickerContainer: {
        borderBottomWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth * 3 : 0,
        borderBottomColor: theme.colors.gray_extraLight,
    },
    input: {
        color: theme.colors.gray_dark,
        //height: 40,
        //alignItems: 'flex-start',
    },
    error: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        color: theme.colors.error
    },
    iosPicker: {
        flexDirection: "row", 
        alignItems:"center", 
        justifyContent:"space-between", 
        paddingVertical: 5, 
        ...theme.style.inputBorderBottom
    }
});

export default MyPicker;
