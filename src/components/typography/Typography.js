import React from "react";
import { 
    Caption as CaptionPaper,
    Paragraph,
    Headline, 
} from "react-native-paper";
import * as theme from "../../core/theme";

const Caption = ({ fontFamily = theme.customFontMSregular, style, text }) => (
    <CaptionPaper style={[fontFamily.caption, style]}>
        {text}
    </CaptionPaper>
)

const Body = ({ style, text }) => (
    <Paragraph style={[style]}>
        {text}
    </Paragraph>
)


export { Caption, Body }