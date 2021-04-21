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

class Analytics extends Component {
    constructor(props) {
        super(props)
        this.fetchDocs = fetchDocs.bind(this)

        this.state = {
            chartPeriod: 'lastSemester',
            loading: true
        }
    }

    componentDidMount() {
        load(this, false)
    }

    renderSummary() {
        const summaryData = [
            {
                label: 'REVENU TOTAL',
                value: 50000,
                symbol: '€',
                colors: { primary: '#555CC4', secondary: '#EEEFFF' }
            },
            {
                label: 'CLIENTS',
                value: 7,
                symbol: '',
                colors: { primary: '#F5276D', secondary: '#FFEFF4' }
            },
            {
                label: 'PROJETS',
                value: 18,
                symbol: '',
                colors: { primary: '#FF9A27', secondary: '#FFF6E6' }
            },
        ]

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                {summaryData.map((data) => {
                    const columnStyle = {
                        height: constants.ScreenHeight * 0.13,
                        width: constants.ScreenWidth * 0.29,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 15,
                        paddingHorizontal: 5,
                        backgroundColor: data.colors.secondary
                    }
                    return (
                        <View style={columnStyle}>
                            <Text style={[theme.customFontMSregular.small, { color: theme.colors.secondary, textAlign: 'center', marginBottom: 12, letterSpacing: 1.5 }]}>{data.label}</Text>
                            <Text style={[theme.customFontMSmedium.body, { color: data.colors.primary }]}>{data.symbol}{data.value.toString()}</Text>
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
                        marginBottom: 15,
                        borderRadius: 16
                    }}
                />
            </View>
        )
    }

    addGoal() {
        const size = 
        return (
            <View style= {{}}>
                <Text>+</Text>
            </View>
        )
    }

    renderGoals() {
        const goalsData = [
            {
                month: 'Janvier',
                target: 10000,
                current: 6000,
            },
            {
                month: 'Février',
                target: 10000,
                current: 6000,
            },
            {
                month: 'Mars',
                target: 10000,
                current: 6000,
            },
            {
                month: 'Avril',
                target: 10000,
                current: 6000,
            },
            {
                month: 'Mai',
                target: 10000,
                current: 6000,
            },
            {
                month: 'Juin',
                target: 10000,
                current: 6000,
            }
        ]

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {this.addGoal()}
                {goalsData.map((data) => {
                    return (
                        <View style= {{marginBottom: 25}}>
                            <AnimatedCircularProgress
                                size={constants.ScreenWidth * 0.27}
                                width={5}
                                fill={(data.current / data.target) * 100}
                                tintColor="#00e0ff"
                                onAnimationComplete={() => console.log('onAnimationComplete')}
                                arcSweepAngle={270}
                                rotation={227}
                                backgroundColor={theme.colors.gray_light}>
                                {(fill) => (
                                    <Text style={[theme.customFontMSregular.header]}>
                                        {parseInt(fill)}%
                                    </Text>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={[theme.customFontMSregular.caption, { textAlign: 'center' }]}>{data.current}€/{data.target}€</Text>
                            <Text style={[theme.customFontMSregular.small, { textAlign: 'center' }]}>{data.month}</Text>
                        </View>
                    )
                })
                }
            </View>
        )

    }

    render() {
        const { loading } = this.state
        const { isConnected } = this.props.network

        return (
            <View style={styles.mainContainer}>
                {loading ?
                    <Loading />
                    :
                    <ScrollView>
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

