import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, TextInput } from 'react-native';
import { Card, Title, ProgressBar, TextInput as PaperInput } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from "react-native-firebase"
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')
import SearchBar from '../../components/SearchBar';
import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import Button from "../../components/Button"
import RadioButton from "../../components/RadioButton"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import { fetchDocs } from "../../api/firestore-api";
import { generatetId, myAlert, updateField, downloadFile, nameValidator, setToast, load, arrayValidator } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { handleSetError } from '../../core/exceptions';
import { sub } from 'react-native-reanimated';

const db = firebase.firestore()

const states = [
    { label: 'Terminé', value: 'Terminé' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Annulé', value: 'Annulé' },
]

class CreateOrder extends Component {
    constructor(props) {
        super(props)
        this.fetchOrder = this.fetchOrder.bind(this)
        this.refreshOrderLine = this.refreshOrderLine.bind(this)
        this.refreshProject = this.refreshProject.bind(this)
        this.calculateSubTotal = this.calculateSubTotal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.OrderId = this.props.navigation.getParam('OrderId', '')
        this.isEdit = this.props.navigation.getParam('isEdit', false)
        this.title = this.props.navigation.getParam('title', 'Nouvelle commande')

        this.state = {
            //AUTO-GENERATED
            OrderId: '', //Not editable


            showInput: false,
            searchInput: '',

            //Screens
            project: { id: '', name: '', error: '' },
            client: { id: '', fullName: '' },

            //Pickers
            state: 'En cours',

            //Order Lines
            orderLines: [{ "description": "", "price": "900", "product": { "attachments": [[Object], [Object], [Object]], "brand": "LGS", "createdAt": "4 janv. 2021 14:12", "createdBy": { "fullName": "Salim Salim", "id": "GS-US-xQ6s" }, "deleted": false, "description": "lorem ipsum dolor", "editedAt": "4 janv. 2021 15:13", "editedBy": { "fullName": "Salim Salim", "id": "GS-US-xQ6s" }, "id": "GS-AR-yH4C", "name": "Machine à coudre", "price": "900", "type": "product" }, "quantity": "1" }],
            //orderLines: [],
            checked: 'first',
            subTotal: 900,
            discount: { type: 'percentage', value: '', error: '' },
            taxe: 0,
            total: 900,

            //logs
            createdBy: { id: '', fullName: '' },
            createdAt: '',
            editedBy: { id: '', fullName: '' },
            editededAt: '',

            error: '',
            loading: false,
            toastType: '',
            toastMessage: ''
        }
    }

    async componentDidMount() {
        load(this, true)

        if (this.isEdit) {
            await this.fetchOrder()
        }

        else {
            const OrderId = generatetId('GS-CO-')
            this.setState({ OrderId }, () => {
                this.initialState = this.state
                load(this, false)
            })
        }
    }

    //on Edit
    async fetchOrder() {
        await db.collection('Orders').doc(this.OrderId).get().then((doc) => {
            let { OrderId, project, state, orderLines, discount, taxe } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            const order = doc.data()
            //General info
            OrderId = this.OrderId
            project = order.project
            orderLines = order.orderLines
            discount = order.discount
            taxe = order.taxe

            let choice = 'first'
            if (discount.type === 'money') choice = 'second'
            this.setDiscountType(choice)

            this.fetchClient(project.id)

            //َActivity
            createdAt = order.createdAt
            createdBy = order.createdBy
            editedAt = order.editedAt
            editedBy = order.editedBy

            //State
            state = order.state

            this.setState({ OrderId, project, state, orderLines, discount, taxe, createdAt, createdBy, editedAt, editedBy }, () => {
                if (this.isInit)
                    this.initialState = this.state

                this.isInit = false

                const subTotal = this.calculateSubTotal()
                this.setState({ subTotal }, () => {
                    this.calculateTotal()
                    load(this, false)
                })
            })
        })
    }

    fetchClient(projectId) {
        db.collection('Projects').doc(projectId).get().then((doc) => {
            const client = doc.data().client
            this.setState({ client })
        })
    }

    //delete
    showAlert() {
        const title = "Supprimer la commande"
        const message = 'Etes-vous sûr de vouloir supprimer cette commande ? Cette opération est irreversible.'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    async handleDelete() {
        load(this, true)
        this.title = 'Suppression de la commande...'
        await db.collection('Orders').doc(this.OrderId).update({ deleted: true })
            .then(() => this.props.navigation.goBack())
            .catch((e) => console.error(e))
            .finally(() => load(this, false))
    }

    //submit
    validateOrderLines() {
        if (this.state.orderLines.length === 0)
            Alert.alert('Erreur de saisie', 'Veuillez ajouter au moins une ligne de commande')
    }

    validateInputs() {
        let { project, orderLines } = this.state

        let projectError = nameValidator(project.id, '"Projet"')
        let orderLinesError = this.validateOrderLines()

        if (projectError) {
            Keyboard.dismiss()
            project.error = projectError
            this.setState({ project, loading: false })
            return false
        }

        if (orderLinesError) {
            this.setState({ loading: false })
            return false
        }

        return true
    }

    async handleSubmit() {
        //Handle Loading or No edit done
        if (this.state.loading || this.state === this.initialState) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        // 1. ADDING document to firestore
        let { OrderId, project, state, orderLines, subTotal, discount, total } = this.state

        let order = {
            OrderId: OrderId,
            project: project,
            state: state,
            orderLines: orderLines,
            subTotal: subTotal,
            discount: { type: discount.type, value: discount.value },
            total: total,

            editedAt: moment().format('lll'),
            editedBy: { id: this.currentUser.uid, fullName: this.currentUser.displayName },
            deleted: false,
        }

        if (!this.isEdit) {
            order.createdAt = moment().format('lll')
            order.createdBy = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        }

        console.log('Ready to add order...')
        db.collection('Orders').doc(OrderId).set(order, { merge: true })
            .then(() => {
                this.setState({ loading: false })
                this.props.navigation.goBack()
            })
            .catch(e => {
                this.setState({ loading: false })
                handleSetError(e)
            })
    }

    //refresh inputs
    refreshProject(project) {
        project.error = ''
        this.setState({ project })
        this.fetchClient(project.id)
    }

    refreshOrderLine(orderLine) {
        let { orderLines } = this.state
        orderLines.push(orderLine)
        this.setState({ orderLines }, () => {
            const subTotal = this.calculateSubTotal()
            this.setState({ subTotal }, () => this.calculateTotal())
        })
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

    setDiscountType(choice) { //set total as well
        let { subTotal, discount, total } = this.state
        if (choice === 'first') {
            discount.type = 'percentage'
            total = subTotal - subTotal * (discount.value / 100)
        }
        else if (choice === 'second') {
            discount.type = 'money'
            total = subTotal - discount.value
        }
        this.setState({ checked: choice, discount, total })
    }

    calculateTotal() {
        let { subTotal, discount, taxe, total } = this.state

        total = subTotal

        if (discount.value !== '') {
            if (discount.type === 'percentage')
                total = total - subTotal * (discount.value / 100)
            else if (discount.type === 'money')
                total = subTotal - discount.value
        }
        if (taxe > 0)
            total = total + subTotal * (taxe / 100)

        this.setState({ total })
    }

    //renderers
    renderOrderLines() {
        const { orderLines } = this.state
        // const orderLines = [{ description: "", price: "8000", product: { ProductId: "GS-AR-HCMf", brand: "LG", createdAt: "2 janv. 2021 09:55", createdBy: [Object], deleted: false, description: "lorem ipsum", editedAt: "2 janv. 2021 09:55", editedBy: [Object], id: "GS-AR-HCMf", name: "Panneaux solaires", price: "8000" }, quantity: "1" }]
        // const orderLines = [{ "description": "", "price": "8000", "product": { "ProductId": "GS-AR-HCMf", "brand": "LG", "createdAt": "2 janv. 2021 09:55", "createdBy": [Object], "deleted": false, "description": "lorem ipsum", "editedAt": "2 janv. 2021 09:55", "editedBy": [Object], "id": "GS-AR-HCMf", "name": "Panneaux solaires", "price": "8000" }, "quantity": "1" }, { "description": "", "price": "500", "product": { "ProductId": "GS-AR-kbgg", "brand": "LG", "createdAt": "2 janv. 2021 12:17", "createdBy": [Object], "deleted": false, "description": "lorem ipsum", "editedAt": "2 janv. 2021 12:17", "editedBy": [Object], "id": "GS-AR-kbgg", "name": "Climatiseur", "price": "500" }, "quantity": "3" }]

        return (
            <View style={styles.customTagsContainer}>
                {orderLines.map((orderLine, key) => {
                    const totalAmount = Number(orderLine.quantity) * Number(orderLine.price)

                    return (
                        <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomColor: '#E0E0E0', borderBottomWidth: 1 }}>
                            <TouchableOpacity style={{ flex: 0.1, alignItems: 'flex-start' }} onPress={() => this.removeOrderLine(key)}>
                                <MaterialCommunityIcons name='close-circle-outline' color={theme.colors.error} size={20} />
                            </TouchableOpacity>

                            <View style={{ flex: 0.65 }}>
                                <Text style={theme.customFontMSsemibold.body}>{orderLine.product.name}</Text>
                                <Text style={[theme.customFontMSregular.body, { color: theme.colors.placeholder }]}>{orderLine.quantity} x {orderLine.price}</Text>
                            </View>

                            <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                                <Text style={theme.customFontMSsemibold.body}>{totalAmount}</Text>
                            </View>

                        </View>
                    )
                })}
            </View>
        )
    }

    renderSubTotal() {
        const { subTotal } = this.state

        return (
            < View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSbold.body}>Sous total</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSbold.body}>€{subTotal}</Text>
                </View>
            </View >
        )
    }

    renderDiscount() {
        const { discount, checked } = this.state

        return (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginTop: 30 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>Remise</Text>
                    <RadioButton
                        checked={checked}
                        firstChoice={{ title: '%', value: 'percentage' }}
                        secondChoice={{ title: '€', value: 'money' }}
                        onPress1={() => this.setDiscountType('first')}
                        onPress2={() => this.setDiscountType('second')}
                        textRight={true} />
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end', marginBottom: 7 }}>
                    <TextInput
                        label=""
                        returnKeyType="done"
                        keyboardType='numeric'
                        value={discount.value}
                        onChangeText={text => {
                            let { discount } = this.state
                            discount.value = text
                            this.setState({ discount }, () => this.calculateTotal())
                        }}
                        style={{ width: constants.ScreenWidth * 0.33, alignSelf: 'flex-end', textAlign: 'right', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
                        editable
                        maxLength={40}
                    />
                </View>
            </View>
        )
    }

    renderTaxe() {
        const { taxe } = this.state

        return (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSregular.body}>Taxe(%)</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end', marginBottom: 7 }}>
                    <TextInput
                        label=""
                        returnKeyType="done"
                        keyboardType='numeric'
                        value={taxe.value}
                        onChangeText={taxe => this.setState({ taxe }, () => this.calculateTotal())}
                        style={{ width: constants.ScreenWidth * 0.33, alignSelf: 'flex-end', textAlign: 'right', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
                        editable
                        maxLength={40}
                    />
                </View>
            </View>
        )
    }

    renderTotal() {
        const { total } = this.state

        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSbold.body}>Total</Text>
                </View>

                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                    <Text style={theme.customFontMSbold.body}>€{total}</Text>
                </View>
            </View>
        )
    }

    render() {
        let { OrderId, project, state, client } = this.state
        let { orderLines, subTotal, discount, total } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, toastType, toastMessage } = this.state
        const {showInput, searchInput} = this.state
        return (
            <View style={styles.container}>
                {/* <Appbar back={!loading} close title titleText={this.title} check={!loading} handleSubmit={this.handleSubmit} del={this.isEdit && !loading} handleDelete={this.showAlert} /> */}
                <SearchBar
          main={this}
          title={!showInput}
          titleText="Home"
          placeholder="Nouvelle commande"
          showBar={showInput}
          handleSearch={() =>
            this.setState({searchInput: '', showInput: !showInput})
          }
          searchInput={searchInput}
          searchUpdated={(searchInput) => this.setState({searchInput})}
        />
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

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ListProjects', { onGoBack: this.refreshProject, prevScreen: 'CreateOrder', isRoot: false, title: 'Choix du projet', showFAB: false })}>
                                        <MyInput
                                            label="Projet concerné"
                                            value={project.name}
                                            error={!!project.error}
                                            errorText={project.error}
                                            editable={false}
                                            right={project.name !== '' && <PaperInput.Icon name='close' size={18} color={theme.colors.placeholder} onPress={() => this.setState({ project: { id: '', name: '', error: '' }, client: { id: '', fullName: '' } })} />} />
                                    </TouchableOpacity>

                                    {client.fullName !== '' &&
                                        <TouchableOpacity >
                                            <MyInput
                                                label="Client concerné"
                                                value={client.fullName}
                                                editable={false}
                                                right={client.fullName !== '' && <PaperInput.Icon name='close' size={18} color={theme.colors.placeholder} onPress={() => this.setState({ project: { id: '', name: '', error: '' }, client: { id: '', fullName: '' } })} />} />
                                        </TouchableOpacity>
                                    }

                                    <Picker
                                        returnKeyType="next"
                                        value={state}
                                        error={!!state.error}
                                        errorText={state.error}
                                        selectedValue={state}
                                        onValueChange={(state) => this.setState({ state })}
                                        title="Etat"
                                        elements={states}
                                    />
                                </Card.Content>
                            </Card>

                            {orderLines.length > 0 ?
                                <Card style={{ margin: 5, paddingBottom: 10, paddingHorizontal: 5 }}>
                                    <Card.Content>
                                        <Button icon="plus-circle" loading={loading} mode="outlined" onPress={() => this.props.navigation.navigate('AddItem', { onGoBack: this.refreshOrderLine })} style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                                            <Text style={theme.customFontMSsemibold.caption}>Ajouter une ligne de commande</Text>
                                        </Button>

                                        <View style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 25, justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E0E0E0', borderBottomWidth: 1 }}>
                                            <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.placeholder }]}>Articles</Text>
                                            <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.placeholder }]}>Prix</Text>
                                        </View>

                                        {this.renderOrderLines()}
                                        {this.renderSubTotal()}
                                        {this.renderDiscount()}
                                        {this.renderTaxe()}
                                        {this.renderTotal()}

                                    </Card.Content>

                                </Card>
                                :
                                <Card style={{ margin: 5, paddingBottom: 10, paddingHorizontal: 5 }}>
                                    <Card.Content>
                                        <Button icon="plus-circle" loading={loading} mode="outlined" onPress={() => this.props.navigation.navigate('AddItem', { onGoBack: this.refreshOrderLine })} style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                                            <Text style={theme.customFontMSsemibold.caption}>Ajouter une ligne de commande</Text>
                                        </Button>
                                    </Card.Content>
                                </Card>
                            }

                            {this.isEdit &&
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
    }
})

