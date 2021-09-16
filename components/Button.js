import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import * as theme from "../core/theme";

const Button = ({ mode, style, labelStyle, children, outlinedColor = theme.colors.primary, ...props }) => (
  <View style={[{ display: "flex", flexDirection: "row" }, styles.button]}>
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
    //width: "100%",
    marginVertical: 10
  },
});

export default memo(Button);
