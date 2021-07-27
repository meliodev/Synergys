import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, TextInput } from 'react-native';
import { Card, Title, TextInput as PaperInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Dialog from "react-native-dialog"
import { connect } from 'react-redux'
import _ from 'lodash'
import { faCashRegister, faCheckCircle, faEnvelopeOpenDollar, faExclamationTriangle, faHandsUsd, faInfoCircle, faTimes } from '@fortawesome/pro-light-svg-icons'

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
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, arrayValidator, setToast, load, articles_fr, isEditOffline, refreshProject, formatDocument, unformatDocument } from "../../core/utils"
import * as theme from "../../core/theme"
import { constants, highRoles } from "../../core/constants"
import { blockRoleUpdateOnPhase } from '../../core/privileges'
import { handleFirestoreError } from '../../core/exceptions'
import { fetchDocument } from '../../api/firestore-api';
import { CustomIcon } from '../../components';

const states = [
    { label: 'Terminé', value: 'Terminé' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Annulé', value: 'Annulé' },
]
const properties = ["project", "state", "orderLines", "taxes", "primeCEE", "primeRenov", "aidRegion", "discount", "validated", "createdAt", "createdBy", "editedAt", "editedBy"]
const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']
const warningMessage = "Attention, la tarification appliquée n'est pas conforme, veuillez APPUYER ICI pour notifier votre responsable d'agence."
const confirmMessage = "La remise a été validé par votre responsable d'agence. Vous pouvez continuer."
const pendingMessageAdmin = "Veuillez APPUYER ICI pour valider la remise appliquée par votre commercial."
const pendingMessageCom = "Votre responsable technique a été notifié. Veuillez patienter ou bien contactez le par téléphone..."

//Components (Helpers)
const SummaryRow = ({ label, value, valuePrefix = "€", textTheme = theme.customFontMSmedium.caption, labelStyle }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                <Text style={[textTheme, { color: theme.colors.placeholder }, labelStyle]}>{label}</Text>
            </View>

            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                <Text style={textTheme}>{valuePrefix}{value}</Text>
            </View>
        </View>
    )
}

class CreateOrder extends Component {
    constructor(props) {
        super(props)
        this.refreshOrderLine = this.refreshOrderLine.bind(this)
        this.refreshProject = refreshProject.bind(this)
        this.calculateSubTotal = this.calculateSubTotal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.runOrderListener = this.runOrderListener.bind(this)
        this.generatePdf = this.generatePdf.bind(this)
        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.setDiscountPopUp = this.setDiscountPopUp.bind(this)
        this.onPressDiscountPopUp = this.onPressDiscountPopUp.bind(this)
        this.cancelDiscount = this.cancelDiscount.bind(this)

        this.initialState = {}
        this.isInit = true
        this.isHighrole = highRoles.includes(this.props.role.id)

        //Generate pdf
        this.autoGenPdf = this.props.navigation.getParam('autoGenPdf', false)
        this.docType = this.props.navigation.getParam('docType', '')
        this.popCount = this.props.navigation.getParam('popCount', 1) // For pdf generation

        this.titleText = this.props.navigation.getParam('titleText', '')
        this.OrderId = this.props.navigation.getParam('OrderId', '')
        this.isEdit = this.OrderId !== '' ? true : false
        this.OrderId = this.isEdit ? this.OrderId : generateId('GS-CO-')
        this.titleText = `Création ${articles_fr('du', masculins, this.docType)} ${this.docType}`
        this.title = this.autoGenPdf ? this.titleText : this.isEdit ? 'Modifier la commande' : 'Nouvelle commande'

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
            orderLines: [{ "description": "", "price": "500", "product": { "brand": [Object], "category": "Catégorie 2", "createdAt": "2021-05-11T18:22:13+00:00", "createdBy": [Object], "deleted": false, "description": "", "editedAt": "2021-05-11T18:22:13+00:00", "editedBy": [Object], "hasPendingWrites": false, "id": "GS-AR-F83f", "name": "Produit 1", "price": "500", "taxe": "", "type": "product" }, "quantity": "1", "taxe": { "name": "", "rate": "", "value": 0 } }],
            checked: 'first',
            subTotal: 900,
            taxe: 0,
            taxes: [],
            total: 900,
            primeCEE: 0,
            primeRenov: 0,
            aidRegion: 0,
            discount: 0,
            discountError: "",
            validated: true,

            discountValidationStep: "",
            enableSubmit: true,

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

    //FETCH-INITIALIZE
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
        this.calculateTotals(order.taxes)
        if (!order.validated) { //Validation pending...
            this.setDiscountPopUp()
            this.runOrderListener()
        }
    }

    setOrder(order) {
        if (!order)
            this.setState({ docNotFound: true })
        else {
            order = formatDocument(order, properties)
            this.setState(order)
        }
        return order
    }

    calculateTotals(taxes) {
        const { orderLines } = this.state
        const subTotal = this.calculateSubTotal(orderLines)
        this.calculateTotal(subTotal, taxes)
    }

    setDiscountPopUp() {
        if (this.isHighrole)
            var discountValidationStep = 'pendingAdmin'
        else var discountValidationStep = 'pendingCom'
        this.setState({ discountValidationStep })
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
        load(this, false)
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
        let { orderLines, project, discount, errors } = this.state

        const projectError = nameValidator(project.id, '"Projet"')
        const orderLinesError = this.validateOrderLines()
        const discountError = discount > 15 ? "La remise ne peut excéder 15% du prix initial" : ""

        if (projectError || discountError || orderLinesError) {
            this.setState({ projectError, discountError, loading: false })
            return false
        }

        return true
    }

    //POST
    async handleSubmit(notifyAdmin) {

        Keyboard.dismiss()
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        //Disable submit onPress for the following cases...
        const disableSubmit = this.state.loading || _.isEqual(this.state, this.initialState) && !this.autoGenPdf || this.state.discountValidationStep === "pendingCom" || this.state.discountValidationStep === "pendingAdmin"
        if (disableSubmit) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //1. Verify if Discount was applied BY A COMMERCIAL
        const isAdminValidationRequired = !notifyAdmin && this.checkDiscountValidation()
        if (isAdminValidationRequired) {
            this.setState({ discountValidationStep: "warning" })
            load(this, false)
            return
        }

        // //POSEUR & COMMERCIAL PHASES UPDATES PRIVILEGES: Check if user has privilege to update selected project
        // const currentRole = this.props.role.id
        // const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, this.state.project.step)
        // if (isBlockedUpdates) {
        //     Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
        //     load(this, false)
        //     return
        // }

        //Set order
        const properties = ["project", "state", "orderLines", "subTotal", "taxes", "primeCEE", "primeRenov", "aidRegion", "discount", "total", "validated"]
        let order = unformatDocument(this.state, properties, this.props.currentUser, this.isEdit)
        order.validated = !notifyAdmin

        db.collection('Orders').doc(this.OrderId).set(order, { merge: true }) //#task: run trigger CF to notify responsable agence (with link of this order so he can validate it)

        if (notifyAdmin) {
            this.setState({ enableSubmit: false })
            this.runOrderListener()
            load(this, false)
        }

        else if (!this.autoGenPdf)
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
        if (overwriteIndex.toString())
            orderLines[overwriteIndex] = orderLine
        else orderLines.push(orderLine)
        this.setState({ orderLines })

        const subTotal = this.calculateSubTotal(orderLines)
        this.setState({ subTotal })

        const taxes = this.setTaxes(orderLines)
        this.calculateTotal(subTotal, taxes)
    }

    setTaxes(orderLines) {
        const taxesTemp = orderLines.map((orderLine) => orderLine.taxe) //taxe = {name, rate, value} ; value = taxe*price*quantity

        var holder = {}

        //Sum up taxes with same rate
        taxesTemp.forEach(function (taxe) {

            if (holder.hasOwnProperty(taxe.name))
                holder[taxe.name] = holder[taxe.name] + Number(taxe.value)

            else holder[taxe.name] = Number(taxe.value)
        })

        var taxes = []

        for (var prop in holder) {
            taxes.push({
                name: prop.toString(),
                value: holder[prop],
                rate: prop
            })
        }

        return taxes
    }

    removeOrderLine(key) {
        let { orderLines } = this.state
        orderLines.splice(key, 1)
        this.setState({ orderLines })
        const subTotal = this.calculateSubTotal(orderLines)
        const { taxes } = this.state
        this.calculateTotal(subTotal, taxes)
    }

    calculateSubTotal(orderLines) {
        let subTotal = 0
        for (const orderLine of orderLines) {
            subTotal = subTotal + orderLine.quantity * orderLine.price
        }
        return subTotal
    }

    calculateTotal(subTotal, taxes) {
        let total = subTotal

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
                    const tva = orderLine.taxe.name !== "" ? `(+ ${orderLine.taxe.name}% TVA)` : ""

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
                                <Text style={[theme.customFontMSregular.caption, { color: theme.colors.placeholder }]}>{orderLine.quantity} x {orderLine.price} {tva}</Text>
                            </View>

                            <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                                <Text style={theme.customFontMSmedium.body}>€{totalAmount}</Text>
                            </View>

                        </TouchableOpacity>
                    )
                })
                }
            </View >
        )
    }

    renderSummary() {
        const { total, subTotal, primeCEE, primeRenov, aidRegion, discount } = this.state
        const discountValue = (subTotal * discount) / 100
        const totalNet = total - primeCEE - primeRenov - aidRegion - discountValue
        return (
            <View>
                <SummaryRow label="Total H.T" valuePrefix="€" value={subTotal} />
                {this.renderTaxes()}
                <SummaryRow label="Total T.T.C" valuePrefix="€" value={total} />
                {primeCEE > 0 && <SummaryRow label="Prime Cee" valuePrefix="- €" value={primeCEE} />}
                {primeRenov > 0 && <SummaryRow label="Prime Renov" valuePrefix="- €" value={primeRenov} />}
                {aidRegion > 0 && <SummaryRow label="Aides région" valuePrefix="- €" value={aidRegion} />}
                {discount > 0 && <SummaryRow label="Remise" valuePrefix="- %" value={discount} />}
                <SummaryRow label="Net à payer" valuePrefix="€" value={totalNet} textTheme={theme.customFontMSmedium.body} labelStyle={{ color: theme.colors.secondary }} />
            </View >
        )
    }

    renderTaxes() {
        const { taxes } = this.state
        if (taxes.length === 0) return null
        return taxes.map((taxe) => {
            const { name, value } = taxe
            return <SummaryRow label={`TVA ${taxe.name}`} valuePrefix="%" value={value} />
        })
    }

    //DISCOUNT VALIDATION
    checkDiscountValidation() {
        const currentRole = this.props.role.id
        const isAdminValidationRequired = this.state.discount > 0 && currentRole === "com"
        return isAdminValidationRequired
    }

    runOrderListener() {
        //Listener: To know when the Responsible validates the discount
        const query = db.collection('Orders').doc(this.OrderId)
        this.orderListener = query.onSnapshot((doc) => {
            const { discount, validated } = doc.data()
            let discountValidationStep = ""
            const pendingStep = this.isHighrole ? "pendingAdmin" : "pendingCom"

            if (discount === 0)
                setToast(this, 'e', "Remise annulée")
            else discountValidationStep = !doc.exists || !validated ? pendingStep : this.isHighrole ? "" : "confirmed"

            this.setState({ discountValidationStep, discount, validated })

            const unsubscribe = discount === 0 || discountValidationStep === "confirmed"
            if (unsubscribe)
                this.orderListener()
        })
    }

    cancelDiscount() {
        const discount = 0
        if (this.state.discountValidationStep !== 'warning') { //Remote
            db.collection('Orders').doc(this.OrderId).update({ discount, validated: true })
            this.setState({ enableSubmit: true })
        }
        else this.setState({ discount, discountValidationStep: "" }) //Local
    }

    onPressDiscountPopUp() {
        const { enableSubmit } = this.state
        if (!enableSubmit) return
        //Admin Validation
        if (this.isHighrole) {
            db.collection('Orders').doc(this.OrderId).update({ validated: true }) //#task: notify commercial
            setToast(this, "s", "La remise a été validé !")
            this.setState({ discountValidationStep: "" })
        }
        //Commercial discount request
        else if (this.state.discountValidationStep === "warning")
            this.handleSubmit(true)

        //Hide popup
        else if (this.state.discountValidationStep === 'confirmed')
            this.setState({ discountValidationStep: "" })
    }

    renderAdminValidationPopUp() {
        const { discountValidationStep } = this.state
        if (discountValidationStep === "") return null

        const isWarning = discountValidationStep === "warning"
        const isPendingCom = discountValidationStep === "pendingCom"
        const isPendingAdmin = discountValidationStep === "pendingAdmin"
        const isConfirm = discountValidationStep === "confirmed"
        const isCancelable = isWarning || isPendingCom || isPendingAdmin

        const backgroundColor = isWarning ? theme.colors.error : isPendingCom ? "#616161" : "green"

        return (
            <TouchableOpacity
                style={[styles.discountPopUp, { backgroundColor }]}
                onPress={this.onPressDiscountPopUp}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', paddingRight: theme.padding }}>
                        <CustomIcon icon={isWarning ? faExclamationTriangle : faCheckCircle} color='white' />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[theme.customFontMSsemibold.caption, { color: theme.colors.white }]}>
                            {isWarning && warningMessage}
                            {isConfirm && confirmMessage}
                            {isPendingAdmin && pendingMessageAdmin}
                            {isPendingCom && pendingMessageCom}
                        </Text>
                    </View>
                </View>
                {isCancelable &&
                    <Button
                        mode="outlined"
                        onPress={this.cancelDiscount}
                        style={[styles.discountCancelButton, { backgroundColor }]}
                        labelStyle={{ color: theme.colors.white }}
                    >
                        Annuler la remise
                     </Button>
                }
                {isConfirm &&
                    <CustomIcon
                        icon={faTimes}
                        size={16}
                        color='white'
                        style={{ position: "absolute", right: 8, top: 8 }}
                    />
                }
            </TouchableOpacity>
        )
    }

    render() {
        const { project, state, client, orderLines, subTotal, taxes, total, primeCEE, primeRenov, aidRegion, discount, order, docType } = this.state
        const { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        const { projectError, discountError, loading, docNotFound, toastType, toastMessage, discountValidationStep, validated } = this.state

        const { canCreate, canUpdate, canDelete } = this.props.permissions.orders
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        const pdfGenButtonLabel = `Générer ${articles_fr('le', masculins, docType)} ${docType}`

        console.log("discountValidationStep", discountValidationStep)

        if (docNotFound)
            return (
                <View style={styles.container}>
                    <Appbar
                        close
                        title
                        titleText={this.title}
                    />
                    <EmptyList
                        icon={faTimes}
                        header='Commande introuvable'
                        description="Le commande est introuvable dans la base de données. Il se peut qu'elle ait été supprimé."
                        offLine={!isConnected}
                    />
                </View>
            )

        else return (
            <View style={styles.container}>
                <Appbar
                    close={!loading}
                    title
                    titleText={this.title}
                    check={this.autoGenPdf ? false : this.isEdit ? canWrite && !loading : !loading}
                    handleSubmit={() => this.handleSubmit(false)}
                    del={canDelete && this.isEdit && !loading && !this.autoGenPdf}
                    handleDelete={this.showAlert}
                />

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
                                        {true &&
                                            <MyInput
                                                label="Numéro de la commande"
                                                returnKeyType="done"
                                                value={this.OrderId}
                                                editable={false}
                                                disabled
                                            />
                                        }

                                        <ItemPicker
                                            onPress={() => {
                                                if (this.project || this.isEdit) return //pre-defined project
                                                navigateToScreen(this, 'ListProjects', {
                                                    onGoBack: this.refreshProject,
                                                    isRoot: false,
                                                    prevScreen: 'CreateOrder',
                                                    titleText: 'Choix du projet',
                                                    showFAB: false
                                                })
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
                                sectionIcon={faEnvelopeOpenDollar}
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

                                        <MyInput
                                            label="Aides région (€)"
                                            returnKeyType="done"
                                            keyboardType='numeric'
                                            value={aidRegion}
                                            onChangeText={aidRegion => this.setState({ aidRegion })}
                                        />
                                    </View>
                                }
                            />

                            <FormSection
                                sectionTitle='Remise'
                                sectionIcon={faHandsUsd}
                                form={
                                    <View style={{ flex: 1, paddingTop: 10 }}>
                                        <MyInput
                                            label="Remise (%)"
                                            returnKeyType="done"
                                            keyboardType='numeric'
                                            value={discount}
                                            onChangeText={discount => this.setState({ discount })}
                                            error={!!discountError}
                                            errorText={discountError}
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
                                                    <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>Articles</Text>
                                                    <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>Prix HT</Text>
                                                </View>
                                                {this.renderOrderLines(canWrite)}
                                                {this.renderSummary()}
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

                        {discountValidationStep !== "" && this.renderAdminValidationPopUp()}

                        {this.autoGenPdf && validated &&
                            <Button mode="contained" onPress={() => this.handleSubmit(false)} style={{ width: constants.ScreenWidth, backgroundColor: theme.colors.primary }} >
                                {pdfGenButtonLabel}
                            </Button>
                        }

                        <Toast
                            message={toastMessage}
                            type={toastType}
                            onDismiss={() => this.setState({ toastMessage: '' })}
                            containerStyle={{ bottom: constants.ScreenHeight * 0.35 }} />
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
    },
    discountPopUp: {
        paddingHorizontal: theme.padding,
        paddingVertical: theme.padding,
    },
    discountCancelButton: {
        borderColor: theme.colors.white,
        marginTop: theme.padding * 1.25
    }
})

