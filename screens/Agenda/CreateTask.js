import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Keyboard, Alert } from 'react-native'
import { Title, Switch } from 'react-native-paper'
import firebase, { db, auth } from '../../firebase'
import { faInfoCircle, faFileAlt, faCalendarPlus, faClock, faCalendar, faTimes, faRetweet } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'
import { connect } from 'react-redux'
import { getSystemAvailableFeatures } from 'react-native-device-info'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import ActivitySection from '../../containers/ActivitySection'
import Appbar from '../../components/Appbar'
import FormSection from '../../components/FormSection'
import CustomIcon from '../../components/CustomIcon'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import ItemPicker from '../../components/ItemPicker'
import AddressInput from '../../components/AddressInput'
import ColorPicker from "../../components/ColorPicker"
import TaskState from "../../components/RequestState"
import TasksConflicts from "../../components/TasksConflicts"
import EmptyList from "../../components/EmptyList"
import Loading from "../../components/Loading"

import * as theme from "../../core/theme"
import { constants, adminId } from "../../core/constants"
import { generateId, navigateToScreen, load, myAlert, updateField, nameValidator, compareDates, compareTimes, checkOverlap, isEditOffline, setPickerTaskTypes, refreshAddress, refreshProject, refreshAssignedTo, setAddress, formatDocument, unformatDocument, displayError } from "../../core/utils"
import { blockRoleUpdateOnPhase } from "../../core/privileges"

import { fetchDocument } from '../../api/firestore-api';

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

const properties = ["name", "assignedTo", "description", "project", "type", "priority", "status", "address", "isAllDay", "date", "endDate", "startHour", "dueHour", "color", "createdAt", "createdBy", "editedAt", "editedBy"]

class CreateTask extends Component {
    constructor(props) {
        super(props)
        this.refreshTaskConflictDate = this.refreshTaskConflictDate.bind(this)
        this.refreshDate = this.refreshDate.bind(this)
        this.refreshAddress = refreshAddress.bind(this)
        this.refreshAssignedTo = refreshAssignedTo.bind(this)
        this.refreshProject = refreshProject.bind(this)
        this.setAddress = setAddress.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.validateInputs = this.validateInputs.bind(this)
        this.validateSchedule = this.validateSchedule.bind(this)
        this.buildTasks = this.buildTasks.bind(this)
        this.persistTasks = this.persistTasks.bind(this)
        this.myAlert = myAlert.bind(this)
        this.alertDeleteTask = this.alertDeleteTask.bind(this)
        this.renderTimeForm = this.renderTimeForm.bind(this)

        this.initialState = {}
        this.isInit = true

        this.prevScreen = this.props.navigation.getParam('prevScreen', '')
        this.TaskId = this.props.navigation.getParam('TaskId', '')
        this.isEdit = this.TaskId ? true : false
        this.TaskId = this.isEdit ? this.TaskId : generateId('GS-TC-')
        this.title = this.isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'

        //Params (task properties)
        this.dynamicType = this.props.navigation.getParam('dynamicType', false) //User cannot create this task type if not added dynamiclly (useful for process progression)
        this.taskType = this.props.navigation.getParam('taskType', undefined) //Not editable
        this.project = this.props.navigation.getParam('project', undefined)
        this.enableTypePicker = !this.isEdit && !this.taskType
        this.isProcess = this.props.navigation.getParam('isProcess', false)

        const currentRole = this.props.role.id
        this.types = setPickerTaskTypes(currentRole, this.dynamicType, this.documentType)
        const defaultState = this.setDefaultState()

        this.state = {
            //TEXTINPUTS
            name: defaultState.name || "",
            nameError: "",
            description: "",

            //PICKERS
            type: defaultState.type || 'Normale',
            priority: 'Moyenne',
            status: 'En cours',
            color: theme.colors.primary,

            //Screens
            assignedTo: defaultState.assignedTo || { id: '', fullName: '' },
            assignedToError: '',
            project: defaultState.project || { id: '', name: '' },
            address: defaultState.address || { description: '', place_id: '' },

            //Schedule
            isAllDay: true,
            startDate: moment().format(),
            endDate: moment().format(),
            startHour: moment().format('HH:mm'),
            dueHour: moment().format('HH:mm'),

            startDateError: '',
            endDateError: '',
            startHourError: '',
            dueHourError: '',

            //Conflicts
            showTasksConflicts: false,
            overlappingTasks: [],
            newTask: null,
            selectedIsAllDay: false,
            selectedDate: '',
            selectedStartHour: '',
            selectedDueHour: '',
            pickedDate: '',
            pickedTask: '',

            //Logs
            createdAt: '',
            createdBy: { id: '', fullName: '' },
            editedAt: '',
            editedBy: { id: '', fullName: '' },

            //Events
            error: '',
            loading: true,
            docNotFound: false,
        }
    }

    setDefaultState() {

        let defaultState = {}

        if (this.project && this.taskType) {
            const { comContact, techContact, address } = this.project
            const name = `${this.taskType.value} - ${this.project.id}`

            let assignedTo = {}
            if (_.isEqual(this.taskType.natures, ['com'])) {
                assignedTo = comContact
            }
            if (_.isEqual(this.taskType.natures, ['tech'])) {
                assignedTo = techContact
            }

            defaultState = {
                name,
                type: this.taskType.value,
                assignedTo,
                project: this.project,
                address
            }
        }

        return defaultState
    }

    //##GET
    async componentDidMount() {
        if (this.isEdit) await this.initEditMode()
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    async initEditMode() {
        let task = await fetchDocument('Agenda', this.TaskId)
        task = await this.setTask(task)
        if (!task) return
    }

    async setTask(task) {
        if (!task)
            this.setState({ docNotFound: true })
        else {
            task = formatDocument(task, properties, [])
            task.startDate = moment(task.date, 'YYYY-MM-DD').format()
            this.setState(task)
        }
        return task
    }

    //##UPDATE
    async refreshDate(output, field, isAllDay) {
        if (field === 'startDate') this.setState({ startDateError: '' })
        else if (field === 'endDate') this.setState({ endDateError: '' })
        else if (field === 'startHour') this.setState({ startHourError: '' })
        else if (field === 'dueHour') this.setState({ dueHourError: '' })

        let update = {}
        update[field] = output

        if (field === 'startDate' && isAllDay)
            update['endDate'] = output

        this.setState(update, () => this.validateSchedule())
    }

    //##VALIDATE
    validateSchedule() {
        const { isAllDay, startDate, endDate, startHour, dueHour, endDateError, dueHourError } = this.state
        const periodicTaskCreation = !this.isEdit && !isAllDay
        const dateError = periodicTaskCreation ? compareDates(endDate, startDate, 'isBefore') : ''
        const timeError = isAllDay ? '' : compareTimes(moment(dueHour, 'hh:mm'), moment(startHour, 'hh:mm'), 'isBefore')

        if (dateError || timeError) {
            endDateError = dateError
            dueHourError = timeError
            this.setState({ endDateError, dueHourError })
            return false
        }

        else return true
    }

    validateInputs() {
        const { name, assignedTo, endDateError, dueHourError } = this.state
        let isValid1 = true
        const nameError = nameValidator(name, '"Nom de la tâche"')
        const assignedToError = nameValidator(assignedTo.id, '"Attribué à"')
        if (nameError || assignedToError || endDateError || dueHourError) {
            isValid1 = false
            this.setState({ nameError, assignedToError, loading: false })
        }
        const isValid2 = this.validateSchedule()
        const isValid = isValid1 && isValid2
        return isValid
    }

    //##CONFLICTS VERIFICATION
    async checkTasksConflicts(tasks) {
        try {
            let overlappingTasks = {}
            for (const tsk of tasks) {
                const overlappingTasksArr = await this.checkAssignedToAvailability(tsk)
                if (overlappingTasksArr.length > 0) {
                    overlappingTasks[tsk.id] = overlappingTasksArr
                }
            }
            return overlappingTasks
        }
        catch (e) {
            const { message } = e
            throw new Error(message)
        }
    }

    async checkAssignedToAvailability(task) {
        try {
            const dateChanged = this.initialState.startDate !== task.date
            const timeChanged = this.initialState.startHour !== task.startHour
            const assignedToChanged = this.initialState.assignedTo.id !== task.assignedTo.id
            if (!dateChanged && !timeChanged && !assignedToChanged) return
            const today = moment().format('YYYY-MM-DD')
            const query = db.collection('Agenda').where('assignedTo.id', '==', task.assignedTo.id).where('date', '>=', today)
            const querySnapshot = await query.get().catch((e) => { throw new Error(errorMessages.firestore.get) })

            if (querySnapshot.empty) return []
            let overlappingTasks = []
            for (const doc of querySnapshot.docs) {

                const taskDoc = doc.data()
                const isCanceled = taskDoc.status === "Annulé"
                const notSameDoc = taskDoc.id !== task.id //updating document
                if (!isCanceled && notSameDoc && taskDoc.date === task.date) {
                    if (taskDoc.isAllDay) {
                        overlappingTasks.push(taskDoc)
                    }

                    else {
                        if (task.isAllDay)
                            overlappingTasks.push(taskDoc)

                        else {
                            const timerange1 = [taskDoc.startHour, taskDoc.dueHour]
                            const timerange2 = [task.startHour, task.dueHour]
                            const timeranges = [timerange1, timerange2]
                            const isOverlap = checkOverlap(timeranges)
                            if (isOverlap)
                                overlappingTasks.push(taskDoc)
                        }
                    }
                }
            }
            return overlappingTasks
        }
        catch (e) {
            const { message } = e
            throw new Error(message)
        }
    }

    handleConflicts(overlappingTasks, newTask) {
        this.setState({ showTasksConflicts: true, overlappingTasks, newTask })
    }

    //##LIMIT TASKS
    isTasksThisWeek(tasks) {
        const filterDate = (task) => {
            const taskDate = moment(task.date, 'YYYY-MM-DD')
            const endWeek = moment().add(7, 'days').format('YYYY-MM-DD')
            const isThisWeek = moment(taskDate).isSameOrBefore(endWeek)
            return isThisWeek
        }

        var index = tasks.findIndex(filterDate)
        const isThisWeek = index !== -1
        return isThisWeek
    }

    limitTasks(tasksLength) {
        const isOverLimit = tasksLength > 7
        return isOverLimit
    }

    //##POST
    async handleSubmit(isConflictHandler = false) {
        try {
            Keyboard.dismiss()
            //1. Check network (disable edit offline)
            const { isConnected } = this.props.network
            let isEditOffLine = isEditOffline(this.isEdit, isConnected)
            if (isEditOffLine) return

            //2. Init variables
            const { loading } = this.state
            if (loading || _.isEqual(this.state, this.initialState)) return
            load(this, true)

            //3.1 Validate inputs 
            const isValid = this.validateInputs()
            if (!isValid) return

            //3.2 POSEUR & COMMERCIAL PHASES UPDATES PRIVILEGES: Check if user has privilege to update selected project
            const currentRole = this.props.role.id
            const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, this.state.project.step)
            if (isBlockedUpdates) {
                Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
                load(this, false)
                return
            }

            //3.3 ADD INTERVENANT IF "ASSIGNED TO" IS NOT ONE OF PROJECT CONTACTS
            const { assignedTo, project, startDate, endDate, type } = this.state
            if (this.isProcess && assignedTo.role === 'Commercial' || assignedTo.role === 'Poseur') {
                const isIntervenant = assignedTo.id !== project.comContact.id && assignedTo.id !== project.techContact.id
                if (isIntervenant) {
                    db.collection('Projects').doc(project.id).update({ intervenant: assignedTo })
                }
            }

            //4. Building task(s)
            const properties = ["name", "assignedTo", "description", "project", "type", "priority", "status", "address", "color", "isAllDay", "startDate", "startHour", "dueHour"]
            let task = unformatDocument(this.state, properties, this.props.currentUser, this.isEdit)
            //specific
            task.id = this.TaskId
            task.date = moment(task.startDate).format('YYYY-MM-DD')
            delete task.startDate
            let natures
            this.types.forEach((t) => { if (t.value === type) natures = t.natures })
            task.natures = natures
            let tasks = this.isEdit ? [task] : this.buildTasks(task, startDate, endDate)

            //5.1
            const isThisWeek = this.isTasksThisWeek(tasks)
            if (!isThisWeek) {
                Alert.alert('Limite dépassée', "Impossible de planifier une tâche avant 7 jours. Veuiller définir une autre date de début.")
                load(this, false)
                return
            }

            //5.2 Limit number of tasks created
            const isOverLimit = this.limitTasks(tasks.length)
            if (isOverLimit) {
                Alert.alert('Limite dépassée', "Impossible d'ajouter plus de 25 tâches en une seule fois.")
                load(this, false)
                return
            }

            ////6. Handle conflicts
            const overlappingTasks = await this.checkTasksConflicts(tasks)
            if (!_.isEmpty(overlappingTasks) || isConflictHandler && _.isEmpty(overlappingTasks)) {
                load(this, false)
                this.handleConflicts(overlappingTasks, task)
                return
            }

            //7. Persist task(s)
            await this.persistTasks(tasks)

            //8. Go back
            //if (this.prevScreen === 'Agenda') {
            if (this.props.navigation.state.params.onGoBack) {
                const refreshAgenda = true
                this.props.navigation.state.params.onGoBack(refreshAgenda)
            }
            //}

            this.props.navigation.goBack()
        }
        catch (e) {
            const { message } = e
            displayError({ message })
        }
    }

    async persistTasks(tasks) {
        try {
            if (this.isEdit)
                await this.updateTask(tasks[0])
            else this.createTasks(tasks)
        }
        catch (e) {
            const { message } = e
            throw new Error(message)
        }
    }

    updateTask(task) {
        return db.collection('Agenda').doc(task.id).set(task, { merge: true })
    }

    createTasks(tasks) {
        for (const task of tasks) {
            db.collection('Agenda').doc(task.id).set(task)
        }
    }

    buildTasks(task, startDate, endDate) {
        let tasks = []
        let { isAllDay, startHour, dueHour } = task

        const startDateFormated = moment(startDate).format('YYYY-MM-DD')
        const endDateFormated = moment(endDate).format('YYYY-MM-DD')

        //Duplicate over the period startDate - endDate
        var dateIterator = moment(startDateFormated).format('YYYY-MM-DD')
        let predicate = moment(dateIterator).isSameOrBefore(endDateFormated, 'day')

        while (predicate) {
            let tempTask = _.cloneDeep(task)
            tempTask.id = generateId('GS-TC-')
            tempTask.date = dateIterator
            tempTask.startHour = startHour
            tempTask.dueHour = dueHour
            tasks.push(tempTask)
            dateIterator = moment(dateIterator).add(1, 'day').format('YYYY-MM-DD')
            predicate = moment(dateIterator).isSameOrBefore(endDateFormated, 'day')
        }

        return tasks
    }

    //##DELETE
    alertDeleteTask() {
        const title = "Supprimer la tâche"
        const message = 'Êtes-vous sûr de vouloir supprimer cette tâche ?'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    handleDelete() {
        this.title = 'Suppression de la tâche...'
        load(this, true)
        db.collection('Agenda').doc(this.TaskId).delete()
        load(this, false)
        this.props.navigation.state.params.onGoBack(true) //Refresh manually tasks in agenda because onSnapshot doesn't listen to delete operations.
        this.props.navigation.goBack()
    }

    //##HELPERS
    setListEmployeesQuery() {
        const { type } = this.state
        let query
        let natures = []
        this.types.forEach((t) => { if (t.value === type) natures = t.natures })
        const neutral = _.isEqual(natures, ['com', 'tech'])

        if (neutral) {
            query = db.collection('Users').where('deleted', '==', false)
        }

        else {
            const isCom = _.isEqual(natures, ['com'])
            const isTech = _.isEqual(natures, ['tech'])
            if (isCom)
                var queryFilter = 'Commercial'
            else if (isTech)
                var queryFilter = 'Poseur'
            query = db.collection('Users').where('role', '==', queryFilter).where('deleted', '==', false)
        }

        return query
    }

    //##RENDERERS
    renderTimeForm(canWrite) {
        const { isAllDay, startDate, endDate, startHour, dueHour } = this.state
        const { startDateError, endDateError, startHourError, dueHourError } = this.state
        const showEndDate = !this.isEdit && !isAllDay

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                    <Text style={theme.customFontMSregular.body}>Toute la journée</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Switch
                            value={isAllDay}
                            onValueChange={(isAllDay) => this.setState({ isAllDay })}
                            color={theme.colors.primary}
                            disabled={!canWrite}
                        />
                    </View>
                </View>

                <ItemPicker
                    onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: 'de début', isAllDay, showTimePicker: false, targetField: 'startDate' })}
                    label={'Date de début *'}
                    value={moment(startDate).format('ll')}
                    editable={canWrite}
                    showAvatarText={false}
                    icon={faCalendarPlus}
                    errorText={startDateError}
                />

                {showEndDate &&
                    <ItemPicker
                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: "de fin", isAllDay, showTimePicker: false, targetField: 'endDate' })}
                        label="Date de fin *"
                        value={moment(endDate).format('ll')}
                        editable={canWrite}
                        showAvatarText={false}
                        icon={faCalendarPlus}
                        errorText={endDateError}
                    />
                }

                {!isAllDay &&
                    <ItemPicker
                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: 'de début', isAllDay, showDayPicker: false, targetField: 'startHour' })}
                        label={'Heure de début *'}
                        value={startHour}
                        editable={canWrite}
                        showAvatarText={false}
                        icon={faClock}
                        errorText={startHourError}
                    />
                }

                {!isAllDay &&
                    <ItemPicker
                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: 'de fin', isAllDay, showDayPicker: false, targetField: 'dueHour' })}
                        label={"Heure d'échéance *"}
                        value={dueHour}
                        editable={canWrite}
                        showAvatarText={false}
                        icon={faClock}
                        errorText={dueHourError}
                        style={{ marginBottom: 15 }}
                    />
                }
            </View>
        )
    }

    refreshTaskConflictDate(output, field, isAllDay) {
        let update = {}
        update[field] = output
        this.setState(update)
        this.setState({ showTasksConflicts: !this.state.showTasksConflicts })
    }

    renderTasksConflicts() {
        const { showTasksConflicts, overlappingTasks, newTask, isAllDay, startDate, endDate, startDateError } = this.state
        const { selectedDate, selectedStartHour, selectedDueHour, pickedDate, pickedTask, selectedIsAllDay } = this.state
        const { isConnected } = this.props.network

        const dateHandler = (label, targetField, showDayPicker, showTimePicker) => {
            this.setState({ showTasksConflicts: !showTasksConflicts }, () => {
                navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshTaskConflictDate, label, isAllDay, showDayPicker, showTimePicker, targetField })
            })
        }

        const rehydrateTaskConflictsProps = (pickedDate, pickedTask, selectedIsAllDay) => {
            this.setState({ pickedDate, pickedTask, selectedIsAllDay })
        }

        const myHandler = (pickedDate, pickedTask, selectedIsAllDay, label, targetField, showDayPicker, showTimePicker) => {
            rehydrateTaskConflictsProps(pickedDate, pickedTask, selectedIsAllDay)
            dateHandler(label, targetField, showDayPicker, showTimePicker)
        }

        const initPickedTaskSelectedItems = (selectedIsAllDay, selectedDate, selectedStartHour, selectedDueHour) => {
            this.setState({ selectedIsAllDay, selectedDate, selectedStartHour, selectedDueHour })
        }

        return (
            <TasksConflicts
                isVisible={showTasksConflicts}
                tasks={overlappingTasks}
                toggleModal={() => this.setState({ showTasksConflicts: !showTasksConflicts })}
                refreshConflicts={async () => await this.handleSubmit(true)}
                isEdit={this.isEdit}
                newTask={newTask}

                startDate={startDate}
                endDate={endDate}
                handleDate={(pickedDate, pickedTask, selectedIsAllDay) => myHandler(pickedDate, pickedTask, selectedIsAllDay, "de début", 'selectedDate', true, false)}
                handleStartHour={(pickedDate, pickedTask, selectedIsAllDay) => myHandler(pickedDate, pickedTask, selectedIsAllDay, "de début", 'selectedStartHour', false, true)}
                handleDueHour={(pickedDate, pickedTask, selectedIsAllDay) => myHandler(pickedDate, pickedTask, selectedIsAllDay, "de fin", 'selectedDueHour', false, true)}

                initPickedTaskSelectedItems={initPickedTaskSelectedItems}
                parentSelectedIsAllDay={selectedIsAllDay}
                parentSelectedDate={selectedDate}
                parentSelectedStartHour={selectedStartHour}
                parentSelectedDueHour={selectedDueHour}
                parentPickedDate={pickedDate}
                parentPickedTask={pickedTask}

                loading={this.state.loading}
                isConnected={isConnected}
            />
        )
    }

    render() {
        let { name, description, assignedTo, project, type, priority, status, address, color, showTasksConflicts } = this.state
        let { createdAt, createdBy, editedAt, editedBy, loading, docNotFound } = this.state
        let { nameError, assignedToError } = this.state

        let { canCreate, canUpdate, canDelete } = this.props.permissions.tasks
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        if (docNotFound)
            return (
                <View style={styles.container}>
                    <Appbar close title titleText={this.title} />
                    <EmptyList
                        icon={faTimes}
                        header='Tâche introuvable'
                        description="Le tâche est introuvable dans la base de données. Il se peut qu'elle ait été supprimé."
                        offLine={!isConnected}
                    />
                </View>
            )

        else return (
            <View style={styles.container}>
                <Appbar close title titleText={this.title} check={this.isEdit ? canWrite && !loading : !loading} handleSubmit={() => this.handleSubmit(false)} del={canDelete && this.isEdit && !loading} handleDelete={this.alertDeleteTask} />

                {loading ?
                    <Loading size='large' />
                    :
                    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>

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
                                        value={name}
                                        onChangeText={name => this.setState({ name, nameError: "" })}
                                        error={!!nameError}
                                        errorText={nameError}
                                        editable={canWrite}
                                    // autoFocus={!this.isEdit}
                                    />

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'ListEmployees', {
                                            onGoBack: this.refreshAssignedTo,
                                            prevScreen: 'CreateTask',
                                            isRoot: false,
                                            titleText: 'Attribuer la tâche à',
                                            query: this.setListEmployeesQuery()
                                        })}
                                        label="Attribuée à *"
                                        value={assignedTo.fullName}
                                        error={!!assignedToError}
                                        errorText={assignedToError}
                                        editable={canWrite}
                                    />

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description}
                                        onChangeText={description => this.setState({ description })}
                                        multiline={true}
                                        // error={!!description.error}
                                        // errorText={description.error}
                                        editable={canWrite}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={type}
                                        error={!!type.error}
                                        errorText={type.error}
                                        selectedValue={type}
                                        onValueChange={(type) => this.setState({ type })}
                                        title="Type *"
                                        elements={this.types}
                                        enabled={canWrite && this.enableTypePicker} //pre-defined task type
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={priority}
                                        error={!!priority.error}
                                        errorText={priority.error}
                                        selectedValue={priority}
                                        onValueChange={(priority) => this.setState({ priority })}
                                        title="Priorité *"
                                        elements={priorities}
                                        enabled={canWrite}
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={status}
                                        error={!!status.error}
                                        errorText={status.error}
                                        selectedValue={status}
                                        onValueChange={(status) => this.setState({ status })}
                                        title="État *"
                                        elements={statuses}
                                        enabled={canWrite}
                                        containerStyle={{ marginBottom: 10 }}
                                    />

                                    <ColorPicker
                                        label='Couleur de la tâche'
                                        selectedColor={color}
                                        updateParentColor={(selectedColor) => this.setState({ color: selectedColor })}
                                        editable={canWrite} />
                                </View>
                            }
                        />

                        {<FormSection
                            sectionTitle='Créneau horaire'
                            sectionIcon={faCalendar}
                            form={this.renderTimeForm(canWrite)}
                        />}

                        <FormSection
                            sectionTitle='Références'
                            sectionIcon={faRetweet}
                            form={
                                <View style={{ flex: 1 }}>
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
                                    <AddressInput
                                        label='Adresse postale'
                                        offLine={!isConnected}
                                        onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress })}
                                        onChangeText={this.setAddress}
                                        clearAddress={() => this.setAddress('')}
                                        address={address}
                                        addressError={address.error}
                                        editable={canWrite}
                                        isEdit={this.isEdit} />
                                </View>
                            }
                        />

                        {this.isEdit &&
                            <ActivitySection
                                createdBy={createdBy}
                                createdAt={createdAt}
                                editedBy={editedBy}
                                editedAt={editedAt}
                                navigation={this.props.navigation}
                            />
                        }

                        {showTasksConflicts && this.renderTasksConflicts()}
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
        currentUser: state.currentUser
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



// alertCollaborator() {
//     const title = ""
//     const message = "L'utilisateur à qui vous voulez assigner cette tâche n'est pas un collaborateur dans le projet selectionné."
//     const handleConfirm = () => navigateToScreen(this, 'ListEmployees', {
//         onGoBack: this.refreshAssignedTo,
//         prevScreen: 'CreateTask',
//         isRoot: false,
//         titleText: 'Attribuer la tâche à',
//         query: db.collection('Users').where('role', '==', 'Commercial').where('deleted', '==', false)
//     })
//     const handleCancel = () => console.log('cancel')
//     const confirmText = 'OK'
//     this.myAlert(title, message, handleConfirm, handleCancel, confirmText)
// }