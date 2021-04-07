import React from 'react';
import { ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_COLOR } from '../utils/color';

export default function PhaseStatus({ params, status }) {
  const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
    const iconConfig = {
      name: 'feed',
      // color: stepStatus === 'finished' ? '#ffffff' : PRIMARY_COLOR,
      color: PRIMARY_COLOR,
      size: 20,
    };
    switch (position) {
      case 0: {
        iconConfig.name = 'check';
        break;
      }
      case 1: {
        iconConfig.name = 'check';
        break;
      }
      case 2: {
        iconConfig.name = 'check';
        break;
      }
      case 3: {
        iconConfig.name = 'check';
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };
  if (status === 'pending') {
    return <ActivityIndicator color={PRIMARY_COLOR} />;
  } else {
    return <MaterialIcons {...getStepIndicatorIconConfig(params)} />;
  }
}
