import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, StatusBar, Text, Dimensions, TouchableOpacity, View, FlatList } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { faHomeLgAlt, faInbox, faConstruction, faCalendarAlt, faUserFriends, faAddressCard, faTicketAlt, faFileInvoice, faFolder, faNewspaper, faSignOutAlt, faCog } from '@fortawesome/pro-light-svg-icons'
import firebase from '@react-native-firebase/app'
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo"

import AvatarText from '../components/AvatarText'
import CustomIcon from '../components/CustomIcon'

import * as theme from '../core/theme';
import { constants } from '../core/constants';
import { resetState, setNetwork } from '../core/redux'

const db = firebase.firestore()

const menuPrivilleges = {
    backoffice: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'orders', 'documents', 'news', 'logout'],
    admin: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'orders', 'documents', 'news', 'logout'],
    dircom: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'documents', 'news', 'logout'],
    com: ['home', 'inbox', 'projects', 'planning', 'clients', 'requests', 'documents', 'news', 'logout'],
    tech: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'orders', 'documents', 'news', 'logout'],
    poseur: ['home', 'inbox', 'projects', 'planning', 'requests', 'news', 'logout'],
    client: ['home', 'inbox', 'projects', 'requests', 'documents', 'news', 'logout']
}

const menuItems = [
    { id: 'home', name: 'Accueil', icon: faHomeLgAlt, color: theme.colors.miHome, navScreen: 'ProjectsStack' },
    { id: 'inbox', name: 'Boite de réception', icon: faInbox, color: '#EF6C00', navScreen: 'InboxStack' },
    { id: 'projects', name: 'Projets', icon: faConstruction, color: '#3F51B5', navScreen: 'ProjectsStack' }, //Create
    { id: 'planning', name: 'Planning', icon: faCalendarAlt, color: theme.colors.miPlanning, navScreen: 'AgendaStack' },
    { id: 'users', name: 'Utilisateurs', icon: faUserFriends, color: theme.colors.miUsers, navScreen: 'UsersManagementStack' },
    { id: 'clients', name: 'Clients', icon: faAddressCard, color: theme.colors.miClients, navScreen: 'ClientsManagementStack' },
    { id: 'requests', name: 'Gestion des demandes', icon: faTicketAlt, color: theme.colors.miRequests, navScreen: 'RequestsManagementStack' },//Create
    { id: 'orders', name: 'Gestion des commandes', icon: faFileInvoice, color: theme.colors.miOrders, navScreen: 'OrdersStack' }, //Create
    { id: 'documents', name: 'Documents', icon: faFolder, color: theme.colors.miDocuments, navScreen: 'DocumentsStack' }, //Create
    { id: 'news', name: 'Actualités', icon: faNewspaper, color: theme.colors.miNews, navScreen: 'NewsStack' },//Create
    { id: 'logout', name: 'Se déconnecter', icon: faSignOutAlt, color: theme.colors.miLogout, navScreen: 'LoginScreen' },
]

class DrawerMenu extends React.Component {

    constructor(props) {
        super(props)
        this.renderMenuItem = this.renderMenuItem.bind(this)
        this.navigateToScreen = this.navigateToScreen.bind(this)

        this.state = {
            notificationCount: 0
        }
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        if (currentUser) this.setNotificationBadge(currentUser.uid)
    }

    componentWillUnmount() {
        this.unsubscribenotifications()
    }

    setNotificationBadge(uid) {
        const query = db.collection('Users').doc(uid).collection('Notifications').where('deleted', '==', false).where('read', '==', false)
        this.unsubscribenotifications = query.onSnapshot((querysnapshot) => {
            if (querysnapshot.empty) return
            const notificationCount = querysnapshot.docs.length
            this.setState({ notificationCount })
        })
    }

    setMenuItems(role) {
        var arrMenuPrivilleges = menuPrivilleges[role]
        if (arrMenuPrivilleges) {
            const menu = menuItems.filter(menuItem => arrMenuPrivilleges.includes(menuItem.id))
            return menu
        }
    }

    renderHeader(currentUser, role) {
        const { displayName } = currentUser

        return (
            <TouchableOpacity style={styles.headerContainer} onPress={() => this.navigateToScreen('Profile', { isClient: role.id === 'client' ? true : false })}>
                <View style={{ flex: 0.22, justifyContent: 'center', alignItems: 'center' }}>
                    <AvatarText size={45} label={displayName.charAt(0)} labelStyle={{ color: theme.colors.white }} />
                </View>

                <View style={{ flex: 0.78, flexDirection: 'row', marginBottom: 3 }}>
                    <View style={{ flex: 0.8 }}>
                        <Text numberOfLines={1} style={[theme.customFontMSregular.title, { color: theme.colors.secondary }]}>{displayName}</Text>
                        <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{role.value}</Text>
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                        <CustomIcon icon={faCog} color={theme.colors.gray_dark} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderMenu() {
        const arrMenu = this.setMenuItems(this.props.role.id)
        const { notificationCount } = this.state

        return (
            <FlatList
                scrollEnabled={!(constants.ScreenHeight >= 667)}
                data={arrMenu}
                keyExtractor={item => item.id.toString()}
                style={{ paddingTop: theme.padding, paddingLeft: theme.padding }}
                renderItem={({ item }) => this.renderMenuItem(item)} />
        )
    }

    renderMenuItem(item) {
        const { notificationCount } = this.state

        if (item.id === 'logout')
            return (
                <TouchableOpacity onPress={this.handleSignout.bind(this)} style={styles.menuItem}>
                    <CustomIcon icon={item.icon} color={item.color} />
                    <Text style={[styles.menuText, theme.customFontMSregular.body]}>{item.name}</Text>
                </TouchableOpacity>
            )

        else return (
            <TouchableOpacity onPress={() => this.navigateToScreen(item.navScreen)} style={styles.menuItem}>
                <CustomIcon icon={item.icon} color={item.color} />
                {item.id === 'inbox' ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.menuText, theme.customFontMSregular.body]}>{item.name}</Text>
                        {notificationCount > 0 &&
                            <View style={styles.notificationBadge}>
                                <Text style={{ fontSize: 8, color: '#fff' }}>{notificationCount}</Text>
                            </View>
                        }
                    </View>
                    :
                    <Text style={[styles.menuText, theme.customFontMSregular.body]}>{item.name}</Text>
                }
            </TouchableOpacity>
        )
    }

    handleSignout() {
        firebase.auth().signOut()
    }

    navigateToScreen(navScreen) {
        this.props.navigation.navigate(navScreen)
    }

    render() {
        const { role } = this.props
        const { currentUser } = firebase.auth()

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />

                {currentUser && this.renderHeader(currentUser, role)}

                <View style={styles.menuContainer}>
                    {currentUser && this.renderMenu()}
                </View>

                <View style={[styles.footerContainer, { bottom: 5 }]}>
                    <Text style={[theme.customFontMSregular.caption, { marginLeft: 15, color: theme.colors.gray400 }]}>App v1.1.15</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(DrawerMenu)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flex: 0.13,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray_light
    },
    menuContainer: {
        flex: 0.87,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 30,
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    menuItem: {
        flex: 1,
        height: constants.ScreenHeight * 0.077,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    notificationBadge: {
        backgroundColor: '#00ACC1',
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        width: 22,
        height: 22
    },
    menuText: {
        marginHorizontal: constants.ScreenWidth * 0.05,
    },
})