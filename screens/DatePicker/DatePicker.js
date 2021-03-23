import React, { Component } from 'react'
import DatePicker from 'react-native-date-picker'
import { View, Text, StyleSheet } from 'react-native'
import { ThemeColors } from 'react-navigation'
import * as theme from '../../core/theme'
import { Title } from 'react-native-paper'
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'

class MyDatePicker extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.label = this.props.navigation.getParam('label', '')
        this.userId = this.props.navigation.getParam('userId', '')
        this.showDayPicker = this.props.navigation.getParam('showDayPicker', true)
        this.showTimePicker = this.props.navigation.getParam('showTimePicker', true)
        this.isAllDay = this.props.navigation.getParam('isAllDay', true)

        this.state = {
            startDate: new Date(),
            startHour: new Date()
        }
    }

    handleSubmit() {

        let date
        let time
        let output

        if (this.isAllDay) {
            date = moment(this.state.startDate).format('YYYY-MM-DD')
            time = moment(this.state.startHour).format('HH:mm')
            output = moment(date + " " + time)
        }

        else {
            if (!this.showDayPicker) { //time picker
                time = moment(this.state.startHour).format('HH:mm')
                output = time
            }

            else if (!this.showTimePicker) { //day picker
                date = moment(this.state.startDate).format('YYYY-MM-DD')
                output = date
            }
        }

        if (this.label === 'de début')
            this.props.navigation.state.params.onGoBack('start', output, this.isAllDay)
        else
            this.props.navigation.state.params.onGoBack('due', output, this.isAllDay)

        this.props.navigation.goBack()
    }

    render() {
        let { startDate, startHour } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Appbar close title titleText={`Date ${this.label}`} check handleSubmit={this.handleSubmit} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {this.showDayPicker &&
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomColor: theme.colors.gray, borderBottomWidth: StyleSheet.hairlineWidth * 2 }}>
                            <Title style={{ marginBottom: 15 }}>Date {this.label}</Title>
                            <DatePicker
                                date={startDate}
                                onDateChange={(startDate) => this.setState({ startDate })}
                                mode='date'
                                locale='fr'
                                androidVariant="nativeAndroid"
                                fadeToColor={theme.colors.primary}
                            />
                        </View>
                    }


                    {this.showTimePicker &&
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Title style={{ marginBottom: 15 }}>Heure {this.label}</Title>
                            <DatePicker
                                date={startHour}
                                onDateChange={(startHour) => this.setState({ startHour })}
                                mode='time'
                                androidVariant="nativeAndroid"
                            />
                        </View>
                    }

                </View>
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        network: state.network,
    }
}

export default connect(mapStateToProps)(MyDatePicker)