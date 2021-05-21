import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, TextInput } from 'react-native';
import { Card, Title, TextInput as PaperInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Dialog from "react-native-dialog"
import { connect } from 'react-redux'
import _ from 'lodash'
import { faCashRegister, faHandsUsd, faInfoCircle, faTimes } from '@fortawesome/pro-light-svg-icons'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import FormSection from '../../components/FormSection';
import ActivitySection from '../../containers/ActivitySection';
import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import ItemPicker from "../../components/ItemPicker"
import Button from "../../components/Button"
import RadioButton from "../../components/RadioButton"
import Toast from "../../components/Toast"
import EmptyList from "../../components/EmptyList"
import Loading from "../../components/Loading"

import firebase, { db, auth } from '../../firebase'
import { generateId, navigateToScreen, myAlert, updateField, downloadFile, nameValidator, arrayValidator, setToast, load, articles_fr, isEditOffline, refreshProject, formatDocument, unformatDocument } from "../../core/utils"
import * as theme from "../../core/theme"
import { constants } from "../../core/constants"
import { blockRoleUpdateOnPhase } from '../../core/privileges'
import { handleFirestoreError } from '../../core/exceptions'
import { fetchDocument } from '../../api/firestore-api';

const states = [
    { label: 'Terminé', value: 'Terminé' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Annulé', value: 'Annulé' },
]
const properties = ["project", "state", "orderLines", "taxes", "primeCEE", "primeRenov", "createdAt", "createdBy", "editedAt", "editedBy"]
const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']

class CreateOrder extends Component {
    constructor(props) {
        super(props)
        this.refreshOrderLine = this.refreshOrderLine.bind(this)
        this.refreshProject = refreshProject.bind(this)
        this.calculateSubTotal = this.calculateSubTotal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.generatePdf = this.generatePdf.bind(this)

        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)

        this.initialState = {}
        this.isInit = true

        //Generate pdf
        this.autoGenPdf = this.props.navigation.getParam('autoGenPdf', false)
        this.docType = this.props.navigation.getParam('docType', '')
        this.popCount = this.props.navigation.getParam('popCount', 1) // For pdf generation

        this.titleText = this.props.navigation.getParam('titleText', '')

        this.OrderId = this.props.navigation.getParam('OrderId', '')
        this.isEdit = this.OrderId ? true : false
        this.OrderId = this.isEdit ? this.OrderId : generateId('GS-CO-')

        this.titleText = `Création ${articles_fr('du', masculins, this.docType)} ${this.docType}`
        this.title = this.autoGenPdf ? this.titleText : this.OrderId ? 'Modifier la commande' : 'Nouvelle commande'

        //Params (order properties)
        this.project = this.props.navigation.getParam('project', undefined)

        this.state = {
            //Screens
            project: this.project || { id: '', name: '' },
            projectError: '',
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

    //GET
    async componentDidMount() {
        if (this.isEdit) await this.initEditMode()
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    async initEditMode() {
        let order = await fetchDocument('Orders', this.OrderId)
        this.setState({ order }) //For pdf generation
        order = await this.setOrder(order)
        if (!order) return
        const subTotal = this.calculateSubTotal()
        this.setState({ subTotal }, () => this.calculateTotal())
    }

    setOrder(order) {
        if (!order)
            this.setState({ docNotFound: true })
        else {
            order = formatDocument(order, properties, [])
            this.setState(order)
        }
        return order
    }

    //DELETE
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

    //VALIDATE
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
        let { orderLines, project, errors } = this.state

        const projectError = nameValidator(project.id, '"Projet"')
        const orderLinesError = this.validateOrderLines()

        if (projectError) {
            Keyboard.dismiss()
            this.setState({ projectError, loading: false })
            return false
        }

        if (orderLinesError) {
            this.setState({ loading: false })
            return false
        }

        return true
    }

    //POST
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
        const currentRole = this.props.role.id
        const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, this.state.project.step)
        if (isBlockedUpdates) {
            Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
            load(this, false)
            return
        }

        const properties = ["project", "state", "orderLines", "subTotal", "taxes", "primeCEE", "primeRenov", "total"]
        const order = unformatDocument(this.state, properties, this.props.currentUser, this.isEdit)
        
        db.collection('Orders').doc(this.OrderId).set(order, { merge: true })

        if (!this.autoGenPdf)
            this.props.navigation.goBack()

        //#task: Store order to be able to generate pdf in case user goes back from PdfGeneration
        else this.setState({ order, loading: false }, () => this.generatePdf(order, this.state.docType))
    }

    //PDF GEN
    generatePdf(order, docType) {
        const navParams = {
            order,
            docType,
            DocumentId: this.props.navigation.getParam('DocumentId', ''),
            popCount: this.popCount,
            onGoBack: this.props.navigation.getParam('onGoBack', null)
        }
        this.props.navigation.navigate('PdfGeneration', navParams)
    }

    //Helpers
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
                this.setState({ taxes }, () => this.calculateTotal())
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

    //RENDERERS
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
        const { project, state, client, orderLines, subTotal, taxes, total, primeCEE, primeRenov, order, docType } = this.state
        const { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        const { projectError, loading, docNotFound, toastType, toastMessage } = this.state

        const { canCreate, canUpdate, canDelete } = this.props.permissions.orders
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

                        <ScrollView keyboardShouldPersistTaps="always" style={styles.container} contentContainerStyle={{ paddingBottom: constants.ScreenWidth * 0.02 }}>

                            <FormSection
                                sectionTitle='Informations générales'
                                sectionIcon={faInfoCircle}
                                form={
                                    <View style={{ flex: 1 }}>
                                        <MyInput
                                            label="Numéro de la commande"
                                            returnKeyType="done"
                                            value={this.OrderId}
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
                                            error={!!projectError}
                                            errorText={projectError}
                                            editable={canWrite}
                                            showAvatarText={false}
                                        />

                                        {client.fullName !== '' &&
                                            <ItemPicker
                                                onPress={() => {
                                                    if (this.project || this.isEdit) return
                                                    this.setState({ project: { id: '', name: '' }, client: { id: '', fullName: '' } })
                                                }}
                                                label="Client concerné *"
                                                value={client.fullName}
                                                editable={false}
                                                showAvatarText={true}
                                                icon={faTimes}
                                            />
                                        }

                                        <Picker
                                            returnKeyType="next"
                                            value={state}
                                            error={!!state.error}
                                            errorText={state.error}
                                            selectedValue={state}
                                            onValueChange={(state) => this.setState({ state })}
                                            title="État de la commande *"
                                            elements={states}
                                            enabled={canWrite}
                                        />
                                    </View>
                                }
                            />

                            <FormSection
                                sectionTitle='Primes'
                                sectionIcon={faHandsUsd}
                                form={
                                    <View style={{ flex: 1 }}>
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
                                    </View>
                                }
                            />

                            <FormSection
                                sectionTitle='Lignes de commandes'
                                sectionIcon={faCashRegister}
                                form={
                                    <View style={{ flex: 1, paddingTop: 10 }}>
                                        <Button icon="plus-circle" loading={loading} mode="outlined"
                                            onPress={() => {
                                                if (!canWrite) return
                                                navigateToScreen(this, 'AddItem', { onGoBack: this.refreshOrderLine })
                                            }}
                                            style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                                            <Text style={theme.customFontMSmedium.caption}>Ajouter une ligne de commande</Text>
                                        </Button>

                                        {orderLines.length > 0 &&
                                            <View>
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
                                            </View>
                                        }
                                    </View>
                                }
                            />


                            {this.isEdit && !this.autoGenPdf &&
                                <ActivitySection
                                    createdBy={createdBy}
                                    createdAt={createdAt}
                                    editedBy={editedBy}
                                    editedAt={editedAt}
                                    navigation={this.props.navigation}
                                />
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
        network: state.network,
        currentUser: state.currentUser
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateOrder)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
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

