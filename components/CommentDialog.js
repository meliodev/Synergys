import React, { useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native"
import Dialog from 'react-native-dialog'
import * as theme from "../core/theme";

const CommentDialog = ({
    title,
    description,
    keyboardType = "default",
    onSubmit,
    isVisible,
    onCancel,
    loading,
}) => {

    const [comment, setComment] = useState('')
    const clearComment = () => setComment('')

    if (loading)
        return (
            <Dialog.Container visible={isVisible}>
                <Dialog.Title style={[theme.customFontMSregular.header, { marginBottom: 5 }]}>Traitement en cours...</Dialog.Title>
                <ActivityIndicator color={theme.colors.primary} size='small' />
            </Dialog.Container>
        )

    else return (
        <Dialog.Container visible={isVisible}>
            <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{title}</Dialog.Title>
            <Dialog.Input
                label={description}
                returnKeyType="done"
                value={comment}
                onChangeText={comment => setComment(comment)}
                autoFocus={isVisible}
                keyboardType={keyboardType} />

            <Dialog.Button
                label="Annuler"
                onPress={onCancel}
                style={{ color: theme.colors.error }}
            />
            <Dialog.Button
                label="Valider"
                onPress={() => onSubmit(comment, clearComment)}
                style={{ color: theme.colors.primary }}
            />
        </Dialog.Container>
    )
}
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

export default CommentDialog
