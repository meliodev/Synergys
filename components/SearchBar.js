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
    close,
    main, placeholder,
    showBar,
    title, titleText,
    searchInput = '', searchUpdated, handleSearch, magnifyStyle,
    check, handleSubmit,
    style, navigation, ...props }) => {

    const showMenu = () => navigation.openDrawer()
    const navBack = () => navigation.pop()

    const AppBarIcon = ({ icon, onPress, style }) => {
        const faIcon = <FontAwesomeIcon icon={icon} size={24} />
        return <appbar.Action icon={faIcon} onPress={onPress} />
    }

    const renderLeftIcon = () => {
        const icon = showBar ? faArrowLeft : faBars
        const handleAction = showBar ? handleSearch : showMenu
        return <AppBarIcon icon={icon} onPress={handleAction} />
    }

    return (
        <appbar.Header style={[{ backgroundColor: theme.colors.appBar, elevation: 0 }, style]}>

            {renderLeftIcon()}

            {title && <appbar.Content title={titleText} titleStyle={[theme.robotoLight.h3, { marginLeft: '-5%' }]} />}

            {showBar &&
                <Searchbar
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.gray_dark}
                    onChangeText={(searchInput) => searchUpdated(searchInput)}
                    value={searchInput}
                    inputStyle={[theme.robotoRegular.h3, { color: theme.colors.secondary }]}
                    style={{ backgroundColor: theme.colors.appBar, elevation: 0, }}
                    theme={{ colors: { placeholder: '#fff', text: '#fff' }, }}
                    icon={() => null}
                    autoFocus
                    selectionColor={theme.colors.secondary}
                />
            }

            {!showBar && <AppBarIcon icon={faSearch} onPress={handleSearch} />} 

        </appbar.Header>
    )
}

export default withNavigation(SearchBar)