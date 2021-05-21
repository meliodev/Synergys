import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { List, Card, Paragraph, Title } from 'react-native-paper';
import { faTicketAlt } from '@fortawesome/pro-light-svg-icons'
import { withNavigation } from 'react-navigation'
import SearchInput, { createFilter } from 'react-native-search-filter'

import ListSubHeader from '../../components/ListSubHeader'
import MyFAB from '../../components/MyFAB'
import RequestItem from '../../components/RequestItem'
import EmptyList from '../../components/EmptyList'

import firebase, { db } from '../../firebase'
import * as theme from '../../core/theme';
import { constants } from '../../core/constants';
import { fetchDocs } from '../../api/firestore-api';
import { configureQuery } from '../../core/privileges';

const KEYS_TO_FILTERS = ['id', 'client.fullName', 'subject', 'state']

//#task replace this component by 'List' component

class ListRequests extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)

        this.state = {
            requestsList: [],
            requestsCount: 0,
            searchInput: ''
        }
    }

    componentDidMount() {
        const role = this.props.role.id
        const { currentUser } = firebase.auth()
        const isClient = (role === 'client')

        const { queryFilters } = this.props.permissions
        if (queryFilters === []) this.setState({ requestsList: [], requestsCount: 0 })
        else {
            const params = { type: this.props.requestType }
            var query = configureQuery('Requests', queryFilters, params)
            this.fetchDocs(query, 'requestsList', 'requestsCount', () => { })
        }
    }

    renderTicketRequest(request) {
        return <RequestItem request={request} requestType={this.props.requestType} chatId={request.chatId} />
    }

    render() {
        let { requestsCount, requestsList } = this.state
        const s = requestsCount > 1 ? 's' : ''
        const filteredRequests = requestsList.filter(createFilter(this.props.searchInput, KEYS_TO_FILTERS))
        const { canCreate } = this.props.permissions

        return (
            <View style={styles.container}>
                {requestsCount > 0 && <ListSubHeader>{requestsCount} nouvelle{s} demande{s}</ListSubHeader>}

                {requestsCount > 0 ?
                    <FlatList
                        enableEmptySections={true}
                        data={filteredRequests}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => this.renderTicketRequest(item)}
                        contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12 }} />
                    :
                    <EmptyList icon={faTicketAlt} iconColor={theme.colors.miRequests} header='Aucune demande' description='Appuyez sur le boutton "+" pour en créer une nouvelle.' offLine={this.props.offLine} />
                }

                {canCreate && <MyFAB onPress={() => this.props.navigation.navigate(this.props.creationScreen)} />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
})

export default withNavigation(ListRequests)