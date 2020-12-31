
import React, { memo } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import * as theme from "../core/theme";
import { Input as TextInput, Item } from 'native-base'
import Icon1 from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/AntDesign'

const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

const Input = ({ errorText, inputSuccess, inputError, verifyInput, ...props }) => (
    <View style={styles.container}>
        <Text>Nom</Text>
        <Item style={{ marginBottom: 33 }} success={inputSuccess} error={inputError}>
            <TextInput

                {...props} />
            {inputSuccess && <Icon2 name='checkcircle' color='green' size={ScreenWidth * 0.05} />}
            {inputError && <Icon1 name='circle-with-cross' color='red' size={ScreenWidth * 0.05} />}
        </Item>
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
)

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 12,
    },
    input: {
        backgroundColor: theme.colors.surface
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4
    }
})

export default memo(Input)
