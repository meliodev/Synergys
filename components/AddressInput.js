import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Linking } from "react-native";
import { Checkbox } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { faEye, faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons'
import { faWaze } from '@fortawesome/free-brands-svg-icons'

import MyInput from './TextInput'
import CustomIcon from './CustomIcon'
import ModalOptions from './ModalOptions'

import { TextInput } from 'react-native-paper'
import * as theme from "../core/theme";
import { notAvailableOffline } from '../core/exceptions';
import { constants } from "../core/constants";

const AddressInput = ({ offLine, onPress, rightIcon, address, onChangeText, clearAddress, addressError, label, editable = true, isEdit, ...props }) => {

    const [checked, setChecked] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false)
    const [elements, setElements] = React.useState([
        { label: "Google Maps", value: "googleMaps", image: require("../assets/icons/googleMaps.png"), selected: false },
        { label: "Waze", value: "waze", icon: faWaze, iconColor: "#14c6f7", selected: false },
    ])
    const isAddressMarked = address.marker && address.marker.latitude !== "" && address.marker.longitude !== ""

    useEffect(() => {
        if (address.description && !isAddressMarked) {
            setChecked(true)
        }
    })

    const onPressRightIcon = () => {
        if (isAddressMarked) {
            //Display 2 options (waze/google map) pop up
            setShowModal(true)
        }
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

    const openMapURL = async (mapTool) => {
        const { latitude, longitude } = address.marker
        const wazeURL = `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes&zoom=17`
        const googleMapURL = `https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`
        if (mapTool === "waze")
            var url = wazeURL
        else if (mapTool === 'googleMaps')
            var url = googleMapURL
        await Linking.openURL(url)
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
                right={!editable &&
                    <TextInput.Icon
                        name={
                            <CustomIcon
                                icon={isAddressMarked ? faEye : faMapMarkerAlt}
                                color={theme.colors.inpuIcon}
                            />
                        }
                        onPress={onPressRightIcon}
                    />
                }
            />
        )
    }

    const onPressCheck = () => {
        if (!editable) return
        setChecked(!checked)
        clearAddress()
    }

    const handleSelectMapTool = (elements, index) => {
        let mapTool = ""
        if (index === 0)
            mapTool = "googleMaps"
        else if (index === 1)
            mapTool = "waze"
        openMapURL(mapTool)
    }

    const toggleModal = () => {
        setShowModal(!showModal)
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
                    <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]} onPress={onPressCheck}>
                        Saisir l'adresse manuellement
                    </Text>
                </View>

                <ModalOptions
                    title={"Ouvrir l'adresse avec"}
                    columns={2}
                    isLoading={false}
                    modalStyle={{ marginTop: constants.ScreenHeight * 0.5 }}
                    isVisible={showModal}
                    toggleModal={toggleModal}
                    elements={elements}
                    autoValidation={true}
                    handleSelectElement={(elements, index) => handleSelectMapTool(elements, index)}
                />

            </View>
        )
    }

    return renderAddressComponent()
}

export default AddressInput