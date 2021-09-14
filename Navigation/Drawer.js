import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, StatusBar, Text, Dimensions, TouchableOpacity, View, FlatList } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { faHomeLgAlt, faInbox, faConstruction, faCalendarAlt, faUserFriends, faAddressCard, faTicketAlt, faFileInvoice, faFolder, faNewspaper, faSignOutAlt, faCog, faCommentDots, faScroll, faVials, faHandHoldingUsd } from '@fortawesome/pro-light-svg-icons'
import firebase, { db } from '../firebase'
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo"

import AvatarText from '../components/AvatarText'
import CustomIcon from '../components/CustomIcon'

import * as theme from '../core/theme';
import { constants } from '../core/constants';
import { resetState, setNetwork, setStatusBarColor } from '../core/redux'
import AppVersion from '../components/AppVersion';

const menuPrivilleges = {
    backoffice: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'orders', 'simulator', 'documents', 'news', 'logout'],
    admin: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'orders', 'simulator', 'documents', 'news', 'logout'],
    dircom: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'documents', 'simulator', 'news', 'logout'],
    com: ['home', 'inbox', 'projects', 'planning', 'clients', 'requests', 'documents', 'simulator', 'news', 'logout'],
    tech: ['home', 'inbox', 'projects', 'planning', 'users', 'clients', 'requests', 'orders', 'documents', 'simulator', 'news', 'logout'],
    poseur: ['projects', 'inbox', 'planning', 'requests', 'simulator', 'news', 'logout'],
    client: ['projects', 'inbox', 'requests', 'documents', 'simulator', 'news', 'logout']
}

const menuItems = [
    { id: 'home', name: 'Accueil', icon: faHomeLgAlt, color: theme.colors.miHome, navScreen: 'DashboardStack' },
    { id: 'inbox', name: 'Boite de réception', icon: faInbox, color: '#EF6C00', navScreen: 'InboxStack' },
    { id: 'projects', name: 'Projets', icon: faConstruction, color: '#3F51B5', navScreen: 'ProjectsStack' },
    { id: 'planning', name: 'Planning', icon: faCalendarAlt, color: theme.colors.miPlanning, navScreen: 'AgendaStack' },
    { id: 'users', name: 'Utilisateurs', icon: faUserFriends, color: theme.colors.miUsers, navScreen: 'UsersManagementStack' },
    { id: 'clients', name: 'Clients/Prospects', icon: faAddressCard, color: theme.colors.miClients, navScreen: 'ClientsManagementStack' },
    { id: 'requests', name: 'Demandes', icon: faTicketAlt, color: theme.colors.miRequests, navScreen: 'RequestsManagementStack' },
    { id: 'orders', name: 'Commandes', icon: faFileInvoice, color: theme.colors.miOrders, navScreen: 'OrdersStack' },
    { id: 'documents', name: 'Documents', icon: faFolder, color: theme.colors.miDocuments, navScreen: 'DocumentsStack' },
    { id: 'simulator', name: 'Simulateur', icon: faVials, color: theme.colors.miSimulator, navScreen: 'SimulatorStack' },
    { id: 'news', name: 'Actualités', icon: faNewspaper, color: theme.colors.miNews, navScreen: 'NewsStack' },
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
        setStatusBarColor(this, { backgroundColor: theme.colors.background, barStyle: "dark-content" })
    }

    componentWillUnmount() {
        this.unsubscribenotifications()
    }

    setNotificationBadge(uid) {
        const query = db
            .collection('Users')
            .doc(uid)
            .collection('Notifications')
            .where('deleted', '==', false)
            .where('read', '==', false)

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

    renderHeader() {
        const { currentUser } = this.props
        const { fullName, role } = currentUser
        const showChatIcon = role !== "Client" && role !== ""

        return (
            <TouchableOpacity style={styles.headerContainer} onPress={() => this.navigateToScreen('Profile', { isRoot: false })}>
                <View style={{ flex: 0.22, justifyContent: 'center', alignItems: 'center' }}>
                    <AvatarText size={45} label={fullName.charAt(0)} labelStyle={{ color: theme.colors.white }} />
                </View>

                <View style={{ flex: 0.78, flexDirection: 'row', marginBottom: 3 }}>
                    <View style={{ flex: 0.73 }}>
                        <Text numberOfLines={1} style={[theme.customFontMSregular.title, { color: theme.colors.secondary }]}>{fullName}</Text>
                        <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{role}</Text>
                    </View>
                    <View style={{ flex: 0.27, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <CustomIcon icon={faCog} color={theme.colors.gray_dark} />
                        {showChatIcon && <CustomIcon icon={faCommentDots} color={theme.colors.gray_dark} onPress={() => this.navigateToScreen('Chat', { chatId: 'GlobalChat' })} />}
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

    navigateToScreen(screenName, screenParams) {
        this.props.navigation.navigate(screenName, screenParams)
    }

    render() {
        const { role, fcmToken, statusBar } = this.props
        const { currentUser } = firebase.auth()

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={statusBar.backgroundColor} barStyle={statusBar.barStyle} />

                {currentUser && this.renderHeader()}

                <View style={styles.menuContainer}>
                    {currentUser && this.renderMenu()}
                </View>

                <View style={[styles.footerContainer, { bottom: 5 }]}>
                    <AppVersion />
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        fcmToken: state.fcmtoken,
        currentUser: state.currentUser,
        statusBar: state.statusBar
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
        height: constants.ScreenHeight * 0.071,
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