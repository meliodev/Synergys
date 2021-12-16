import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { faUser, faAddressCard, fal } from '@fortawesome/pro-light-svg-icons'

import TwoTabs from '../../components/TwoTabs'
import SearchBar from '../../components/SearchBar'
import TabView from '../../components/TabView'

import ListUsers from '../Users/ListUsers'

import { db } from '../../firebase'
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { configureQuery } from "../../core/privileges";

class ClientsManagement extends React.Component {

    constructor(props) {
        super(props)
        this.isRoot = this.props.navigation.getParam('isRoot', true)

        this.state = {
            index: 0,
            showInput: false,
            searchInput: ''
        }
    }


    viewProfile(user) {
        const { id } = user
        this.props.navigation.navigate('Profile', { user: { id, roleId: 'client' }, isClient: true, isEdit: false })
    }

    render() {

        const { queryFilters } = this.props.permissions.clients
        const queryClients = configureQuery('Clients', queryFilters, { isProspect: false })
        const queryProspects = configureQuery('Clients', queryFilters, { isProspect: true })

        const routes = [
            { key: 'first', title: 'CLIENTS' },
            { key: 'second', title: 'PROSPECTS' },
        ]

        const { index, searchInput, showInput } = this.state
        const { isConnected } = this.props.network
        const permissionsClients = this.props.permissions.clients

        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    menu={this.isRoot}
                    main={this}
                    title={!showInput}
                    showBar={showInput}
                    placeholder={index === 0 ? 'Rechercher un client' : 'Rechercher un prospect'}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                    searchInput={searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                <TabView
                    navigationState={{ index, routes }}
                    onIndexChange={(index) => this.setState({ index, searchInput: '', showInput: false })}
                    icon1={faUser}
                    icon2={faAddressCard}
                    Tab1={
                        <ListUsers
                            searchInput={searchInput}
                            prevScreen='ClientsManagement'
                            userType='client'
                            menu
                            offLine={!isConnected}
                            permissions={permissionsClients}
                            query={queryClients}
                            showButton={permissionsClients.canCreate}
                            onPress={this.viewProfile.bind(this)}
                            emptyListIcon={faUser}
                            emptyListHeader='Aucun client'
                            emptyListDesc='Gérez vos clients. Appuyez sur le boutton, en bas à droite, pour en ajouter un nouveau.'
                        />}

                    Tab2={
                        <ListUsers
                            searchInput={searchInput}
                            prevScreen='ClientsManagement'
                            userType='prospect'
                            menu
                            offLine={!isConnected}
                            permissions={permissionsClients}
                            query={queryProspects}
                            showButton={permissionsClients.canCreate}
                            onPress={this.viewProfile.bind(this)}
                            emptyListIcon={faAddressCard}
                            emptyListHeader='Aucun prospect'
                            emptyListDesc='Gérez vos prospects. Appuyez sur le boutton, en bas à droite, pour en ajouter un nouveau.'
                        />}
                />
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

export default connect(mapStateToProps)(ClientsManagement)