import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Agenda } from 'react-native-calendars';
import MyFAB from '../../components/MyFAB'

export default class AgendaScreen extends Component {
    constructor(props) {
        super(props)
        this.onRefresh = this.onRefresh.bind(this)
        this.count = 0

        this.state = {
            items: {},
            refreshing: false,
        }
    }

    render() {
        const { refreshing } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={'2017-05-16'}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    onRefresh={this.onRefresh}
                    refreshing={refreshing}
                // markingType={'period'}
                // markedDates={{
                //    '2017-05-08': {textColor: '#43515c'},
                //    '2017-05-09': {textColor: '#43515c'},
                //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                //    '2017-05-21': {startingDay: true, color: 'blue'},
                //    '2017-05-22': {endingDay: true, color: 'gray'},
                //    '2017-05-24': {startingDay: true, color: 'gray'},
                //    '2017-05-25': {color: 'gray'},
                //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                // monthFormat={'yyyy'}
                // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                // hideExtraDays={false}
                />
                <MyFAB style={{ position: 'absolute', rigth: 0, bottom: 0 }} onPress={() => {
                    let { items } = this.state
                    items['2017-05-16'][0].name = 'Hello world !'
                    this.setState({ items })
                    console.log(items['2017-05-16'][0].name)
                }} />
            </View>
        )
    }

    wait(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    onRefresh() {
        this.setState({ refreshing: true })
        this.wait(2000).then(() => this.setState({ refreshing: false }))
    }

    loadItems(day) {
        setTimeout(() => {
            this.count += 1
            console.log(this.count, '00000000000000000000000000000000')

            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    this.state.items[strTime] = [];
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        this.state.items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150))
                        });
                    }
                }
            }
            const newItems = {};
            Object.keys(this.state.items).forEach(key => {
                newItems[key] = this.state.items[key];
            })
            this.setState({
                items: newItems
            })
        }, 1000)
    }

    renderItem(item) {
        console.log(item.name)
        return (
            <TouchableOpacity
                style={[styles.item, { height: item.height }]}
                onPress={() => Alert.alert(item.name)}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});