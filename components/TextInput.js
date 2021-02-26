import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as NativeTextInput } from 'react-native';
import { TextInput as Input } from "react-native-paper";
import * as theme from "../core/theme";

const TextInput = ({ errorText, style, disabled, whiteTheme, link, ...props }) => (
  <View style={styles.container}>
    <Input
      style={[theme.robotoRegular.body, styles.input, style]}
      selectionColor={whiteTheme ? '#fff' : theme.colors.primary}
      underlineColor={theme.colors.gray_extraLight}
      theme={whiteTheme ?
        {
          colors: {
            primary: '#fff',
            text: (disabled && props.editable === false) ? theme.colors.placeholder : '#fff',
            placeholder: '#fff'
          }
        }
        :
        {
          colors: {
            primary: theme.colors.primary,
            placeholder: theme.colors.secondary,
            text: (disabled && props.editable === false) ? theme.colors.placeholder : link ? 'green' : theme.colors.gray_dark
          },
        }}

      {...props} />
    {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10
  },
  input: {
    width: "100%",
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray_extraLight,
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  error: {
    paddingHorizontal: 4,
    paddingTop: 4,
    color: theme.colors.error
  }
});

export default memo(TextInput);
