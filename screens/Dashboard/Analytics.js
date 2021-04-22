import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { LineChart } from 'react-native-chart-kit'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { db, auth } from '../../firebase'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'
import { load } from '../../core/utils'
import { fetchDocs } from '../../api/firestore-api'

import { Picker, Loading } from '../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'

class Analytics extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)

        this.state = {
            userGoals: [],
            totalProjects: 0,
            totalClients: 0,
            chartPeriod: 'lastSemester',
            loading: true
        }
    }

    async componentDidMount() {
        // this.fetchUserRevenue()
        const userGoals = await this.fetchUserGoals()
        const totalProjects = await this.fetchTotalProjects()
        const totalClients = await this.fetchTotalClients()
        this.setState({ userGoals, totalProjects, totalClients })
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
        await db
            .collection('Users')
            .doc(auth.currentUser.uid)
            .collection('TurnoverGoals')
            .where('monthYear', '>=', startOfLastSemester)
            .orderBy('monthYear', 'desc')
            .get()
            .then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    const goal = {
                        month: moment(data.monthYear).format('MM'),
                        year: moment(data.monthYear).format('YYYY'),
                        target: data.target,
                        current: data.current || 0
                    }
                    userGoals.push(goal)
                })
            })

        return userGoals
    }

    renderSummary() {
        const { totalProjects, totalClients } = this.state

        const summaryData = [
            {
                label: 'REVENU TOTAL',
                value: 50000,
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
            { label: 'Les derniers 6 mois', value: 'lastSemester' },
            { label: 'La dernière année', value: 'lastYear' },
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
        console.log(index)
        // this.props.navigation.navigate('AddGoal', { userId: auth.currentUser.uid, GoalId: goal.id })
    }

    renderGoals() {

        const { userGoals } = this.state

        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {this.addGoal()}
                {userGoals.map((data, index) => {
                    const { current, target, month } = data
                    const progress = (current / target) * 100
                    const targetReached = progress >= 100
                    const currentLow = progress < 33
                    const tintColor = targetReached ? theme.colors.primary : currentLow ? theme.colors.error : 'orange'
                    return (
                        <TouchableOpacity style={{ marginBottom: 17, marginLeft: (index + 1) % 3 === 0 ? 0 : constants.ScreenWidth * 0.07 }} onPress={() => this.onPressGoal(data, index)}>
                            <AnimatedCircularProgress
                                size={constants.ScreenWidth * 0.26}
                                width={5}
                                fill={progress}
                                tintColor={tintColor}
                                onAnimationComplete={() => console.log('onAnimationComplete')}
                                arcSweepAngle={270}
                                rotation={227}
                                backgroundColor={theme.colors.gray_light}
                                style={{ marginBottom: 10 }}>
                                {(fill) => (
                                    <Text style={[theme.customFontMSregular.header]}>
                                        {parseInt(fill)}%
                                    </Text>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={[theme.customFontMSregular.caption, { textAlign: 'center' }]}>{current}€/{target}€</Text>
                            <Text style={[theme.customFontMSregular.small, { textAlign: 'center', marginTop: 5 }]}>{month}</Text>
                        </TouchableOpacity>
                    )
                })
                }
            </View>
        )
    }

    addGoal() {
        const size = constants.ScreenWidth * 0.26
        const onPress = () => {
            this.props.navigation.navigate('AddGoal')
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

