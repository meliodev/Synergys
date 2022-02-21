import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Appbar as appbar } from 'react-native-paper'

import { faBars, faTimes, faSearch, faArrowLeft, faCheck } from '@fortawesome/pro-light-svg-icons'
import { Searchbar } from "react-native-paper";
import * as theme from "../core/theme";
import { constants } from '../core/constants'
import { withNavigation } from 'react-navigation'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFilter } from '@fortawesome/pro-light-svg-icons'

const SearchBar = ({
    menu = true, close,
    main, placeholder,
    showBar,
    title, titleText,
    searchInput = '', searchUpdated, handleSearch, magnifyStyle,
    check, handleSubmit,
    filterComponent,
    style, navigation, ...props }) => {

    const showMenu = () => navigation.openDrawer()
    const navBack = () => navigation.pop()

    const AppBarIcon = ({ icon, onPress, style }) => {
        const faIcon = <FontAwesomeIcon icon={icon} size={24} />
        return <appbar.Action icon={() => <FontAwesomeIcon icon={icon} size={24} />} onPress={onPress} />
    }

    const renderLeftIcon = () => {
        const icon = showBar ? faArrowLeft : menu ? faBars : faTimes
        const handleAction = showBar ? handleSearch : menu ? showMenu : navBack
        return <AppBarIcon icon={icon} onPress={handleAction} />
    }

    return (
        <appbar.Header style={[{ backgroundColor: theme.colors.appBar, elevation: 0 }, style]}>

            {renderLeftIcon()}
            {title && <appbar.Content title={titleText} titleStyle={[theme.customFontMSregular.header, { marginLeft: '-5%', letterSpacing: 1 }]} />}
            {showBar &&
                <Searchbar
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.gray_dark}
                    onChangeText={(searchInput) => searchUpdated(searchInput)}
                    value={searchInput}
                    inputStyle={[theme.customFontMSregular.h3, { color: theme.colors.secondary }]}
                    style={{ backgroundColor: theme.colors.appBar, elevation: 0 }}
                    theme={{ colors: { placeholder: '#fff', text: '#fff' } }}
                    icon={() => null}
                   // autoFocus
                    autoFocus={false}
                    selectionColor={theme.colors.gray_dark}
                />
            }

            {!showBar && <AppBarIcon icon={faSearch} onPress={handleSearch} />}
            {!showBar && filterComponent}
            {check && !showBar && <AppBarIcon icon={faCheck} onPress={handleSubmit} />}

        </appbar.Header>
    )
}

export default withNavigation(SearchBar)