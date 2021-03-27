import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Keyboard } from 'react-native';
import { List, Card } from 'react-native-paper';
import { connect } from 'react-redux'
import { faConstruction } from '@fortawesome/pro-light-svg-icons'
import { faThLarge, faList } from '@fortawesome/pro-solid-svg-icons'
import _ from 'lodash'

import { ActiveFilter, SearchBar, ListSubHeader, Filter, MyFAB, ProjectItem, ProjectItem2, EmptyList, Loading } from '../../components'

import Background from '../../components/NewBackground'
import CustomIcon from '../../components/CustomIcon'

import * as theme from '../../core/theme';
import { constants } from '../../core/constants';
import { load, toggleFilter, setFilter, handleFilter, formatRow, stringifyUndefined } from '../../core/utils'
import { requestRESPermission, requestWESPermission } from '../../core/permissions'
import { configureQuery } from '../../core/privileges'
import { fetchDocs } from '../../api/firestore-api';

import { withNavigation } from 'react-navigation'
import firebase from '@react-native-firebase/app';

import SearchInput, { createFilter } from 'react-native-search-filter'
import { TouchableOpacity } from 'react-native-gesture-handler';
const KEYS_TO_FILTERS = ['id', 'name', 'state', 'step',]

const states = [
    { label: 'Tous', value: '' },
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

const steps = [
    { label: 'Toutes', value: '' },
    { label: 'Prospect', value: 'Prospect' },
    { label: 'Chantier', value: 'Chantier' },
    { label: 'SAV', value: 'SAV' },
]

const db = firebase.firestore()

class ListProjects extends Component {
    constructor(props) {
        super(props)
        this.onPressProject = this.onPressProject.bind(this)
        this.fetchDocs = fetchDocs.bind(this)

        this.isRoot = this.props.navigation.getParam('isRoot', true)
        this.titleText = this.props.navigation.getParam('titleText', 'Projets')
        this.showFAB = this.props.navigation.getParam('showFAB', true)
        this.filteredProjects = []

        this.state = {
            projectsList: [],
            projectsCount: 0,

            showInput: false,
            searchInput: '',

            //filter fields
            step: '',
            state: '',
            client: { id: '', fullName: '' },
            filterOpened: false,

            //view (grid/list)
            view: 'grid',
            columnCount: 3,

            loading: true,
        }
    }

    async componentDidMount() {

        Keyboard.dismiss()
        requestWESPermission()
        requestRESPermission()

        // const queryFilters = [
        //     { filterOrder: 1, clause: 'where', filter: 'project.subscribers', operation: 'array-contains', value: '' },
        //     { filterOrder: 2, clause: 'where', filter: 'deleted', operation: '==', value: false },
        //     { filterOrder: 3, clause: 'orderBy', field: 'dateKey', sort: 'asc' },
        // ]

        // db.collection('Permissions').doc('Commercial').update({ 'tasks.queryFilters': queryFilters })

        // if (isClient)
        //     var query = db.collection('Projects').where('client.id', '==', currentUser.uid).where('deleted', '==', false).orderBy('createdAt', 'DESC')

        const { queryFilters } = this.props.permissions.projects
        if (queryFilters === []) this.setState({ projectsList: [], projectsCount: 0 })
        else {
            const params = { role: this.props.role.value }
            const query = configureQuery('Projects', queryFilters, params)
            this.fetchDocs(query, 'projectsList', 'projectsCount', () => load(this, false))
        }
    }


    componentWillUnmount() {
        this.unsubscribe()
    }

    renderProject(project) {
        const { view } = this.state

        if (view === 'list')
            return <ProjectItem project={project} onPress={() => this.onPressProject(project)} />

        else if (view === 'grid') {
            if (project.empty) {
                return <View style={styles.invisibleItem} />
            }

            else return <ProjectItem2 project={project} onPress={() => this.onPressProject(project)} />
        }
    }

    onPressProject(project) {
        if (this.isRoot)
            this.props.navigation.navigate('CreateProject', { ProjectId: project.id })

        else {
            const { id, name, client, subscribers } = project
            this.props.navigation.state.params.onGoBack({ id, name, client, subscribers })
            this.props.navigation.goBack()
        }
    }

    renderSearchBar() {
        const { searchInput, showInput } = this.state
        let { step, state, client, filterOpened } = this.state

        return (
            <SearchBar
                menu={this.isRoot}
                main={this}
                title={!showInput}
                titleText={this.titleText}
                placeholder='Rechercher un projet'
                showBar={showInput}
                handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                searchInput={searchInput}
                searchUpdated={(searchInput) => this.setState({ searchInput })}
                filterComponent={
                    <Filter
                        isAppBar={true}
                        main={this}
                        opened={filterOpened}
                        toggleFilter={() => toggleFilter(this)}
                        setFilter={(field, value) => setFilter(this, field, value)}
                        resetFilter={() => this.setState({ step: '', state: '', client: { id: '', fullName: '' } })}
                        options={[
                            { id: 0, type: 'picker', title: "Étape", values: steps, value: step, field: 'step' },
                            { id: 1, type: 'picker', title: "État", values: states, value: state, field: 'state' },
                            { id: 2, type: 'screen', title: "Client", value: client.fullName, field: 'client', screen: 'ListClients', titleText: 'Filtre par client' },
                        ]}
                    />
                }
            />
        )
    }

    toggleViewMode() {
        const { view } = this.state

        if (view === 'list')
            this.setState({ view: 'grid', columnCount: 3 })
        else if (view === 'grid')
            this.setState({ view: 'list', columnCount: 1 })
    }

    render() {

        let { projectsCount, projectsList, view, columnCount, loading } = this.state
        let { step, state, client, filterOpened } = this.state
        let { searchInput, showInput } = this.state
        const { canCreate } = this.props.permissions.projects
        const { isConnected } = this.props.network

        const fields = [{ label: 'step', value: step }, { label: 'state', value: state }, { label: 'client.id', value: client.id }]
        this.filteredProjects = handleFilter(projectsList, this.filteredProjects, fields, searchInput, KEYS_TO_FILTERS)

        const filterCount = this.filteredProjects.length
        const filterActivated = filterCount < projectsCount

        const s = filterCount > 1 ? 's' : ''
        const isList = view === 'list'

        return (
            <View style={{ flex: 1 }}>

                {loading ?
                    <Background>
                        {this.renderSearchBar()}
                        <Loading size='large' />
                    </Background>
                    :
                    <Background>
                        {this.renderSearchBar()}
                        {filterActivated && <ActiveFilter />}

                        {projectsCount > 0 &&
                            <ListSubHeader right={<CustomIcon icon={isList ? faThLarge : faList} size={18} onPress={this.toggleViewMode.bind(this)} />}>{filterCount} projet{s}</ListSubHeader>
                        }

                        {projectsCount > 0 ?

                            <FlatList
                                enableEmptySections={true}
                                data={formatRow(this.filteredProjects, columnCount)}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => this.renderProject(item)}
                                style={{ zIndex: 1 }}
                                numColumns={columnCount}
                                key={columnCount}
                                columnWrapperStyle={columnCount > 1 && styles.columnWrapperStyle}
                                contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12, paddingHorizontal: theme.padding, paddingTop: 10 }} />
                            :
                            <EmptyList icon={faConstruction} header='Aucun projet' description='Gérez tous vos projets. Appuyez sur le boutton "+" pour en créer un nouveau.' />
                        }

                        {canCreate && this.showFAB && this.isRoot &&
                            <MyFAB onPress={() => this.props.navigation.navigate('CreateProject')} />
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
    columnWrapperStyle: {
        justifyContent: 'space-between'
    },
    invisibleItem: { //Same shape of ProjectItem2
        width: constants.ScreenWidth * 0.24,
        height: constants.ScreenWidth * 0.24,
        borderRadius: constants.ScreenWidth * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'transparent'
    }
})

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(ListProjects)





   // const collection = formatedActions[documentId][0]['collection'] //PROJECTS: all array items have same collection

            // for (let action of formatedActions[documentId]) { // NOM & PRENOM: actions targeting same collection / same document

            //     const { properties } = action

            //     const isValid = await this.verifyDataExist(collection, documentId, properties)

            //     if (isValid) {
            //         action.status = 'done'
            //     }
            // }