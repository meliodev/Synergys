
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Section from './Section'
import * as theme from '../core/theme'

const FormSection = ({ sectionTitle, sectionIcon, form, containerStyle, formContainerStyle, onPressIcon, iconColor, showSection = true }) => {
    return (
        <View style={[containerStyle, styles.container]}>
          {showSection && <Section text={sectionTitle} icon={sectionIcon} onPressIcon={onPressIcon} iconColor={iconColor} />}

            {form &&
                <View style={[styles.formContainer, formContainerStyle]}>
                    {form}
                </View>
            }
        </View>
    )
}

export default FormSection

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        paddingBottom: 16,
        paddingHorizontal: theme.padding,
    }
})