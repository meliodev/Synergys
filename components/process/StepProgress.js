/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as theme from '../../core/theme'

export default function StepProgress({ progress, style }) {
  console.log('66666666666', progress)
  return (
    <AnimatedCircularProgress
      size={27}
      width={2}
      fill={progress}
      tintColor={progress >= 75 ? theme.colors.primary : theme.colors.secondary}
      style={style}
      // onAnimationComplete={() => console.log('onAnimationComplete')}
      backgroundColor="#D8D8D8"
      rotation={0}>
      {(fill) => (
        <Text
          style={[
            styles.percentText,
            { color: progress >= 75 ? theme.colors.primary : theme.colors.secondary },
          ]}>
          {parseInt(fill)}%
        </Text>
      )}
    </AnimatedCircularProgress>
  );
}

const styles = StyleSheet.create({
  percentText: {
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
