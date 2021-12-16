
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import { Checkbox } from 'react-native-paper'

import { faPen, faTimes } from '@fortawesome/pro-light-svg-icons'

import { constants } from '../core/constants'
import * as theme from '../core/theme'

import Button from './Button'
import CustomIcon from './CustomIcon'
import SquarePlus from './SquarePlus'

export default class ModalCheckBoxes extends Component {
    constructor(props) {
        super(props)
        this.toggleModal = this.toggleModal.bind(this)
        this.onPressItem = this.onPressItem.bind(this)

        this.state = {
            isModalVisible: false,
        }
    }

    renderItem(items, item, key) {

        const onPressItem = () => {
            items[key].selected = !items[key].selected
            this.props.updateItems(items)
        }

        return (
            <View style={modalStyles.item}>
                <Checkbox
                    status={items[key].selected ? 'checked' : 'unchecked'}
                    color={theme.colors.primary}
                    onPress={onPressItem}
                />
                <Text style={[theme.customFontMSregular.body, { marginLeft: 15, flex: 1 }]} onPress={onPressItem}>
                    {item.label}
                </Text>
            </View>
        )
    }

    toggleModal() {
        const { isModalVisible } = this.state
        this.setState({ isModalVisible: !isModalVisible })
    }

    renderModal() {
        let { isModalVisible } = this.state
        let { items } = this.props
        const header = (text) => <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{text}</Text>

        return (
            <Modal
                isVisible={isModalVisible}
                style={modalStyles.modal}
                onBackdropPress={this.toggleModal}>
                <View style={modalStyles.container}>
                    <TouchableOpacity style={modalStyles.closeIcon}>
                        <CustomIcon
                            icon={faTimes}
                            color={theme.colors.gray_dark}
                            size={21}
                            onPress={this.toggleModal}
                        />
                    </TouchableOpacity>

                    <View style={{ paddingBottom: 15 }}>
                        {header("Types de travaux")}
                        <FlatList
                            data={items}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => this.renderItem(items, item, index)}
                        />
                    </View>

                    <View>
                        <Button
                            mode="contained"
                            onPress={() => this.handleConfirmModal(items)}
                            containerStyle={{ alignSelf: "flex-end" }}>
                            Confirmer
                        </Button>
                    </View>
                </View>
            </Modal >
        )
    }

    onPressItem(item) {
        this.props.onPressItem(item)
    }

    renderItems() {
        const { items, itemsFetched } = this.props
        if (!itemsFetched) return null
        const textStyle = theme.customFontMSregular.caption
        const selectedItems = items.filter((workType) => workType.selected === true)
        const anyItemSelected = selectedItems.length === 0

        if (anyItemSelected)
            return (
                <View style={{ marginTop: 15 }}>
                    <Text style={[textStyle, { marginBottom: 15 }]}>Types de travaux</Text>
                    <SquarePlus onPress={this.toggleModal} />
                </View>
            )

        else return (
            <View style={styles.itemsListContainer}>
                <TouchableOpacity style={styles.itemsListHeader} onPress={this.toggleModal}>
                    <Text style={[textStyle]}>Types de travaux</Text>
                    <CustomIcon icon={faPen} color={theme.colors.gray_dark} size={21} />
                </TouchableOpacity>
                {selectedItems.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index.toString()}
                            onPress={() => this.onPressItem(item)}
                            style={styles.itemsListRow}>
                            <Text style={[textStyle, { color: theme.colors.gray_dark, marginBottom: index === selectedItems.length - 1 ? 0 : 5 }]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }


    handleConfirmModal(items) {
        this.toggleModal()
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderItems()}
                {this.renderModal()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemsListContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
        borderRadius: 8,
        marginTop: 15,
    },
    itemsListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginRight: theme.padding
    }
})

const modalStyles = StyleSheet.create({
    modal: {
        flex: 1,
        maxHeight: constants.ScreenHeight,
        margin: 15,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        padding: theme.padding
    },
    closeIcon: {
        zIndex: 1,
        position: 'absolute',
        top: theme.padding,
        right: theme.padding,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemsTextArea: {
        alignSelf: 'center',
        textAlignVertical: 'top',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingTop: 15,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.gray_light
    },
    confirmButton: {
        alignSelf: 'center',
        backgroundColor: theme.colors.primary
    }
})
