import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Image } from "react-native";
import Modal from 'react-native-modal'
import { Title } from 'react-native-paper'
import { faTimes, faUserAlt } from '@fortawesome/pro-light-svg-icons'

import Button from './Button'
import CustomIcon from './CustomIcon'

import * as theme from "../core/theme";
import { constants } from "../core/constants";


export const ModalForm = ({ elements, elementSize, handleSelectElement, autoValidation, isReview, model = 'Element1' }) => {
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

    const Element1 = ({ element, index, elementSize }) => {

        const elementStaticStyle = () => {
            return {
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                margin: elementSize * 0.03,
                width: elementSize,
                height: elementSize,
                elevation: 2,
                backgroundColor: theme.colors.white,
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

        const iconColor = element.selected ? theme.colors.primary : element.iconColor
        const textColor = element.selected ? theme.colors.primary : theme.colors.secondary

        return (
            <TouchableOpacity style={[elementStaticStyle(), elementDynamicStyle(element.selected)]} onPress={() => onPressElement(element, index)}>
                <View style={{ height: elementSize * 0.55, justifyContent: 'center' }}>
                    {element.icon && <CustomIcon icon={element.icon} size={elementSize * 0.3} color={iconColor} />}
                    {element.image && <Image style={{ width: elementSize * 0.2, height: elementSize * 0.2 / (1200 / 1722) }} source={element.image} />}
                </View>
                <View style={{ height: elementSize * 0.45, paddingHorizontal: 3 }}>
                    <Text style={[element.label.length > 15 ? theme.customFontMSregular.small : theme.customFontMSregular.body, { textAlign: 'center', color: textColor }]}>{element.label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const Element2 = ({ element, index, elementSize }) => {

        const elementStyle = {
            borderRadius: 30,
            // justifyContent: 'space-evenly',
            alignItems: 'center',
            marginBottom: elementSize * 0.1,
            width: elementSize,
            height: elementSize,
            elevation: 3,
            backgroundColor: theme.colors.white,
        }

        const { primary, secondary } = element.colors
        const textColor = primary
        const iconColor = primary
        const backgroundColor = theme.colors.white
        const iconSize = element.icon === faUserAlt ? elementSize * 0.18 : elementSize * 0.23

        return (
            <TouchableOpacity style={elementStyle} onPress={() => onPressElement(element, index)}>
                <View style={{ flex: 0.5, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <CustomIcon icon={element.icon} size={iconSize} color={iconColor} style={{ marginBottom: elementSize * 0.05 }} />
                </View>
                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingHorizontal: elementSize / 6 }}>
                    <Text style={[theme.customFontMSregular.body, { textAlign: 'center', color: theme.colors.secondary }]}>{element.label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const Rate = ({ element, index, length }) => {

        const elementStaticStyle = () => {
            return {
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.gray_medium,
                borderRadius: constants.ScreenWidth * 0.075,
                justifyContent: 'center',
                alignItems: 'center',
                margin: elementSize * 0.03,
                width: constants.ScreenWidth * 0.15,
                height: constants.ScreenWidth * 0.15,
                marginBottom: 7,
                backgroundColor: theme.colors.white,
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

        const iconColor = element.selected ? theme.colors.primary : element.iconColor
        const numberColor = element.selected ? theme.colors.primary : theme.colors.secondary
        const titleColor = element.selected ? theme.colors.primary : theme.colors.gray_dark

        return (
            <View style={{ width: constants.ScreenWidth * 0.17, height: 100, marginBottom: 25 }}>
                <TouchableOpacity style={[elementStaticStyle(), elementDynamicStyle(element.selected)]} onPress={() => onPressElement(element, index)}>
                    <Text style={[theme.customFontMSregular.header, { textAlign: 'center', color: numberColor }]}>{element.label}</Text>
                </TouchableOpacity>
                {index === 0 && <Text style={[theme.customFontMSregular.small, { textAlign: 'center', color: titleColor }]}>Pas du tout satisfait</Text>}
                {index === (length - 1) && <Text style={[theme.customFontMSregular.small, { textAlign: 'center', color: titleColor }]}>Très satisfait</Text>}
            </View>
        )
    }

    const containerStyle = { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingHorizontal: elementSize * 0.04 }

    if (isReview)
        return (
            <View style={[containerStyle, { justifyContent: 'space-around' }]}>
                {elements.map((element, index) => <Rate element={element} index={index} length={elements.length} />)}
            </View>
        )

    else return (
        <View style={[containerStyle, { justifyContent: elements.length > 1 ? 'space-between' : 'center' }]}>
            {elements.map((element, index) => {
                if (model === 'Element1')
                    return (
                        <Element1
                            element={element}
                            index={index}
                            elementSize={elementSize}
                        />
                    )
                else if (model === 'Element2')
                    return (
                        <Element2
                            element={element}
                            index={index}
                            elementSize={elementSize}
                        />
                    )
            })}
        </View>
    )

}


const ModalOptions = ({
    title, columns = 3, isVisible, toggleModal, handleCancel, handleConfirm,
    elements, handleSelectElement, autoValidation, isLoading, modalStyle, isReview, ...props }) => {

    let elementSize

    if (columns === 1)
        elementSize = constants.ScreenWidth * 0.5

    if (columns === 2)
        elementSize = constants.ScreenWidth * 0.45

    else if (columns >= 3)
        elementSize = constants.ScreenWidth * 0.3

    return (
        <Modal
            isVisible={isVisible}
            //  onSwipeComplete={!isLoading && toggleModal}
            swipeDirection={!isLoading ? "down" : ""}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onBackdropPress={!isLoading ? toggleModal : () => console.log('No action...')}
            style={[styles.modal, modalStyle]} >

            {isLoading ?
                <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={[theme.customFontMSregular.title, { marginBottom: 100 }]}>Traitement en cours...</Text>
                    <ActivityIndicator color={theme.colors.primary} size={50} />
                </View>
                :
                <View style={styles.container}>
                    <TouchableOpacity style={{ zIndex: 1, position: 'absolute', top: theme.padding, right: theme.padding, justifyContent: 'center', alignItems: 'center' }} onPress={() => console.log('hello')}>
                        <CustomIcon icon={faTimes} color={theme.colors.gray_dark} onPress={toggleModal} />
                    </TouchableOpacity>
                    <Title style={[theme.customFontMSregular.header, { marginBottom: 35, textAlign: 'center', paddingHorizontal: theme.padding * 3 }]}>{title}</Title>

                    <ModalForm elements={elements} elementSize={elementSize} handleSelectElement={handleSelectElement} autoValidation={autoValidation} isReview={isReview} />
                    {!autoValidation &&
                        <View style={styles.buttonsContainer}>
                            <Button mode="outlined" onPress={handleCancel} style={{ width: '40%' }}>Annuler</Button>
                            <Button mode="contained" onPress={handleConfirm} style={{ width: '45%' }}>Confirmer</Button>
                        </View>
                    }
                </View>
            }
        </Modal>
    )
}


const styles = StyleSheet.create({
    modal: {
        width: constants.ScreenWidth,
        marginTop: constants.ScreenHeight * 0.55,
        marginHorizontal: 0,
        marginBottom: 0,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    container: {
        flex: 1,
        paddingTop: theme.padding / 1.5,
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
