import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { Card, Title, FAB } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firebase from '@react-native-firebase/app'
import { faInfoCircle, faFileAlt, faQuestionCircle } from '@fortawesome/pro-light-svg-icons'
import { faCalendarPlus, faClock } from '@fortawesome/pro-light-svg-icons'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import FormSection from '../../components/FormSection'
import OffLineBar from '../../components/OffLineBar'
import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import ItemPicker from '../../components/ItemPicker'
import AddressInput from '../../components/AddressInput'
import Picker from "../../components/Picker"
import Switch from "../../components/Switch"
import Loading from "../../components/Loading"

//Task state
import ColorPicker from "../../components/ColorPicker"
import TaskState from "../../components/RequestState"

import * as theme from "../../core/theme"
import { constants, adminId } from "../../core/constants"
import { generateId, navigateToScreen, load, myAlert, updateField, nameValidator, compareDates, isEditOffline } from "../../core/utils"

import { connect } from 'react-redux'
import { CustomIcon } from '../../components';

const db = firebase.firestore()

let types = [
    { label: 'Normale', value: 'Normale' }, //#static
    { label: 'Rendez-vous 1', value: 'Rendez-vous 1' }, //#dynamic
    { label: 'Visite technique préalable', value: 'Visite technique préalable' }, //#dynamic
    { label: 'Visite technique', value: 'Visite technique' }, //#dynamic
    { label: 'Installation', value: 'Installation' }, //#dynamic
    { label: 'Rattrapage', value: 'Rattrapage' }, //#dynamic
    { label: 'Panne', value: 'Panne' }, //#static
    { label: 'Entretien', value: 'Entretien' }, //#static
    //{ label: 'Rendez-vous N', value: 'Rendez-vous N' }, //restriction: user can not create rdn manually (only during the process and only DC can posptpone it during the process)
]

const priorities = [
    { label: 'Urgente', value: 'Urgente' },
    { label: 'Moyenne', value: 'Moyenne' },
    { label: 'Faible', value: 'Faible' },
]

const statuses = [
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

class CreateTask extends Component {
    constructor(props) {
        super(props)
        this.refreshDate = this.refreshDate.bind(this)
        this.refreshDay = this.refreshDay.bind(this)
        this.refreshTime = this.refreshTime.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.refreshAssignedTo = this.refreshAssignedTo.bind(this)
        this.refreshProject = this.refreshProject.bind(this)

        this.validateInputs = this.validateInputs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.myAlert = myAlert.bind(this)
        this.alertDeleteTask = this.alertDeleteTask.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.TaskId = this.props.navigation.getParam('TaskId', '')
        this.isEdit = this.TaskId ? true : false
        this.TaskId = this.isEdit ? this.TaskId : generateId('GS-TC-')
        this.title = this.isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'

        //Params (task properties)
        this.enableRDN = this.props.navigation.getParam('enableRDN', false)
        this.taskType = this.props.navigation.getParam('taskType', 'Rendez-vous')
        this.project = this.props.navigation.getParam('project', { id: '', name: '', error: '' })
        if (this.enableRDN) {
            types.push({ label: 'Rendez-vous N', value: 'Rendez-vous N' })
        }

        this.state = {
            //TEXTINPUTS
            name: { value: "", error: '' },
            description: { value: "", error: '' },

            //PICKERS
            type: this.taskType,
            priority: 'Moyenne',
            status: 'En cours',

            //Screens
            assignedTo: { id: '', fullName: '', error: '' },
            project: this.project,
            address: { description: '', place_id: '', error: '' },

            isAllDay: false,

            //isAllDay = true
            startDate: { value: moment().format(), error: '' },
            dueDate: { value: moment().add(1, 'h').format(), error: '' },

            //isAllDay = false
            startDay: { value: moment().format(), error: '' },
            dueDay: { value: moment().format(), error: '' },
            startTime: { value: moment().format(), error: '' },
            dueTime: { value: moment().add(1, 'h').format(), error: '' },

            color: theme.colors.primary,

            createdAt: '',
            createdBy: { userId: '', userName: '' },
            editedAt: '',
            editedBy: { userId: '', userName: '' },

            error: '',
            loading: false
        }
    }


    async componentDidMount() {
        if (this.isEdit) {
            await this.fetchTask()
        }

        else this.initialState = this.state
    }

    fetchTask() {
        db.collection('Agenda').doc(this.TaskId).get().then((doc) => {
            let { name, assignedTo, description, project, type, priority, status, address, startDate, dueDate, color } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            const task = doc.data()

            if (!task) return

            // //General info
            name.value = task.name
            assignedTo = task.assignedTo
            description.value = task.description
            project = task.project
            priority = task.priority
            status = task.status
            type = task.type
            address = task.address
            startDate.value = task.startDate
            dueDate.value = task.dueDate
            color = task.color

            //َActivity
            createdAt = task.createdAt
            createdBy = task.createdBy
            editedAt = task.editedAt
            editedBy = task.editedBy

            this.setState({ createdAt, createdBy, editedAt, editedBy })
            this.setState({ name, assignedTo, description, project, type, priority, status, address, startDate, dueDate, color }, () => {
                // if (this.isInit)
                this.initialState = this.state

                // this.isInit = false
            })
        })
    }

    //Screen inputs
    refreshAddress(address) {
        this.setState({ address })
    }

    refreshAssignedTo(isPro, id, prenom, nom, role) {
        const assignedTo = { id, fullName: `${prenom} ${nom}`, role, error: '' }
        this.setState({ assignedTo })
    }

    refreshDate(label, date) {
        const pickedDate = {
            value: moment(date).format(),
            error: ''
        }

        if (label === 'start') {
            this.setState({ startDate: pickedDate })
        }

        else if (label === 'due') {
            this.setState({ dueDate: pickedDate })
        }
    }

    refreshDay(label, day) {
        if (label === 'start') {
            console.log('day start', day)
            this.setState({ startDay: day })
        }

        else if (label === 'due') {
            console.log('day end', day)
            this.setState({ dueDay: day })
        }
    }

    refreshTime(label, time) {
        if (label === 'start') {
            console.log('time start', time)
            this.setState({ startTime: time })
        }

        else if (label === 'due') {
            console.log('time end', time)
            this.setState({ dueTime: time })
        }
    }

    refreshProject(project) {
        this.setState({ project })
    }

    //Inputs validation
    validateInputs() {
        let { name, assignedTo, isAllDay, startDate, dueDate, startDay, dueDay, startTime, dueTime } = this.state

        let nameError = nameValidator(name.value, '"Nom de la tâche"')
        let assignedToError = nameValidator(assignedTo.id, '"Attribué à"')

        if (isAllDay)
            var dateError = compareDates(dueDate.value, startDate.value, 'isBefore')

        else {
            var dayError = compareDays(dueDay.value, startDay.value, 'isBefore')
            var timeError = compareTimes(dueTime.value, startTime.value, 'isBefore')
        }

        if (nameError || assignedToError || dateError) {
            name.error = nameError
            assignedTo.error = assignedToError
            startDate.error = dateError
            dueDate.error = dateError

            Keyboard.dismiss()
            this.setState({ name, assignedTo, startDate, dueDate, loading: false })
            return false
        }

        return true
    }

    //Submit
    async handleSubmit() {

        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        let { error, loading } = this.state
        let { name, assignedTo, description, project, type, priority, status, address, startDate, dueDate, color } = this.state

        if (loading || this.state === this.initialState) return
        load(this, true)

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        // 2. ADDING task DOCUMENT
        const currentUser = { userId: this.currentUser.uid, userName: this.currentUser.displayName }
        const dateKey = moment(startDate.value).format('YYYY-MM-DD')
        const timestamp = moment(startDate.value).format()

        let task = {
            dateKey: dateKey,
            name: name.value,
            assignedTo: { id: assignedTo.id, fullName: assignedTo.fullName },
            description: description.value,
            project: { id: project.id, name: project.name },
            type: type,
            priority: priority,
            status: status,
            address: { description: address.description, place_id: address.place_id },
            startDate: startDate.value,
            dueDate: dueDate.value,
            editedAt: moment().format(),
            editedBy: currentUser,
            subscribers: [{ id: this.currentUser.uid }], //add others (DC, CMX)
            color,
            timestamp: timestamp
        }

        if (!this.isEdit) {
            task.createdAt = moment().format()
            task.createdBy = currentUser
        }

        console.log('Ready to add task...')

        if (isAllDay) {
            db.collection('Agenda').doc(this.TaskId).set(task, { merge: true })
        }

        // else {
        //     const dateIterator = startDate
        //     while (moment(dateIterator).isBefore(dueDate)) {
        //         console.log(dateIterator)
        //         dateIterator = moment(dateIterator).add(1, 'day')
        //     }
        // }

        // if (this.isEdit)
        //     this.props.navigation.state.params.onGoBack(true) //Don't refresh tasks in agenda

        // else
        //     this.props.navigation.state.params.onGoBack(true) //Refresh tasks in agenda

        this.props.navigation.goBack()
    }


    alertDeleteTask() {
        const title = "Supprimer la tâche"
        const message = 'Êtes-vous sûr de vouloir supprimer cette tâche ?'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    //#OOS
    handleDelete() {
        this.title = 'Suppression de la tâche...'
        load(this, true)
        db.collection('Agenda').doc(this.TaskId).delete()
        load(this, false)
        this.props.navigation.state.params.onGoBack(true) //Refresh manually tasks in agenda because onSnapshot doesn't listen to delete operations.
        this.props.navigation.goBack()
    }

    render() {
        let { name, description, assignedTo, project, startDate, dueDate, startDay, dueDay, startTime, dueTime, type, priority, status, address, color, isAllDay } = this.state
        let { createdAt, createdBy, editedAt, editedBy, loading } = this.state
        let { canUpdate, canDelete } = this.props.permissions.tasks
        canUpdate = (canUpdate || !this.isEdit)
        const { isConnected } = this.props.network

        return (
            <View style={styles.container}>
                <Appbar close={!loading} title titleText={this.title} check={this.isEdit ? canUpdate && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading} handleDelete={this.alertDeleteTask} />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView style={styles.container}>

                        <FormSection
                            sectionTitle='Informations générales'
                            sectionIcon={faInfoCircle}
                            form={
                                <View style={{ flex: 1 }}>

                                    <MyInput
                                        label="Numéro de la tâche"
                                        returnKeyType="done"
                                        value={this.TaskId}
                                        editable={false}
                                        disabled
                                    />

                                    <MyInput
                                        label="Nom de la tâche *"
                                        returnKeyType="done"
                                        value={name.value}
                                        onChangeText={text => updateField(this, name, text)}
                                        error={!!name.error}
                                        errorText={name.error}
                                        editable={canUpdate}
                                    />

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, canUpdate, 'ListEmployees', { onGoBack: this.refreshAssignedTo, prevScreen: 'CreateTask', isRoot: false, titleText: 'Attribuer la tâche à' })}
                                        label="Attribuée à *"
                                        value={assignedTo.fullName}
                                        error={!!assignedTo.error}
                                        errorText={assignedTo.error}
                                        editable={false}
                                    />

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description.value}
                                        onChangeText={text => updateField(this, description, text)}
                                        error={!!description.error}
                                        errorText={description.error}
                                        editable={canUpdate}
                                    />

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, canUpdate, 'ListProjects', { onGoBack: this.refreshProject, prevScreen: 'CreateTask', isRoot: false, titleText: 'Choix du projet', showFAB: false })}
                                        label="Projet concerné"
                                        value={project.name}
                                        error={!!project.error}
                                        errorText={project.error}
                                        editable={false}
                                        showAvatarText={false}
                                    />

                                    <ColorPicker label='Couleur de la tâche' selectedColor={color} updateParentColor={(selectedColor) => this.setState({ color: selectedColor })} />

                                    <Picker
                                        label="Type *"
                                        returnKeyType="next"
                                        value={type}
                                        error={!!type.error}
                                        errorText={type.error}
                                        selectedValue={type}
                                        onValueChange={(type) => this.setState({ type })}
                                        title="Type"
                                        elements={types}
                                        enabled={canUpdate}
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <Picker
                                        label="État *"
                                        returnKeyType="next"
                                        value={status}
                                        error={!!status.error}
                                        errorText={status.error}
                                        selectedValue={status}
                                        onValueChange={(status) => this.setState({ status })}
                                        title="État"
                                        elements={statuses}
                                        enabled={canUpdate}
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <Picker
                                        label="Priorité *"
                                        returnKeyType="next"
                                        value={priority}
                                        error={!!priority.error}
                                        errorText={priority.error}
                                        selectedValue={priority}
                                        onValueChange={(priority) => this.setState({ priority })}
                                        title="Priorité"
                                        elements={priorities}
                                        enabled={canUpdate}
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <AddressInput
                                        label='Adresse postale'
                                        offLine={!isConnected}
                                        onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress })}
                                        address={address}
                                        addressError={address.error}
                                        editable={canUpdate} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                                        <Text style={theme.customFontMSregular.body}>Toute la journée</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {!this.isEdit && <Switch onToggleSwitch={(isAllDay) => this.setState({ isAllDay })} />}
                                            <CustomIcon icon={faQuestionCircle} color={theme.colors.gray_dark} size={19} style={{ marginLeft: 5 }} onPress={() => Alert.alert('Toute la journée', `Si vous activez "Toute la journée", Une seule tâche va être crée et étendue sur toute la période définie. Sinon, la tâche se répétera chaque jour quotidiennement dans le créneau horaire défini.`)} />
                                        </View>
                                    </View>

                                    {isAllDay ?
                                        <View>
                                            <ItemPicker
                                                onPress={() => navigateToScreen(this, canUpdate, 'DatePicker', { onGoBack: this.refreshDate, label: 'de début', isAllDay })}
                                                label='Date de début *'
                                                value={moment(startDate.value).format('lll')}
                                                editable={false}
                                                showAvatarText={false}
                                                icon={faCalendarPlus}
                                                errorText={startDate.error}
                                            />

                                            <ItemPicker
                                                onPress={() => navigateToScreen(this, canUpdate, 'DatePicker', { onGoBack: this.refreshDate, label: "d'échéance", isAllDay })}
                                                label="Date d'échéance *"
                                                value={moment(dueDate.value).format('lll')}
                                                editable={false}
                                                showAvatarText={false}
                                                icon={faCalendarPlus}
                                                errorText={dueDate.error}
                                            />
                                        </View>
                                        :
                                        <View>
                                            <ItemPicker
                                                onPress={() => navigateToScreen(this, canUpdate, 'DatePicker', { onGoBack: this.refreshDay, label: 'de début', showTimePicker: false, isAllDay })}
                                                label='Date de début *'
                                                value={moment(startDay.value).format('ll')}
                                                editable={false}
                                                showAvatarText={false}
                                                icon={faCalendarPlus}
                                                errorText={startDay.error}
                                                showDayPicker
                                            />

                                            <ItemPicker
                                                onPress={() => navigateToScreen(this, canUpdate, 'DatePicker', { onGoBack: this.refreshDay, label: "de fin", showTimePicker: false, isAllDay })}
                                                label="Date de fin *"
                                                value={moment(dueDay.value).format('ll')}
                                                editable={false}
                                                showAvatarText={false}
                                                icon={faCalendarPlus}
                                                errorText={dueDay.error}
                                            />
                                            <ItemPicker
                                                onPress={() => navigateToScreen(this, canUpdate, 'DatePicker', { onGoBack: this.refreshTime, label: 'de début', showDayPicker: false, isAllDay })}
                                                label='Heure de début *'
                                                value={moment(startTime.value).format('HH:mm')}
                                                editable={false}
                                                showAvatarText={false}
                                                icon={faClock}
                                                errorText={startTime.error}
                                            />

                                            <ItemPicker
                                                onPress={() => navigateToScreen(this, canUpdate, 'DatePicker', { onGoBack: this.refreshTime, label: "d'échéance", showDayPicker: false, isAllDay })}
                                                label="Heure d'échéance *"
                                                value={moment(dueTime.value).format('HH:mm')}
                                                editable={false}
                                                showAvatarText={false}
                                                icon={faClock}
                                                errorText={dueDate.error}
                                            />
                                        </View>
                                    }

                                </View>
                            }
                        />

                        {this.isEdit &&
                            <FormSection
                                sectionTitle='Activité'
                                sectionIcon={faFileAlt}
                                form={
                                    <View style={{ flex: 1 }}>
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
                                    </View>
                                }
                            />
                        }
                    </ScrollView>
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
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateTask)

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
})