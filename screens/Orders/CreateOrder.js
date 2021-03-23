import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, TextInput } from 'react-native';
import { Card, Title, TextInput as PaperInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Dialog from "react-native-dialog"
import firebase from '@react-native-firebase/app'
import { connect } from 'react-redux'

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
import Loading from "../../components/Loading"

import { generateId, navigateToScreen, myAlert, updateField, downloadFile, nameValidator, arrayValidator, setToast, load, articles_fr, isEditOffline } from "../../core/utils"
import * as theme from "../../core/theme"
import { constants } from "../../core/constants"
import { handleFirestoreError } from '../../core/exceptions'

const db = firebase.firestore()

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
        this.titleText = this.props.navigation.getParam('titleText', '')

        this.OrderId = this.props.navigation.getParam('OrderId', '')
        this.isEdit = this.OrderId ? true : false

        this.titleText = `Création ${articles_fr('du', masculins, this.docType)} ${this.docType}`
        this.title = this.autoGenPdf ? this.titleText : this.OrderId ? 'Modifier la commande' : 'Nouvelle commande'

        this.state = {
            //AUTO-GENERATED
            OrderId: '', //Not editable

            //Screens
            project: { id: '', name: '', error: '' },
            client: { id: '', fullName: '' },

            //Pickers
            state: 'En cours',

            //Order Lines
            orderLines: [
                //  { "description": "", "price": "900", "product": { "brand": { "name": "LGS", "logo": {} }, "createdAt": "4 janv. 2021 14:12", "createdBy": { "fullName": "Salim Salim", "id": "GS-US-xQ6s" }, "deleted": false, "description": "lorem ipsum dolor", "editedAt": "4 janv. 2021 15:13", "editedBy": { "fullName": "Salim Salim", "id": "GS-US-xQ6s" }, "id": "GS-AR-yH4C", "name": "Machine à coudre", "price": "900", "type": "product", "category": "eee", "taxe": "25" }, "quantity": "1" }
            ],
            //orderLines: [],
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
            loading: false,
            toastType: '',
            toastMessage: '',

            showDialog: false,
            order: null,
            pdfType: '',
            docType: this.docType,
        }
    }

    async componentDidMount() {
        load(this, true)

        if (this.isEdit) {
            await this.fetchOrder()
            load(this, false)
        }

        else {
            const OrderId = generateId('GS-CO-')
            this.setState({ OrderId }, () => {
                this.initialState = this.state
                load(this, false)
            })
        }
    }

    //on Edit: fetch data
    async fetchOrder() {
        await db.collection('Orders').doc(this.OrderId).get().then((doc) => {
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
                    this.initialState = this.state

                this.isInit = false

                const subTotal = this.calculateSubTotal()
                this.setState({ subTotal }, () => this.calculateTotal())
            })
        })
    }

    fetchClient(projectId) {
        db.collection('Projects').doc(projectId).get().then((doc) => {
            const client = doc.data().client
            this.setState({ client })
        })
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
        if (this.state.loading || this.state === this.initialState && !this.autoGenPdf) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

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

            editedAt: moment().format('lll'),
            editedBy: currentUser,
            deleted: false,
        }

        if (!this.isEdit) {
            order.createdAt = moment().format('lll')
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
        this.props.navigation.navigate('PdfGeneration', { order, docType, DocumentId: this.props.navigation.getParam('DocumentId', ''), onGoBack: this.props.navigation.getParam('onGoBack', null) })
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
    renderOrderLines(canUpdate) {
        const { orderLines } = this.state

        return (
            <View style={styles.customTagsContainer}>
                {orderLines.map((orderLine, key) => {
                    const totalAmount = Number(orderLine.quantity) * Number(orderLine.price)

                    return (
                        <TouchableOpacity onPress={() => navigateToScreen(this, canUpdate, 'AddItem', { orderLine, orderKey: key, onGoBack: this.refreshOrderLine })} style={styles.orderLine}>

                            {canUpdate &&
                                <TouchableOpacity style={{ flex: 0.1, alignItems: 'flex-start', justifyContent: 'center' }} onPress={() => this.removeOrderLine(key)}>
                                    <MaterialCommunityIcons name='close-circle-outline' color={theme.colors.error} size={20} />
                                </TouchableOpacity>
                            }

                            <View style={{ flex: canUpdate ? 0.65 : 0.75 }}>
                                <Text style={theme.customFontMSsemibold.body}>{orderLine.product.name}</Text>
                                <Text style={[theme.customFontMSregular.body, { color: theme.colors.placeholder }]}>{orderLine.quantity} x {orderLine.price} (+ {orderLine.taxe.name}% TVA)</Text>
                            </View>

                            <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                                <Text style={theme.customFontMSsemibold.body}>{totalAmount}</Text>
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
                    <Text style={theme.customFontMSbold.body}>Total T.T.C</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSbold.body}>€{total}</Text>
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
                    <Text style={theme.customFontMSbold.header}>Net à payer</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSbold.header}>€{totalNet}</Text>
                </View>
            </View>
        )
    }

    render() {
        let { OrderId, project, state, client } = this.state
        let { orderLines, subTotal, taxes, total, primeCEE, primeRenov, order, docType } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, toastType, toastMessage } = this.state

        var { canUpdate, canDelete } = this.props.permissions.documents
        canUpdate = (canUpdate || !this.isEdit)

        const { isConnected } = this.props.network

        const pdfGenButtonLabel = `Générer ${articles_fr('le', masculins, docType)} ${docType}`

        return (
            <View style={styles.container}>
                <Appbar close={!loading} title titleText={this.title} check={this.autoGenPdf ? false : this.isEdit ? canUpdate && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading && !this.autoGenPdf} handleDelete={this.showAlert} />

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
                                        onPress={() => navigateToScreen(this, canUpdate, 'ListProjects', { onGoBack: this.refreshProject, isRoot: false, prevScreen: 'CreateOrder', titleText: 'Choix du projet', showFAB: false })}
                                        label="Projet concerné *"
                                        value={project.name}
                                        error={!!project.error}
                                        errorText={project.error}
                                        editable={false}
                                        showAvatarText={false}
                                    />

                                    {client.fullName !== '' &&
                                        <TouchableOpacity >
                                            <MyInput
                                                label="Client concerné *"
                                                value={client.fullName}
                                                editable={false}
                                                right={client.fullName !== '' && canUpdate && <PaperInput.Icon name='close' size={18} color={theme.colors.placeholder} onPress={() => this.setState({ project: { id: '', name: '', error: '' }, client: { id: '', fullName: '' } })} />} />
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
                                        enabled={canUpdate}
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
                                            onPress={() => navigateToScreen(this, canUpdate, 'AddItem', { onGoBack: this.refreshOrderLine })}
                                            style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                                            <Text style={theme.customFontMSsemibold.caption}>Ajouter une ligne de commande</Text>
                                        </Button>

                                        <View style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 25, justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E0E0E0', borderBottomWidth: 1 }}>
                                            <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.placeholder }]}>Articles</Text>
                                            <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.placeholder }]}>Prix HT</Text>
                                        </View>

                                        {this.renderOrderLines(canUpdate)}
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
                                            onPress={() => navigateToScreen(this, canUpdate, 'AddItem', { onGoBack: this.refreshOrderLine })}
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
                            <Button mode="contained" onPress={this.handleSubmit} style={{ width: constants.ScreenWidth, backgroundColor: theme.colors.secondary }} >
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

