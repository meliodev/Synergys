import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MyInput from './TextInput'
import * as theme from "../core/theme";
import { notAvailableOffline } from '../core/exceptions';
import { withNavigation } from 'react-navigation'

const AddressInput = ({ offLine, refreshAddress, address, addressError, ...props }) => (
    <TouchableOpacity onPress={() => {
        if (offLine) {
            const message = 'La carte est indisponible en mode hors-ligne'
            notAvailableOffline(message)
            return
        }

        navigation.navigate('Address', { onGoBack: refreshAddress, currentAddress: address })
    }}>
        <MyInput
            label="Emplacement"
            value={address.description}
            error={!!addressError}
            errorText={addressError}
            editable={false}
            multiline={true} />
    </TouchableOpacity>
)

export default withNavigation(AddressInput)
