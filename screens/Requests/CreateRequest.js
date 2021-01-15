import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, FAB } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firebase from '@react-native-firebase/app';

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import MyInput from '../../components/TextInput'
import Appbar from '../../components/Appbar'
import Picker from "../../components/Picker";
import RequestState from "../../components/RequestState";

import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { generatetId, myAlert, updateField } from "../../core/utils";

import { connect } from 'react-redux'
import CreateTicket from './CreateTicket';
import CreateProject from './CreateProject';

const db = firebase.firestore()

const departments = [
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Facturation et suivi de projet', value: 'Facturation et suivi de projet' },
    { label: 'Conseil technique', value: 'Conseil technique' },
    { label: 'Incident', value: 'Incident' },
]

class CreateRequest extends Component {
    constructor(props) {
        super(props)
        this.refreshClient = this.refreshClient.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.myAlert = myAlert.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser
        this.requestType = this.props.requestType
        this.isTicket = false
        //this.isProject = false

        if (this.requestType === 'ticket')
            this.isTicket = true

        this.RequestId = this.props.navigation.getParam('RequestId', '')
        this.isEdit = this.props.navigation.getParam('isEdit', false)

        this.state = {
            idCount: 0,
            RequestId: '', //Not editable
            client: { id: '', fullName: '' },

            department: 'Incident', //ticket
            address: { description: '40 Quai Vallière, 11100 Narbonne, France', place_id: 'qehsfgnhousfgnf' }, //project

            subject: { value: "", error: '' },
            description: { value: "", error: '' },
            state: 'En attente',

            createdAt: '',
            createdBy: { userId: '', userName: '' },
            editedAt: '',
            editedBy: { userId: '', userName: '' },

            error: '',
            loading: false
        }
    }

    async componentDidMount() {
        //Edition
        if (this.isEdit)
            this.fetchRequest()

        //Creation
        else {
            let RequestId = ''
            if (this.isTicket)
                RequestId = generatetId('GS-DTC-')

            else
                RequestId = generatetId('GS-DPR-')

            this.setState({ RequestId }, () =>  this.initialState = this.state)
        }
    }

    componentWillUnmount() {
        //  this.unsubscribe1()
    }

    fetchRequest() {
        db.collection('Requests').doc(this.RequestId).onSnapshot((doc) => {
            let { RequestId, department, client, subject, state, description, address } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            console.log(createdBy)
            //General info
            RequestId = this.RequestId
            client = client
            subject.value = doc.data().subject
            description.value = doc.data().description
            this.chatId = doc.data().chatId

            //َActivity
            createdAt = doc.data().createdAt
            createdBy = doc.data().createdBy
            editedAt = doc.data().editedAt
            editedBy = doc.data().editedBy

            //State
            state = doc.data().state

            if (this.isTicket)
                department = doc.data().department

            else
                address = doc.data().address

            this.setState({ createdAt, createdBy, editedAt, editedBy })
            this.setState({ RequestId, client, department, subject, description, address, state }, () => {
                if (this.isInit)
                    this.initialState = this.state

                this.isInit = false
            })
        })
    }

    refreshClient(isPro, id, nom, prenom) {
        let fullName = ''
        let client = { id: '', fullName: '' }

        if (isPro)
            fullName = nom

        else
            fullName = prenom + ' ' + nom

        client.id = id
        client.fullName = fullName

        this.setState({ client })
    }

    refreshAddress(address) {
        this.setState({ address })
    }

    validateInputs() {
        console.log('Verifying inputs')
    }

    // async increaseCount(idCount) {
    //     //condition: project or ticket
    //     if (this.isTicket)
    //         await db.collection('IdCounter').doc('requests').update({ tickets: idCount }).then(() => console.log('TICKETS COUNT UPDATED !'))

    //     else
    //         await db.collection('IdCounter').doc('requests').update({ projects: idCount }).then(() => console.log('PRODUCTS COUNT UPDATED !'))
    // }

    async AddNewChatRoom(RequestId) {
        await db.collection('Chats')
            .add({
                name: 'Nom du chat',
                latestMessage: {
                    text: `La demande de projet a été initiée.`,
                    createdAt: new Date().getTime()
                }
            })
            .then(docRef => {
                docRef.collection('Messages').add({
                    text: `La demande de projet a été initiée.`,
                    createdAt: new Date().getTime(),
                    system: true
                })
                return docRef
            })
            .then((docRef) => {
                console.log('request ID: ' + RequestId)
                console.log('Chat doc ID: ' + docRef.id)
                db.collection('Requests').doc(RequestId).update({ chatId: docRef.id }).catch((e) => console.error(e))
            })
            .catch(e => console.error(e))
    }

    async handleSubmit() {
        let { error, loading } = this.state
        let { idCount, RequestId, client, department, subject, description, address, state } = this.state

        if (loading) return

        //1. Validate inputs
        this.validateInputs()

        //2. ADDING REQUEST DOCUMENT
        let request = {
            RequestId: RequestId,
            client: client,
            subject: subject.value,
            description: description.value,
            state: state,
            editedAt: moment().format('lll'),
            editedBy: { userId: this.currentUser.uid, userName: this.currentUser.displayName }
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
            request.createdAt = moment().format('lll')
            request.createdBy = { userId: this.currentUser.uid, userName: this.currentUser.displayName }
        }

        //Case: No edit done
        if (this.state === this.initialState) {
            this.props.navigation.goBack()
            return
        }

        console.log('Ready to add ticket request...')

        db.collection('Requests').doc(RequestId).set(request, { merge: true })
            .then(async () => {
                //#trigger:
                if (!this.isEdit) {
                    // await this.increaseCount(idCount)
                    await this.AddNewChatRoom(RequestId)
                }

                this.props.navigation.goBack()
            })
            .catch((e) => this.setState({ error: e }))
            .finally(() => this.setState({ loading: false }))
    }

    renderStateToggle(currentState) {
        if (this.isTicket)
            return <RequestState state={currentState} onPress={(state) => this.alertUpdateRequestState(state, 'ticket')} />

        else
            return <RequestState state={currentState} onPress={(state) => this.alertUpdateRequestState(state, 'projet')} />
    }

    alertUpdateRequestState(nextState, label) {
        if (nextState !== this.state.state) {
            const title = "Mettre à jour le " + label
            const message = "Etes-vous sûr de vouloir changer l'état de ce " + label + ' ?'
            const handleConfirm = () => this.updateRequestState(nextState)

            this.myAlert(title, message, handleConfirm)
        }

        else return
    }

    updateRequestState(nextState) {
        db.collection('Requests').doc(this.RequestId).update({ state: nextState })
            .then(() => console.log('Request state updated !'))
            .catch((e) => console.error(e))
    }

    componentDidUpdate() {
        console.log(this.state.client)
    }

    render() {
        let { RequestId, client, department, subject, state, description, address } = this.state
        let { createdAt, createdBy, editedAt, editedBy } = this.state

        const title = ' Demande de ' + this.props.requestType

        let prevScreen = ''
        if (this.props.requestType === 'ticket')
            prevScreen = 'CreateTicketReq'

        else
            prevScreen = 'CreateProjectReq'

        return (
            <View style={styles.container}>
                <Appbar back close title titleText={title} check handleSubmit={this.handleSubmit} />

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

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ListClients', { onGoBack: this.refreshClient, prevScreen: prevScreen, titleText: 'Clients' })}>
                                <MyInput
                                    label="Client"
                                    value={client.fullName}
                                    editable={false}
                                />
                            </TouchableOpacity>

                            {this.isTicket ?
                                <Picker
                                    label="Département"
                                    returnKeyType="next"
                                    value={department}
                                    error={!!department.error}
                                    errorText={department.error}
                                    selectedValue={department}
                                    onValueChange={(department) => this.setState({ department })}
                                    title="Département"
                                    elements={departments}
                                />
                                :
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress })}>
                                    <MyInput
                                        label="Adresse postale"
                                        value={address.description}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            }


                            <MyInput
                                label="Sujet"
                                returnKeyType="done"
                                value={subject.value}
                                onChangeText={text => updateField(this, subject, text)}
                                error={!!subject.error}
                                errorText={subject.error}
                            />

                            <MyInput
                                label="Description"
                                returnKeyType="done"
                                value={description.value}
                                onChangeText={text => updateField(this, description, text)}
                                error={!!description.error}
                                errorText={description.error}
                            />

                        </Card.Content>
                    </Card>

                    {this.isEdit &&
                        <Card>
                            <Card.Content>
                                <Title>Activité</Title>
                                <MyInput
                                    label="Date de création"
                                    returnKeyType="done"
                                    value={createdAt}
                                    editable={false}
                                />
                                <MyInput
                                    label="Auteur"
                                    returnKeyType="done"
                                    value={createdBy.userName}
                                    editable={false}
                                />
                                <MyInput
                                    label="Dernière mise à jour"
                                    returnKeyType="done"
                                    value={editedAt}
                                    editable={false}
                                />
                                <MyInput
                                    label="Dernier intervenant"
                                    returnKeyType="done"
                                    value={editedBy.userName}
                                    editable={false}
                                />
                            </Card.Content>
                        </Card>
                    }
                </ScrollView>

                {this.isEdit &&
                    <View style={{ padding: 10, paddingRight: 15 }}>
                        <FAB
                            style={[styles.fab]}
                            small
                            icon={() => <Ionicons name='chatbubble-ellipses' color='white' size={25} />}
                            onPress={() => this.props.navigation.navigate('Chat', { chatId: this.chatId })} />
                        {this.renderStateToggle(state)}
                    </View>}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
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
        //flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10,
        width: 50,
        height: 50,
        borderRadius: 100,
    }
});

