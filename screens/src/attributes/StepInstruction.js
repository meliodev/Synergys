/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';

import { CustomIcon } from '../../../components';
import * as theme from '../../../core/theme'

export default function StepInstruction({ instructions }) {
  return (
    <View>
      <CustomIcon
        icon={faInfoCircle}
        onPress={() => Alert.alert('', instructions)}
        size={16}
        color="#0A0F70"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  instructionContainer: {
    padding: 10,
    position: 'absolute',
    top: 15,
    width: 200,
    alignSelf: 'center',
  },
  instructionSection: {
    borderRadius: 7,
    borderColor: '#0A0F70',
    borderWidth: 1,
    padding: 3,
    backgroundColor: 'white',
    zIndex: 11,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
