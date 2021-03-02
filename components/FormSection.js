
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Header from './Header'
import * as theme from '../core/theme'

const FormSection = ({ headerText, headerIcon, form }) => {
    return (
        <View style={styles.container}>
            <Header>
                <Text style= {theme.robotoRegular.h3}>{headerText}</Text>
                {headerIcon}
            </Header>

            <View style={styles.formContainer}>
                {form}
            </View>
        </View>
    )
}

export default FormSection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: theme.padding
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: theme.padding,
        paddingVertical: theme.padding/2
    }
})