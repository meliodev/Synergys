import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function PhaseTitle({ title, selected }) {
  return <Text style={[styles.textStyle, selected]}>{title}</Text>;
}

const styles = StyleSheet.create({
  textStyle: {
    color: '#484F5A',
    fontSize: 12,
    textAlign: 'center',
  },
});
