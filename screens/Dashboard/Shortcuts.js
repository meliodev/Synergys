import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import { faBell, faCalendar, faUserAlt, faAddressCard, faClipboardUser, faConstruction, faCalendarAlt, faFolder } from '@fortawesome/pro-light-svg-icons'
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { db, auth } from '../../firebase'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { load } from '../../core/utils'

import { ModalForm } from '../../components/ModalOptions'

import { Appbar, CustomIcon, Section, EmptyList, NotificationItem, TaskItem, Loading } from '../../components'

const shortcutsModel = {
    createProspect: {
        label: 'Nouveau prospect',
        value: '',
        icon: faClipboardUser,
        colors: { primary: '#6cc2ff', secondary: '#edf8fe' },
        navigation: { screen: 'CreateClient', params: { prevScreen: 'Dashboard', isProspect: true } }
    },
    createClient: {
        label: 'Nouveau client',
        value: '',
        icon: faAddressCard,
        colors: { primary: '#926fff', secondary: '#f1edfe' },
        navigation: {
            screen: 'CreateClient',
            params: { prevScreen: 'Dashboard', isProspect: false }
        }
    },
    createUser: {
        label: 'Nouvel utilisateur',
        value: '',
        icon: faUserAlt,
        colors: { primary: '#ff79e8', secondary: '#feeefb' },
        navigation: { screen: 'CreateUser', params: { prevScreen: 'Dashboard' } }
    },
    createProject: {
        label: 'Nouveau projet',
        value: '',
        icon: faConstruction,
        colors: { primary: '#fd9e64', secondary: '#faefe9' },
        navigation: { screen: 'ClientsManagement', params: { isRoot: false, prevScreen: 'Dashboard' } }
    },
    createTask: {
        label: 'Nouvelle tâche',
        value: '',
        icon: faCalendarAlt,
        colors: { primary: '#577eff', secondary: '#edf1fd' },
        navigation: { screen: 'CreateTask', params: { prevScreen: 'Dashboard' } }
    },
    createDocument: {
        label: 'Nouveau document',
        value: '',
        icon: faFolder,
        colors: { primary: '#30de62', secondary: '#e7fceb' },
        navigation: { screen: 'UploadDocument', params: { prevScreen: 'Dashboard' } }
    }
}

class Shortcuts extends Component {
    constructor(props) {
        super(props)
        this.shortcuts = this.setPermissionBasedShortcuts()

        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        load(this, false)
    }

    setPermissionBasedShortcuts() {
        let shortcuts = []
        const { clients, users, projects, tasks, documents } = this.props.permissions
        const { createProspect, createClient, createUser, createProject, createTask, createDocument } = shortcutsModel

        if (clients.canCreate) shortcuts.push(createProspect)
        if (clients.canCreate) shortcuts.push(createClient)
        if (users.canCreate) shortcuts.push(createUser)
        if (projects.canCreate) shortcuts.push(createProject)
        if (tasks.canCreate) shortcuts.push(createTask)
        if (documents.canCreate) shortcuts.push(createDocument)

        return shortcuts
    }


    render() {
        const { loading } = this.state
        const { isConnected } = this.props.network

        const elementSize = constants.ScreenWidth * 0.42

        const handleSelectElement = (element, index) => {
            const { screen, params } = element.navigation
            this.props.navigation.navigate(screen, params)
        }

        return (
            <View style={styles.mainContainer}>
                {/* <Appbar back title titleText='Raccourcis' /> */}
                {loading ?
                    <Loading />
                    :
                    <View style={{ paddingVertical: 5 }}>
                        <ModalForm
                            elements={this.shortcuts}
                            elementSize={elementSize}
                            model='Element2'
                            handleSelectElement={handleSelectElement}
                            autoValidation={true}
                            isReview={false}
                        />
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Shortcuts)



const styles = StyleSheet.create({
    mainContainer: {
        zIndex: 2,
        backgroundColor: theme.colors.white
    },
    notificationsList: {
        paddingVertical: 15
    },
    tasksList: {
        paddingVertical: 15
    },
    root: {
        zIndex: 1,
        paddingHorizontal: theme.padding,
        //backgroundColor: 'green',
    }
});

