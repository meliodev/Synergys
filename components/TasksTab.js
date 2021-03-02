
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { faTasks, faCalendar } from '@fortawesome/pro-light-svg-icons'

import * as theme from "../core/theme";
import { constants } from '../core/constants'
import Header from './Header'
import CustomIcon from './CustomIcon'

const TasksTab = ({ isCalendar, onPress1, onPress2, ...props }) => {

    const tabWidth = constants.ScreenWidth * 0.125



    const Tab = ({ label, icon, active, onPress }) => {
        const backgroundColor = active ? theme.colors.gray_light : theme.colors.white
        const textColor = active ? theme.colors.gray_dark : theme.colors.secondary
        const tabStyle = { flexDirection: 'row', padding: theme.padding, width: constants.ScreenWidth * 0.45, justifyContent: 'center', backgroundColor: backgroundColor, borderRadius: 10 }

        return (
            <TouchableOpacity style={tabStyle} onPress={onPress}>
                <CustomIcon icon={icon} color= {textColor} />
                <Text style={[theme.robotoRegular.body, { color: textColor, marginLeft: 10 }]}>
                    {label}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <Header style={{ marginBottom: 0 }}>
            <Tab label='Liste' icon={faTasks} active={isCalendar} onPress={onPress1} />
            <Tab label='Calendrier' icon={faCalendar} active={!isCalendar} onPress={onPress2} />
        </Header>

        // <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        //     <TouchableOpacity
        //         style={[styles.stateStyle, {
        //             backgroundColor: !isCalendar ? theme.colors.secondary : '#fff',
        //             width: '50%'
        //         }]}
        //         onPress={onPress1}>
        //         <Text style={[theme.customFontMSsemibold.body, { color: !isCalendar ? '#fff' : '#333', textAlign: 'center' }]}>Liste</Text>
        //     </TouchableOpacity>

        //     <TouchableOpacity
        //         style={[styles.stateStyle, {
        //             backgroundColor: isCalendar ? theme.colors.secondary : '#fff',
        //             width: '50%'
        //         }]}
        //         onPress={onPress2}>
        //         <Text style={[theme.customFontMSsemibold.body, { color: isCalendar ? '#fff' : '#333', textAlign: 'center' }]}>Calendrier</Text>
        //     </TouchableOpacity>
        // </View>
    )
}


const styles = StyleSheet.create({
    stateStyle: {
        //elevation: 3,
        justifyContent: 'center', alignItems: 'center',
        width: constants.ScreenWidth * 0.3,
        height: constants.ScreenHeight * 0.07
    }
})

export default TasksTab
