import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-community/picker'
import * as theme from "../core/theme";
import { constants } from "../core/constants";

const MyPicker = ({ containerStyle, style, elements, title, ...props }) => (
    <View style={[styles.container, containerStyle]}>
        <Text style={styles.header}>{title}</Text>
        <Picker style={[styles.input, style]} {...props}>
            {elements.map((item) => {
                return (<Picker.Item label={item.label} value={item.value} />)
            })}
        </Picker>
    </View>
)

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        borderBottomWidth: 0.25,
        borderBottomColor: '#C7C7CD',
    },
    header: {
        fontSize: 12,
        color: '#757575',
    },
    input: {
        marginLeft: -7,
        color: '#333',
        alignItems: 'flex-start'
    },
});

export default MyPicker;
