import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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

import { withNavigation } from 'react-navigation'

const OrderItem = ({ order, onPress, navigation, ...props }) => {

    const setStateColor = (state) => {
        switch (state) {
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

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text numberOfLines={1} style={theme.customFontMSmedium.body}>{order.project.name}</Text>
                <Text style={theme.customFontMSmedium.header}>€ {order.total}</Text>
            </View>

            <View>
                {order.client && <Text><Text style={theme.customFontMSregular.body}>chez</Text> <Text style={theme.customFontMSmedium.body}>{order.client.fullName}</Text></Text>}
                <Text style={[theme.customFontMSregular.caption, { paddingTop: 10 }]}>{order.id}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{moment(order.editedAt, 'lll').format('ll')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: setStateColor(order.state), padding: 2, elevation: 2 }}>
                        <Text style={theme.customFontMSregular.caption}>{order.state}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: theme.colors.background,
        elevation: 3,
        borderRadius: 10,
        marginVertical: 5
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
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
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

export default withNavigation(OrderItem)
