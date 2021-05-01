import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Linking } from "react-native";
import { Checkbox } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons'
import { faWaze } from '@fortawesome/free-brands-svg-icons'

import MyInput from './TextInput'
import CustomIcon from './CustomIcon'

import { TextInput } from 'react-native-paper'
import * as theme from "../core/theme";
import { notAvailableOffline } from '../core/exceptions';

const AddressInput = ({ offLine, onPress, rightIcon, address, onChangeText, clearAddress, addressError, label, editable = true, isEdit, ...props }) => {

    const [checked, setChecked] = React.useState(false)
    const isAddressMarked = address.marker && address.marker.latitude !== "" && address.marker.longitude !== ""

    useEffect(() => {
        if (address.description && !isAddressMarked) {
            setChecked(true)
        }            
    })

    const onPressRightIcon = () => {
        if (isAddressMarked) openWaze()
        else openMap()
    }

    const openMap = () => {
        if (!editable) return
        if (offLine) {
            const message = 'La carte est indisponible en mode hors-ligne'
            notAvailableOffline(message)
            return
        }
        onPress()
    }

    const openWaze = async () => {
        const { latitude, longitude } = address.marker
        const wazeURL = `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes&zoom=17`
        await Linking.openURL(wazeURL)
    }

    const renderAddressInput = (editable) => {
        return (
            <MyInput
                label={label || "Emplacement"}
                value={address.description}
                onChangeText={onChangeText}
                error={!!addressError}
                errorText={addressError}
                editable={editable}
                //multiline={true}
                right={!editable && <TextInput.Icon name={<CustomIcon icon={isAddressMarked ? faWaze : faMapMarkerAlt} color={isAddressMarked ? '#000' : theme.colors.inpuIcon} />} onPress={onPressRightIcon} />}
            />
        )
    }

    const onPressCheck = () => {
        setChecked(!checked)
        clearAddress()
    }

    const renderAddressComponent = () => {
        return (
            <View>
                {checked ?
                    renderAddressInput(true)
                    :
                    <TouchableOpacity onPress={openMap}>
                        {renderAddressInput(false)}
                    </TouchableOpacity>
                }
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10, marginTop: 10 }}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={onPressCheck}
                        color={theme.colors.primary}
                    />
                    <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>Saisir l'adresse manuellement</Text>
                </View>
            </View>
        )
    }

    return renderAddressComponent()
}

export default AddressInput