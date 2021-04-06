
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Section from './Section'
import * as theme from '../core/theme'

const FormSection = ({ sectionTitle, sectionIcon, form, containerStyle, onPressIcon, iconColor, showSection = true }) => {
    return (
        <View style={[containerStyle, styles.container]}>
          {showSection && <Section text={sectionTitle} icon={sectionIcon} onPressIcon={onPressIcon} iconColor={iconColor} />}

            {form &&
                <View style={styles.formContainer}>
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
        paddingBottom: theme.padding / 2,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: theme.padding,
        paddingVertical: theme.padding / 2
    }
})