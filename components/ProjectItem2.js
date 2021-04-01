import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { faTools, faToolbox, faLamp, faUserHardHat, faCalendar, faCalendarAlt, faFolderOpen } from '@fortawesome/pro-duotone-svg-icons'
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons'

import CustomIcon from './CustomIcon'

import * as theme from '../core/theme'
import { constants } from '../core/constants'

import { withNavigation } from 'react-navigation'

const iconContainerSize = constants.ScreenWidth * 0.24

const ProjectItem2 = ({ project, onPress, navigation, ...props }) => {

    const setIconPhase = (projectStep) => {
        switch (projectStep) {
            case 'Initialisation':
                return faFolderOpen
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

    const setIconStatus = (projectStatus) => {
        if (projectStatus === 'Terminé')
            return <CustomIcon icon={faCheckCircle} color='green' size={iconContainerSize * 0.2} style={{ position: 'absolute', top: 5, right: 10, zIndex: 1 }} />
        else if (projectStatus === 'Annulé')
            return <CustomIcon icon={faTimesCircle} color={theme.colors.error} size={iconContainerSize * 0.2} style={{ position: 'absolute', top: 5, right: 10, zIndex: 1 }} />
        else return null
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {setIconStatus(project.status)}
            <View style={[styles.iconContainer, { backgroundColor: project.color }]}>
                <CustomIcon icon={setIconPhase(project.step)} size={iconContainerSize * 0.45} color={theme.colors.white} secondaryColor={theme.colors.secondary} />
            </View>
            <View style={{ width: iconContainerSize * 1.1 }}>
                <Text style={[theme.customFontMSregular.caption, { flexWrap: 'wrap', textAlign: 'center', color: theme.colors.secondary }]} numberOfLines={2}>{project.name}</Text>
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
