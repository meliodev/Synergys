import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { Card, Title, FAB } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firebase from '@react-native-firebase/app'
import { faInfoCircle, faFileAlt, faQuestionCircle } from '@fortawesome/pro-light-svg-icons'
import { faCalendarPlus } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'

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
import { generateId, navigateToScreen, load, myAlert, updateField, nameValidator, compareDates, isEditOffline, setPickerTaskTypes } from "../../core/utils"
import { blockRoleUpdateOnPhase } from "../../core/privileges"

import { connect } from 'react-redux'
import { CustomIcon } from '../../components';

const db = firebase.firestore()

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
        this.dynamicType = this.props.navigation.getParam('dynamicType', false) //User cannot create this task type if not added dynamiclly (useful for process progression)
        this.taskType = this.props.navigation.getParam('taskType', undefined) //Not editable
        this.project = this.props.navigation.getParam('project', undefined)
        this.enableTypePicker = !this.isEdit && !this.taskType

        const currentRole = this.props.role.id
        this.types = setPickerTaskTypes(currentRole, this.dynamicType, this.documentType)

        this.state = {
            //TEXTINPUTS
            name: { value: "", error: '' },
            description: { value: "", error: '' },

            //PICKERS
            type: (this.taskType && this.taskType.value) || 'Normale',
            priority: 'Moyenne',
            status: 'En cours',

            //Screens
            assignedTo: { id: '', fullName: '', error: '' },
            project: this.project || { id: '', name: '', error: '' },
            address: { description: '', place_id: '', error: '' },
            startDate: { value: moment().format(), error: '' },
            dueDate: { value: moment().add(1, 'h').format(), error: '' },

            color: theme.colors.primary,

            createdAt: '',
            createdBy: { id: '', fullName: '' },
            editedAt: '',
            editedBy: { id: '', fullName: '' },

            error: '',
            loading: false
        }
    }


    async componentDidMount() {
        if (this.isEdit) {
            await this.fetchTask()
        }

        else this.initialState = _.cloneDeep(this.state)
    }


    async fetchTask() {
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
                this.initialState = _.cloneDeep(this.state)
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

    refreshProject(project) {
        this.setState({ project })
    }

    //Inputs validation
    validateInputs() {
        let { name, assignedTo, startDate, dueDate } = this.state

        let nameError = nameValidator(name.value, '"Nom de la tâche"')
        let assignedToError = nameValidator(assignedTo.id, '"Attribué à"')
        let dateError = compareDates(dueDate.value, startDate.value, 'isBefore')

        if (nameError || assignedToError || dateError) {
            name.error = nameError
            assignedTo.error = assignedToError
            startDate.error = dateError
            dueDate.error = dateError

            this.setState({ name, assignedTo, startDate, dueDate, loading: false })
            return false
        }

        return true
    }

    alertCollaborator() {
        const title = ""
        const message = "L'utilisateur à qui vous voulez assigner cette tâche n'est pas un collaborateur dans le projet selectionné. Veuillez utiliser la barre de recherche pour trouver un collaborateur."
        const handleConfirm = () => navigateToScreen(this, 'ListEmployees', { onGoBack: this.refreshAssignedTo, prevScreen: 'CreateTask', isRoot: false, titleText: 'Attribuer la tâche à' })
        const handleCancel = () => console.log('cancel')
        const confirmText = 'OK'
        this.myAlert(title, message, handleConfirm, handleCancel, confirmText)
    }

    //Submit
    async handleSubmit() {
        Keyboard.dismiss()

        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        let { error, loading } = this.state
        let { name, assignedTo, description, project, type, priority, status, address, startDate, dueDate, color } = this.state

        if (loading || _.isEqual(this.state, this.initialState)) return
        load(this, true)

        //1.1 Validate inputs 
        const isValid = this.validateInputs()
        if (!isValid) return

        //1.2 ASSIGNED TO VERIFICATION (if he is one of the project's collaborators)
        if (project && project.subscribers) {
            const collaborators = project.subscribers.map((sub) => sub.id)
            if (!collaborators.includes(assignedTo.id)) {
                this.alertCollaborator()
                load(this, false)
                return
            }
        }

        //POSEUR & COMMERCIAL PHASES UPDATES PRIVILEGES: Check if user has privilege to update selected project
        const currentRole = this.props.role.id
        const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, this.state.project.step)
        if (isBlockedUpdates) {
            Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
            load(this, false)
            return
        }

        // 2. ADDING task DOCUMENT
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        const dateKey = moment(startDate.value).format('YYYY-MM-DD')
        const timestamp = moment(startDate.value).format()
        let natures
        this.types.forEach((t) => { if (t.value === type) natures = t.natures })

        let task = {
            dateKey: dateKey,
            name: name.value,
            assignedTo: { id: assignedTo.id, fullName: assignedTo.fullName },
            description: description.value,
            project,
            type: type,
            natures,
            priority: priority,
            status: status,
            address: { description: address.description, place_id: address.place_id },
            startDate: startDate.value,
            dueDate: dueDate.value,
            editedAt: moment().format(),
            editedBy: currentUser,
            color,
            deleted: false
        }

        if (!this.isEdit) {
            task.createdAt = moment().format()
            task.createdBy = currentUser
        }

        console.log('Ready to add task...')

        //  if (isAllDay) {
        db.collection('Agenda').doc(this.TaskId).set(task, { merge: true })
        // }

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
        let { name, description, assignedTo, project, startDate, startHour, dueDate, dueHour, type, priority, status, address, color } = this.state
        let { createdAt, createdBy, editedAt, editedBy, loading } = this.state

        let { canCreate, canUpdate, canDelete } = this.props.permissions.tasks
        canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        return (
            <View style={styles.container}>
                <Appbar close={!loading} title titleText={this.title} check={this.isEdit ? canWrite && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading} handleDelete={this.alertDeleteTask} />

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
                                        editable={canWrite}
                                    />

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'ListEmployees', { onGoBack: this.refreshAssignedTo, prevScreen: 'CreateTask', isRoot: false, titleText: 'Attribuer la tâche à' })}
                                        label="Attribuée à *"
                                        value={assignedTo.fullName}
                                        error={!!assignedTo.error}
                                        errorText={assignedTo.error}
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

                                    <ItemPicker
                                        onPress={() => {
                                            if (this.project || this.isEdit) return //pre-defined project
                                            navigateToScreen(this, 'ListProjects', { onGoBack: this.refreshProject, prevScreen: 'CreateTask', isRoot: false, titleText: 'Choix du projet', showFAB: false })
                                        }}
                                        label="Projet concerné"
                                        value={project.name}
                                        error={!!project.error}
                                        errorText={project.error}
                                        showAvatarText={false}
                                        editable={canWrite}
                                    />

                                    <ColorPicker
                                        label='Couleur de la tâche'
                                        selectedColor={color}
                                        updateParentColor={(selectedColor) => this.setState({ color: selectedColor })}
                                        editable={canWrite} />

                                    <Picker
                                        label="Type *"
                                        returnKeyType="next"
                                        value={type}
                                        error={!!type.error}
                                        errorText={type.error}
                                        selectedValue={type}
                                        onValueChange={(type) => this.setState({ type })}
                                        title="Type"
                                        elements={this.types}
                                        enabled={canWrite && this.enableTypePicker} //pre-defined task type
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
                                        enabled={canWrite}
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
                                        enabled={canWrite}
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <AddressInput
                                        label='Adresse postale'
                                        offLine={!isConnected}
                                        onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress })}
                                        address={address}
                                        addressError={address.error}
                                        editable={canWrite}
                                        isEdit={this.isEdit} />


                                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                                        <Text style={theme.customFontMSregular.body}>Toute la journée</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Switch onToggleSwitch={(isAllDay) => this.setState({ isAllDay })} disabled={!canWrite} />
                                            <CustomIcon icon={faQuestionCircle} color={theme.colors.gray_dark} size={21} onPress={() => Alert.alert('Toute la journée', `Si vous activez "Toute la journée", Une seule tâche va être crée et étendue sur toute la période définie. Sinon, la tâche se répétera chaque jour quotidiennement dans le créneau horaire défini.`)} />
                                        </View>
                                    </View> */}

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: 'de début' })}
                                        label='Date de début *'
                                        value={moment(startDate.value).format('lll')}
                                        editable={canWrite}
                                        showAvatarText={false}
                                        icon={faCalendarPlus}
                                        errorText={startDate.error}
                                    />

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: "d'échéance" })}
                                        label="Date d'échéance *"
                                        value={moment(dueDate.value).format('lll')}
                                        editable={canWrite}
                                        showAvatarText={false}
                                        icon={faCalendarPlus}
                                        errorText={dueDate.error}
                                    />
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
                                            value={createdBy.fullName}
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
                                            value={editedBy.fullName}
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