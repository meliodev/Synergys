import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import {} from "react-native-paper";
import * as theme from "../core/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { faWifiSlash } from '@fortawesome/pro-light-svg-icons'
import CustomIcon from "./CustomIcon";

const EmptyList = ({ icon, iconStyle, header, headerTextStyle, description, descriptionTextStyle, style, offLine = false, offLineHeader, offlineDescription, ...props }) => {

    if (offLine)
        return (
            <View style={[styles.container, style]}>
                <View style={[{ width: 130, height: 130, borderRadius: 75, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff' }, iconStyle]}>
                    <CustomIcon icon={faWifiSlash} size={80} color={theme.colors.gray_medium} />
                </View>
                <View style={[{ marginBottom: 10 }]}>
                    <Text style={[theme.robotoRegular.h3, { textAlign: 'center' }, headerTextStyle]}>Pas de données en cache</Text>
                </View>
                <View>
                    <Text style={[theme.robotoRegular.body, { textAlign: 'center', color: theme.colors.gray_dark }, descriptionTextStyle]}>Veuillez rétablir votre connection réseau pour récupérer les données du serveur.</Text>
                </View>
            </View>
        )

    else return (
        <View style={[styles.container, style]}>
            <View style={[{ width: 130, height: 130, borderRadius: 75, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff' }, iconStyle]}>
                <CustomIcon icon={icon} size={80} color={theme.colors.gray_medium} />
            </View>
            <View style={[{ marginBottom: 10 }]}>
                <Text style={[theme.robotoRegular.h3, { textAlign: 'center' }, headerTextStyle]}>{header}</Text>
            </View>
            <View>
                <Text style={[theme.robotoRegular.body, { textAlign: 'center', color: theme.colors.gray_dark }, descriptionTextStyle]}>{description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 33,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default EmptyList
