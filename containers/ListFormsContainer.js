import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { connect } from 'react-redux'
import { faFileInvoice } from '@fortawesome/pro-light-svg-icons'
import { withNavigation } from 'react-navigation'

import SearchInput, { createFilter } from 'react-native-search-filter'
import Background from '../components/NewBackground'
import ActiveFilter from '../components/ActiveFilter'
import SearchBar from '../components/SearchBar'
import ListSubHeader from '../components/ListSubHeader'
import Filter from '../components/Filter'
import MyFAB from '../components/MyFAB'
import OrderItem from '../components/OrderItem' //#add
import EmptyList from '../components/EmptyList'
import Loading from '../components/Loading'

import firebase, { db, auth } from '../firebase'
import * as theme from '../core/theme';
import { constants } from '../core/constants';
import { load, toggleFilter, setFilter, handleFilter } from '../core/utils'
import { configureQuery } from '../core/privileges'
import { fetchDocs } from '../api/firestore-api';

const KEYS_TO_FILTERS = ['id', 'name', 'state'] //#edit

class ListFormsContainer extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)

        this.isRoot = this.props.navigation.getParam('isRoot', true)
        this.autoGenPdf = this.props.navigation.getParam('autoGenPdf', false) // For pdf generation
        this.docType = this.props.navigation.getParam('docType', '') // For pdf generation
        this.popCount = this.props.navigation.getParam('popCount', 1) // For pdf generation

        //filters
        // this.project = this.props.navigation.getParam('project', undefined) // For pdf generation

        this.titleText = this.props.navigation.getParam('titleText', 'Commandes')
        this.showFAB = this.props.navigation.getParam('showFAB', true) && this.isRoot
        this.filteredItems = []

        this.state = {
            List: [],
            Count: 0,

            showInput: false,
            searchInput: '',

            //filters
            state: '',
            project: { id: '', name: '' },
            client: { id: '', fullName: '' },
            filterOpened: false,

            loading: false,
        }
    }

    async componentDidMount() {
        load(this, true)
        await this.fetchItems()
        // if (this.project)
        //     this.setState({ project: this.project }) //#task: change filter to QueryFilter
    }

    async fetchItems() {
        // const { queryFilters } = this.props.permissions.eeb
        // if (queryFilters === []) this.setState({ List: [], Count: 0 })
        // else {
        //     const params = { role: this.props.role.value }
        //     var query = configureQuery('Orders', queryFilters, params)
        const { collection } = this.props
        const query = db.collection(collection).orderBy('createdAt', 'desc')
        this.fetchDocs(query, 'List', 'Count', async () => {
            load(this, false)
        })
        //}
    }

    renderItem(item) { //#edit
        return <OrderItem order={order} onPress={() => this.onPressOrder(order)} />
    }

    onPressItem(item) {//#edit
        if (this.isRoot)
            this.props.navigation.navigate('CreateOrder', { OrderId: order.id })

        else this.props.navigation.navigate('CreateOrder', { OrderId: order.id, autoGenPdf: true, docType: this.docType, DocumentId: this.props.navigation.getParam('DocumentId', ''), popCount: this.popCount, onGoBack: this.props.navigation.getParam('onGoBack', null) })
    }

    render() {
        let { Count, List, loading } = this.state
        let { state, project, client, filterOpened } = this.state
        let { searchInput, showInput } = this.state
        const { creationScreen } = this.props
        const canCreate = true //#task: edit it..
        const { isConnected } = this.props.network

        const fields = [
            { label: 'state', value: state },
            { label: 'client.id', value: client.id },
            { label: 'project.id', value: project.id }
        ]
        this.filteredItems = handleFilter(List, this.filteredItems, fields, searchInput, KEYS_TO_FILTERS)
        const filterCount = this.filteredItems.length
        const filterActivated = filterCount < Count
        const s = filterCount > 1 ? 's' : ''

        return (
            <View style={styles.container}>

                {loading ?
                    <Loading size='large' />
                    :
                    <Background style={styles.container}>
                        {filterActivated && <ActiveFilter />}
                        {Count > 0 && <ListSubHeader>{filterCount} élément{s}</ListSubHeader>}

                        {Count > 0 ?
                            <FlatList
                                enableEmptySections={true}
                                data={this.filteredItems}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => this.renderOrder(item)}
                                style={{ zIndex: 1 }}
                                contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12, paddingHorizontal: theme.padding }} />
                            :
                            this.props.emptyList
                        }

                        {canCreate &&
                            <MyFAB onPress={() => this.props.navigation.navigate(creationScreen)} />
                        }
                    </Background>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
});

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(ListFormsContainer)
