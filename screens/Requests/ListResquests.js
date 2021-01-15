import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import { List, Card, Paragraph, Title } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import MyFAB from '../../components/MyFAB'
import RequestItem from '../../components/RequestItem'
import Button from '../../components/Button'

import * as theme from '../../core/theme';
import { constants } from '../../core/constants';
import { myAlert } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api';

import { withNavigation } from 'react-navigation'
import firebase from '@react-native-firebase/app';

import SearchInput, { createFilter } from 'react-native-search-filter'
const KEYS_TO_FILTERS = ['id', 'client.fullName', 'subject', 'state']

const db = firebase.firestore()
//#task replace this component by 'List' component

class ListRequests extends Component {
    constructor(props) {
        super(props)
        this.myAlert = myAlert.bind(this)

        this.state = {
            requestsList: [],
            requestsCount: 0,
            searchInput: ''
        }
    }

    async componentDidMount() {
        let query = db.collection('Requests').where('type', '==', this.props.requestType).orderBy('createdAt', 'DESC')
        await fetchDocs(this, query, 'requestsList', 'requestsCount', () => { })
    }

    renderTicketRequest(request) {
        return <RequestItem request={request} requestType={this.props.requestType} chatId={request.chatId} handleAccept={this.handleAccept} handleReject={this.handleReject} />
    }

    render() {
        let { requestsCount, requestsList } = this.state

        let s = ''
        if (requestsCount > 1)
            s = 's'

        const filteredRequests = requestsList.filter(createFilter(this.props.searchInput, KEYS_TO_FILTERS))

        return (
            <View style={{ flex: 1 }}>
                {requestsCount > 0 && <List.Subheader>{requestsCount} nouvelle{s} demande{s}</List.Subheader>}
                <FlatList
                    enableEmptySections={true}
                    data={filteredRequests}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => this.renderTicketRequest(item)}
                    contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12 }} />
                <MyFAB onPress={() => this.props.navigation.navigate(this.props.creationScreen)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default withNavigation(ListRequests)