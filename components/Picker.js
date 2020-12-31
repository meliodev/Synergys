import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-community/picker'
import * as theme from "../core/theme";
import { constants } from "../core/constants";

const MyPicker = ({ containerStyle, style, elements, title, ...props }) => (
    <View style={[styles.container, containerStyle]}>
        <Text style={styles.header}>{title}</Text>
        <Picker
            style={[styles.input, style]}
            // style={{ height: 50, width: constants.ScreenWidth*0.9 }}
            {...props}
        >
            {elements.map((item) => {
                return (<Picker.Item label={item.label} value={item.value} />)
            })}
        </Picker>
    </View>
);

const styles = StyleSheet.create({
    container: {
        //width: "100%",
        marginVertical: 15,
        borderBottomWidth: 0.25,
        borderBottomColor: '#C7C7CD',
        //backgroundColor: 'blue',
    },
    header: {
        fontSize: 12,
        color: '#757575',
    },
    input: {
        marginLeft: -7,
        color: '#333',
        alignItems: 'flex-start'
        //width: "100%",
        // alignSelf: 'center',
        // backgroundColor: 'transparent',
        // borderBottomWidth: 0.25,
        // borderBottomColor: '#C7C7CD',
        // textAlign: 'center',
        // paddingHorizontal: 0
    },
});

export default MyPicker;
