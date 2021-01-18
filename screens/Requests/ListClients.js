

import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableHighlight, FlatList, ScrollView, Alert } from 'react-native'
import { List, FAB } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import firebase from "react-native-firebase"

import SearchBar from '../../components/SearchBar'

import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { myAlert } from '../../core/utils'

import ListUsers from '../../screens/Users/ListUsers'

const db = firebase.firestore()

class ListClients extends Component {
    constructor(props) {
        super(props)
        this.getClient = this.getClient.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', '')
        this.titleText = this.props.navigation.getParam('titleText', '')
        this.showButton = this.props.navigation.getParam('showButton', true)
        console.log('showButton: ' + this.showButton)

        this.state = {
            index: 0,
            showInput: false,
            searchInput: ''
        }
    }

    // componentDidUpdate() {
    //     console.log(this.state.searchInput)
    // }

    getClient(isPro, id, prenom, nom) {
        this.props.navigation.state.params.onGoBack(isPro, id, prenom, nom)
        this.props.navigation.goBack()
    }

    render() {
        const queryClients = db.collection('Users').where('role', '==', 'Client').where('deleted', '==', false)

        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    close={true}
                    main={this}
                    title={!this.state.showInput}
                    titleText={this.titleText}
                    placeholder='Rechercher'
                    showBar={this.state.showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !this.state.showInput })}
                    searchInput={this.state.searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                <ListUsers searchInput={this.state.searchInput} prevScreen={this.prevScreen} userType='client' query={queryClients} onPress={this.getClient} showButton={this.showButton} emptyListHeader='Liste des clients' emptyListDesc='Aucun client. Appuyez sur le boutton, en bas à droite, pour en créer un nouveau.' />
            </View>
        )
    }
}

export default ListClients

const styles = StyleSheet.create({
})