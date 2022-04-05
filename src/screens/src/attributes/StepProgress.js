/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as theme from '../../../core/theme'

export default function StepProgress({ progress }) {
  const color = progress >= 75 ? theme.colors.primary : theme.colors.secondary
  return (
    <AnimatedCircularProgress
      size={33}
      width={2}
      fill={progress}
      tintColor={color}
      // onAnimationComplete={() => console.log('onAnimationComplete')}
      backgroundColor="#D8D8D8"
      rotation={0}>
      {(fill) => (
        <Text style={[theme.customFontMSmedium.extraSmall, { color, textAlign: 'center' },]}>
          {parseInt(progress)}%
        </Text>
      )}
    </AnimatedCircularProgress>
  );
}

const styles = StyleSheet.create({
  percentText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
