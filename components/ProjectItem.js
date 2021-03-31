import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

import { ThemeColors, withNavigation } from 'react-navigation'

const ProjectItem = ({ project, onPress, navigation, ...props }) => {

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

    return (
        <Card style={styles.container} onPress={onPress}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={setStepColor(project.step)} style={[styles.linearGradient, styles.stepContainer]}>
                <Text style={[theme.customFontMSregular.body, { color: theme.colors.white }]}>{project.step}</Text>
            </LinearGradient>

            <Card.Content style={styles.content}>
                <View style={{ flex: 1, alignSelf: 'flex-start' }}>
                    <Title style={[theme.customFontMSregular.header]} numberOfLines={1}>{project.name}</Title>
                    {project.description !== '' && <Paragraph style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, marginBottom: 10 }]} numberOfLines={1}>{project.description}</Paragraph>}

                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        {project.address.description !== '' && <Paragraph numberOfLines={2} style={theme.customFontMSregular.body}>à {project.address.description}</Paragraph>}
                        <Paragraph numberOfLines={1} style={theme.customFontMSregular.body}>chez <Paragraph style={[theme.customFontMSregular.caption, { textDecorationLine: 'underline' }]} onPress={() => navigation.navigate('Profile', { userId: project.client.id, isClient: true })}>{project.client.fullName}</Paragraph></Paragraph>
                    </View>

                    <Paragraph style={[theme.customFontMSregular.caption, { color: theme.colors.placeholder }]}>Modifié par <Text style={[theme.customFontMSregular.caption, { color: theme.colors.placeholder, textDecorationLine: 'underline' }]} onPress={() => navigation.navigate('Profile', { userId: project.editedBy.id })}>{project.editedBy.fullName}</Text></Paragraph>

                    <View style={styles.footer}>
                        <Paragraph style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark }]} >{moment(project.editedAt, 'lll').format('ll')} - {moment(project.editedAt, 'lll').format('HH:mm')}</Paragraph>
                        <View style={{ width: constants.ScreenWidth * 0.25, borderRadius: 50, backgroundColor: setStateColor(project.state), padding: 2, elevation: 2 }}>
                            <Paragraph style={[theme.customFontMSregular.caption, { color: theme.colors.secondary, textAlign: 'center' }]}>{project.state}</Paragraph>
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
        borderRadius: 15,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10
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
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    }
})

export default withNavigation(ProjectItem)
