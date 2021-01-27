
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import * as theme from "../core/theme";
import { constants } from '../core/constants'

const TasksTab = ({ isCalendar, onPress1, onPress2, ...props }) => {

    const tabWidth = constants.ScreenWidth * 0.125

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.stateStyle, {
                    backgroundColor: !isCalendar ? theme.colors.secondary : '#fff',
                    // backgroundColor: 'red',
                    width: '50%'
                }]}
                onPress={onPress1}>
                <Text style={[theme.customFontMSsemibold.body, { color: !isCalendar ? '#fff' : '#333', textAlign: 'center' }]}>Liste</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.stateStyle, {
                    backgroundColor: isCalendar ? theme.colors.secondary : '#fff',
                    width: '50%'
                }]}
                onPress={onPress2}>
                <Text style={[theme.customFontMSsemibold.body, { color: isCalendar ? '#fff' : '#333', textAlign: 'center' }]}>Calendrier</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container : {
        backgroundColor:'#EBEBEB',
        flexDirection: 'row', justifyContent: 'center',
        height: constants.ScreenHeight * 0.11
    },
    stateStyle: {
        //elevation: 3,
        margin: 20,
        borderRadius: 15,
        justifyContent: 'center', alignItems: 'center',
        width: constants.ScreenWidth * 0.3,
        height: constants.ScreenHeight * 0.07
    }
})

export default TasksTab
