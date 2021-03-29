
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, RefreshControl } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { faCaretDown, faCheckCircle, faTimesCircle, faPauseCircle } from '@fortawesome/pro-solid-svg-icons'
const XDate = require('xdate')

import dateutils from 'react-native-calendars/src/dateutils'

import _ from 'lodash'
import firebase from '@react-native-firebase/app'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import ActiveFilter from '../../components/ActiveFilter'
import CustomIcon from '../../components/CustomIcon'
import OffLineBar from '../../components/OffLineBar'
import PickerBar from '../../components/PickerBar'
import Appbar from '../../components/Appbar'
import PlanningTabs from '../../components/PlanningTabs'
import Filter from '../../components/Filter'
import MyFAB from '../../components/MyFAB'
import EmptyList from '../../components/EmptyList'
import Loading from '../../components/Loading'

import { configureQuery } from '../../core/privileges'
import { load, myAlert, toggleFilter, setFilter, handleFilterAgenda as applyFilterAgenda, handleFilterTasks as applyFilterTasks } from '../../core/utils'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { connect } from 'react-redux'
import { ActivityIndicator } from 'react-native';

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
}
LocaleConfig.defaultLocale = 'fr'

const db = firebase.firestore()
const KEYS_TO_FILTERS = ['type', 'status', 'priority', 'project.id', 'assignedTo.id']

const types = [
    { label: 'Tous', value: '' },
    { label: 'Normale', value: 'Normale' }, //#static
    { label: 'Rendez-vous 1', value: 'Rendez-vous 1' }, //#dynamic
    { label: 'Visite technique préalable', value: 'Visite technique préalable' }, //#dynamic
    { label: 'Visite technique', value: 'Visite technique' }, //#dynamic
    { label: 'Installation', value: 'Installation' }, //#dynamic
    { label: 'Rattrapage', value: 'Rattrapage' }, //#dynamic
    { label: 'Panne', value: 'Panne' }, //#static
    { label: 'Entretien', value: 'Entretien' }, //#static
    { label: 'Rendez-vous N', value: 'Rendez-vous N' }, //restriction: user can not create rdn manually (only during the process and only DC can posptpone it during the process)
]

const priorities = [
    { label: 'Toutes', value: '' },
    { label: 'Urgente', value: 'urgente' },
    { label: 'Moyenne', value: 'moyenne' },
    { label: 'Faible', value: 'faible' },
]

const statuses = [
    { label: 'Tous', value: '' },
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

class Agenda2 extends Component {
    constructor(props) {
        super(props)
        this.isAgenda = this.props.navigation.getParam('isAgenda', false) //#task: set it to true
        this.isRoot = this.props.navigation.getParam('isRoot', true) //#task: set it to true
        this.loadItems = this.loadItems.bind(this)
        this.refreshItems = this.refreshItems.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.togglePlanningTabs = this.togglePlanningTabs.bind(this)
        this.projectFilter = this.props.navigation.getParam('projectFilter', { id: '', name: '' })

        const lowRoles = ['com', 'poseur']
        const currentRole = this.props.role.id
        const isLowRole = lowRoles.includes(currentRole)
        this.isAgenda = isLowRole || this.isAgenda

        this.state = {
            //Settings
            isAgenda: this.isAgenda,

            //Calendar mode
            items: {},
            filteredItems: {},

            //List mode
            taskItems: [],
            filteredTaskItems: [],

            //filter fields
            type: '',
            status: '',
            priority: '',
            assignedTo: { id: '', fullName: '' },
            project: this.projectFilter,
            filterOpened: false,

            selectedDay: moment().format('YYYY-MM-DD'),
            refreshing: false,
        }
    }

    refreshItems(refresh) {
        if (refresh) {
            this.setState({ refreshing: true })
            const { selectedDay } = this.state
            this.setState({ items: {}, filteredItems: {}, taskItems: [], filteredTaskItems: [] }, () => this.loadItems(selectedDay))
        }
    }

    setTasksQuery() {
        const roleId = this.props.role.id
        const { isAgenda } = this.state
        const { currentUser } = firebase.auth()

        let query = null

        //AGENDA (static)
        if (isAgenda) {
            query = db.collection('Agenda').where('assignedTo.id', '==', currentUser.uid).orderBy('dateKey', 'asc')
            return query
        }

        //PLANNING (dynamic)
        else {
            const { queryFilters } = this.props.permissions.tasks
            if (queryFilters === []) return null
            else {
                const params = { role: this.props.role.value }
                query = configureQuery('Agenda', queryFilters, params)
                return query
            }
        }

        // else if (roleId === 'dircom')
        //     query = agendaRef.collection('Tasks').where('assignedTo.role', '==', 'com')

        // else if (roleId === 'tech')
        //     query = agendaRef.collection('Tasks').where('assignedTo.role', '==', 'poseur')

        // else if (roleId === 'com')
        //     query = agendaRef.collection('Tasks').where('project.subscribers', 'array-contains', currentUser.id)

        // else if (roleId === 'poseur')
        //     query = agendaRef.collection('Tasks').where('project.subscribers', 'array-contains', currentUser.id)

        return query
    }

    loadItems(day) {
        setTimeout(async () => {

            let items = {}

            if (!items[day.dateString]) {

                items[day.dateString] = []

                const query = this.setTasksQuery()
                if (!query) return
                await query.get().then((tasksSnapshot) => {

                    if (tasksSnapshot === null) return

                    for (const taskDoc of tasksSnapshot.docs) { //#task: Initialize with empty array

                        const task = taskDoc.data()
                        const date = task.dateKey //exp: 2021-01-07

                        if (!items[date])
                            items[date] = []

                        const startDate = moment(task.startDate).format('YYYY-MM-DD')
                        const dueDate = moment(task.dueDate).format('YYYY-MM-DD')
                        const isPeriod = moment(startDate).isBefore(dueDate, 'day')
                        const duration = moment(dueDate).diff(startDate, 'day') + 1
                        let timeLine = 1
                        let dayProgress = `${timeLine}/${duration}`

                        items[date].push({
                            id: taskDoc.id,
                            date: date,
                            name: task.name,
                            type: task.type,
                            status: task.status,
                            priority: task.priority.toLowerCase(),
                            project: task.project,
                            assignedTo: task.assignedTo,
                            color: task.color,
                            dayProgress: dayProgress
                        })

                        //Tasks lasting for 2days or more...
                        if (isPeriod) {
                            console.log('isPeriod', isPeriod)

                            timeLine = 2
                            var dateIterator = moment(startDate).add(1, 'day').format('YYYY-MM-DD')
                            let predicate = (moment(dateIterator).isBefore(dueDate, 'day') || moment(dateIterator).isSame(dueDate, 'day'))

                            while (predicate) {
                                dayProgress = `${timeLine}/${duration}`
                                items[dateIterator] = []
                                items[dateIterator].push({
                                    id: taskDoc.id,
                                    date: dateIterator,
                                    name: task.name,
                                    type: task.type,
                                    status: task.status,
                                    priority: task.priority.toLowerCase(),
                                    project: task.project,
                                    assignedTo: task.assignedTo,
                                    dayProgress: dayProgress,
                                    // labels: [task.priority.toLowerCase()],
                                })

                                timeLine += 1
                                dateIterator = moment(dateIterator).add(1, 'day').format('YYYY-MM-DD')
                                predicate = (moment(dateIterator).isBefore(dueDate, 'day') || moment(dateIterator).isSame(dueDate, 'day'))
                            }
                        }
                    }
                })

                this.setState({ items }, () => {
                    const taskItems = this.setTaskItems()
                    this.setState({ taskItems, refreshing: false }, () => this.handleFilter(false))
                })

            }

        }, 1000)
    }

    renderTaskStatusController(item) {
        const { id, date, status } = item

        const changeStatus = (status) => {
            db.collection('Agenda').doc(id).update({ status })
            this.refreshItems(true)
        }

        let iconObject = null

        switch (status) {
            case 'En cours':
                iconObject = { icon: faCheckCircle, color: theme.colors.gray_dark }
                break;

            case 'Terminé':
                iconObject = { icon: faCheckCircle, color: theme.colors.valid }
                break;

            case 'Annulé':
                iconObject = { icon: faTimesCircle, color: theme.colors.canceled }
                break;

            case 'En attente':
                iconObject = { icon: faPauseCircle, color: theme.colors.pending }
                break;

            default:
                return null
        }

        return (
            <CustomIcon
                icon={iconObject.icon}
                color={iconObject.color}
                size={26}
                onPress={() => changeStatus(status)}
            />
        )
    }

    handleFilter(toggle) {
        if (toggle) toggleFilter(this)

        const { items, taskItems, type, status, priority, assignedTo, project, filterOpened } = this.state
        const fields = [{ label: 'type', value: type }, { label: 'status', value: status }, { label: 'priority', value: priority }, { label: 'project.id', value: project.id }, { label: 'assignedTo.id', value: assignedTo.id }]

        let filteredItems = {}
        filteredItems = applyFilterAgenda(items, filteredItems, fields, KEYS_TO_FILTERS)
        this.setState({ filteredItems })
    }

    renderAppBarPicker() {
        const { isAgenda } = this.state
        const roleId = this.props.role.id
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[theme.customFontMSregular.title, { color: theme.colors.secondary, marginHorizontal: 10 }]}>{isAgenda ? 'Mon agenda' : 'Planning'}</Text>
                <CustomIcon icon={faCaretDown} color={theme.colors.gray_dark} />
            </View>
        )
    }

    setCalendarType(isAgenda) {
        this.setState({ isAgenda }, () => this.refreshItems(true))
    }

    //Tab functions
    setTaskItems() {
        const { items } = this.state
        let tasksList = []

        for (let key in items) { //key is "date"
            let tasks = items[key]

            if (tasks.length > 0) {
                let elements = []
                tasks.forEach((task) => elements.push(task)) //other elements: tasks in that date
                tasksList.push(elements) // array of arrays
            }
        }

        return tasksList
    }

    renderTaskItems() {
        const { filteredTaskItems } = this.state

        return filteredTaskItems.map((item, key) => {
            return (
                <View style={{ padding: 15 }}>
                    <Text style={theme.customFontMSbold.header}>{item[0].date}</Text>
                    {item.map((taskItem) => {
                        return this.renderItem(taskItem)
                    })}
                </View>
            )
        })
    }

    togglePlanningTabs(isAgenda) {
        this.setState({ isAgenda }, () => this.refreshItems(true))
    }

    onDayPress(selectedDay) {
        this.setState({ selectedDay })
    }


    renderDay(dateObject, item) {

        if (dateObject) {
            const date = moment(dateObject.dateString, 'YYYY-MM-DD').format()
            const dayNum = moment(date).format('D')
            let dayName = moment(date).format('ddd').toUpperCase()
            dayName = dayName.slice(0, -1)

            const today = moment(date).isSame(moment().format()) ? { color: theme.colors.primary } : undefined;

            return (
                <View style={styles.day}>
                    <Text allowFontScaling={false} style={[styles.dayNum, today]}>{dayNum}</Text>
                    <Text allowFontScaling={false} style={[styles.dayText, today]}>{dayName}</Text>
                </View>
            )
        }

        else {
            return (
                <View style={styles.day}>
                    <Text allowFontScaling={false} style={[styles.dayNum, { color: '#fff' }]}></Text>
                    <Text allowFontScaling={false} style={[styles.dayText, { color: '#fff' }]}></Text>
                </View>
            )
        }
    }

    renderItem(item) {

        const itemColor = item.color
        const TaskId = item.id

        const onPressItem = () => {
            this.props.navigation.navigate('CreateTask', { onGoBack: this.refreshItems, TaskId })
        }

        const progress = item.dayProgress !== '1/1' ? ` (jour ${item.dayProgress})` : ''
        const done = item.status === 'Terminé'

        return (
            <TouchableOpacity style={[styles.item, { backgroundColor: itemColor, opacity: done ? 0.5 : 1 }]} onPress={onPressItem} >
                <View style={{ flex: 0.5, justifyContent: 'center', paddingRight: 5 }}>
                    <Text style={[theme.customFontMSregular.body, { color: '#fff' }]} numberOfLines={1}>{item.name}{progress}</Text>
                </View>
                <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 5 }}>
                    <Text style={[theme.customFontMSregular.caption, { color: '#fff' }]} numberOfLines={1}>{item.assignedTo.fullName}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderEmptyData() {
        const { isConnected } = this.props.network
        return (<ActivityIndicator size='large' color={theme.colors.primary} style={{ marginTop: constants.ScreenHeight * 0.3 }} />)
    }

    renderEmptyDate() {
        return (
            <View style={styles.item}>
                <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>Aucune tâche</Text>
            </View>
        )
    }

    render() {

        const roleId = this.props.role.id
        const { canCreate } = this.props.permissions.tasks

        let { isAgenda, displayType, items, filteredItems, taskItems, filteredTaskItems, type, status, priority, assignedTo, project, filterOpened, refreshing } = this.state //items and filter fields
        const filterActivated = !_.isEqual(items, filteredItems)
        const highRoles = (roleId === 'admin' || roleId === 'backoffice' || roleId === 'dircom' || roleId === 'tech')

        return (
            <View style={{ flex: 1 }}>

                { highRoles ?
                    <PickerBar
                        main={this}
                        //Refresh
                        refresh
                        onRefresh={() => this.refreshItems(true)}
                        //Filter
                        filter
                        filterOpened={filterOpened}
                        type={type}
                        status={status}
                        priority={priority}
                        project={project}
                        assignedTo={assignedTo} />
                    :
                    <Appbar back={!this.isRoot} menu={this.isRoot} title titleText='Mon agenda' />
                }

                {highRoles && <PlanningTabs isAgenda={isAgenda} onPress1={() => this.togglePlanningTabs(true)} onPress2={() => this.togglePlanningTabs(false)} />}

                {filterActivated && <ActiveFilter />}

                <View style={{ flex: 1 }} >
                    <Agenda
                        LocaleConfig
                        //displayLoadingIndicator
                        renderEmptyData={this.renderEmptyData.bind(this)}
                        items={this.state.filteredItems}
                        loadItemsForMonth={this.loadItems}
                        selected={moment().format('YYYY-MM-DD')}
                        onDayPress={this.onDayPress.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        rowHasChanged={this.rowHasChanged.bind(this)}
                        displayLoadingIndicator={true}
                        // style= {{paddingBottom: 65}}
                        //onRefresh={() => this.refreshItems(true)} <-- #bug: this line disables zIndex which is used to put background below flatlist items (issue is followed up on react-native github repository)
                        theme={{
                            dotColor: theme.colors.agendaLight,
                            todayTextColor: theme.colors.primary,
                            selectedDayBackgroundColor: theme.colors.primary,
                            agendaDayTextColor: theme.colors.agendaLight,
                            agendaDayNumColor: theme.colors.agendaLight,
                            agendaTodayColor: theme.colors.primary,
                            textDayFontFamily: '-Regular',
                            backgroundColor: '#F1F1F8',
                            'stylesheet.agenda.list': {
                                container: {
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                },
                                // day: {
                                //     width: 63,
                                //     alignItems: 'center',
                                //     justifyContent: 'flex-start',
                                //     marginTop: 0,
                                //     backgroundColor: 'brown'
                                // },
                                dayNum: styles.dayNum,
                                dayText: styles.dayText,
                                day: styles.day,
                            },
                        }}
                        renderDay={this.renderDay}
                    />
                </View>
                {canCreate && this.isRoot && <MyFAB onPress={() => this.props.navigation.navigate('CreateTask', { onGoBack: this.refreshItems })} />}
            </View>
        )
    }

    rowHasChanged(r1, r2) {
        return r1.status !== r2.status
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        network: state.network,
        permissions: state.permissions,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Agenda2)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 15,
        marginBottom: 10,
        //marginTop: 10,
    },
    emptyDate: {
        justifyContent: 'center',
        marginLeft: 19,
        height: 15,
        flex: 1,
        paddingTop: 30,
    },

    //Agenda theme
    day: {
        width: 63,
        alignItems: 'center',
        justifyContent: 'flex-start',
        // marginTop: 32,
    },
    dayNum: {
        fontFamily: 'Lato-Regular',
        fontSize: 18,
        color: theme.colors.secondary,
        //fontSize: 28,
        marginTop: -3
    },
    dayText: {
        fontFamily: '-Medium',
        fontSize: 12,
        letterSpacing: 1,
        color: theme.colors.gray_googleAgenda
    }
})









       // const labels =
        //     item.labels &&
        //     item.labels.map(label => (
        //         <View key={`label-${label}`} style={{ padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: label === 'urgente' ? theme.colors.error : label === 'faible' ? theme.colors.primary : colors.primary, borderRadius: 3 }}>
        //             <Text style={{ color: 'white', fontSize: 8 }}>{label}</Text>
        //         </View>
        //     ))