import React from 'react';
import { ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_COLOR } from '../utils/color';

export default function PhaseStatus({ params, status }) {
  const getStepIndicatorIconConfig = ({ position, stepStatus }) => {

    const iconConfig = {
      name: 'check',
      color: PRIMARY_COLOR,
      size: 20,
    }

    return iconConfig
  }

  if (status === 'pending') {
    return <ActivityIndicator color={PRIMARY_COLOR} />;
  } 
  
  else {
    return <MaterialIcons {...getStepIndicatorIconConfig(params)} />;
  }
}
