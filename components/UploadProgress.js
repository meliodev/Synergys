import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { TextInput as Input, ProgressBar } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import * as theme from "../core/theme";

const UploadProgress = ({ attachment, ...props }) => {
    let readableSize = attachment.size / 1000
    readableSize = readableSize.toFixed(1)

    return (
        <TouchableOpacity style={styles.container}>

            <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.17, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name='image' size={24} color={theme.colors.primary} />
                </View>

                <View style={{ flex: 0.68 }}>
                    <Text numberOfLines={1} ellipsizeMode='middle' style={[theme.customFontMSmedium.body]}>{attachment.name}</Text>
                    <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>{readableSize} KB</Text>
                </View>
            </View>

            <View style={{ flex: 0.1, justifyContent: 'flex-end' }}>
                <ProgressBar progress={attachment.progress} color={theme.colors.primary} visible={true} />
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        elevation: 1,
        backgroundColor: theme.colors.gray50,
        width: '90%',
        height: 60,
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 15
    },
})

export default UploadProgress


