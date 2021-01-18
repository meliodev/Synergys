import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import * as theme from '../core/theme'
import { constants } from '../core/constants'
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationItem = ({ notification, ...props }) => (
    <View style={styles.container}>
        <Image source={{ uri: notification.image }} style={styles.avatar} />
        <View style={styles.content}>

            <View style={{ flex: 0.85 }}>
                <View style={styles.text}>
                    {/* <Text style={[theme.customFontMSsemibold.body]}>{notification.name}</Text> */}
                    <Text style={[theme.customFontMSmedium.caption]} numberOfLines={3}>{notification.text}</Text>
                </View>
                <Text style={styles.timeAgo}>2 hours ago</Text>
            </View>

            <View style={{ flex: 0.15, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Menu>
                    <MenuTrigger>
                        <Icon name={'dots-horizontal'} size={22} color='#333' style={{ padding: 5 }} />
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption onSelect={() => console.log('Hey')} style={{ flexDirection: 'row', padding: constants.ScreenWidth * 0.03 }}>
                            <Text style={theme.customFontMSmedium.body}>archiver</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>

        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 0
    },
    mainContent: {
        marginRight: 60
    },
    img: {
        height: 50,
        width: 50,
        margin: 0
    },
    separator: {
        height: 1,
        backgroundColor: "#CCCCCC"
    },
    timeAgo: {
        fontSize: 12,
        color: "#696969"
    },
    name: {
        fontSize: 16,
        color: "#1E90FF"
    }
})

export default NotificationItem
