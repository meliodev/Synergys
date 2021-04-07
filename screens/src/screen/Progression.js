import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from '../../../components/index';
import ProcessContainer from '../container/ProcessContainer';
import * as theme from '../../../core/theme'

export default function Progression() {
  return (
    <View style={styles.container}>
      <Appbar back title titleText='Progression' />
      <ProcessContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
