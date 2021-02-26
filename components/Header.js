import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import * as theme from "../core/theme";
import { constants } from '../core/constants'

const Header = ({ children }) => (
  <View style={styles.header}>{children}</View>
)

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: constants.ScreenHeight * 0.025,
    paddingHorizontal: theme.padding,
    marginBottom: theme.padding / 2,
    backgroundColor: theme.colors.gray_light
  }
});

export default memo(Header);
