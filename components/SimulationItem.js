import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { List, Card, Paragraph, Title, Avatar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Button from './Button'

import * as theme from '../core/theme';
import { constants } from '../core/constants';

import { withNavigation } from 'react-navigation'

const SimulationItem = ({ simulation, onPress, navigation, ...props }) => {

    const { id, estimation, project, editedAt, nameSir, nameMiss, isDraft, createdBy, colorCat } = simulation
    const isNameSir = nameSir !== ""
    const isNameMiss = nameMiss !== ""
    const bothNames = isNameSir && isNameMiss
    if (bothNames)
        var clientsNames = nameSir + " & " + nameMiss
    else if (isNameSir)
        var clientsNames = nameSir
    else if (isNameMiss)
        var clientsNames = nameMiss

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.header}>
                <Text style={[theme.customFontMSregular.small, { color: theme.colors.gray_medium }]}>{id}</Text>
                <Text style={[theme.customFontMSmedium.header, { backgroundColor: colorCat, paddingHorizontal: theme.padding, paddingVertical: 2, borderRadius: 4, color: 'white' }]}>€ {estimation}</Text>
            </View>

            <View style={styles.body}>
                <Text numberOfLines={1} style={[theme.customFontMSmedium.body, { marginBottom: 5, color: project ? theme.colors.secondary : theme.colors.gray_dark }]}>{project ? project.name : "Aucun projet"}</Text>
                <Text>
                    <Text numberOfLines={2} style={[theme.customFontMSmedium.caption, { color: theme.colors.gray_dark }]}>
                        {project && project.client ? project.client.fullName : clientsNames}
                    </Text>
                </Text>
            </View>

            <Text style={[theme.customFontMSregular.caption, { marginBottom: 8, color: theme.colors.gray_dark }]}>Crée par {createdBy.fullName}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark }]}>{moment(editedAt).format('lll')}</Text>
                {isDraft && <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark }]}>Brouillon</Text>}
            </View>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: theme.colors.background,
        elevation: 3,
        borderRadius: 10,
        marginVertical: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    body: {
        marginBottom: 15,
        marginTop: 3
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    stepContainer: {
        height: 33,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

export default withNavigation(SimulationItem)
