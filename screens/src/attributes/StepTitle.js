import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function StepTitle({ title }) {
  return <Text style={styles.stepTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  stepTitle: {
    color: '#25D366',
    // fontWeight: 'bold',
    marginHorizontal: 10,
  },
});
