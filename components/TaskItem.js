import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import * as theme from '../core/theme'

const TaskItem = ({ task, onPress }) => {

    const { id, name, status, isAllDay, color, startHour, dueHour } = task
    const taskColor = color
    const TaskId = id
    const done = status === 'Terminé'
    const timerange = isAllDay ? 'Toute la journée' : `${startHour} - ${dueHour}`

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor: taskColor, opacity: done ? 0.5 : 1 }]} onPress={onPress} >
            <View style={{ flex: 0.5, justifyContent: 'center', paddingRight: 5 }}>
                <Text style={[theme.customFontMSregular.body, { color: '#fff' }]} numberOfLines={1}>{name}</Text>
            </View>
            <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 5 }}>
                {/* <Text style={[theme.customFontMSregular.caption, { color: '#fff' }]} numberOfLines={1}>{task.assignedTo.fullName}</Text> */}
                <Text style={[theme.customFontMSregular.caption, { color: theme.colors.white, marginRight: 10 }]} numberOfLines={1}>{timerange}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 15,
        marginBottom: 10,
        //marginTop: 10,
    },
})

export default TaskItem