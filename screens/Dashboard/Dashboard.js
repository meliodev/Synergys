import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import DashboardMenu from '../../components/DashboardMenu'
import { Appbar } from '../../components'
import _ from 'lodash'
import { connect } from 'react-redux'

import * as theme from '../../core/theme'
import { requestRESPermission, requestWESPermission } from '../../core/permissions'

class Dashboard extends Component {

    componentDidMount() {
        requestWESPermission()
        requestRESPermission()
    }

    render() {
        return (
            <View style={styles.container}>
                <Appbar menu  />
                <DashboardMenu navigation={this.props.navigation} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        currentUser: state.currentUser,
        network: state.network,
        state: state,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Dashboard)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white
    }
})

