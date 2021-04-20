import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Appbar, CustomIcon, NewBackground } from '../../components'
import { constants } from '../../core/constants';
import { faLayerPlus, faChartLine, faArrowAltToRight } from '@fortawesome/pro-duotone-svg-icons'

import * as theme from '../../core/theme'

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: ''
        }
    }

    renderItem(icon, colors, label, navScreen, style) {
        const { primary, secondary, tertiary } = colors
        return (
            <TouchableOpacity style={[styles.menuItem, style]} onPress={() => this.props.navigation.navigate(navScreen)}>
                <CustomIcon
                    icon={icon}
                    color={primary}
                    secondaryColor={secondary}
                    size={constants.ScreenHeight * 0.07}
                />
                <View style={[styles.itemLabel, { backgroundColor: tertiary }]}>
                    <Text style={[theme.customFontMSmedium.h3, { letterSpacing: 1.5, color: primary, textAlign: 'center' }]}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <NewBackground style={styles.mainContainer}>
                <Appbar menu title titleText='Accueil' />
                <View style={styles.contentContainer}>
                    {this.renderItem(faLayerPlus, { primary: '#4699f5', secondary: '#bfe1fa', tertiary: '#cee8f9' }, 'NOUVEAUTÉS', 'Summary', { backgroundColor: '#deeff9' })}
                    {this.renderItem(faChartLine, { primary: '#fab627', secondary: '#fbde98', tertiary: '#faebce' }, 'STATISTIQUES', 'Statistics', { backgroundColor: '#fbf4e4' })}
                    {this.renderItem(faArrowAltToRight, { primary: '#fa2788', secondary: '#f8bad1', tertiary: '#f8d6e4' }, 'RACCOURCIS', 'Shortcuts', { backgroundColor: '#f9e6ec' })}
                </View>
            </NewBackground>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: theme.padding,
        paddingVertical: constants.ScreenHeight * 0.05
    },
    menuItem: {
        elevation: 3,
        height: constants.ScreenHeight * 0.25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 40,
        borderRadius: 25,
        marginBottom: 20,
    },
    itemLabel: {
        elevation: 4,
        paddingHorizontal: 30,
        paddingVertical: 25,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100
    }
});

