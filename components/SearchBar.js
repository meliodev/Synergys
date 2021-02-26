import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Appbar as appbar } from 'react-native-paper'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Searchbar } from "react-native-paper";
import * as theme from "../core/theme";
import { constants } from '../core/constants'
import { withNavigation } from 'react-navigation'

import { SolidIcons } from 'react-native-fontawesome'
import CustomIcon from "./CustomIcon"

const SearchBar = ({
    close,
    main, placeholder,
    showBar,
    title, titleText,
    searchInput = '', searchUpdated, handleSearch, magnifyStyle,
    check, handleSubmit,
    style, navigation, ...props }) => {

    const showMenu = () => navigation.openDrawer()
    const navBack = () => navigation.pop()

    const renderLeftIcon = () => {
        if (showBar)
            return <CustomIcon icon={SolidIcons.arrowLeft} headerLeft onPress={handleSearch} />

        else {
            if (close) return <CustomIcon icon={SolidIcons.cross} headerLeft />
            else return <CustomIcon icon={SolidIcons.bars} headerLeft onPress={showMenu} />
        }
    }

    return (
        <appbar.Header style={[{ backgroundColor: theme.colors.appBar, elevation: 0 }, style]}>

            {renderLeftIcon()}

            {title && <appbar.Content title={titleText} titleStyle={theme.robotoLight.h3} />}
            {check && !showBar && <appbar.Action icon="check" onPress={handleSubmit} />}

            {showBar &&
                <Searchbar
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.gray100}
                    onChangeText={(searchInput) => searchUpdated(searchInput)}
                    value={searchInput}
                    inputStyle={{ color: '#fff' }}
                    style={{ backgroundColor: theme.colors.primary, elevation: 0, }}
                    theme={{ colors: { placeholder: '#fff', text: '#fff' } }}
                    icon={() => null}
                    autoFocus
                    selectionColor='#fff'
                />
            }

            {!showBar &&
                <CustomIcon icon={SolidIcons.search} onPress={handleSearch} headerRight />
            }

        </appbar.Header>
    )
}

export default withNavigation(SearchBar)