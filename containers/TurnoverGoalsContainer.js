import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { LineChart } from 'react-native-chart-kit'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { db, auth } from '../firebase'
import * as theme from '../core/theme'
import { constants, highRoles } from '../core/constants'
import { load, sortMonths } from '../core/utils'
import { fetchDocs } from '../api/firestore-api'
import { setTurnoverArr, setMonthlyGoals } from '../screens/Dashboard/helpers'

import { TurnoverGoal } from '../components'

class TurnoverGoalsContainer extends Component {

    renderGoals() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {!this.props.isCom && this.addGoal()}
                {this.props.monthlyGoals.map((goal, index) => (
                    <TurnoverGoal
                        goal={goal}
                        index={index}
                        onPress={this.props.onPressGoal.bind(this)}
                    />
                ))}
            </View>
        )
    }

    addGoal() {
        const size = constants.ScreenWidth * 0.26
        const onPress = this.props.onPressNewGoal

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
        return this.renderGoals()
    }
}

export default TurnoverGoalsContainer