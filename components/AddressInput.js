import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { withNavigation } from 'react-navigation'
import { faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons'

import MyInput from './TextInput'
import CustomIcon from './CustomIcon'

import { TextInput } from 'react-native-paper'
import * as theme from "../core/theme";
import { notAvailableOffline } from '../core/exceptions';

const AddressInput = ({ offLine, onPress, rightIcon, address, addressError, label, editable, ...props }) => {

    const onPressHandler = () => {
        if (!editable) return
        if (offLine) {
            const message = 'La carte est indisponible en mode hors-ligne'
            notAvailableOffline(message)
            return
        }
        onPress()
    }

    if (address.description !== '')
        return (
            <TouchableOpacity onPress={onPressHandler}>
                <MyInput
                    label={label || "Emplacement"}
                    value={address.description}
                    error={!!addressError}
                    errorText={addressError}
                    editable={false}
                    multiline={true}
                    right={<TextInput.Icon name={<CustomIcon icon={faMapMarkerAlt} color={theme.colors.inpuIcon} />} onPress={onPressHandler} style={{ marginTop: 30 }} />}
                />
            </TouchableOpacity>
        )
    else return null
}

export default withNavigation(AddressInput)
