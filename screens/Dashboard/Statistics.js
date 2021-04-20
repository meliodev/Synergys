import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, CustomIcon } from '../../components'

export default class Statistics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: ''
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Appbar back title titleText='Statistiques' />
              
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

