import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { List, Card, Avatar, Title } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Button from './Button'

import * as theme from '../core/theme';
import { constants } from '../core/constants';

import { ThemeColors, withNavigation } from 'react-navigation'

const ProjectItem = ({ project, onPress, navigation, ...props }) => {

    const { id, step, name, description, address, state, client, editedAt, editedBy } = project

    const setStateColor = (state) => {
        switch (state) {
            case 'En attente':
                return theme.colors.pending

            case 'En cours':
                return theme.colors.inProgress
                break

            case 'Terminé':
                return theme.colors.valid
                break

            case 'Annulé':
                return theme.colors.canceled
                break

            default:
                return '#333'
        }
    }

    const setStepColor = (step) => {
        return [theme.colors.valid, theme.colors.valid, theme.colors.valid]
    }

    const viewClientProfile = () => {
        navigation.navigate('Profile', { userId: client.id, isClient: true })
    }

    const lastUpdate = `${moment(editedAt).format('ll')} - ${moment(editedAt).format('HH:mm')}`

    return (
        <Card style={styles.container} onPress={onPress}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={setStepColor(step)} style={[styles.linearGradient, styles.stepContainer]}>
                <Text style={[theme.customFontMSregular.small, styles.header]} numberOfLines={1}>{id}</Text>
                <Text style={[theme.customFontMSregular.body, { color: theme.colors.white }]}>{step}</Text>
            </LinearGradient>

            <Card.Content style={styles.content}>
                <View style={{ flex: 1, alignSelf: 'flex-start' }}>
                    <Title style={[theme.customFontMSregular.body]} numberOfLines={1}>{name}</Title>
                    {description !== '' && <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, marginBottom: 10 }]} numberOfLines={1}>{description}</Text>}

                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        {address.description !== '' && <Text numberOfLines={2} style={theme.customFontMSregular.body}>à {address.description}</Text>}
                        <Text numberOfLines={1} style={theme.customFontMSregular.caption}>chez <Text style={[theme.customFontMSregular.caption, { textDecorationLine: 'underline' }]} onPress={viewClientProfile}>{client.fullName}</Text></Text>
                    </View>

                    {/* <Text style={[theme.customFontMSregular.caption, { color: theme.colors.placeholder }]}>Modifié par <Text style={[theme.customFontMSregular.caption, { color: theme.colors.placeholder, textDecorationLine: 'underline' }]} onPress={() => navigation.navigate('Profile', { userId: editedBy.id })}>{editedBy.fullName}</Text></Text> */}

                    <View style={styles.footer}>
                        <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark }]} >{lastUpdate}</Text>
                        <View style={{ width: constants.ScreenWidth * 0.25, borderRadius: 50, backgroundColor: setStateColor(state), padding: 5, elevation: 2 }}>
                            <Text style={[theme.customFontMSregular.caption, { color: theme.colors.secondary, textAlign: 'center' }]}>{state}</Text>
                        </View>
                    </View>
                </View>
            </Card.Content>

        </Card>
    )

}

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.padding / 2,
        borderRadius: 10,
        elevation: 4,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 0
    },
    header: {
        position: 'absolute',
        left: theme.padding,
        color: theme.colors.white
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5
    },
    stepContainer: {
        height: 33,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    }
})

export default withNavigation(ProjectItem)
