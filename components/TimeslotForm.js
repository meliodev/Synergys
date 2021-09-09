

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Keyboard, Alert } from 'react-native'
import { Switch } from 'react-native-paper'
import DatePicker from 'react-native-date-picker'
import { faCalendarPlus, faClock } from '@fortawesome/pro-light-svg-icons'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import ItemPicker from '../components/ItemPicker'

import { navigateToScreen } from '../core/utils'
import * as theme from '../core/theme'

export default class TimeslotForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            //Schedule
            isAllDay: false,
            startDate: moment(this.props.startDate).toDate(),
            endDate: moment(this.props.endDate).toDate(),
            startHour: moment(this.props.startHour).toDate(),
            dueHour: moment(this.props.dueHour).toDate(),

            startDateError: '',
            endDateError: '',
            startHourError: '',
            dueHourError: '',

            togglePickers: {
                startDate: false,
                endDate: false,
                startHour: false,
                dueHour: false,
            }
        }
    }

    togglePicker(pickerId) {
        let { togglePickers } = this.state
        for (let key in togglePickers) {
            if (key === pickerId)
                togglePickers[key] = !togglePickers[key]
            else togglePickers[key] = false
        }
        this.setState({ togglePickers })
    }

    renderTimeForm() {
        const { isAllDay, startDate, endDate, startHour, dueHour, togglePickers } = this.state
        const { startDateError, endDateError, startHourError, dueHourError } = this.state
        const showEndDate = !isAllDay && !this.isEdit && this.props.role.id !== "com" //#task: make it as prop 
        const { canWrite } = this.props

        return (
            <View style={{ flex: 1 }}>

                <View style={styles.isAllDayContainer}>
                    <Text style={theme.customFontMSregular.body}>Toute la journée</Text>
                    <View style={styles.isAllDaySwitchContainer}>
                        <Switch
                            value={isAllDay}
                            onValueChange={(isAllDay) => this.setState({ isAllDay })}
                            color={theme.colors.primary}
                            disabled={!canWrite}
                        />
                    </View>
                </View>

                {this.renderItemPicker("startDate", "Date de début *", startDate, startDateError, "date")}

                {togglePickers["startDate"] &&
                    this.renderDatePicker("date", "startDate", startDate)
                }

                {showEndDate &&
                    this.renderItemPicker("endDate", "Date de fin *", endDate, endDateError, "date")
                }

                {togglePickers["endDate"] &&
                    this.renderDatePicker("date", "endDate", endDate)
                }

                {!isAllDay &&
                    this.renderItemPicker("startHour", "Heure de début *", startHour, startHourError, "time")
                }

                {togglePickers["startHour"] &&
                    this.renderDatePicker("time", "startHour", startHour)
                }

                {!isAllDay &&
                    this.renderItemPicker("dueHour", "Heure d'échéance *", dueHour, dueHourError, "time")
                }

                {togglePickers["dueHour"] &&
                    this.renderDatePicker("time", "dueHour", dueHour)
                }

            </View>
        )
    }

    renderDatePicker(mode, dateId, date) {
        return (
            <DatePicker
                date={date}
                onDateChange={(newDate) => {
                    let update = {}
                    update[dateId] = newDate
                    this.setState(update)
                    this.props.setParentState(mode, dateId, newDate)
                }}
                mode={mode}
                locale='fr'
                androidVariant="nativeAndroid"
                fadeToColor={theme.colors.primary}
                style={{ alignSelf: "center" }}
            />
        )
    }

    renderItemPicker(id, label, value, error, mode) {
        const { canWrite } = this.props
        return (
            <ItemPicker
                onPress={() => this.togglePicker(id)}
                label={label}
                value={mode === "date" ? moment(value).format('ll') : moment(value).format('HH:mm')}
                editable={canWrite}
                showAvatarText={false}
                icon={mode === "date" ? faCalendarPlus : faClock}
                errorText={error}
            />
        )
    }

    render() {
        return this.renderTimeForm()
    }
}

const styles = StyleSheet.create({
    isAllDayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    isAllDaySwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})