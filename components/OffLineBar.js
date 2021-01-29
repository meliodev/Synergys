import React from "react";
import { View, StyleSheet, Text } from "react-native";
import * as theme from "../core/theme";

const OffLineBar = ({ ...props }) => (
    <View style={styles.container}>
        <Text style={[theme.customFontMSregular.body, { color: theme.colors.white }]}>Mode Hors-Ligne</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: theme.colors.offline,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default OffLineBar
