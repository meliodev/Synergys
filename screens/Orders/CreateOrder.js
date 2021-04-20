import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, TextInput } from 'react-native';
import { Card, Title, TextInput as PaperInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Dialog from "react-native-dialog"
import { connect } from 'react-redux'
import _ from 'lodash'
import { faTimes } from '@fortawesome/pro-light-svg-icons'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import ItemPicker from "../../components/ItemPicker"
import Button from "../../components/Button"
import RadioButton from "../../components/RadioButton"
import Toast from "../../components/Toast"
import EmptyList from "../../components/EmptyList"
import Loading from "../../components/Loading"

import firebase, { db } from '../../firebase'
import { generateId, navigateToScreen, myAlert, updateField, downloadFile, nameValidator, arrayValidator, setToast, load, articles_fr, isEditOffline } from "../../core/utils"
import * as theme from "../../core/theme"
import { constants } from "../../core/constants"
import { blockRoleUpdateOnPhase } from '../../core/privileges'
import { handleFirestoreError } from '../../core/exceptions'

const states = [
    { label: 'Terminé', value: 'Terminé' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Annulé', value: 'Annulé' },
]

const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']

class CreateOrder extends Component {
    constructor(props) {
        super(props)
        this.fetchOrder = this.fetchOrder.bind(this)
        this.refreshOrderLine = this.refreshOrderLine.bind(this)
        this.refreshProject = this.refreshProject.bind(this)
        this.calculateSubTotal = this.calculateSubTotal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.generatePdf = this.generatePdf.bind(this)

        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        //Generate pdf
        this.autoGenPdf = this.props.navigation.getParam('autoGenPdf', false)
        this.docType = this.props.navigation.getParam('docType', '')
        this.popCount = this.props.navigation.getParam('popCount', 1) // For pdf generation

        this.titleText = this.props.navigation.getParam('titleText', '')

        this.OrderId = this.props.navigation.getParam('OrderId', '')
        this.isEdit = this.OrderId ? true : false

        this.titleText = `Création ${articles_fr('du', masculins, this.docType)} ${this.docType}`
        this.title = this.autoGenPdf ? this.titleText : this.OrderId ? 'Modifier la commande' : 'Nouvelle commande'

        //Params (order properties)
        this.project = this.props.navigation.getParam('project', undefined)

        this.state = {
            //AUTO-GENERATED
            OrderId: '', //Not editable

            //Screens
            project: this.project || { id: '', name: '', error: '' },
            client: { id: '', fullName: '' },

            //Pickers
            state: 'En cours',

            //Order Lines
            orderLines: [],
            checked: 'first',
            subTotal: 900,
            taxe: 0,
            taxes: [],
            total: 900,
            primeCEE: 0,
            primeRenov: 0,

            //logs
            createdBy: { id: '', fullName: '' },
            createdAt: '',
            editedBy: { id: '', fullName: '' },
            editededAt: '',

            error: '',
            loading: true,
            docNotFound: false,
            toastType: '',
            toastMessage: '',

            showDialog: false,
            order: null,
            pdfType: '',
            docType: this.docType,
        }
    }

    async componentDidMount() {

        if (this.isEdit) {
            const docNotFound = await this.fetchOrder()
            if (docNotFound) {
                load(this, false)
                return
            }
        }

        else {
            const OrderId = generateId('GS-CO-')
            this.setState({ OrderId }, () => {
                this.initialState = _.cloneDeep(this.state)
            })
        }

        if (this.project) {
            const client = await this.fetchClient(this.project.id)
            this.project.client = client
            this.setState({ project: this.project })
        }

        load(this, false)
    }

    //on Edit: fetch data
    async fetchOrder() {
        await db.collection('Orders').doc(this.OrderId).get().then((doc) => {

            if (!doc.exists) {
                this.setState({ docNotFound: true })
                return true
            }

            let { OrderId, project, state, orderLines, taxes, primeCEE, primeRenov } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            const order = doc.data()
            //General info
            OrderId = this.OrderId
            project = order.project
            orderLines = order.orderLines
            taxes = order.taxes
            primeCEE = order.primeCEE
            primeRenov = order.primeRenov

            this.fetchClient(project.id)

            //َActivity
            createdAt = order.createdAt
            createdBy = order.createdBy
            editedAt = order.editedAt
            editedBy = order.editedBy

            //State
            state = order.state

            this.setState({ OrderId, project, state, orderLines, taxes, primeCEE, primeRenov, createdAt, createdBy, editedAt, editedBy, order }, () => {
                if (this.isInit)
                    this.initialState = _.cloneDeep(this.state)

                this.isInit = false

                const subTotal = this.calculateSubTotal()
                this.setState({ subTotal }, () => this.calculateTotal())
            })
        })
    }

    async fetchClient(projectId) {
        const client = await db.collection('Projects').doc(projectId).get().then((doc) => {
            if (!doc.exists) return
            const client = doc.data().client
            this.setState({ client })
            return client
        })
        return client
    }

    //delete order
    showAlert() {
        const title = "Supprimer la commande"
        const message = 'Etes-vous sûr de vouloir supprimer cette commande ? Cette opération est irreversible.'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    async handleDelete() {
        load(this, true)
        this.title = 'Suppression de la commande...'
        db.collection('Orders').doc(this.OrderId).update({ deleted: true })
        this.props.navigation.goBack()
    }

    //inputs validation & submit
    validateOrderLines() {
        if (this.state.orderLines.length === 0) {
            const errorTitle = 'Erreur de saisie'
            const errorMessage = 'Veuillez ajouter au moins une ligne de commande'
            Alert.alert(errorTitle, errorMessage)
            return errorTitle
        }

        else return null
    }

    validateInputs() {
        let { orderLines } = this.state

        //let projectError = nameValidator(project.id, '"Projet"')
        let orderLinesError = this.validateOrderLines()

        // if (projectError) {
        //     Keyboard.dismiss()
        //     project.error = projectError
        //     this.setState({ project, loading: false })
        //     return false
        // }

        if (orderLinesError) {
            this.setState({ loading: false })
            return false
        }

        return true
    }

    async handleSubmit() {
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        //Handle Loading or No edit done
        if (this.state.loading || _.isEqual(this.state, this.initialState) && !this.autoGenPdf) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        // //POSEUR & COMMERCIAL PHASES UPDATES PRIVILEGES: Check if user has privilege to update selected project
        // const currentRole = this.props.role.id
        // const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, this.state.project.step)
        // if (isBlockedUpdates) {
        //     Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
        //     load(this, false)
        //     return
        // }

        // 1. ADDING document to firestore
        const { OrderId, project, state, orderLines, subTotal, taxes, primeCEE, primeRenov, total } = this.state
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }

        let order = {
            project,
            state,
            orderLines,
            subTotal,
            taxes,
            total,
            primeCEE,
            primeRenov,
            editedAt: moment().format(),
            editedBy: currentUser,
            deleted: false,
        }

        if (!this.isEdit) {
            order.createdAt = moment().format()
            order.createdBy = currentUser
        }

        console.log('Ready to add order...')
        db.collection('Orders').doc(OrderId).set(order, { merge: true })

        if (!this.autoGenPdf)
            this.props.navigation.goBack()

        //#task: Store order to be able to generate pdf in case user goes back from PdfGeneration
        else this.setState({ order, loading: false }, () => this.generatePdf(order, this.state.docType))
    }

    //Handle Pdf generation flow
    generatePdf(order, docType) {
        this.props.navigation.navigate('PdfGeneration', { order, docType, DocumentId: this.props.navigation.getParam('DocumentId', ''), popCount: this.popCount, onGoBack: this.props.navigation.getParam('onGoBack', null) })
    }

    //refresh inputs
    refreshProject(project) {
        project.error = ''
        this.setState({ project })
        this.fetchClient(project.id)
    }

    refreshOrderLine(orderLine, overwriteIndex) {
        let { orderLines } = this.state

        if (overwriteIndex.toString()) {
            orderLines[overwriteIndex] = orderLine
        }

        else {
            orderLines.push(orderLine)
        }

        this.setState({ orderLines }, () => {
            const subTotal = this.calculateSubTotal()

            this.setState({ subTotal }, () => {
                const taxes = this.setTaxes(orderLines)
                this.setState({ taxes }, () => {
                    this.calculateTotal()
                })
            })
        })
    }

    setTaxes(orderLines) {
        const taxesTemp = orderLines.map((orderLine) => orderLine.taxe) //taxe = {name, rate, value} ; value = taxe*price*quantity

        var holder = {}

        //Sum up taxes with same rate
        taxesTemp.forEach(function (taxe) {

            if (holder.hasOwnProperty(taxe.name)) {
                holder[taxe.name] = holder[taxe.name] + Number(taxe.value)
            }

            else {
                holder[taxe.name] = Number(taxe.value)
            }
        })

        var taxes = []

        for (var prop in holder) {
            taxes.push({ name: prop.toString(), value: holder[prop], rate: prop })
        }

        return taxes
    }

    removeOrderLine(key) {
        let { orderLines } = this.state
        orderLines.splice(key, 1)
        this.setState({ orderLines }, () => {
            const subTotal = this.calculateSubTotal()
            this.setState({ subTotal }, () => this.calculateTotal())
        })
    }

    //helpers
    calculateSubTotal() {
        const { orderLines } = this.state

        let subTotal = 0

        for (const orderLine of orderLines) {
            subTotal = subTotal + orderLine.quantity * orderLine.price
        }

        return subTotal
    }

    calculateTotal() {
        let { subTotal, taxes, total } = this.state

        total = subTotal

        if (taxes.length > 0) {
            var taxeValues = taxes.map(taxe => taxe.value)
            const sumTaxes = taxeValues.reduce((prev, next) => prev + next)
            total = total + sumTaxes
        }

        this.setState({ total })
    }

    //renderers
    renderOrderLines(canWrite) {
        const { orderLines } = this.state

        return (
            <View style={styles.customTagsContainer}>
                {orderLines.map((orderLine, key) => {
                    const totalAmount = Number(orderLine.quantity) * Number(orderLine.price)

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (!canWrite) return
                                navigateToScreen(this, 'AddItem', { orderLine, orderKey: key, onGoBack: this.refreshOrderLine })
                            }}
                            style={styles.orderLine}
                        >

                            {canWrite &&
                                <TouchableOpacity style={{ flex: 0.1, alignItems: 'flex-start', justifyContent: 'center' }} onPress={() => this.removeOrderLine(key)}>
                                    <MaterialCommunityIcons name='close-circle-outline' color={theme.colors.error} size={20} />
                                </TouchableOpacity>
                            }

                            <View style={{ flex: canWrite ? 0.65 : 0.75 }}>
                                <Text style={theme.customFontMSmedium.body}>{orderLine.product.name}</Text>
                                <Text style={[theme.customFontMSregular.body, { color: theme.colors.placeholder }]}>{orderLine.quantity} x {orderLine.price} (+ {orderLine.taxe.name}% TVA)</Text>
                            </View>

                            <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                                <Text style={theme.customFontMSmedium.body}>{totalAmount}</Text>
                            </View>

                        </TouchableOpacity>
                    )
                })
                }
            </View >
        )
    }

    renderSubTotal() {
        const { subTotal } = this.state

        return (
            < View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>Total H.T</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>€{subTotal}</Text>
                </View>
            </View >
        )
    }

    renderTaxes() {
        const { taxes } = this.state

        return taxes.map((taxe) => {
            return (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                    <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                        <Text style={theme.customFontMSregular.body}>TVA {taxe.name}%</Text>
                    </View>

                    <View style={{ flex: 0.5, alignItems: 'flex-end', marginBottom: 7 }}>
                        <Text style={theme.customFontMSregular.body}>€{taxe.value}</Text>
                    </View>
                </View>
            )
        })
    }

    renderTotal() {
        const { total } = this.state

        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSmedium.body}>Total T.T.C</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSmedium.body}>€{total}</Text>
                </View>
            </View>
        )
    }

    renderPrimeCee() {
        const { primeCEE } = this.state

        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>Prime Cee</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>- €{primeCEE}</Text>
                </View>
            </View>
        )
    }

    renderPrimeRenov() {
        const { primeRenov } = this.state

        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>Prime Renov</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>- €{primeRenov}</Text>
                </View>
            </View>
        )
    }

    renderTotalNet() {
        const { total, primeCEE, primeRenov } = this.state
        const totalNet = total - primeCEE - primeRenov

        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSmedium.header}>Net à payer</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSmedium.header}>€{totalNet}</Text>
                </View>
            </View>
        )
    }

    render() {
        let { OrderId, project, state, client } = this.state
        let { orderLines, subTotal, taxes, total, primeCEE, primeRenov, order, docType } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, docNotFound, toastType, toastMessage } = this.state

        let { canCreate, canUpdate, canDelete } = this.props.permissions.orders
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        const pdfGenButtonLabel = `Générer ${articles_fr('le', masculins, docType)} ${docType}`

        if (docNotFound)
            return (
                <View style={styles.container}>
                    <Appbar close title titleText={this.title} />
                    <EmptyList icon={faTimes} header='Commande introuvable' description="Le commande est introuvable dans la base de données. Il se peut qu'elle ait été supprimé." offLine={!isConnected} />
                </View>
            )

        else return (
            <View style={styles.container}>
                <Appbar close={!loading} title titleText={this.title} check={this.autoGenPdf ? false : this.isEdit ? canWrite && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading && !this.autoGenPdf} handleDelete={this.showAlert} />

                {loading ?
                    <View style={{ flex: 1 }}>
                        <Loading size='large' style={styles.loadingContainer} />
                    </View>
                    :
                    <View style={{ flex: 1 }}>

                        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: constants.ScreenWidth * 0.02 }}>

                            <Card style={{ margin: 5 }}>
                                <Card.Content>
                                    <Title>Détails de la commande</Title>

                                    <MyInput
                                        label="Numéro de la commande"
                                        returnKeyType="done"
                                        value={OrderId}
                                        editable={false}
                                        disabled
                                    />

                                    <ItemPicker
                                        onPress={() => {
                                            if (this.project || this.isEdit) return //pre-defined project
                                            navigateToScreen(this, 'ListProjects', { onGoBack: this.refreshProject, isRoot: false, prevScreen: 'CreateOrder', titleText: 'Choix du projet', showFAB: false })
                                        }}
                                        label="Projet concerné *"
                                        value={project.name}
                                        error={!!project.error}
                                        errorText={project.error}
                                        editable={canWrite}
                                        showAvatarText={false}
                                    />

                                    {client.fullName !== '' &&
                                        <TouchableOpacity >
                                            <MyInput
                                                label="Client concerné *"
                                                value={client.fullName}
                                                editable={false}
                                                right={client.fullName !== '' && canWrite && <PaperInput.Icon name='close' size={18} color={theme.colors.placeholder} onPress={() => {
                                                    if (this.project || this.isEdit) return
                                                    this.setState({ project: { id: '', name: '', error: '' }, client: { id: '', fullName: '' } })
                                                }} />} />
                                        </TouchableOpacity>
                                    }

                                    <Picker
                                        returnKeyType="next"
                                        value={state}
                                        error={!!state.error}
                                        errorText={state.error}
                                        selectedValue={state}
                                        onValueChange={(state) => this.setState({ state })}
                                        title="Etat *"
                                        elements={states}
                                        enabled={canWrite}
                                    />

                                    <MyInput
                                        label="Prime CEE (€)"
                                        returnKeyType="done"
                                        keyboardType='numeric'
                                        value={primeCEE}
                                        onChangeText={primeCEE => this.setState({ primeCEE })}
                                    />

                                    <MyInput
                                        label="Prime Renov (€)"
                                        returnKeyType="done"
                                        keyboardType='numeric'
                                        value={primeRenov}
                                        onChangeText={primeRenov => this.setState({ primeRenov })}
                                    />
                                </Card.Content>
                            </Card>

                            {orderLines.length > 0 ?
                                <Card style={{ margin: 5, paddingBottom: 10 }}>
                                    <Card.Content>
                                        <Button icon="plus-circle" loading={loading} mode="outlined"
                                            onPress={() => {
                                                if (!canWrite) return
                                                navigateToScreen(this, 'AddItem', { onGoBack: this.refreshOrderLine })
                                            }}
                                            style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                                            <Text style={theme.customFontMSmedium.caption}>Ajouter une ligne de commande</Text>
                                        </Button>

                                        <View style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 25, justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E0E0E0', borderBottomWidth: 1 }}>
                                            <Text style={[theme.customFontMSmedium.body, { color: theme.colors.placeholder }]}>Articles</Text>
                                            <Text style={[theme.customFontMSmedium.body, { color: theme.colors.placeholder }]}>Prix HT</Text>
                                        </View>

                                        {this.renderOrderLines(canWrite)}
                                        {this.renderSubTotal()}
                                        {taxes.length > 0 && this.renderTaxes()}
                                        {this.renderTotal()}
                                        {primeCEE > 0 && this.renderPrimeCee()}
                                        {primeRenov > 0 && this.renderPrimeRenov()}
                                        {this.renderTotalNet()}

                                    </Card.Content>
                                </Card>
                                :
                                <Card style={{ margin: 5, paddingBottom: 10, paddingHorizontal: 5 }}>
                                    <Card.Content>
                                        <Button icon="plus-circle" loading={loading} mode="outlined"
                                            onPress={() => {
                                                if (!canWrite) return
                                                navigateToScreen(this, 'AddItem', { onGoBack: this.refreshOrderLine })
                                            }}
                                            style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                                            <Text style={theme.customFontMSsemibold.caption}>Ajouter une ligne de commande</Text>
                                        </Button>
                                    </Card.Content>
                                </Card>
                            }

                            {this.isEdit && !this.autoGenPdf &&
                                <Card style={{ margin: 5 }}>
                                    <Card.Content>
                                        <Title style={{ marginBottom: 15 }}>Activité</Title>

                                        <MyInput
                                            label="Date de création"
                                            returnKeyType="done"
                                            value={createdAt}
                                            editable={false}
                                        />

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { userId: createdBy.id })}>
                                            <MyInput
                                                label="Crée par"
                                                returnKeyType="done"
                                                value={createdBy.fullName}
                                                editable={false}
                                                link
                                            />
                                        </TouchableOpacity>

                                        <MyInput
                                            label="Dernière mise à jour"
                                            returnKeyType="done"
                                            value={editedAt}
                                            editable={false}
                                        />

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { userId: editedBy.id })}>
                                            <MyInput
                                                label="Dernier intervenant"
                                                returnKeyType="done"
                                                value={editedBy.fullName}
                                                editable={false}
                                                link
                                            />
                                        </TouchableOpacity>

                                    </Card.Content>
                                </Card>
                            }

                        </ScrollView>

                        {this.autoGenPdf &&
                            <Button mode="contained" onPress={this.handleSubmit} style={{ width: constants.ScreenWidth, backgroundColor: theme.colors.primary }} >
                                {pdfGenButtonLabel}
                            </Button>
                        }

                        <Toast
                            message={toastMessage}
                            type={toastType}
                            onDismiss={() => this.setState({ toastMessage: '' })} />
                    </View>
                }

            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateOrder)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        //flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10,
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderLine: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    }
})

