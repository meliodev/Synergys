import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Modal from 'react-native-modal'
import { Title } from 'react-native-paper'

import Button from './Button'
import CustomIcon from './CustomIcon'

import * as theme from "../core/theme";
import { constants } from "../core/constants";

const ModalForm = ({ elements, elementSize, handleSelectElement, autoValidation }) => {

    const elementStaticStyle = () => {
        return {
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            margin: elementSize * 0.03,
            width: elementSize,
            height: elementSize,
            elevation: 2,
            backgroundColor: theme.colors.white
        }
    }

    const elementDynamicStyle = (isSelected) => {
        if (isSelected)
            return {
                elevation: 0,
                borderWidth: 1,
                borderColor: theme.colors.primary
            }
        else return {}
    }

    const selectElement = (index) => {
        //Unselect all types
        elements.forEach((element, key) => elements[key].selected = false)

        //Select chosen element
        elements[index].selected = true

        //Handle update on parent component
        handleSelectElement(elements, index) //all elements (selected element has "selected" = true)
    }

    const onPressElement = (element, index) => {
        if (autoValidation) {
            handleSelectElement(element, index) //only the selected element
        }

        else selectElement(index)
    }

    const Element = ({ element, index }) => {
        const color = element.selected ? theme.colors.primary : theme.colors.black

        return (
            <TouchableOpacity style={[elementStaticStyle(), elementDynamicStyle(element.selected)]} onPress={() => onPressElement(element, index)}>
                <View style={{ height: elementSize * 0.55, justifyContent: 'center' }}>
                    <CustomIcon icon={element.icon} size={elementSize * 0.3} color={color} />
                </View>
                <View style={{ height: elementSize * 0.45 }}>
                    <Text style={[theme.customFontMSmedium.body, { textAlign: 'center', color }]}>{element.label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const containerStyle = { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: elementSize * 0.04 }

    return (
        <View style={[containerStyle]}>
            {elements.map((element, index) => {
                return (<Element element={element} index={index} />)
            })}
        </View>
    )
}


const ModalOptions = ({
    title, columns = 3, isVisible, toggleModal, handleCancel, handleConfirm,
    elements, handleSelectElement, autoValidation, ...props }) => {

    let elementSize

    if (columns === 2)
        elementSize = constants.ScreenWidth * 0.45

    else if (columns === 3)
        elementSize = constants.ScreenWidth * 0.3

    return (
        <Modal
            isVisible={isVisible}
            onSwipeComplete={toggleModal}
            swipeDirection="right"
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onBackdropPress={toggleModal}
            style={styles.modal} >

            <View style={styles.container}>
                <Title style={[theme.customFontMSsemibold.header, { marginBottom: 30, textAlign: 'center' }]}>{title}</Title>
                <ModalForm elements={elements} elementSize={elementSize} handleSelectElement={handleSelectElement} autoValidation={autoValidation} />
                {!autoValidation &&
                    <View style={styles.buttonsContainer}>
                        <Button mode="outlined" onPress={handleCancel} style={{ width: '40%' }}>Annuler</Button>
                        <Button mode="contained" onPress={handleConfirm} style={{ width: '45%' }}>Confirmer</Button>
                    </View>
                }
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modal: {
        width: constants.ScreenWidth,
        marginTop: constants.ScreenHeight * 0.3,
        marginHorizontal: 0,
        marginBottom: 0,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    container: {
        flex: 1,
        paddingTop: constants.ScreenHeight * 0.02,
        backgroundColor: '#fff',
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    column: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default memo(ModalOptions)
