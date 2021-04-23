import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { LineChart } from 'react-native-chart-kit'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { db, auth } from '../../firebase'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { load } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api'

import { Picker, TurnoverGoal, Loading } from '../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'

class Analytics extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)

        this.state = {
            userGoals: [],
            totalIncome: 0,
            totalProjects: 0,
            totalClients: 0,
            chartPeriod: 'lastSemester',
            loading: true
        }
    }

    async componentDidMount() {
        const { userGoals, totalIncome } = await this.fetchUserGoals()
        const totalProjects = await this.fetchTotalProjects()
        const totalClients = await this.fetchTotalClients()
        this.setState({ userGoals, totalIncome, totalProjects, totalClients })
        load(this, false)
    }

    async fetchTotalProjects() {
        return db.collection('Projects').where('createdBy.id', '==', auth.currentUser.uid).get().then((querySnapshot) => {
            const totalProjects = querySnapshot.docs.length
            return totalProjects
        })
    }

    async fetchTotalClients() {
        return db.collection('Clients').where('createdBy.id', '==', auth.currentUser.uid).get().then((querySnapshot) => {
            const totalClients = querySnapshot.docs.length
            return totalClients
        })
    }

    async fetchUserGoals() {
        let userGoals = []
        const startOfLastSemester = moment().subtract(6, 'months').format()
        let monthTemp, month, year;
        let goal = 0
        let current = 0
        let totalIncome = 0

        await db
            .collection('Users')
            .doc(auth.currentUser.uid)
            .collection('Turnover')
            // .where('monthYear', '>=', moment(startOfLastSemester).toDate())
            // .orderBy('monthYear', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data()

                    for (var projectId in data.projectsIncome) {
                        totalIncome += Number(data.projectsIncome[projectId])
                    }
lk
                    if (moment(data.monthYear).isSameOrAfter(moment(startOfLastSemester))) {

                        if (data.target) {
                            monthTemp = moment(doc.id, 'MM-YYYY').format('MMMM')
                            month = monthTemp.charAt(0).toUpperCase() + monthTemp.slice(1)
                            year = moment(doc.id, 'MM-YYYY').format('YYYY')

                            for (var projectId in data.projectsIncome) {
                                current += Number(data.projectsIncome[projectId])
                            }

                            goal = {
                                id: doc.id,
                                month,
                                year,
                                target: data.target,
                                current,
                            }
                            userGoals.push(goal)
                            current = 0
                        }
                    }
                })
            })

        return { userGoals, totalIncome }
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

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                {summaryData.map((data) => {
                    const columnStyle = {
                        height: constants.ScreenHeight * 0.1,
                        width: constants.ScreenWidth * 0.29,
                        borderRadius: 16,
                        backgroundColor: data.colors.secondary
                    }
                    return (
                        <View style={columnStyle}>
                            <View style={{ flex: 0.15 }} />
                            <View style={{ flex: 0.45, paddingHorizontal: 10, justifyContent: 'center' }}>
                                <Text style={[theme.customFontMSregular.small, { color: theme.colors.secondary, textAlign: 'center', letterSpacing: 1.5 }]}>{data.label}</Text>
                            </View>
                            <View style={{ flex: 0.25, justifyContent: 'center' }}>
                                <Text style={[theme.customFontMSmedium.body, { color: data.colors.primary, textAlign: 'center' }]}>{data.symbol}{data.value.toString()}</Text>
                            </View>
                            <View style={{ flex: 0.15 }} />
                        </View>
                    )
                })
                }
            </View>
        )
    }

    renderChart() {
        const { chartPeriod } = this.state
        const periods = [
            { label: 'Le mois courant', value: 'currentMonth' },
            { label: 'Les 6 derniers mois', value: 'lastSemester' },
            { label: "L'année dernière", value: 'lastYear' },
        ]

        return (
            <View>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
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
                        enabled={true}
                        style={{ width: '50%', marginRight: -15 }}
                        pickerContainerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>

                <LineChart
                    data={{
                        labels: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width - theme.padding * 2} // from react-native
                    height={220}
                    yAxisLabel="€"
                    yAxisSuffix="k"
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
        this.props.navigation.navigate('AddGoal', { userId: auth.currentUser.uid, GoalId: goal.id })
    }

    renderGoals() {
        const { userGoals } = this.state
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {this.addGoal()}
                {userGoals.map((goal, index) => (
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
            this.props.navigation.navigate('AddGoal', { onGoback: this.fetchUserGoals })
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
        const { userGoals, loading } = this.state
        const { isConnected } = this.props.network

        return (
            <View style={styles.mainContainer}>
                {loading ?
                    <Loading />
                    :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.renderSummary()}
                        {this.renderChart()}
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

