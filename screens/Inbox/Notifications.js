import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import * as theme from '../../core/theme'
import { constants } from '../../core/constants'

import NotificationItem from '../../components/NotificationItem'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Notifications extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [
                { id: 3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name: "March SoulLaComa", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "https://via.placeholder.com/100x100/FFB6C1/000000" },
                { id: 2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name: "John DoeLink", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "https://via.placeholder.com/100x100/20B2AA/000000" },
                { id: 4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name: "Finn DoRemiFaso", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "" },
                { id: 5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name: "Maria More More", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "" },
                { id: 1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name: "Frank Odalthh", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "https://via.placeholder.com/100x100/7B68EE/000000" },
                { id: 6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name: "Clark June Boom!", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "" },
                { id: 7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name: "The googler", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment: "" },
            ]
        }
    }

    renderNotification(item) {
        const notification = item.item;

        return <NotificationItem notification={notification} />
    }

    render() {
        return (
            null
            // <FlatList
            //     style={styles.root}
            //     data={this.state.data}
            //     extraData={this.state}
            //     keyExtractor={(item) => {return item.id}}
            //     renderItem={(item) => this.renderNotification(item)}
            // />
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "#FFFFFF"
    }
})
