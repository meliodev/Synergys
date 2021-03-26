import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { faBinoculars, faTools, faToolbox, faLamp, faUserHardHat, faCalendar, faCalendarAlt } from '@fortawesome/pro-duotone-svg-icons'

import CustomIcon from './CustomIcon'

import * as theme from '../core/theme'
import { constants } from '../core/constants'

import { withNavigation } from 'react-navigation'

const iconContainerSize = constants.ScreenWidth * 0.24

const ProjectItem2 = ({ project, onPress, navigation, ...props }) => {

    const setIcon = (projectStep) => {
        switch (projectStep) {
            case 'Prospect':
                return faBinoculars
                break

            case 'Rendez-vous 1':
                return faCalendar
                break

            case 'Rendez-vous N':
                return faCalendarAlt
                break

            case 'Visite technique':
                return faUserHardHat
                break

            case 'Installation':
                return faTools
                break

            case 'Maintenance':
                return faToolbox
                break
        }
    }

    const titleColor = (projectStatus) => {
        if (projectStatus === 'Terminé')
            return theme.colors.primary
        else if (projectStatus === 'Annulé')
            return theme.colors.error
        else return theme.colors.secondary
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: project.color }]}>
                <CustomIcon icon={setIcon(project.step)} size={constants.ScreenWidth * 0.12} color={theme.colors.white} secondaryColor={theme.colors.secondary} />
            </View>
            <View style={{ width: iconContainerSize * 1.1 }}>
                <Text style={[theme.customFontMSregular.caption, { flexWrap: 'wrap', textAlign: 'center', color: titleColor(project.status) }]} numberOfLines={2}>{project.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        //   backgroundColor: 'pink',
    },
    iconContainer: {
        width: iconContainerSize,
        height: iconContainerSize,
        borderRadius: constants.ScreenWidth * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
})

export default withNavigation(ProjectItem2)
