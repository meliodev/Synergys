
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card, Title } from 'react-native-paper'

import MyInput from '../components/TextInput'

import * as theme from "../core/theme";
import { getRoleIdFromValue } from "../core/utils";

const ActivitySection = ({ createdBy, createdAt, editedBy, editedAt, navigation, ...props }) => {

    navigateToProfile = (user) => navigation.navigate('Profile', { user: { id: user.id, roleId: getRoleIdFromValue(user.role) } })

    return (
        <Card style={{ margin: 5 }}>
            <Card.Content>
                <Title style={{ marginBottom: 15 }}>Activité</Title>

                <MyInput
                    label="Date de création"
                    returnKeyType="done"
                    value={createdAt}
                    editable={false}
                />

                <TouchableOpacity onPress={() => navigateToProfile(createdBy)}>
                    <MyInput
                        label="Crée par"
                        returnKeyType="done"
                        value={createdBy.fullName}
                        editable={false}
                        link
                    />
                </TouchableOpacity>

                <MyInput
                    label="Dernière mise à jour"
                    returnKeyType="done"
                    value={editedAt}
                    editable={false}
                />

                <TouchableOpacity onPress={() => navigateToProfile(editedBy)}>
                    <MyInput
                        label="Dernier intervenant"
                        returnKeyType="done"
                        value={editedBy.fullName}
                        editable={false}
                        link
                    />
                </TouchableOpacity>

            </Card.Content>
        </Card>
    )

}

export default ActivitySection


