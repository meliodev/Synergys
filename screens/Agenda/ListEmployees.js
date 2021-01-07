//Conditionnal rendering depending on USER ROLE

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'

import TwoTabs from '../../components/TwoTabs'
import SearchBar from '../../components/SearchBar'
import TabView from '../../components/TabView'

import ListUsers from '../Users/ListUsers';

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";

import firebase from "react-native-firebase";
import { withNavigation } from 'react-navigation'

const db = firebase.firestore()

class ListEmployees extends React.Component {

    constructor(props) {
        super(props)
        this.getEmployee = this.getEmployee.bind(this)

        this.state = {
            showInput: false,
            searchInput: ''
        }
    }

    getEmployee(isPro, id, nom, prenom, role) {
        this.props.navigation.state.params.onGoBack(isPro, id, prenom, nom, role)
        this.props.navigation.goBack()
    }

    render() {
        const queryUsers = db.collection('Users').where('isClient', '==', false).where('deleted', '==', false)
        const { searchInput, showInput } = this.state

        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    close={true}
                    main={this}
                    title={!showInput}
                    titleText={this.titleText}
                    placeholder='Rechercher'
                    showBar={showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                    searchInput={searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                <ListUsers
                    searchInput={searchInput}
                    prevScreen={this.props.prevScreen}
                    userType='utilisateur'
                    query={queryUsers}
                    //showButton 
                    onPress={this.getEmployee}
                    emptyListHeader='Aucun utilisateur disponible'
                    emptyListDesc="Veuillez créer un nouvel utilisateur via l'interface de gestion des utilisateurs." />
            </View>
        )
    }
}

export default withNavigation(ListEmployees)











