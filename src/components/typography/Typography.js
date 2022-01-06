import React from "react";
import { Caption as CaptionPaper } from "react-native-paper";
import * as theme from "../../core/theme";

const Caption = ({ fontFamily = theme.customFontMSregular, style, text }) => (
    <CaptionPaper style={[fontFamily.caption, style]}>
        {text}
    </CaptionPaper>
)


export { Caption }