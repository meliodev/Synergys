import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import PhaseTitle from '../attributes/PhastTitle';
import PhaseStatus from '../attributes/PhaseStatus';
import { PRIMARY_COLOR } from '../utils/color';
import { constants } from '../../../core/constants';
import * as theme from '../../../core/theme';

const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: PRIMARY_COLOR,
  stepStrokeWidth: 2,
  separatorStrokeFinishedWidth: 2,
  stepStrokeFinishedColor: PRIMARY_COLOR,
  stepStrokeUnFinishedColor: PRIMARY_COLOR,
  separatorFinishedColor: '#707070',
  separatorUnFinishedColor: '#E8E8E8',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 5,
  currentStepIndicatorLabelFontSize: 8,
  stepIndicatorLabelCurrentColor: '#aaaaaa',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: theme.colors.secondary,
  labelSize: 8,
  currentStepLabelColor: '#999999',
};

export default function PhaseComponent({ labels, status, currentPage, setCurrentPage }) {

  const onStepPress = (position) => {
    setCurrentPage(position)
  }

  const renderStepIndicator = (params) => (
    <PhaseStatus params={params} status={status[params.position]} />
  )

  const renderLabel = ({ position, label, currentPosition }) => {
    return (
      <PhaseTitle
        title={label}
        selected={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      />
    )
  }

  return (
    <View style={styles.container}>
      <StepIndicator
        currentPosition={currentPage}
        stepCount={labels.length}
        customStyles={secondIndicatorStyles}
        onPress={onStepPress}
        renderStepIndicator={renderStepIndicator}
        renderLabel={renderLabel}
        labels={labels}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  stepLabelSelected: {
    color: '#25D366'
  },
  stepLabel: {
    // color: '#000'
  }
});
