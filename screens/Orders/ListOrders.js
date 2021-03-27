import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { connect } from 'react-redux'
import { faFileInvoice } from '@fortawesome/pro-light-svg-icons'

import Background from '../../components/NewBackground'
import ActiveFilter from '../../components/ActiveFilter'
import SearchBar from '../../components/SearchBar'
import ListSubHeader from '../../components/ListSubHeader'
import Filter from '../../components/Filter'
import MyFAB from '../../components/MyFAB'
import OrderItem from '../../components/OrderItem' //#add
import EmptyList from '../../components/EmptyList'
import Loading from '../../components/Loading'

import * as theme from '../../core/theme';
import { constants } from '../../core/constants';
import { load, toggleFilter, setFilter, handleFilter } from '../../core/utils'
import { configureQuery } from '../../core/privileges'
import { fetchDocs } from '../../api/firestore-api';

import { withNavigation } from 'react-navigation'
import firebase from '@react-native-firebase/app';

import SearchInput, { createFilter } from 'react-native-search-filter'
const KEYS_TO_FILTERS = ['id', 'name', 'state'] //#edit

const states = [
    { label: 'Tous', value: '' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

const db = firebase.firestore()

class ListOrders extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)
        this.onPressOrder = this.onPressOrder.bind(this) //#edit

        this.isRoot = this.props.navigation.getParam('isRoot', true)
        this.autoGenPdf = this.props.navigation.getParam('autoGenPdf', false) // For pdf generation
        this.docType = this.props.navigation.getParam('docType', '') // For pdf generation
        this.popCount = this.props.navigation.getParam('popCount', 1) // For pdf generation
        this.project = this.props.navigation.getParam('project', undefined) // For pdf generation

        this.titleText = this.props.navigation.getParam('titleText', 'Commandes')
        this.showFAB = this.props.navigation.getParam('showFAB', true)
        this.filteredOrders = []

        this.state = {
            ordersList: [],
            ordersCount: 0,

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
        await this.fetchOrders()
        if (this.project)
            this.setState({ project: this.project }) //#task: change filter to QueryFilter
    }

    async fetchOrders() {
        // const query = db.collection('Orders').where('deleted', '==', false).orderBy('createdAt', 'DESC')

        const { queryFilters } = this.props.permissions.orders
        if (queryFilters === []) this.setState({ ordersList: [], ordersCount: 0 })
        else {
            const params = { role: this.props.role.value }
            var query = configureQuery('Orders', queryFilters, params)

            this.fetchDocs(query, 'ordersList', 'ordersCount', async () => {

                //Fetch client dynamiclly
                let { ordersList } = this.state
                if (ordersList.length > 0) {
                    for (let i = 0; i < ordersList.length; i++) {
                        await db.collection('Projects').doc(ordersList[i].project.id).get().then((doc) => {
                            if (doc.exists)
                                ordersList[i].client = doc.data().client
                        })
                    }
                    this.setState({ ordersList, filteredOrders: ordersList })
                }

                load(this, false)
            })
        }
    }

    // componentWillUnmount() {
    //     this.unsubscribe()
    // }

    renderOrder(order) { //#edit
        return <OrderItem order={order} onPress={() => this.onPressOrder(order)} />
    }

    onPressOrder(order) {//#edit
        if (this.isRoot)
            this.props.navigation.navigate('CreateOrder', { OrderId: order.id })

        else this.props.navigation.navigate('CreateOrder', { OrderId: order.id, autoGenPdf: true, docType: this.docType, DocumentId: this.props.navigation.getParam('DocumentId', ''), popCount: this.popCount, onGoBack: this.props.navigation.getParam('onGoBack', null) })
    }

    renderSearchBar() {
        let { state, project, client, filterOpened } = this.state
        let { searchInput, showInput } = this.state
        return (
            <SearchBar
                menu={this.isRoot}
                main={this}
                title={!this.state.showInput}
                titleText={this.titleText}
                placeholder='Rechercher une commande'
                showBar={showInput}
                handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                searchInput={searchInput}
                searchUpdated={(searchInput) => this.setState({ searchInput })}
                filterComponent={
                    <Filter
                        isAppBar
                        main={this}
                        opened={filterOpened}
                        toggleFilter={() => toggleFilter(this)}
                        setFilter={(field, value) => setFilter(this, field, value)}
                        resetFilter={() => this.setState({ state: '', client: { id: '', fullName: '' }, project: { id: '', name: '' } })}
                        options={[
                            { id: 1, type: 'picker', title: "État", values: states, value: state, field: 'state' },
                            { id: 2, type: 'screen', title: "Client", value: client.fullName, field: 'client', screen: 'ListClients', titleText: 'Filtre par client' },
                            { id: 2, type: 'screen', title: "Projet", value: project.name, field: 'project', screen: 'ListProjects', titleText: 'Filtre par projet' },
                        ]}
                    />
                }
            />
        )
    }

    render() {
        let { ordersCount, ordersList, loading } = this.state
        let { state, project, client, filterOpened } = this.state
        let { searchInput, showInput } = this.state
        const { canCreate } = this.props.permissions.orders
        const { isConnected } = this.props.network

        const fields = [{ label: 'state', value: state }, { label: 'client.id', value: client.id }, { label: 'project.id', value: project.id }]
        this.filteredOrders = handleFilter(ordersList, this.filteredOrders, fields, searchInput, KEYS_TO_FILTERS)

        const filterCount = this.filteredOrders.length
        const filterActivated = filterCount < ordersCount
        const s = filterCount > 1 ? 's' : ''

        return (
            <View style={styles.container}>

                {loading ?
                    <Background style={styles.container}>
                        {this.renderSearchBar()}
                        <Loading size='large' />
                    </Background>
                    :
                    <Background style={styles.container}>

                        {this.renderSearchBar()}
                        {filterActivated && <ActiveFilter />}
                        {ordersCount > 0 && <ListSubHeader>{filterCount} commande{s}</ListSubHeader>}

                        {ordersCount > 0 ?
                            <FlatList
                                enableEmptySections={true}
                                data={this.filteredOrders}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => this.renderOrder(item)}
                                style={{ zIndex: 1 }}
                                contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12, paddingHorizontal: theme.padding }} />
                            :
                            <EmptyList icon={faFileInvoice} header='Aucune commande' description='Gérez vos commandes. Appuyez sur le boutton "+" pour en créer une nouvelle.' offLine={!isConnected} />
                        }

                        {canCreate && this.showFAB && this.isRoot &&
                            <MyFAB onPress={() => this.props.navigation.navigate('CreateOrder')} />
                        }
                    </Background>}
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

export default connect(mapStateToProps)(ListOrders)
