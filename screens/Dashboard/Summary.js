import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import { faBell, faCalendar } from '@fortawesome/pro-light-svg-icons'
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { db, auth } from '../../firebase'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { load } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api'

import { Appbar, CustomIcon, Section, EmptyList, NotificationItem, TaskItem, Loading } from '../../components'

class Summary extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)

        this.state = {
            notificationsList: [],
            notificationsCount: 0,
            tasksList: [],
            tasksCount: 0,
            loading: true
        }
    }

    componentDidMount() {
        const queryNotifications = db
            .collection('Users')
            .doc(auth.currentUser.uid)
            .collection('Notifications')
            .where('deleted', '==', false)
            .where('read', '==', false)
            .orderBy('sentAt', 'desc')
            .limit(5)

        const today = moment().format('YYYY-MM-DD')
        const queryTasks = db
            .collection('Agenda')
            .where('assignedTo.id', '==', auth.currentUser.uid)
            .where('date', '>=', today)
            .orderBy('date', 'asc')
            .limit(5)

        this.fetchDocs(queryNotifications, 'notificationsList', 'notificationsCount', () => { })
        this.fetchDocs(queryTasks, 'tasksList', 'tasksCount', () => {
            let { tasksList } = this.state
            //  tasksList.forEach((task) => console.log(task.id, task.date))
            tasksList = this.formatTasks(tasksList)
            this.setState({ tasksList }, () => load(this, false))
        })
    }

    viewMoreLink(navScreen, navParams) {
        const customStyle = { textAlign: 'center', color: theme.colors.primary, marginTop: 10 }
        return (
            <Text
                style={[theme.customFontMSmedium.body, customStyle]}
                onPress={() => this.props.navigation.navigate(navScreen, navParams)}
            >
                Voir plus
            </Text>
        )
    }

    renderSection(sectionTitle, sectionIcon, listItems, countItems, navScreen, navParams = {}, renderItem, emptyListHeader, emptyListDesc, isConnected) {
        return (
            <View style={styles.notificationsContainer}>
                <Section text={sectionTitle} icon={sectionIcon} />
                <View style={styles.notificationsList}>
                    {countItems > 0 ?
                        <FlatList
                            style={styles.root}
                            data={listItems}
                            keyExtractor={(item) => { return item.id }}
                            ListFooterComponent={this.viewMoreLink(navScreen, navParams)}
                            renderItem={renderItem}
                        />
                        :
                        <EmptyList
                            icon={sectionIcon}
                            header={emptyListHeader}
                            description={emptyListDesc}
                            offLine={!isConnected}
                        />
                    }
                </View>
            </View>
        )
    }

    notificationsSection(isConnected) {
        const { notificationsCount, notificationsList } = this.state
        const renderItem = (item) => <NotificationItem notification={item.item} navigation={this.props.navigation} />
        const navParams = { isRoot: false }
        return this.renderSection('Notifications', faBell, notificationsList, notificationsCount, 'Inbox', navParams, renderItem, 'Notifications', 'Aucune nouvelle notification.', isConnected)
    }

    tasksSection(isConnected) {
        let { tasksCount, tasksList } = this.state
        const onPressTask = (TaskId) => {
            this.props.navigation.navigate('CreateTask', { prevScreen: 'Summary', onGoBack: () => console.log('Do nothing...'), TaskId })
        }

        //Headers & items
        const renderItem = (item) => {
            if (item.item.isHeader) {
                return <Text style={[theme.customFontMSregular.body, { paddingVertical: 10 }]}>{item.item.label}</Text>
            }
            else return <TaskItem task={item.item} onPress={() => onPressTask(item.item.id)} />
        }

        const navParams = { isRoot: false, isAgenda: true }
        return this.renderSection('Tâches', faCalendar, tasksList, tasksCount, 'Agenda', navParams, renderItem, 'Tâches', 'Aucune nouvelle tâche.', isConnected)
    }

    formatTasks(tasksList) {

        const today = { label: "Ajourd'hui", value: moment().format('YYYY-MM-DD') }
        const tomorrow = { label: "Demain", value: moment().add(1, 'day').format('YYYY-MM-DD') }
        const startThisWeek = { label: "Cette semaine", value: moment().add(2, 'day').format('YYYY-MM-DD') }
        const endThisWeek = { label: "Cette semaine", value: moment().add(7, 'days').format('YYYY-MM-DD') }

        let currentDate = ''

        for (let i = 0; i < tasksList.length; i++) {
            const task = tasksList[i]

            if (currentDate !== task.date) {
                currentDate = task.date

                const isToday = moment(task.date).isSame(today.value, 'day')
                const isTomorrow = moment(task.date).isSame(tomorrow.value, 'day')
                //const isThisWeek = moment(task.date).isSameOrAfter(startThisWeek.value, 'day') && moment(task.date).isBefore(endThisWeek.value, 'day')

                if (isToday)
                    tasksList.splice(i, 0, { id: i, label: today.label, isHeader: true })

                else if (isTomorrow)
                    tasksList.splice(i, 0, { id: i, label: tomorrow.label, isHeader: true })

                // else if (isThisWeek)
                //     tasksList.splice(i, 0, { id: i, label: startThisWeek.label, isHeader: true })

                else tasksList.splice(i, 0, { id: i, label: moment(currentDate, 'YYYY-MM-DD').format('DD-MM-YYYY'), isHeader: true })
            }

        }

        return tasksList
    }

    render() {
        const { loading } = this.state
        const { isConnected } = this.props.network

        return (
            <View style={styles.mainContainer}>
                <Appbar back title titleText='Nouveautés' />
                {loading ?
                    <Loading />
                    :
                    <ScrollView>
                        {this.notificationsSection(isConnected)}
                        {this.tasksSection(isConnected)}
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

export default connect(mapStateToProps)(Summary)



const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    notificationsList: {
        paddingVertical: 15
    },
    tasksList: {
        paddingVertical: 15
    },
    root: {
        zIndex: 1,
        paddingHorizontal: theme.padding,
        //backgroundColor: 'green',
    }
});

