import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { LineChart } from 'react-native-chart-kit'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { db, auth } from '../../firebase'
import * as theme from '../../core/theme'
import { constants, highRoles } from '../../core/constants'
import { load, sortMonths } from '../../core/utils'
import { fetchDocs, fetchTurnoverData } from '../../api/firestore-api'

import { Picker, TurnoverGoal, Loading } from '../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'

class Analytics extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)
        this.refreshMonthlyGoals = this.refreshMonthlyGoals.bind(this)
        this.currentMonth = moment().format('MMM')
        this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1)

        this.queries = this.setQueriesBasedOnRole()
        this.initialTurnoverObjects = this.initTurnoverObjects()

        this.state = {
            totalIncome: 0,
            totalProjects: 0,
            totalClients: 0,
            chartLabels: [],
            chartDataSets: [[]],
            chartPeriod: 'lastSemester',
            monthlyGoals: [],
            loading: true
        }
    }

    async componentDidMount() {
        await this.fetchData()
        load(this, false)
    }

    //Initial config.
    setQueriesBasedOnRole() {
        const role = this.props.role
        const roleId = role.id
        let queries = {}
        if (highRoles.includes(roleId)) {
            queries.turnover = db
                .collectionGroup('Turnover')

            queries.projects = db
                .collection('Projects')
        }

        else if (roleId === 'com') {
            queries.turnover = db
                .collection('Users')
                .doc(auth.currentUser.uid)
                .collection('Turnover')

            queries.projects = db
                .collection('Projects')
                .where('createdBy.id', '==', auth.currentUser.uid)
        }

        return queries
    }

    initTurnoverObjects() {
        let turnoverObjects = {}

        const sixMmonthsAgo = moment().subtract('5', 'months').format('YYYY-MM')
        const currentMonth = moment().format('YYYY-MM')
        let monthIterator = sixMmonthsAgo

        while (moment(monthIterator).isSameOrBefore(currentMonth)) {
            const year = moment(monthIterator, 'YYYY-MM').format('YYYY')
            const monthNameLowerCase = moment(monthIterator, 'YYYY-MM').format('MMM')
            const monthNameUpperCase = monthNameLowerCase.charAt(0).toUpperCase() + monthNameLowerCase.slice(1)
            const formatedMonth = moment(monthIterator, 'YYYY-MM').format('MM-YYYY')
            turnoverObjects[formatedMonth] = {
                year,
                month: monthNameUpperCase,
                current: 0,
                monthYear: formatedMonth
            }
            monthIterator = moment(monthIterator).add(1, 'month').format('YYYY-MM')
        }

        return turnoverObjects
    }


    async fetchData() {
        const totalIncome = await this.fetchTotalIncome(this.queries.turnover)
        const { totalProjects, totalClients } = await this.fetchTotals(this.queries.projects)
        // let turnoverObjects = {
        //     "03-2021": { "current": 3000, "id": "2021", "isCurrent": true, "month": "Mars.", "monthYear": "03-2021", "target": undefined, "year": "2021" },
        //     "02-2021": { "current": 2000, "id": "2021", "isCurrent": true, "month": "Févr.", "monthYear": "02-2021", "target": undefined, "year": "2021" },
        //     "04-2021": { "current": 4000, "id": "2021", "isCurrent": true, "month": "Avr.", "monthYear": "04-2021", "target": undefined, "year": "2021" },
        //     "01-2021": { "current": 600, "id": "2021", "isCurrent": true, "month": "Janv.", "monthYear": "01-2021", "target": undefined, "year": "2021" },
        //     "12-2020": { "current": 500, "id": "2020", "isCurrent": true, "month": "Dec.", "monthYear": "12-2020", "target": undefined, "year": "2020" },
        //     "11-2020": { "current": 200, "id": "2020", "isCurrent": true, "month": "Nov.", "monthYear": "11-2020", "target": undefined, "year": "2020" },
        // }

        let turnoverObjects = this.initialTurnoverObjects

        // turnoverObjects["03-2021"] = { "current": 5000, "id": "2021", "isCurrent": true, "month": "Mars", "monthYear": "03-2021", "target": undefined, "year": "2021" }
        // turnoverObjects["02-2021"] = { "current": 4000, "id": "2021", "isCurrent": true, "month": "Févr.", "monthYear": "02-2021", "target": undefined, "year": "2021" }
        // turnoverObjects["04-2021"] = { "current": 6000, "id": "2021", "isCurrent": true, "month": "Avr.", "monthYear": "04-2021", "target": undefined, "year": "2021" }
        // turnoverObjects["01-2021"] = { "current": 1000, "id": "2021", "isCurrent": true, "month": "Janv.", "monthYear": "01-2021", "target": undefined, "year": "2021" }
        // turnoverObjects["11-2020"] = { "current": 200, "id": "2020", "isCurrent": true, "month": "Nov.", "monthYear": "11-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["12-2020"] = { "current": 300, "id": "2020", "isCurrent": true, "month": "Déc.", "monthYear": "12-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["10-2020"] = { "current": 100, "id": "2020", "isCurrent": true, "month": "Oct.", "monthYear": "10-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["09-2020"] = { "current": 90, "id": "2020", "isCurrent": true, "month": "Sept.", "monthYear": "09-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["08-2020"] = { "current": 80, "id": "2020", "isCurrent": true, "month": "Août.", "monthYear": "08-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["07-2020"] = { "current": 50, "id": "2020", "isCurrent": true, "month": "Juil.", "monthYear": "07-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["06-2020"] = { "current": 30, "id": "2020", "isCurrent": true, "month": "Juin.", "monthYear": "06-2020", "target": undefined, "year": "2020" }
        // turnoverObjects["05-2020"] = { "current": 20, "id": "2020", "isCurrent": true, "month": "Mai.", "monthYear": "05-2020", "target": undefined, "year": "2020" }

        turnoverObjects = await fetchTurnoverData(this.queries.turnover, turnoverObjects)
        let turnoverArr = this.setTurnoverArr(turnoverObjects)
        turnoverArr = sortMonths(turnoverArr)
        const monthlyGoals = this.setMonthlyGoals(turnoverArr)
        const { chartLabels, chartDataSets } = this.setChart(turnoverArr)
        this.setState({ totalIncome, monthlyGoals, chartDataSets, chartLabels, totalProjects, totalClients })
    }

    setTurnoverArr(turnoverObjects) {
        let turnoverArr = []
        for (const key in turnoverObjects) {
            turnoverArr.push(turnoverObjects[key])
        }
        return turnoverArr
    }

    setMonthlyGoals(turnoverArr) {
        let monthlyGoals = []

        for (const turnover of turnoverArr) {
            if (turnover.target)
                monthlyGoals.push(turnover)
        }

        return monthlyGoals
    }

    setChart(turnoverArr) {
        let semesterTurnoverArr = this.filterSemesterTurnover(turnoverArr)
        const chartData = semesterTurnoverArr.map((turnover) => turnover.current)
        const chartLabels = semesterTurnoverArr.map((turnover) => turnover.month)
        const chartDataSets = [chartData]
        return { chartLabels, chartDataSets }
    }

    filterSemesterTurnover(turnoverArr) {

        const sixMmonthsAgo = moment().subtract('5', 'months').format('YYYY-MM')

        turnoverArr = turnoverArr.filter((turnover) => {
            const monthYear = moment(turnover.monthYear, 'MM-YYYY').format('YYYY-MM')
            const isLastSemester = moment(monthYear).isSameOrAfter(sixMmonthsAgo, 'month')
            if (isLastSemester) return turnover
        })

        return turnoverArr
    }

    //SUMMARY DATA
    async fetchTotalIncome(query) {
        let totalIncome = 0
        let monthsTurnovers = {}
        await query.get().then((querySnapshot) => {
            for (const doc of querySnapshot.docs) {
                monthsTurnovers = doc.data()
                delete monthsTurnovers.current
                delete monthsTurnovers.target

                for (const month in monthsTurnovers) {
                    const projectsIncome = monthsTurnovers[month].projectsIncome || {}
                    for (var projectId in projectsIncome) {
                        totalIncome += Number(projectsIncome[projectId].amount)
                    }
                }
            }
        })

        return totalIncome
    }

    async fetchTotals(query) {
        return query.get().then((querySnapshot) => {
            const clients = []

            querySnapshot.forEach((doc) => {
                const project = doc.data()
                const clientId = project.client.id
                if (!clients.includes(clientId))
                    clients.push(clientId)
            })

            const totalProjects = querySnapshot.docs.length
            const totalClients = clients.length
            return { totalProjects, totalClients }
        })
    }

    renderSummary() {
        const { totalIncome, totalProjects, totalClients } = this.state

        const summaryData = [
            {
                label: 'REVENU TOTAL',
                value: totalIncome,
                symbol: '€',
                colors: { primary: '#555CC4', secondary: '#EEEFFF' }
            },
            {
                label: 'CLIENTS',
                value: totalClients,
                symbol: '',
                colors: { primary: '#F5276D', secondary: '#FFEFF4' }
            },
            {
                label: 'PROJETS',
                value: totalProjects,
                symbol: '',
                colors: { primary: '#FF9A27', secondary: '#FFF6E6' }
            },
        ]

        const emptySpace = () => <View style={{ flex: 0.15 }} />

        return (
            <View style={styles.summaryContainer}>
                {summaryData.map((data) => {
                    return (
                        <View style={[styles.summaryColumn, { backgroundColor: data.colors.secondary }]}>
                            {emptySpace()}
                            <View style={styles.summaryLabelContainer}>
                                <Text style={[theme.customFontMSregular.small, styles.summaryLabel]}>{data.label}</Text>
                            </View>
                            <View style={styles.summaryValueContainer}>
                                <Text style={[theme.customFontMSmedium.body, styles.summaryValue, { color: data.colors.primary }]}>{data.symbol}{data.value.toString()}</Text>
                            </View>
                            {emptySpace()}
                        </View>
                    )
                })
                }
            </View>
        )
    }

    renderChart() {
        const { chartPeriod, monthlyGoals, chartDataSets, chartLabels } = this.state
        const periods = [
            { label: 'Le mois courant', value: 'currentMonth' },
            { label: 'Les 6 derniers mois', value: 'lastSemester' },
            { label: "L'année dernière", value: 'lastYear' },
        ]

        let labels = chartLabels
        let datasets = []
        for (const chartData of chartDataSets) {
            const data = chartData
            datasets.push({ data })
        }

        return (
            <View>

                <View style={styles.chartHeader}>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={[theme.customFontMSregular.caption]}>Statistiques</Text>
                    </View>
                    <Picker
                        showTitle={false}
                        returnKeyType="next"
                        value={chartPeriod}
                        selectedValue={chartPeriod}
                        onValueChange={(chartPeriod) => this.setState({ chartPeriod })}
                        elements={periods}
                        enabled={false}
                        style={{ width: '50%', marginRight: -15 }}
                        pickerContainerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>

                <LineChart
                    data={{
                        labels,
                        datasets
                    }}
                    width={Dimensions.get("window").width - theme.padding * 2} // from react-native
                    height={220}
                    yAxisLabel="€"
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    onDataPointClick={(data) => console.log(data)}
                    bezier
                    style={{
                        marginTop: 5,
                        marginBottom: 25,
                        borderRadius: 16
                    }}
                />
            </View>
        )
    }

    onPressGoal(goal, index) {
        const navParams = {
            userId: auth.currentUser.uid,
            GoalId: goal.id,
            monthYear: goal.monthYear,
            onGoBack: this.refreshMonthlyGoals
        }

        this.props.navigation.navigate('AddGoal', navParams)
    }

    async refreshMonthlyGoals() {
        let turnoverObjects = await fetchTurnoverData(this.queries.turnover, this.initialTurnoverObjects)
        const turnoverArr = this.setTurnoverArr(turnoverObjects)
        const monthlyGoals = this.setMonthlyGoals(turnoverArr)
        this.setState({ monthlyGoals })
    }

    renderGoals(isCom) {
        const { monthlyGoals } = this.state

        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {!isCom && this.addGoal()}
                {monthlyGoals.map((goal, index) => (
                    <TurnoverGoal
                        goal={goal}
                        index={index}
                        onPress={this.onPressGoal.bind(this)}
                    />
                ))}
            </View>
        )
    }

    addGoal() {
        const size = constants.ScreenWidth * 0.26
        const onPress = () => {
            this.props.navigation.navigate('AddGoal', { onGoBack: this.refreshMonthlyGoals })
        }
        return (
            <TouchableOpacity style={{ marginBottom: 25, alignItems: 'center' }} onPress={onPress}>
                <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: theme.colors.gray_dark, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={[theme.customFontMSregular.h1, { color: theme.colors.gray_dark }]}>+</Text>
                </View>
                <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark, textAlign: 'center' }]}>Nouvel objectif</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { monthlyGoals, chartLabels, loading } = this.state
        const { isConnected } = this.props.network
        const roleId = this.props.role.id
        const isCom = roleId === 'com'

        return (
            <View style={styles.mainContainer}>
                {loading ?
                    <Loading />
                    :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.renderSummary()}
                        {chartLabels.length > 0 && this.renderChart()}
                        {this.renderGoals(isCom)}
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

export default connect(mapStateToProps)(Analytics)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    //Summary
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    summaryColumn: {
        height: constants.ScreenHeight * 0.1,
        width: constants.ScreenWidth * 0.29,
        borderRadius: 16,
    },
    summaryLabelContainer: {
        flex: 0.45,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    summaryLabel: {
        color: theme.colors.secondary,
        textAlign: 'center',
        letterSpacing: 1.5
    },
    summaryValueContainer: {
        flex: 0.25,
        justifyContent: 'center'
    },
    summaryValue: {
        textAlign: 'center'
    },
    //CHART
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    }
})

