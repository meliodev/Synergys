//Conditionnal rendering depending on USER ROLE

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { faUser, faAddressCard, fal } from '@fortawesome/pro-light-svg-icons'

import TwoTabs from '../../components/TwoTabs'
import SearchBar from '../../components/SearchBar'
import TabView from '../../components/TabView'

import ListUsers from '../Users/ListUsers'

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";

import firebase from '@react-native-firebase/app';

const db = firebase.firestore()

class ClientsManagement extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            index: 0,
            showInput: false,
            searchInput: ''
        }
    }


    viewProfile(isPro, id, nom, prenom) {
        this.props.navigation.navigate('Profile', { userId: id, isClient: true })
    }

    render() {
        const queryClients = db.collection('Clients').where('isProspect', '==', false).where('deleted', '==', false)
        const queryProspects = db.collection('Clients').where('isProspect', '==', true).where('deleted', '==', false)

        const routes = [
            { key: 'first', title: 'CLIENTS' },
            { key: 'second', title: 'PROSPECTS' },
        ]

        const { index, searchInput } = this.state
        const permissionsUsers = this.props.permissions.users
        const { isConnected } = this.props.network

        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    main={this}
                    title={!this.state.showInput}
                    placeholder={index === 0 ? 'Rechercher un client' : 'Rechercher un prospect'}
                    showBar={this.state.showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !this.state.showInput })}
                    searchInput={this.state.searchInput}
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
                            permissions={permissionsUsers}
                            query={queryClients}
                            showButton
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
                            permissions={permissionsUsers}
                            query={queryProspects}
                            showButton
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











