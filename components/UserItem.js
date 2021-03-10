

import React, { Children, Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, } from 'react-native';
import { Checkbox, List } from 'react-native-paper';
import { faAddressCard, faUsers, faUserTie, faUser, faUserShield, faUserCog } from '@fortawesome/pro-solid-svg-icons'

import * as theme from '../core/theme';
import { constants } from '../core/constants';
import { checkPlural } from '../core/utils';

import Menu from './Menu'
import CustomIcon from './CustomIcon'

const UserItem = ({ isTeam, userType, onPress, item, controller, itemStyle, options, functions, ...props }) => {

    if (isTeam) {
        var { name, members } = item
        var membersCount = checkPlural(members.length, ' membre')
    }

    else {
        var { isPro, role, denom, prenom, nom } = item
        var normalUser = (!isPro && item.role !== 'Admin' && role !== 'Back office') //Poseur, Comercial, DC
    }

    const color = theme.colors.primary
    const title = isTeam ? name : isPro ? denom : `${prenom} ${nom}`
    const description = isTeam ? membersCount : userType === 'utilisateur' ? role : (item.phone || item.email)

    const setIcon = () => {
        if (isTeam) return faUsers

        if (userType === 'utilisateur') {
            if (isPro) return faUserTie
            if (normalUser) return faUser
            if (role === 'Admin') return faUserShield
            if (role === 'Back office') return faUserCog
        }

        else if (userType === 'client') return faUser
        else if (userType === 'prospect') return faAddressCard
    }

    const icon = setIcon()

    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, itemStyle]}>

            <View style={styles.visuals}>
                <CustomIcon icon={icon} color={color} size={icon === faUser ? 19 : 24} />
            </View>

            <View style={[styles.primaryTextContainer]}>
                <Text style={[theme.customFontMSregular.body, { marginBottom: 5 }]}>{title}</Text>
                <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark }]}>{description}</Text>
            </View>

            <View style={styles.controller}>
                {options && <Menu options={options} functions={functions} />}
                {controller}
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        marginVertical: 5
    },
    visuals: {
        //flex: 0.18,
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'green',
    },
    primaryTextContainer: {
        flex: 0.85,
        //paddingLeft: 10,
        // backgroundColor: 'pink',
    },
    controller: {
        flex: 0.15,
        alignItems: 'center',
        // backgroundColor: 'brown',
    }
})

export default UserItem
