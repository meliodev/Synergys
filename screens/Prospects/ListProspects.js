import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Keyboard } from 'react-native';
import { List, Card } from 'react-native-paper';
import { connect } from 'react-redux'

import SearchBar from '../../components/SearchBar'
import Filter from '../../components/Filter'
import MyFAB from '../../components/MyFAB'
import ProspectItem from '../../components/ProspectItem'
import EmptyList from '../../components/EmptyList'
import Loading from '../../components/Loading'

import * as theme from '../../core/theme';
import { constants } from '../../core/constants';
import { load, toggleFilter, setFilter, handleFilter } from '../../core/utils'
import { requestRESPermission, requestWESPermission } from '../../core/permissions'
import { fetchDocs } from '../../api/firestore-api';

import { withNavigation } from 'react-navigation'
import firebase from '@react-native-firebase/app';

import SearchInput, { createFilter } from 'react-native-search-filter'

const KEYS_TO_FILTERS = ['id', 'fullName', 'nom', 'prenom', 'denom', 'role']
const db = firebase.firestore()

class ListProspects extends Component {
    constructor(props) {
        super(props)
        this.onPressProspect = this.onPressProspect.bind(this)
        this.fetchDocs = fetchDocs.bind(this)

        this.isRoot = this.props.navigation.getParam('isRoot', true)
        this.titleText = this.props.navigation.getParam('titleText', 'Prospects')
        this.showFAB = this.props.navigation.getParam('showFAB', true)
        this.filteredProspects = []

        this.state = {
            prospectsList: [],
            prospectsCount: 0,

            showInput: false,
            searchInput: '',

            //filter fields
            step: '',
            state: '',
            client: { id: '', fullName: '' },
            filterOpened: false,

            loading: true,
        }
    }

    componentDidMount() {
        const role = this.props.role.id
        const { currentUser } = firebase.auth()

        var query = db.collection('Prospects')
        this.fetchDocs(query, 'prospectsList', 'prospectsCount', () => {
            console.log(this.state.prospectsList)
            load(this, false)
        })
    }

    renderProspect(prospect) {
        return <ProspectItem item={prospect} onPress={() => this.onPressProspect(prospect)} />
    }

    onPressProspect(prospect) {
        if (this.isRoot)
            this.props.navigation.navigate('CreateProspect', { ProspectId: prospect.id })

        else {
            this.props.navigation.state.params.onGoBack({ id: prospect.id, name: prospect.name, client: prospect.client })
            this.props.navigation.goBack()
        }
    }

    render() {

        let { prospectsCount, prospectsList, loading } = this.state
        let { searchInput, showInput } = this.state
        const { canCreate } = this.props.permissions.users
        const { isConnected } = this.props.network

        this.filteredProspects = prospectsList
        //   this.filteredProspects = prospectsList.filter(createFilter(this.props.searchInput, KEYS_TO_FILTERS))

        const filterCount = this.filteredProspects.length
        const filterActivated = filterCount < prospectsCount

        const s = filterCount > 1 ? 's' : ''

        return (
            <View style={styles.container}>
                <SearchBar
                    close={!this.isRoot}
                    main={this}
                    title={!showInput}
                    titleText={this.titleText}
                    placeholder='Rechercher un prospect'
                    showBar={showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                    searchInput={searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                {filterActivated && <View style={{ backgroundColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}><Text style={[theme.customFontMSsemibold.caption, { color: '#fff' }]}>Filtre activé</Text></View>}

                {loading ?
                    <View style={styles.container}>
                        <Loading size='large' />
                    </View>
                    :
                    <View style={styles.container}>
                        {prospectsCount > 0 &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.gray50 }}>
                                <List.Subheader>{filterCount} prospect{s}</List.Subheader>
                            </View>
                        }

                        {prospectsCount > 0 ?
                            <FlatList
                                enableEmptySections={true}
                                data={this.filteredProspects}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => this.renderProspect(item)}
                                contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12 }} />
                            :
                            <EmptyList iconName='badge-account-horizontal' header='Liste des prospects' description='Gérez tous vos prospects. Appuyez sur le boutton "+" pour en créer un nouveau.' />
                        }

                        {canCreate && this.showFAB && this.isRoot &&
                            <MyFAB onPress={() => this.props.navigation.navigate('CreateProspect', { prevScreen: 'ListProspects' })} />
                        }
                    </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(ListProspects)