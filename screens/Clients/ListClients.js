

import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableHighlight, FlatList, ScrollView, Alert } from 'react-native'
import { List, FAB } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import firebase from '@react-native-firebase/app'
import { connect } from 'react-redux'

import SearchBar from '../../components/SearchBar'

import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { myAlert } from '../../core/utils'

import ListUsers from '../Users/ListUsers'

const db = firebase.firestore()

class ListClients extends Component {
    constructor(props) {
        super(props)
        this.getClient = this.getClient.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', '')
        this.isRoot = this.props.navigation.getParam('isRoot', true)
        this.titleText = this.props.navigation.getParam('titleText', '')
        this.showButton = this.props.navigation.getParam('showButton', true)

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
        const queryClients = db.collection('Clients').where('deleted', '==', false) //Client + Prospects
        const permissions = this.props.permissions.clients
        const { isConnected } = this.props.network

        return ( 
            <View style={{ flex: 1 }}>
                <SearchBar
                    menu={this.isRoot}
                    main={this}
                    title={!this.state.showInput}
                    titleText={this.titleText}
                    placeholder='Rechercher'
                    showBar={this.state.showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !this.state.showInput })}
                    searchInput={this.state.searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                <ListUsers
                    searchInput={this.state.searchInput}
                    prevScreen={this.prevScreen}
                    userType='client'
                    offLine={!isConnected}
                    permissions={permissions}
                    query={queryClients}
                    onPress={this.getClient}
                    showButton={this.showButton}
                    emptyListHeader='Aucun client'
                    emptyListDesc='Appuyez sur le boutton, en bas à droite, pour en créer un nouveau.' />
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

export default connect(mapStateToProps)(ListClients)

const styles = StyleSheet.create({
}) 