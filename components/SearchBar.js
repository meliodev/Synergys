import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Appbar as appbar } from 'react-native-paper'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
// import  from 'react-native-vector-icons/AntDesign'
import { Searchbar } from "react-native-paper";
import * as theme from "../core/theme";
import { constants } from '../core/constants'
import { withNavigation } from 'react-navigation'

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
            return (
                <TouchableOpacity onPress={handleSearch} style={{ marginHorizontal: 10 }} >
                    <MaterialCommunityIcons name="arrow-left" size={24} 
                    // color='#fff' 
                    />
                </TouchableOpacity>
            )

        else {
            if (close)
                return (
                    <TouchableOpacity onPress={navBack} style={{ marginHorizontal: 10 }} >
                        <MaterialCommunityIcons name="close" size={24} 
                        // color='#fff'
                         />
                    </TouchableOpacity>
                )
            else return (
                <TouchableOpacity onPress={showMenu} style={{ marginHorizontal: 10 }} >
                    <MaterialCommunityIcons name="menu" size={24} 
                    // color='#fff' 
                    />
                </TouchableOpacity>
            )
        }
    }

    return (
        <appbar.Header style={[{
             backgroundColor: '#F8F8F9',
              elevation: 0 }, style]}>
            {renderLeftIcon()}
            {title && <appbar.Content title={titleText} titleStyle={theme.customFontMSmedium.title} />}
            {check && !showBar && <appbar.Action icon="check" onPress={handleSubmit} />}
            {showBar &&
                <Searchbar
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.gray100}
                    onChangeText={(searchInput) => searchUpdated(searchInput)}
                    value={searchInput}
                    inputStyle={{ color: 'black' }}
                    style={{ backgroundColor: '#F8F8F9', elevation: 0, }}
                    theme={{ colors: { placeholder: '#fff', text: '#fff' } }}
                    icon={() => null}
                    autoFocus
                    selectionColor='#fff'
                />
            }
            {!showBar &&
            <View
            style={{
                flexDirection: 'row',
                width: '20%',
                justifyContent: 'space-around'
            }}
            >
                {/* <appbar.Action icon="magnify" onPress={handleSearch} 
                // style={[
                // //     { 
                // //     position: 'absolute', right: 0 
                // // }, 
                // magnifyStyle]} 
                /> */}
                <AntDesign name="search1"  size={20} onPress={handleSearch} />
                <Ionicons name="ios-notifications-outline" size={23}  />
                <Ionicons name="md-refresh" size={23}  />
            
            </View>
                // <appbar.Action icon="magnify" onPress={handleSearch} style={[{ position: 'absolute', right: 0 }, magnifyStyle]} />
            }

        </appbar.Header>
    )
}

export default withNavigation(SearchBar)