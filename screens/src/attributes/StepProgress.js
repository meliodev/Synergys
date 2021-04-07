/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function StepProgress({ progress }) {
  return (
    <AnimatedCircularProgress
      size={35}
      width={2}
      fill={progress}
      tintColor="#777777"
      // onAnimationComplete={() => console.log('onAnimationComplete')}
      backgroundColor="#D8D8D8"
      rotation={0}>
      {(fill) => (
        <Text
          style={[
            styles.percentText,
            { color: progress > 75 ? '#25D366' : '#0A0F70' },
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
    fontSize: 10,
    fontWeight: 'bold',
  },
});
