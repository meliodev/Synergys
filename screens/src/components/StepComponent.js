import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import StepProgress from '../attributes/StepProgress'
import StepTitle from '../attributes/StepTitle'
import StepInstruction from '../attributes/StepInstruction'

export default function StepComponent({ title, progress, instructions }) {

  return (
    <View style={styles.container}>
      <StepProgress progress={progress} />
      <StepTitle title={title} />
      <StepInstruction instructions={instructions} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
})
