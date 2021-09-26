import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-picker/picker'
import * as theme from "../core/theme";
import { constants } from "../core/constants";

const MyPicker = ({ containerStyle, style, pickerContainerStyle, elements, title, showTitle = true, errorText, enabled = true, ...props }) => (
    <View style={[styles.container, style]}>

        <View style={[styles.pickerContainer, pickerContainerStyle]}>
            {showTitle && <Text style={theme.customFontMSregular.caption}>{title}</Text>}
            <Picker
                style={[styles.input]}
                enabled={enabled}
                dropdownIconColor={theme.colors.gray_dark}
                {...props}
            >
                {elements.map((item, index) => <Picker.Item key={index.toString()} label={item.label} value={item.value} />)}
            </Picker>
        </View>

        {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}

    </View>
)

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingTop: 15,
    },
    pickerContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth * 3,
        borderBottomColor: theme.colors.gray_extraLight,
    },
    input: {
        // marginLeft: -8,
        color: theme.colors.gray_dark,
        height: 40,
        alignItems: 'flex-start',
    },
    error: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        color: theme.colors.error
    }
});

export default MyPicker;
