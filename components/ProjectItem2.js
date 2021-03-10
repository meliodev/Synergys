import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { faBezierCurve, faDrawCircle, faDrawSquare, faTools, faToolbox } from '@fortawesome/pro-duotone-svg-icons'

import CustomIcon from './CustomIcon'

import * as theme from '../core/theme'
import { constants } from '../core/constants'

import { withNavigation } from 'react-navigation'

const iconContainerSize = constants.ScreenWidth * 0.24

const ProjectItem2 = ({ project, onPress, navigation, ...props }) => {
    
    const setIcon = (projectStep) => {
        switch (projectStep) {
            case 'Prospect':
                return faBezierCurve
                break

            case 'Rendez-vous 1':
                return faDrawCircle
                break

            case 'Rendez-vous N':
                return faDrawSquare
                break

            case 'Visite technique':
                return faTools
                break

            case 'Installation':
                return faToolbox
                break
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: project.color }]}>
                <CustomIcon icon={setIcon(project.step)} size={constants.ScreenWidth * 0.12} color={theme.colors.white} secondaryColor={theme.colors.secondary} />
            </View>
            <View style= {{ width: iconContainerSize*1.1 }}>
                <Text style={[theme.customFontMSregular.caption, {flexWrap: 'wrap', textAlign: 'center'}]} numberOfLines={2}>{project.name}</Text>
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
