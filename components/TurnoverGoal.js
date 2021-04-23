
import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput as NativeTextInput } from 'react-native';
import { TextInput as Input } from "react-native-paper";
import * as theme from "../core/theme";
import { constants } from "../core/constants";
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const TurnoverGoal = ({ goal, index, onPress, isList = true, ...props }) => {

    const { current, target, month } = goal
    const progress = (current / target) * 100
    const targetReached = progress >= 100
    const currentLow = progress < 33
    const tintColor = targetReached ? theme.colors.primary : currentLow ? '#F5276D' : 'orange'
    const isFirstColumn = (index + 1) % 3 === 0

    return (
        <TouchableOpacity style={{ marginBottom: 17, marginLeft: !isList ? 0 : isFirstColumn ? 0 : constants.ScreenWidth * 0.06 }} onPress={() => onPress(goal, index)}>
            <AnimatedCircularProgress
                size={constants.ScreenWidth * 0.26}
                width={5}
                fill={progress}
                tintColor={tintColor}
                onAnimationComplete={() => console.log('onAnimationComplete')}
                arcSweepAngle={270}
                rotation={227}
                backgroundColor={theme.colors.gray_light}
                style={{ marginBottom: 10, alignSelf: 'center' }}>
                {(fill) => (
                    <Text style={[theme.customFontMSregular.header]}>
                        {parseInt(fill)}%
                    </Text>
                )}
            </AnimatedCircularProgress>
            <Text style={[theme.customFontMSregular.caption, { textAlign: 'center' }]}>{current}€/{target}€</Text>
            <Text style={[theme.customFontMSregular.small, { textAlign: 'center', marginTop: 5 }]}>{month}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})

export default memo(TurnoverGoal);
