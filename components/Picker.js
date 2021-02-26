import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-community/picker'
import * as theme from "../core/theme";
import { constants } from "../core/constants";

const MyPicker = ({ containerStyle, style, elements, title, errorText, enabled = true, ...props }) => (
    <View style={[styles.container, containerStyle]}>

        <View style={[styles.pickerContainer]}>
            <Text style={theme.robotoRegular.caption}>{title}</Text>
            <Picker style={[styles.input, style]} enabled= {enabled} {...props}>
                {elements.map((item) => {
                    return <Picker.Item label={item.label} value={item.value} />
                })}
            </Picker>
        </View>
        {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{'errorText'}</Text> : null}

    </View>


)

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 15,
    },
    pickerContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth*2,
        borderBottomColor: theme.colors.gray_extraLight,
    },
    label: {
        fontSize: 12,
        color: '#757575',
    },
    input: {
        marginLeft: -7,
        color: '#333',
        alignItems: 'flex-start',
    },
    error: {
        paddingHorizontal: 4,
        paddingVertical: 10,
        color: theme.colors.error
    }
});

export default MyPicker;
