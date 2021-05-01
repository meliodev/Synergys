import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { Card, Title } from 'react-native-paper'
import { faCommentDots, faTimes } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')


import Appbar from '../../components/Appbar'
import Picker from "../../components/Picker";
import AddressInput from '../../components/AddressInput'
import ItemPicker from '../../components/ItemPicker'
import MyInput from '../../components/TextInput'
import RequestState from "../../components/RequestState";
import Toast from "../../components/Toast";
import MyFAB from "../../components/MyFAB";
import EmptyList from "../../components/EmptyList";
import Loading from "../../components/Loading";

import firebase, { db, auth } from '../../firebase'
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, uuidGenerator, setToast, load, isEditOffline, refreshClient, setAddress } from "../../core/utils";

import { connect } from 'react-redux'
import CreateTicket from './CreateTicket';
import CreateProject from './CreateProject';
import { ActivitySection } from '../../containers/ActivitySection';

const departments = [
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Facturation et suivi de projet', value: 'Facturation et suivi de projet' },
    { label: 'Conseil technique', value: 'Conseil technique' },
    { label: 'Incident', value: 'Incident' },
]

class CreateRequest extends Component {
    constructor(props) {
        super(props)
        this.refreshClient = refreshClient.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.setAddress = setAddress.bind(this)
        this.autoFillClient = this.autoFillClient.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.myAlert = myAlert.bind(this)

        this.initialState = {}
        this.isInit = true
        this.requestType = this.props.requestType
        this.isTicket = this.requestType === 'ticket' ? true : false
        //this.isProject = false

        this.RequestId = this.props.navigation.getParam('RequestId', '')
        this.isEdit = this.RequestId ? true : false
        this.isClient = this.props.role.id === 'client'

        this.state = {
            idCount: 0,
            RequestId: '', //Not editable
            client: { id: '', fullName: '' },

            department: 'Commercial', //ticket
            address: { description: '', place_id: '' }, //project

            subject: { value: "", error: '' },
            description: { value: "", error: '' },
            state: 'En attente',

            createdAt: '',
            createdBy: { id: '', fullName: '' },
            editedAt: '',
            editedBy: { id: '', fullName: '' },

            error: '',
            loading: true,
            docNotFound: false,
            toastMessage: '',
            toastType: ''
        }
    }

    async componentDidMount() {
        //Edition
        if (this.isEdit) {
            const docNotFound = await this.fetchRequest()
            if (docNotFound) {
                load(this, false)
                return
            }
        }

        //Creation
        else {
            const RequestId = this.isTicket ? generateId('GS-DTC-') : generateId('GS-DPR-')
            var client = { id: '', fullName: '' }
            if (this.isClient) client = this.autoFillClient()
            this.setState({ RequestId, client }, () => this.initialState = _.cloneDeep(this.state))
        }

        load(this, false)
    }

    autoFillClient() {
        const { currentUser } = auth
        const client = {
            id: currentUser.uid,
            fullName: currentUser.displayName,
            email: currentUser.email,
            role: this.props.role.value
        }
        return client
    }


    async fetchRequest() {
        await db.collection('Requests').doc(this.RequestId).get().then((doc) => {

            if (!doc.exists) {
                this.setState({ docNotFound: true })
                return true
            }

            let { RequestId, department, client, subject, state, description, address } = this.state
            const { createdAt, createdBy, editedAt, editedBy } = this.state

            const request = doc.data()
            //General info
            RequestId = doc.id
            client = request.client
            subject.value = request.subject
            description.value = request.description
            this.chatId = request.chatId

            //َActivity
            createdAt = request.createdAt
            createdBy = request.createdBy
            editedAt = request.editedAt
            editedBy = request.editedBy

            //State
            state = request.state

            if (this.isTicket)
                department = request.department

            else
                address = request.address

            this.setState({ createdAt, createdBy, editedAt, editedBy })
            this.setState({ RequestId, client, department, subject, description, address, state }, () => {
                if (this.isInit)
                    this.initialState = _.cloneDeep(this.state)

                this.isInit = false
            })
        })
    }

    refreshAddress(address) {
        this.setState({ address })
    }

    validateInputs() {
        let { client, subject } = this.state

        let clientError = nameValidator(client.fullName, '"Client"')
        let subjectError = nameValidator(subject.value, '"Sujet"')
        //let addressError = nameValidator(address.description, '"Adresse postale"')

        if (clientError || subjectError) {
            subject.error = subjectError
            Keyboard.dismiss()
            this.setState({ clientError, subject, loading: false })
            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
            return false
        }

        return true
    }

    async AddRequestAndChatRoom(RequestId, request) {

        const messageId = await uuidGenerator()
        const systemMessage = {
            _id: messageId,
            text: `La demande de projet a été initiée.....`,
            createdAt: new Date().getTime(),
            system: true
        }

        //Batch write
        const batch = db.batch()
        const chatId = await uuidGenerator()
        request.chatId = chatId
        const requestsRef = db.collection('Requests').doc(RequestId)
        const chatRef = db.collection('Chats').doc(chatId)
        const messagesRef = chatRef.collection('ChatMessages').doc(messageId)

        batch.set(requestsRef, request)
        batch.set(chatRef, systemMessage)
        batch.set(messagesRef, systemMessage)
        batch.commit()

        // .catch((e) => {
        //     setToast(this, 'e', 'Erreur lors de la création de la demande, veuillez réessayer.')
        //     load(this, false)
        // })
    }

    async handleSubmit() {
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        const { error, loading } = this.state
        if (loading || _.isEqual(this.state, this.initialState)) return
        load(this, true)

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //2. ADDING REQUEST DOCUMENT
        const { RequestId, client, department, subject, description, address, state } = this.state
        const currentUser = {
            id: auth.currentUser.uid,
            fullName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            role: this.props.role.value,
        }

        let request = {
            client: client,
            subject: subject.value,
            description: description.value,
            state: state,
            editedAt: moment().format(),
            editedBy: currentUser
        }

        if (this.isTicket) {
            request.department = department
            request.type = 'ticket'
        }

        else {
            request.address = address
            request.type = 'projet'
        }

        if (!this.isEdit) {
            request.createdAt = moment().format()
            request.createdBy = currentUser
        }

        console.log('Ready to add request...')

        if (this.isEdit)
            db.collection('Requests').doc(RequestId).set(request, { merge: true })

        else
            this.AddRequestAndChatRoom(RequestId, request)

        load(this, false)
        this.props.navigation.goBack()
    }

    renderStateToggle(currentState, canWrite) {
        const label = this.isTicket ? 'ticket' : 'projet'
        return <RequestState state={currentState} onPress={(state) => this.alertUpdateRequestState(state, label, canWrite)} />
    }

    alertUpdateRequestState(nextState, label, canWrite) {
        if (nextState === this.state.state || !canWrite) return

        const title = "Mettre à jour le " + label
        const message = "Etes-vous sûr de vouloir changer l'état de ce " + label + ' ?'
        const handleConfirm = () => this.updateRequestState(nextState)

        this.myAlert(title, message, handleConfirm)
    }

    updateRequestState(nextState) {
        db.collection('Requests').doc(this.RequestId).update({ state: nextState })
            .then(() => {
                this.setState({ state: nextState })
                // this.fetchRequest()
            })
            .catch((e) => setToast(this, 'e', "Erreur lors de la mise à jour de l'état de la demande"))
    }

    render() {
        const { RequestId, client, department, subject, state, description, address } = this.state
        const { createdAt, createdBy, editedAt, editedBy, loading, docNotFound, toastMessage, toastType, clientError, addressError } = this.state
        const { requestType } = this.props

        let { canCreate, canUpdate, canDelete } = this.props.permissions.requests
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        const title = ' Demande de ' + requestType
        const prevScreen = requestType === 'ticket' ? 'CreateTicketReq' : 'CreateProjectReq'

        if (docNotFound)
            return (
                <View style={styles.container}>
                    <Appbar close title titleText={title} />
                    <EmptyList icon={faTimes} header='Demande introuvable' description="Le demande est introuvable dans la base de données. Il se peut qu'elle ait été supprimé." offLine={!isConnected} />
                </View>
            )

        else return (
            <View style={styles.container}>
                <Appbar close title titleText={title} check={this.isEdit ? canWrite && !loading : !loading} handleSubmit={this.handleSubmit} />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView style={styles.container} contentContainerStyle={{
                        backgroundColor: '#fff',
                        padding: constants.ScreenWidth * 0.02,
                        // paddingBottom: 80
                    }}>

                        <Card style={{ marginBottom: 20 }}>
                            <Card.Content>
                                <Title>Informations générales</Title>
                                <MyInput
                                    label="Numéro de la demande"
                                    returnKeyType="done"
                                    value={RequestId}
                                    editable={false}
                                />

                                {!this.isClient &&
                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'ListClients', { onGoBack: this.refreshClient, userType: 'client', prevScreen: prevScreen, isRoot: false, titleText: 'Choisir un client' })}
                                        label="Client *"
                                        value={client.fullName}
                                        error={!!clientError}
                                        errorText={clientError}
                                        editable={canWrite}
                                    />
                                }


                                {this.isTicket ?
                                    <Picker
                                        label="Département *"
                                        returnKeyType="next"
                                        value={department}
                                        selectedValue={department}
                                        onValueChange={(department) => this.setState({ department })}
                                        title="Département"
                                        elements={departments}
                                        enabled={canWrite}
                                    />
                                    :
                                    <AddressInput
                                        label='Adresse postale'
                                        offLine={!isConnected}
                                        onPress={() => navigateToScreen(this, 'Address', { onGoBack: this.refreshAddress })}
                                        address={address}
                                        onChangeText={this.setAddress}
                                        clearAddress={() => this.setAddress('')}
                                        addressError={addressError}
                                        editable={canWrite}
                                        isEdit={this.isEdit} />
                                }

                                <MyInput
                                    label="Sujet *"
                                    returnKeyType="done"
                                    value={subject.value}
                                    onChangeText={text => updateField(this, subject, text)}
                                    error={!!subject.error}
                                    errorText={subject.error}
                                    editable={canWrite}
                                />

                                <MyInput
                                    label="Description"
                                    returnKeyType="done"
                                    value={description.value}
                                    onChangeText={text => updateField(this, description, text)}
                                    error={!!description.error}
                                    errorText={description.error}
                                    editable={canWrite}
                                />

                            </Card.Content>
                        </Card>

                        {this.isEdit &&
                            <ActivitySection
                                createdBy={createdBy}
                                createdAt={createdAt}
                                editedBy={editedBy}
                                editedAt={editedAt}
                                navigation={this.props.navigation}
                            />
                        }
                    </ScrollView>
                }

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />

                {this.isEdit &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingRight: 15, backgroundColor: theme.colors.surface, elevation: 5 }}>
                        <MyFAB
                            onPress={() => this.props.navigation.navigate('Chat', { chatId: this.chatId })}
                            icon={faCommentDots}
                            style={styles.fab} />
                        {this.renderStateToggle(state, canWrite)}
                    </View>}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateRequest)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    fab: {
        width: constants.ScreenWidth * 0.14,
        height: constants.ScreenWidth * 0.14,
    }
});

