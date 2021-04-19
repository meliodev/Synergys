//Conditionnal rendering depending on USER ROLE

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { faUser, faUsers } from '@fortawesome/pro-light-svg-icons'

import TwoTabs from '../../components/TwoTabs'
import SearchBar from '../../components/SearchBar'
import TabView from '../../components/TabView'

import ListUsers from './ListUsers';
import ListTeams from './ListTeams';

import { db } from '../../firebase'
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";

class UsersManagement extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            index: 0,
            showInput: false,
            searchInput: ''
        }
    }


    viewProfile(isPro, id, nom, prenom) {
        this.props.navigation.navigate('Profile', { userId: id })
    }

    render() {
        const queryUsers = db.collection('Users').where('deleted', '==', false)

        const routes = [
            { key: 'first', title: 'UTILISATEURS' },
            { key: 'second', title: 'ÉQUIPES' },
        ]

        const { index, searchInput } = this.state
        const permissionsUsers = this.props.permissions.users
        const permissionsTeams = this.props.permissions.teams
        const { isConnected } = this.props.network

        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    main={this}
                    title={!this.state.showInput}
                    placeholder={index === 0 ? 'Rechercher par nom, id, ou rôle' : 'Rechercher une équipe'}
                    showBar={this.state.showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !this.state.showInput })}
                    searchInput={this.state.searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                <TabView
                    navigationState={{ index, routes }}
                    onIndexChange={(index) => this.setState({ index, searchInput: '', showInput: false })}
                    icon1={faUser}
                    icon2={faUsers}
                    Tab1={
                        <ListUsers
                            searchInput={searchInput}
                            prevScreen='UsersManagement'
                            userType='utilisateur'
                            menu
                            offLine={!isConnected}
                            permissions={permissionsUsers}
                            query={queryUsers}
                            showButton
                            onPress={this.viewProfile.bind(this)}
                            emptyListHeader='Aucun utilisateur'
                            emptyListDesc='Gérez les utilisateurs. Appuyez sur le boutton, en bas à droite, pour en créer un nouveau.'
                        />}

                    Tab2={
                        <ListTeams
                            searchInput={searchInput}
                            offLine={!isConnected}
                            permissions={permissionsTeams}
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

export default connect(mapStateToProps)(UsersManagement)











