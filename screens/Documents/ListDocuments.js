import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { List } from 'react-native-paper'
import SearchInput, { createFilter } from 'react-native-search-filter'
import { connect } from 'react-redux'
import { faFolder } from '@fortawesome/pro-light-svg-icons'

import Background from '../../components/NewBackground'
import SearchBar from '../../components/SearchBar'
import ActiveFilter from '../../components/ActiveFilter'
import ListSubHeader from '../../components/ListSubHeader'
import Filter from '../../components/Filter'
import DocumentItem from '../../components/DocumentItem'
import MyFAB from '../../components/MyFAB'
import EmptyList from '../../components/EmptyList'
import Loading from '../../components/Loading'

import { configureQuery } from '../../core/privileges'
import { myAlert, downloadFile, loadLog, load, toggleFilter, setFilter, handleFilter } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api';
import { uploadFileNew } from "../../api/storage-api";

import { auth, db } from '../../firebase'
import * as theme from '../../core/theme';
import { constants } from '../../core/constants';

const KEYS_TO_FILTERS = ['id', 'name', 'state', 'type',]

const states = [
    { label: 'Tous', value: '' },
    { label: 'A faire', value: 'A faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Validé', value: 'Validé' },
]

let types = [
    { label: 'Tous', value: '' },
    { label: 'Bon de commande', value: 'Bon de commande' },
    { label: 'Devis', value: 'Devis' },
    { label: 'Facture', value: 'Facture' },
    { label: 'Dossier CEE', value: 'Dossier CEE' },
    { label: 'Fiche EEB', value: 'Fiche EEB' },
    { label: 'Dossier aide', value: 'Dossier aide' },
    { label: 'Prime de rénovation', value: 'Prime de rénovation' },
    { label: 'Aide et subvention', value: 'Aide et subvention' },
    { label: 'Action logement', value: 'Action logement' },
    { label: 'PV réception', value: 'PV réception' },
    { label: 'Mandat SEPA', value: 'Mandat SEPA' },
    { label: 'Contrat CGU-CGV', value: 'Contrat CGU-CGV' },
    { label: 'Attestation fluide', value: 'Attestation fluide' },
    { label: 'Autre', value: 'Autre' },
]

class ListDocuments extends Component {
    constructor(props) {
        super(props)
        this.filteredDocuments = []
        this.fetchDocs = fetchDocs.bind(this)
        this.uploadFileNew = uploadFileNew.bind(this)
        this.bootstrapUploads = this.bootstrapUploads.bind(this)

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

            loading: true,
        }
    }

    //Fetch documents
    componentDidMount() {
        //Rehydrate killed upload tasks
        this.bootstrapUploads()

        const role = this.props.role.id

        const { queryFilters } = this.props.permissions.documents
        if (queryFilters === [])
            this.setState({ documentsList: [], documentsCount: 0 })

        else {
            const params = { role: this.props.role.value }
            var query = configureQuery('Documents', queryFilters, params)
            this.fetchDocs(query, 'documentsList', 'documentsCount', async () => {
                await this.fetchExtraDocuments() //Intervenant
                load(this, false)
            })
        }
    }

    async fetchExtraDocuments() {
        let { documentsList, documentsCount } = this.state
        let extraDocuments = []

        await db
            .collection('Documents')
            .where('project.intervenant.id', '==', auth.currentUser.uid)
            .get().then((snapshot) => {
                documentsCount = documentsCount + snapshot.docs.length
                for (const doc of snapshot.docs) {
                    let document = doc.data()
                    document.id = doc.id
                    extraDocuments.push(document)
                }
            })

        if (extraDocuments.length > 0)
            documentsList = documentsList.concat(extraDocuments)

        this.setState({ documentsList, documentsCount })
    }

    bootstrapUploads() {
        const { newAttachments } = this.props.documents //Documents uploads
        console.log('1. Pending attachments.....', newAttachments)

        if (newAttachments === {}) return

        Object.entries(newAttachments).forEach(([DocumentId, attachment]) => {
            this.uploadOfflineBeta(attachment, DocumentId)
        })
    }

    uploadOfflineBeta(attachment, DocumentId) {
        const { storageRefPath } = attachment
        // console.log('2. uploadOfflineBeta')
        // console.log('2.1 attachment:', attachment)
        // console.log('2.2 storageRefPath:', storageRefPath)
        // console.log('2.3 DocumentId:', DocumentId)
        this.uploadFileNew(attachment, storageRefPath, DocumentId, true)
    }

    renderDocument(document) {
        return <DocumentItem document={document} />
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
    }

    renderSearchBar() {
        let { type, state, project, filterOpened } = this.state
        let { searchInput, showInput } = this.state

        return (
            <SearchBar
                main={this}
                title={!showInput}
                titleText='Documents'
                placeholder='Rechercher un document'
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
                        resetFilter={() => this.setState({ type: '', state: '', project: { id: '', name: '' } })}
                        options={[
                            { id: 0, type: 'picker', title: "Type", values: types, value: type, field: 'type' },
                            { id: 1, type: 'picker', title: "État", values: states, value: state, field: 'state' },
                            { id: 2, type: 'screen', title: "Projet", value: project.name.value, field: 'project', screen: 'ListProjects', titleText: 'Filtre par projet' },
                        ]}
                    />
                }
            />
        )
    }

    render() {
        let { documentsCount, documentsList, loading } = this.state
        let { type, state, project, filterOpened } = this.state
        let { searchInput, showInput } = this.state
        const { canCreate } = this.props.permissions.documents
        const { isConnected } = this.props.network

        const fields = [{ label: 'type', value: type }, { label: 'state', value: state }, { label: 'project.id', value: project.id }]
        this.filteredDocuments = handleFilter(documentsList, this.filteredDocuments, fields, searchInput, KEYS_TO_FILTERS)
        const filterCount = this.filteredDocuments.length
        const filterActivated = filterCount < documentsCount
        const s = filterCount > 1 ? 's' : ''

        return (
            <View style={styles.container}>

                { loading ?
                    <Background style={styles.container}>
                        {this.renderSearchBar()}
                        <Loading size='large' />
                    </Background>
                    :
                    <Background style={styles.container}>
                        {this.renderSearchBar()}
                        {filterActivated && <ActiveFilter />}
                        {documentsCount > 0 && <ListSubHeader>{filterCount} document{s}</ListSubHeader>}

                        {documentsCount > 0 ?
                            <FlatList
                                enableEmptySections={true}
                                data={this.filteredDocuments}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => this.renderDocument(item)}
                                style={{ zIndex: 1 }}
                                contentContainerStyle={{ paddingBottom: constants.ScreenHeight * 0.12 }} />
                            :
                            <EmptyList icon={faFolder} header='Aucun document' description='Gérez tous vos documents (factures, devis, etc). Appuyez sur le boutton "+" pour en ajouter.' offLine={!isConnected} />
                        }
                        {canCreate && <MyFAB onPress={() => this.props.navigation.navigate('UploadDocument')} />}
                    </Background>}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterActive: {
        backgroundColor: theme.colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    }
})

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        documents: state.documents
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(ListDocuments)
