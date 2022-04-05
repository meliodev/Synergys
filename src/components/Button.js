import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import * as theme from "../core/theme";

const Button = ({ mode, containerStyle, style, labelStyle, children, outlinedColor = theme.colors.primary, ...props }) => (
  <View style={[{ display: "flex", flexDirection: "row" }, styles.button, containerStyle]}>
    <PaperButton
      style={[
        mode === "outlined" && { backgroundColor: theme.colors.surface },
        mode === "contained" && { backgroundColor: props.backgroundColor || theme.colors.primary },
        style
      ]}
      labelStyle={[
        //styles.text,
        mode === "outlined" && { color: outlinedColor, fontFamily: 'Montserrat-Medium' },
        mode === "contained" && { color: theme.colors.surface, fontFamily: 'Montserrat-Medium' },
        labelStyle
      ]}
      mode={mode}
      {...props}
    >
      {children}
    </PaperButton>
  </View>
)

const styles = StyleSheet.create({
  button: {
    marginVertical: 10
  },
});

export default memo(Button);
