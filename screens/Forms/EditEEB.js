import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { Appbar } from '../../components';

export default class EditEEB extends Component {
    constructor(props) {
        super(props)
        this.SimulationId = this.props.navigation.getParam('SimulationId', '')

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Appbar close title titleText="Modifier les données de la simulation" />
                <Text style={{ marginTop: 50 }}>Modification des données de la simulation: {this.SimulationId}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

