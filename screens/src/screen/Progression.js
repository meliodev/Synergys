import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, ProcessAction } from '../../../components/index';
import ProcessContainer from '../container/ProcessContainer';
import * as theme from '../../../core/theme'

export default class Progression extends Component {

  constructor(props) {
    super(props)
    this.process = this.props.navigation.getParam('process', '')
    this.project = this.props.navigation.getParam('project', '')
    this.clientId = this.props.navigation.getParam('clientId', '')
    this.step = this.props.navigation.getParam('step', '')
    this.canUpdate = this.props.navigation.getParam('canUpdate', '')
    this.role = this.props.navigation.getParam('role', '')
  }

  render() {
    return (
      <View style={styles.container} >
        <Appbar back title titleText='Progression' />

        <ProcessAction
          initialProcess={this.process}
          project={this.project}
          clientId={this.clientId}
          step={this.step}
          canUpdate={this.canUpdate}
          isAllProcess={true}
          role={this.role}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
