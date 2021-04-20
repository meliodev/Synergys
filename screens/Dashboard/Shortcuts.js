import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, CustomIcon } from '../../components'

export default class Shortcuts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: ''
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Appbar back title titleText='Raccourcis' />
              
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

