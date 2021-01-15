import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, StatusBar, Text, Alert, Dimensions, TouchableOpacity, View, FlatList } from 'react-native'
import { Avatar } from 'react-native-paper'
import AvatarText from '../components/AvatarText'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebase from '@react-native-firebase/app'
import { logoutUser } from '../api/auth-api'

import { connect } from 'react-redux'
import * as theme from '../core/theme';
import { constants } from '../core/constants';
import { setRole } from '../core/utils';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

//Admin menu
const arrMenuAdmin = [
    { 'id': 0, name: 'Accueil', 'icon': 'home', 'color': '#64B5F6', 'navScreen': 'ProjectsStack' },
    { 'id': 1, name: 'Boite de réception', 'icon': 'comment-text-multiple', 'color': '#EF6C00', 'navScreen': 'InboxStack' },
    { 'id': 2, name: 'Projets', 'icon': 'alpha-p-box', 'color': '#3F51B5', 'navScreen': 'ProjectsStack' }, //Create
    { 'id': 3, name: 'Planning', 'icon': 'calendar', 'navScreen': 'AgendaStack' },
    { 'id': 4, name: 'Utilisateurs', 'icon': 'account-multiple-outline', 'color': '#2E7D32', 'navScreen': 'UsersManagementStack' },
    { 'id': 5, name: 'Gestion des demandes', 'icon': 'arrow-left-bold', 'color': '#AD1457', 'navScreen': 'RequestsManagementStack' },//Create
    { 'id': 6, name: 'Gestion des commandes', 'icon': 'file-document-edit-outline', 'navScreen': 'OrdersStack' }, //Create
    { 'id': 7, name: 'Documents', 'icon': 'file-document', 'color': '#6D4C41', 'navScreen': 'DocumentsStack' }, //Create
    { 'id': 8, name: 'Actualités', 'icon': 'newspaper', 'navScreen': 'NewsStack' },//Create
    { 'id': 9, name: 'Se déconnecter', 'icon': 'logout', 'color': '#000000', 'navScreen': 'LoginScreen' },
]

const arrMenuDirCom = [
    { 'id': 0, name: 'Accueil', 'icon': 'home-outline', 'navScreen': 'Dashboard' },
    { 'id': 1, name: 'Boite de réception', 'icon': 'comment-text-multiple', 'navScreen': 'Inbox' },
    { 'id': 2, name: 'Mes Projets', 'icon': 'alpha-p-box', 'navScreen': 'ListProjects' }, //Create
    { 'id': 3, name: 'Planning', 'icon': 'calendar', 'navScreen': 'Agenda' },
    { 'id': 4, name: 'Mes Tickets', 'icon': 'arrow-left-bold-outline', 'navScreen': 'RequestsManagementStack' },//Create
    { 'id': 5, name: 'Mes Documents', 'icon': 'file-document', 'navScreen': 'Upload' }, //Create
    { 'id': 6, name: 'Actualités', 'icon': 'newspaper', 'navScreen': 'ListNews' },//Create
    { 'id': 7, name: 'Se déconnecter', 'icon': 'logout', 'navScreen': 'LoginScreen' },
]

const arrMenuCom = [
    { 'id': 0, name: 'Accueil', 'icon': 'home-outline', 'navScreen': 'Dashboard' },
    { 'id': 1, name: 'Boite de réception', 'icon': 'comment-text-multiple', 'navScreen': 'Inbox' },
    { 'id': 2, name: 'Mes Projets', 'icon': 'alpha-p-box', 'navScreen': 'ListProjects' }, //Create
    { 'id': 3, name: 'Planning', 'icon': 'calendar', 'navScreen': 'Agenda' },
    { 'id': 4, name: 'Mes Tickets', 'icon': 'arrow-left-bold-outline', 'navScreen': 'RequestsManagementStack' },//Create
    { 'id': 5, name: 'Mes Documents', 'icon': 'file-document', 'navScreen': 'Upload' }, //Create
    { 'id': 6, name: 'Actualités', 'icon': 'newspaper', 'navScreen': 'ListNews' },//Create
    { 'id': 7, name: 'Se déconnecter', 'icon': 'logout', 'navScreen': 'LoginScreen' },
]

const arrMenuPoseur = [
    { 'id': 0, name: 'Tableau de bord', 'icon': 'home-outline', 'navScreen': 'Dashboard' },
    { 'id': 1, name: 'Agenda Poseur', 'icon': 'calendar', 'navScreen': 'Agenda2' },
    { 'id': 2, name: 'Boite de réception', 'icon': 'comment-text-multiple', 'navScreen': 'P' },
    // { 'id': 3, name: 'Utilisateurs', 'icon': 'face-profile', 'navScreen': 'MyWaletScreen' },
    { 'id': 3, name: 'Projets', 'icon': 'clipboard-multiple', 'navScreen': 'HelpScreen' },
    { 'id': 4, name: 'Se déconnecter', 'icon': 'logout', 'navScreen': 'LoginScreen' },
]

const arrMenuTech = [
    { 'id': 0, name: 'Accueil', 'icon': 'home-outline', 'navScreen': 'Dashboard' },
    { 'id': 1, name: 'Boite de réception', 'icon': 'comment-text-multiple', 'navScreen': 'Inbox' },
    { 'id': 2, name: 'Mes Projets', 'icon': 'alpha-p-box', 'navScreen': 'ListProjects' }, //Create
    { 'id': 3, name: 'Planning', 'icon': 'calendar', 'navScreen': 'Agenda' },
    { 'id': 4, name: 'Mes Tickets', 'icon': 'arrow-left-bold-outline', 'navScreen': 'RequestsManagementStack' },//Create
    { 'id': 5, name: 'Mes Documents', 'icon': 'file-document', 'navScreen': 'Upload' }, //Create
    { 'id': 6, name: 'Actualités', 'icon': 'newspaper', 'navScreen': 'ListNews' },//Create
    { 'id': 7, name: 'Se déconnecter', 'icon': 'logout', 'navScreen': 'LoginScreen' },
]

const arrMenuClient = [
    { 'id': 0, name: 'Accueil', 'icon': 'home-outline', 'navScreen': 'Dashboard' },
    { 'id': 1, name: 'Boite de réception', 'icon': 'comment-text-multiple', 'navScreen': 'Inbox' },
    { 'id': 2, name: 'Mes Projets', 'icon': 'alpha-p-box', 'navScreen': 'ListProjects' }, //Create
    { 'id': 3, name: 'Planning', 'icon': 'calendar', 'navScreen': 'Agenda' },
    { 'id': 4, name: 'Mes Tickets', 'icon': 'arrow-left-bold-outline', 'navScreen': 'RequestsManagementStack' },//Create
    { 'id': 5, name: 'Mes Documents', 'icon': 'file-document', 'navScreen': 'Upload' }, //Create
    { 'id': 6, name: 'Actualités', 'icon': 'newspaper', 'navScreen': 'ListNews' },//Create
    { 'id': 7, name: 'Se déconnecter', 'icon': 'logout', 'navScreen': 'LoginScreen' },
]


class DrawerMenu extends React.Component {

    constructor(props) {
        super(props)
        this.navigateToScreen = this.navigateToScreen.bind(this);
    }

    render() {
        const { user, role } = this.props

        if (user.connected && role.value !== 'client')
            return (
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={theme.colors.statusbar} barStyle="light-content" />

                    <TouchableOpacity style={styles.headerContainer} onPress={() => this.navigateToScreen('Profile')}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                {user.displayName && <AvatarText size={constants.ScreenWidth * 0.1} label={user.connected ? user.displayName.charAt(0) : ''} />}
                            </View>

                            <View style={{ flex: 0.8 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                    <View style={{ flex: 0.8 }}>
                                        {user.displayName && <Text numberOfLines={1} style={[theme.customFontMSsemibold.header, { color: '#fff', paddingLeft: 15 }]}>{user.connected ? user.displayName : ''}</Text>}
                                        <Text style={[theme.customFontMSmedium.body, { color: '#fff', paddingLeft: 15 }]}>{role.value}</Text>
                                    </View>
                                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                        <FontAwesome name='gear' size={20} style={{ color: '#fff' }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.menuContainer}>
                        {this.renderFlatList()}
                    </View>

                    <View style={[styles.footerContainer, { bottom: 5 }]}>
                        <Text style={[theme.customFontMSregular.caption, { marginLeft: 15, color: theme.colors.gray400 }]}>App v1.0.0</Text>
                    </View>

                </SafeAreaView>
            )

        else return null
    }

    renderIcon() {
        return <Icon name='menu' style={{ color: '#333' }} />
    }

    // setMenuItems() {
    //     let arrMenu = []
    //     switch (this.props.role.value) {
    //         case 'admin':
    //             arrMenu = arrMenuAdmin
    //             break;

    //         case 'dircom':
    //             arrMenu = arrMenuDirCom
    //             break;

    //         case 'com':
    //             arrMenu = arrMenuCom
    //             break;

    //         case 'poseur':
    //             arrMenu = arrMenuPoseur
    //             break;

    //         case 'tech':
    //             arrMenu = arrMenuTech
    //             break;

    //         case 'client':
    //             arrMenu = arrMenuClient
    //             break;

    //         case '':
    //             console.log(`User not logged in`);
    //             break;

    //         default:
    //             console.log(`Error while setting drawer menu items`);
    //     }
    //     return arrMenu
    // }

    renderFlatList() {

        // let arrMenu = this.setMenuItems()

        return (
            <FlatList
                scrollEnabled={(screenHeight >= 667) ? false : true}
                data={arrMenuAdmin}
                keyExtractor={item => item.id.toString()}
                style={{ marginTop: 15 }}
                renderItem={({ item }) => {
                    if (item.icon === 'logout')
                        return (
                            <TouchableOpacity onPress={() => firebase.auth().signOut()
                                .then(() => this.navigateToScreen('LoginScreen'))
                                .catch((e) => console.error(e))}
                            //   style={{backgroundColor: this.props.navigation.state.routeName === ''}}
                            >
                                <View style={{ height: screenHeight * 0.08, marginTop: screenHeight * 0.19, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <MaterialCommunityIcons name={item.icon} size={20} color={item.color} style={{ paddingLeft: 20 }} />
                                    <Text style={[styles.menuText, theme.customFontMSsemibold.body]}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )

                    else return (
                        <TouchableOpacity onPress={() => this.navigateToScreen(item.navScreen)}>
                            <View style={{ height: screenHeight * 0.08, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <MaterialCommunityIcons name={item.icon} size={20} color={item.color} style={{ paddingLeft: 20 }} />
                                {item.name === 'Boite de réception' || item.name === 'Gestion des demandes' ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.menuText, theme.customFontMSsemibold.body]}>{item.name}</Text>
                                        <View style={{ backgroundColor: '#00ACC1', borderRadius: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
                                            <Text style={[theme.customFontMSmedium.caption, { fontSize: 8, color: '#fff' }]}>BETA</Text>
                                        </View>
                                    </View>
                                    :
                                    <Text style={[styles.menuText, theme.customFontMSsemibold.body]}>{item.name}</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }
                } />)
    }

    navigateToScreen(navScreen) {
        this.props.navigation.navigate(navScreen)
    }

}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        user: state.user.user,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(DrawerMenu)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flex: 0.15,
        justifyContent: 'center',
        backgroundColor: theme.colors.primary
    },
    menuContainer: {
        flex: 0.85,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    headerText: {
        fontSize: 50,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    menuText: {
        marginLeft: constants.ScreenWidth * 0.05,
        marginRight: constants.ScreenWidth * 0.05,
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 30,
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10
    },
})