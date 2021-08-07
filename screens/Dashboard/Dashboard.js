import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Appbar, CustomIcon, NewBackground, EmptyList } from '../../components'
import { constants } from '../../core/constants';
import { faAnalytics, faArrowAltToRight, faBell, faTasks } from '@fortawesome/pro-duotone-svg-icons'
import _ from 'lodash'
import { connect } from 'react-redux'

import * as theme from '../../core/theme'
import { requestRESPermission, requestWESPermission } from '../../core/permissions'

import firebase from '../../firebase'

import Analytics from './Analytics'
import Tasks from './Tasks'
import Notifications from './Notifications'
import Shortcuts from './Shortcuts'

const colors1 = { primary: '#565df9', secondary: '#e3e3ff' }
const colors2 = { primary: '#ff8400', secondary: '#ffebce' }
const colors3 = { primary: '#64ab5d', secondary: '#e3f0e1' }
const colors4 = { primary: '#df8ad6', secondary: '#faebf7' }

const menuItems = [
    {
        icon: faAnalytics,
        colors: colors1,
        label: 'Analytiques',
        content: 'analytics',
    },
    {
        icon: faTasks,
        colors: colors3,
        label: 'Tâches',
        content: 'tasks',
    },
    {
        icon: faBell,
        colors: colors4,
        label: 'Notifications',
        content: 'notifications',
    },
    {
        icon: faArrowAltToRight,
        colors: colors2,
        label: 'Raccourcis',
        content: 'shortcuts',
    },
]

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: 'analytics'
        }
        if (props.role.id === 'client')
            props.navigation.navigate('ListProjects')
    }

    componentDidMount() {
        requestWESPermission()
        requestRESPermission()
    }

    renderMenuItem(item, index) {
        const { icon, colors, label, content } = item
        const { primary, secondary } = colors
        const isSelected = content === this.state.content
        const backgroundColor = isSelected ? primary : secondary
        const iconColor = isSelected ? theme.colors.white : primary
        const borderBottomColor = isSelected ? primary : theme.colors.white
        const textColor = isSelected ? primary : theme.colors.secondary
        const iconWrapperSize = constants.ScreenWidth * 0.15
        const iconSize = iconWrapperSize * 0.4

        const onPressItem = () => {
            this.setState({ content })
        }

        const menuItemIconWrapperStyle = {
            height: iconWrapperSize,
            width: iconWrapperSize,
            borderRadius: iconWrapperSize / 2,
            borderColor: primary,
            backgroundColor
        }

        const labelStyle = {
            color: textColor,
            textAlign: 'center',
        }

        return (
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor }]} onPress={onPressItem}>
                <View style={[styles.menuItemIconWrapper, menuItemIconWrapperStyle]}>
                    <CustomIcon icon={icon} size={iconSize} color={iconColor} />
                </View>
                <View>
                    <Text style={[theme.customFontMSregular.small, labelStyle]}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderMenuItems() {
        return (
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => {
                    return this.renderMenuItem(item, index)
                })}
            </View>
        )
    }

    render() {
        const { content } = this.state

        return (
            <View style={styles.mainContainer}>
                <Appbar menu title titleText='Accueil' />
                {this.renderMenuItems()}
                <View style={styles.container}>
                    {content === 'analytics' && <Analytics navigation={this.props.navigation} />}
                    {content === 'tasks' && <Tasks navigation={this.props.navigation} />}
                    {content === 'notifications' && <Notifications navigation={this.props.navigation} />}
                    {content === 'shortcuts' && <Shortcuts navigation={this.props.navigation} />}
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Dashboard)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.padding,
        marginTop: 10
    },
    menuItem: {
        alignItems: 'center',
        width: constants.ScreenWidth * 0.2,
        borderBottomWidth: 3,
        paddingBottom: 10
    },
    menuItemIconWrapper: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        // backgroundColor: 'pink',
        paddingHorizontal: theme.padding,
        paddingTop: theme.padding
    }
})

