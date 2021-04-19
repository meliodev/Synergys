import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as NativeTextInput } from 'react-native';
import { TextInput as Input } from "react-native-paper";
import * as theme from "../core/theme";

const TextInput = ({ errorText, disabled, whiteTheme, link, ...props }) => (
  <View style={styles.container}>
    <Input
      style={[theme.customFontMSregular.body, styles.input]}
      selectionColor={whiteTheme ? '#fff' : theme.colors.primary}
      underlineColor={theme.colors.gray_extraLight}
      theme={
        {
          colors: { 
            placeholder: theme.colors.secondary,
            text: (disabled && props.editable === false) ? theme.colors.placeholder : link ? 'green' : theme.colors.gray_dark,
            error: theme.colors.error
          },
        }
      }

      {...props} />
    {errorText ? <Text style={[theme.customFontMSregular.caption, styles.error]}>{errorText}</Text> : null}
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 5,
   // marginBottom: 10,
   //backgroundColor: 'yellow'
  },
  input: {
    width: "100%",
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: theme.colors.gray_extraLight,
    textAlign: 'center',
    paddingHorizontal: 0,
//    backgroundColor: 'pink'
  },
  error: {
    // paddingHorizontal: 4,
    paddingTop: 4,
    color: theme.colors.error
  }
});

export default memo(TextInput);
