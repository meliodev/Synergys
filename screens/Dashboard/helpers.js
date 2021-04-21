
import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import * as theme from '../../core/theme'
import { constants } from '../../core/constants'

import { Section, EmptyList } from '../../components'

const viewMoreLink = (navScreen, navParams) => {
    const customStyle = { textAlign: 'center', color: theme.colors.primary, marginTop: 15 }
    return (
        <Text
            style={[theme.customFontMSmedium.body, customStyle]}
            onPress={() => this.props.navigation.navigate(navScreen, navParams)}
        >
            Voir plus
        </Text>
    )
}

export const renderSection = (sectionTitle, sectionIcon, listItems, countItems, navScreen, navParams = {}, renderItem, emptyListHeader, emptyListDesc, isConnected) => {
    return (
        <View style={styles.notificationsContainer}>
            {/* <Section text={sectionTitle} icon={sectionIcon} /> */}
            <View style={styles.notificationsList}>
                {countItems > 0 ?
                    <FlatList
                        data={listItems}
                        keyExtractor={(item) => { return item.id }}
                        ListFooterComponent={viewMoreLink(navScreen, navParams)}
                        renderItem={renderItem}
                    />
                    :
                    <EmptyList
                        icon={sectionIcon}
                        header={emptyListHeader}
                        description={emptyListDesc}
                        offLine={!isConnected}
                    />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    notificationsContainer: {
        backgroundColor: theme.colors.white
    },
    notificationsList: {
        paddingVertical: 15,
    },
    tasksList: {
        paddingVertical: 15
    },
})