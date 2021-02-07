import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { constants } from '../core/constants'

const ratio = 133 / 215
const width =  constants.ScreenWidth * 0.8
const height = width * ratio
//const width = constants.ScreenWidth * 0.32

const Logo = ({ style, ...props }) => (
  <Image source={require('../assets/logo.png')} style={[styles.image,style]} />
)

const styles = StyleSheet.create({
  image: {
    marginBottom: 12,
    width: width,
    height: height
  },
});

export default memo(Logo);
