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
import { analyticsQueriesBasedOnRole, initTurnoverObjects, setTurnoverArr, setMonthlyGoals } from './helpers'

import { Picker, TurnoverGoal, Loading } from '../../components'
import TurnoverGoalsContainer from '../../containers/TurnoverGoalsContainer'
import { TouchableOpacity } from 'react-native-gesture-handler'

class Analytics extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)
        this.refreshMonthlyGoals = this.refreshMonthlyGoals.bind(this)
        this.currentMonth = moment().format('MMM')
        this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1)

        const role = this.props.role
        const roleId = role.id
        this.queries = analyticsQueriesBasedOnRole(roleId, auth.currentUser.uid)
        this.initialTurnoverObjects = initTurnoverObjects()

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

        turnoverObjects = await fetchTurnoverData(this.queries.turnover, turnoverObjects, auth.currentUser.uid)
        let turnoverArr = setTurnoverArr(turnoverObjects)
        turnoverArr = sortMonths(turnoverArr)
        const monthlyGoals = setMonthlyGoals(turnoverArr)
        const { chartLabels, chartDataSets } = this.setChart(turnoverArr)
        this.setState({ totalIncome, totalProjects, totalClients, chartDataSets, chartLabels, monthlyGoals })
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

    onPressNewGoal() {
        this.props.navigation.navigate('AddGoal', { onGoBack: this.refreshMonthlyGoals })
    }

    onPressGoal(goal, index) {

        let incomeSources = []
        let incomeSource = {}

        const navParams = {
            userId: auth.currentUser.uid,
            GoalId: goal.id,
            currentTurnover: goal.current,
            incomeSources: goal.sources,
            monthYear: goal.monthYear,
            onGoBack: this.refreshMonthlyGoals
        }

        this.props.navigation.navigate('AddGoal', navParams)
    }

    async refreshMonthlyGoals() {
        let turnoverObjects = await fetchTurnoverData(this.queries.turnover, this.initialTurnoverObjects, auth.currentUser.uid)
        const turnoverArr = setTurnoverArr(turnoverObjects)
        const monthlyGoals = setMonthlyGoals(turnoverArr)
        this.setState({ monthlyGoals })
    }

    renderGoals() {
        const { monthlyGoals } = this.state
        const roleId = this.props.role.id
        const isCom = roleId === 'com'

        return (
            <TurnoverGoalsContainer
                monthlyGoals={monthlyGoals}
                onPressNewGoal={this.onPressNewGoal.bind(this)}
                onPressGoal={this.onPressGoal.bind(this)}
                navigation={this.props.navigation}
                isCom={isCom}
            />
        )
    }

    render() {
        const { chartLabels, loading } = this.state
        const { isConnected } = this.props.network

        return (
            <View style={styles.mainContainer}>
                {loading ?
                    <Loading />
                    :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.renderSummary()}
                        {chartLabels.length > 0 && this.renderChart()}
                        {this.renderGoals()}
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
        elevation: 4,
        height: constants.ScreenHeight * 0.1,
        width: constants.ScreenWidth * 0.275,
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

