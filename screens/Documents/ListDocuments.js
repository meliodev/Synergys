import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Image, ScrollView, FlatList, PermissionsAndroid } from 'react-native'
import { List, Card } from 'react-native-paper'
import firebase from '@react-native-firebase/app';
import SearchInput, { createFilter } from 'react-native-search-filter'

import SearchBar from '../../components/SearchBar'
import Filter from '../../components/Filter'
import DocumentItem from '../../components/DocumentItem'
import MyFAB from '../../components/MyFAB'
import EmptyList from '../../components/EmptyList'
import Loading from '../../components/Loading'

import { myAlert, downloadFile, loadLog, load, toggleFilter, setFilter, handleFilter } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api';

import * as theme from '../../core/theme';
import { constants } from '../../core/constants';

const KEYS_TO_FILTERS = ['id', 'name', 'state', 'type',]
const db = firebase.firestore()

const states = [
    { label: 'Tous', value: '' },
    { label: 'A faire', value: 'A faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Validé', value: 'Validé' },
]

const types = [
    { label: 'Tous', value: '' },
    { label: 'Bon de commande', value: 'Bon de commande' },
    { label: 'Devis', value: 'Devis' },
    { label: 'Facture', value: 'Facture' },
    { label: 'Dossier CEE', value: 'Dossier CEE' },
    { label: 'Prime de rénovation', value: 'Prime de rénovation' },
    { label: 'Aide et subvention', value: 'Aide et subvention' },
    { label: 'Action logement', value: 'Action logement' },
]

class ListDocuments extends Component {
    constructor(props) {
        super(props)
        this.filteredDocuments = []

        this.state = {
            documentsList: [],
            documentsCount: 0,

            //searchbar
            showInput: false,
            searchInput: '',

            //filters
            type: '',
            state: '',
            project: { id: '', name: '' },
            filterOpened: false,

            loading: false,
        }
    }

    //Fetch documents
    async componentDidMount() {
        load(this, true)
        let query = db.collection('Documents').where('deleted', '==', false).orderBy('createdAt', 'DESC')
        await fetchDocs(this, query, 'documentsList', 'documentsCount', () => load(this, false))
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    renderDocument(document) {
        const docId = document.id
        const docName = document.attachment.name
        const docURL = document.attachment.downloadURL

        return <DocumentItem document={document} />
    }

    render() {
        let { documentsCount, documentsList, loading, loadingMessage } = this.state
        let { type, state, project, filterOpened } = this.state
        let { searchInput, showInput } = this.state

        const fields = [{ label: 'type', value: type }, { label: 'state', value: state }, { label: 'project.id', value: project.id }]
        this.filteredDocuments = handleFilter(documentsList, this.filteredDocuments, fields, searchInput, KEYS_TO_FILTERS)
        const filterCount = this.filteredDocuments.length
        const filterActivated = filterCount < documentsCount

        let s = ''
        if (filterCount > 1)
            s = 's'

        return (
            <View style={styles.container}>
                <SearchBar
                    main={this}
                    title={!showInput}
                    titleText='Documents'
                    placeholder='Rechercher un document'
                    showBar={this.state.showInput}
                    handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                    searchInput={searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />

                {filterActivated && <View style={{ backgroundColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}><Text style={[theme.customFontMSsemibold.caption, { color: '#fff' }]}>Filtre activé</Text></View>}

                { loading ?
                    <View style={styles.container}>
                        <Loading size='large' />
                    </View>
                    :
                    <View style={styles.container}>
                        {documentsCount > 0 &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.gray50 }}>
                                <List.Subheader>{filterCount} document{s}</List.Subheader>

                                <Filter
                                    main={this}
                                    opened={filterOpened}
                                    toggleFilter={() => toggleFilter(this)}
                                    setFilter={(field, value) => setFilter(this, field, value)}
                                    resetFilter={() => this.setState({ type: '', state: '', project: { id: '', name: '' } })}
                                    options={[
                                        { id: 0, type: 'picker', title: "Type", values: types, value: type, field: 'type' },
                                        { id: 1, type: 'picker', title: "État", values: states, value: state, field: 'state' },
                                        { id: 2, type: 'screen', title: "Projet", value: project.name, field: 'project', screen: 'ListProjects', titleText: 'Filtre par projet' },
                                    ]}
                                />
                            </View>
                        }

                        {documentsCount > 0 ?
                            <FlatList
                                enableEmptySections={true}
                                data={this.filteredDocuments}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => this.renderDocument(item)}
                                contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12 }} />
                            :
                            <EmptyList iconName='file-document' header='Liste des documents' description='Gérez tous vos documents (factures, devis, etc). Appuyez sur le boutton "+" pour en ajouter.' />
                        }
                        <MyFAB onPress={() => this.props.navigation.navigate('UploadDocument')} />
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

export default ListDocuments