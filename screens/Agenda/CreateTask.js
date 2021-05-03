import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, Alert } from 'react-native';
import { Title, Switch } from 'react-native-paper'
import firebase, { db, auth } from '../../firebase'
import { faInfoCircle, faFileAlt, faCalendarPlus, faClock, faCalendar, faTimes } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import FormSection from '../../components/FormSection'
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
import { generateId, navigateToScreen, load, myAlert, updateField, nameValidator, compareDates, compareTimes, checkOverlap, isEditOffline, setPickerTaskTypes, refreshAddress, refreshProject, refreshAssignedTo, setAddress } from "../../core/utils"
import { blockRoleUpdateOnPhase } from "../../core/privileges"

import { connect } from 'react-redux'
import { CustomIcon } from '../../components'
import { getSystemAvailableFeatures } from 'react-native-device-info'

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
        this.refreshTaskConflictDate = this.refreshTaskConflictDate.bind(this)
        this.refreshDate = this.refreshDate.bind(this)
        this.refreshAddress = refreshAddress.bind(this)
        this.refreshAssignedTo = refreshAssignedTo.bind(this)
        this.refreshProject = refreshProject.bind(this)
        this.setAddress = setAddress.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.validateInputs = this.validateInputs.bind(this)
        this.validateSchedule = this.validateSchedule.bind(this)
        this.setTasks = this.setTasks.bind(this)
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
            name: { value: defaultState.name || "" },
            description: { value: "" },

            //PICKERS
            type: defaultState.type || 'Normale',
            priority: 'Moyenne',
            status: 'En cours',
            color: theme.colors.primary,

            //Screens
            assignedTo: defaultState.assignedTo || { id: '', fullName: '' },
            project: defaultState.project || { id: '', name: '' },
            address: defaultState.address || { description: '', place_id: '' },

            //Schedule
            isAllDay: true,
            startDate: { value: moment().format() },
            endDate: { value: moment().format() },
            startHour: { value: moment().format('HH:mm') },
            dueHour: { value: moment().format('HH:mm') },

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


    async componentDidMount() {

        if (this.isEdit) {
            const docNotFound = await this.fetchTask()
            if (docNotFound) {
                load(this, false)
                return
            }
        }

        else this.initialState = _.cloneDeep(this.state)

        load(this, false)
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

            const project = this.project


            defaultState = {
                name,
                type: this.taskType.value,
                assignedTo,
                project,
                address
            }
        }

        return defaultState
    }


    async fetchTask() {
        await db.collection('Agenda').doc(this.TaskId).get().then((doc) => {

            if (!doc.exists) {
                this.setState({ docNotFound: true })
                return true
            }

            let { name, assignedTo, description, project, type, priority, status, address, isAllDay, startDate, startHour, dueHour, color } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            const task = doc.data()

            //General info
            name.value = task.name
            assignedTo = task.assignedTo
            description.value = task.description
            project = task.project
            priority = task.priority
            status = task.status
            type = task.type
            address = task.address
            color = task.color

            isAllDay = task.isAllDay
            startDate.value = moment(task.date, 'YYYY-MM-DD').format()
            startHour.value = task.startHour || moment().format('HH:mm')
            dueHour.value = task.dueHour || moment().add(1, 'hour').format('HH:mm')

            //َActivity
            createdAt = task.createdAt
            createdBy = task.createdBy
            editedAt = task.editedAt
            editedBy = task.editedBy

            this.setState({ createdAt, createdBy, editedAt, editedBy })
            this.setState({ name, assignedTo, description, project, type, priority, status, address, isAllDay, startDate, startHour, dueHour, color }, () => {
                // if (this.isInit)
                this.initialState = _.cloneDeep(this.state)
                // this.isInit = false
            })
        })
    }

    //Screen inputs
    async refreshDate(output, field, isAllDay) {

        let date = {
            value: output,
            error: ''
        }

        let update = {}
        update[field] = date

        if (field === 'startDate' && isAllDay)
            update['endDate'] = date

        this.setState(update, () => this.validateSchedule())
    }

    //Inputs validation
    validateSchedule() {
        const { isAllDay, startDate, endDate, startHour, dueHour } = this.state
        const periodicTaskCreation = !this.isEdit && !isAllDay
        const dateError = periodicTaskCreation ? compareDates(endDate.value, startDate.value, 'isBefore') : ''
        const timeError = isAllDay ? '' : compareTimes(moment(dueHour.value, 'hh:mm'), moment(startHour.value, 'hh:mm'), 'isBefore')

        if (dateError || timeError) {
            endDate.error = dateError
            dueHour.error = timeError
            this.setState({ endDate, dueHour })
            return false
        }

        else return true
    }

    validateInputs() {
        let isValid = true
        let { name, assignedTo, isAllDay } = this.state

        let isValid1 = true
        const nameError = nameValidator(name.value, '"Nom de la tâche"')
        const assignedToError = nameValidator(assignedTo.id, '"Attribué à"')

        if (nameError || assignedToError) {
            name.error = nameError
            assignedTo.error = assignedToError
            isValid1 = false
            this.setState({ name, assignedTo, loading: false })
        }
        const isValid2 = this.validateSchedule()
        isValid = isValid1 && isValid2
        return isValid
    }

    alertCollaborator() {
        const title = ""
        const message = "L'utilisateur à qui vous voulez assigner cette tâche n'est pas un collaborateur dans le projet selectionné."
        const handleConfirm = () => navigateToScreen(this, 'ListEmployees', {
            onGoBack: this.refreshAssignedTo,
            prevScreen: 'CreateTask',
            isRoot: false,
            titleText: 'Attribuer la tâche à',
            query: db.collection('Users').where('role', '==', 'Commercial').where('deleted', '==', false)
        })
        const handleCancel = () => console.log('cancel')
        const confirmText = 'OK'
        this.myAlert(title, message, handleConfirm, handleCancel, confirmText)
    }

    //Submit
    async handleSubmit(isConflictHandler = false) {
        Keyboard.dismiss()

        //1. Check network (disable edit offline)
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        //2. Init variables
        let { error, loading } = this.state
        let { name, assignedTo, description, project, type, priority, status, address, color } = this.state
        const { isAllDay, startDate, endDate, startHour, dueHour } = this.state

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
        if (this.isProcess && assignedTo.role === 'Commercial' || assignedTo.role === 'Poseur') {
            const isIntervenant = assignedTo.id !== project.comContact.id && assignedTo.id !== project.techContact.id
            if (isIntervenant) {
                db.collection('Projects').doc(project.id).update({ intervenant: assignedTo })
            }
        }

        //4. Building task(s)
        const currentUser = {
            id: auth.currentUser.uid,
            fullName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            role: this.props.role.value,
        }

        let natures
        this.types.forEach((t) => { if (t.value === type) natures = t.natures })

        let task = {
            id: this.TaskId,
            name: name.value,
            assignedTo,
            description: description.value,
            project,
            type,
            natures,
            priority,
            status,
            address,
            isAllDay,
            date: moment(startDate.value).format('YYYY-MM-DD'),
            startHour: isAllDay ? undefined : startHour.value,
            dueHour: isAllDay ? undefined : dueHour.value,
            editedAt: moment().format(),
            editedBy: currentUser,
            color,
            deleted: false
        }

        if (!this.isEdit) {
            task.createdAt = moment().format()
            task.createdBy = currentUser
        }

        let tasks = this.isEdit ? [task] : this.setTasks(task, startDate, endDate)

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
        // const overlappingTasks = await this.checkTasksConflicts(tasks)
        // if (!_.isEmpty(overlappingTasks) || isConflictHandler && _.isEmpty(overlappingTasks)) {
        //     load(this, false)
        //     this.handleConflicts(overlappingTasks, task)
        //     return
        // }

        //7. Persist task(s)
        await this.persistTasks(tasks)

        //8. Go back
        //if (this.prevScreen === 'Agenda') {
        const refreshAgenda = true
        this.props.navigation.state.params.onGoBack(refreshAgenda)
        //}

        this.props.navigation.goBack()
    }

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

    //Conflicts handlers
    async checkTasksConflicts(tasks) {
        let overlappingTasks = {}

        for (const tsk of tasks) {
            const overlappingTasksArr = await this.checkAssignedToAvailability(tsk)
            if (overlappingTasksArr.length > 0) {
                overlappingTasks[tsk.id] = overlappingTasksArr
            }
        }

        return overlappingTasks
    }

    async checkAssignedToAvailability(task) {

        const dateChanged = this.initialState.startDate !== task.date
        const timeChanged = this.initialState.startHour !== task.startHour
        const assignedToChanged = this.initialState.assignedTo.id !== task.assignedTo.id

        if (!dateChanged && !timeChanged && !assignedToChanged) return

        const today = moment().format('YYYY-MM-DD')
        const overlappingTasks = await db.collection('Agenda').where('assignedTo.id', '==', task.assignedTo.id).where('date', '>=', today)
            .get().then((querySnapshot) => {

                if (querySnapshot.empty) return []

                let overlappingTasks = []
                for (const doc of querySnapshot.docs) {

                    const taskDoc = doc.data()
                    const notSameDoc = taskDoc.id !== task.id //updating document
                    if (notSameDoc && taskDoc.date === task.date) {
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
            })

        return overlappingTasks
    }

    handleConflicts(overlappingTasks, newTask) {
        this.setState({ showTasksConflicts: true, overlappingTasks, newTask })
    }

    //Firestore handlers
    async persistTasks(tasks) {
        if (this.isEdit) {
            await this.updateTask(tasks[0])
        }

        else this.createTasks(tasks)
    }

    async updateTask(task) {
        await db.collection('Agenda').doc(task.id).set(task, { merge: true })
    }

    createTasks(tasks) {
        for (const task of tasks) {
            db.collection('Agenda').doc(task.id).set(task)
        }
    }

    setTasks(task, startDate, endDate) {
        let tasks = []
        let { isAllDay, startHour, dueHour } = task

        const startDateFormated = moment(startDate.value).format('YYYY-MM-DD')
        const endDateFormated = moment(endDate.value).format('YYYY-MM-DD')

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

    limitTasks(tasksLength) {
        const isOverLimit = tasksLength > 7
        return isOverLimit
    }

    //Delete task
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

    renderTimeForm(canWrite) {
        const { isAllDay, startDate, endDate, startHour, dueHour } = this.state
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
                    value={moment(startDate.value).format('ll')}
                    editable={canWrite}
                    showAvatarText={false}
                    icon={faCalendarPlus}
                    errorText={startDate.error}
                />

                {showEndDate &&
                    <ItemPicker
                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: "de fin", isAllDay, showTimePicker: false, targetField: 'endDate' })}
                        label="Date de fin *"
                        value={moment(endDate.value).format('ll')}
                        editable={canWrite}
                        showAvatarText={false}
                        icon={faCalendarPlus}
                        errorText={endDate.error}
                    />
                }

                {!isAllDay &&
                    <ItemPicker
                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: 'de début', isAllDay, showDayPicker: false, targetField: 'startHour' })}
                        label={'Heure de début *'}
                        value={startHour.value}
                        editable={canWrite}
                        showAvatarText={false}
                        icon={faClock}
                        errorText={startHour.error}
                    />
                }

                {!isAllDay &&
                    <ItemPicker
                        onPress={() => navigateToScreen(this, 'DatePicker', { onGoBack: this.refreshDate, label: 'de fin', isAllDay, showDayPicker: false, targetField: 'dueHour' })}
                        label={"Heure d'échéance *"}
                        value={dueHour.value}
                        editable={canWrite}
                        showAvatarText={false}
                        icon={faClock}
                        errorText={dueHour.error}
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
        const { showTasksConflicts, overlappingTasks, newTask, isAllDay, startDate, endDate } = this.state
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

                startDate={startDate.value}
                endDate={endDate.value}
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
        let { name, description, assignedTo, project, startDate, startHour, endDate, dueHour, isAllDay, type, priority, status, address, color, showTasksConflicts, overlappingTasks } = this.state
        let { createdAt, createdBy, editedAt, editedBy, loading, docNotFound } = this.state

        let { canCreate, canUpdate, canDelete } = this.props.permissions.tasks
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        if (docNotFound)
            return (
                <View style={styles.container}>
                    <Appbar close title titleText={this.title} />
                    <EmptyList icon={faTimes} header='Tâche introuvable' description="Le tâche est introuvable dans la base de données. Il se peut qu'elle ait été supprimé." offLine={!isConnected} />
                </View>
            )

        else return (
            <View style={styles.container}>
                <Appbar close title titleText={this.title} check={this.isEdit ? canWrite && !loading : !loading} handleSubmit={() => this.handleSubmit(false)} del={canDelete && this.isEdit && !loading} handleDelete={this.alertDeleteTask} />

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
                                        error={!!assignedTo.error}
                                        errorText={assignedTo.error}
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

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description.value}
                                        onChangeText={text => updateField(this, description, text)}
                                        multiline={true}
                                        error={!!description.error}
                                        errorText={description.error}
                                        editable={canWrite}
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

                        {this.isEdit &&
                            <FormSection
                                sectionTitle='Activité'
                                sectionIcon={faFileAlt}
                                form={
                                    <View style={{ flex: 1 }}>
                                        <MyInput
                                            label="Date de création"
                                            returnKeyType="done"
                                            value={moment(createdAt).format('LLL')}
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
                                            value={moment(editedAt).format('LLL')}
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