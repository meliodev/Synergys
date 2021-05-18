
import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { List, Appbar } from 'react-native-paper';
import { faFilter, faTimes } from '@fortawesome/pro-light-svg-icons'
import { MenuProvider, Menu as PopupMenu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { withNavigation } from 'react-navigation'

import Picker from '../components/Picker'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import CustomIcon from '../components/CustomIcon'
import { SystemMessage } from 'react-native-gifted-chat';

import * as theme from '../core/theme';
import { constants } from '../core/constants';
import { refreshClient, refreshProject, refreshUser } from '../core/utils';

const { SlideInMenu } = renderers

const Filter = ({ main, opened, toggleFilter, setFilter, resetFilter, options, functions, menuStyle, isAppBar = false, ...props }) => {

    const onPressScreenPicker = (option) => {
        if (option.disabled) return

        toggleFilter()

        if (option.screen === 'ListClients')
            var callback = (client) => {
                client = refreshUser(client)
                return { client }
            }

        else if (option.screen === 'ListProjects')
            var callback = (project) => {
                project = refreshProject(project, false)
                return { project }
            }

        else if (option.screen === 'ListEmployees')
            var callback = (assignedTo) => {
                assignedTo = refreshUser(assignedTo)
                return { assignedTo }
            }

        const refresh = (filter) => {
           // toggleFilter()
            const obj = callback(filter)
            main.setState(obj)
        }

        const navParams = { isRoot: false, titleText: option.titleText, showButton: false, onGoBack: refresh }
        props.navigation.push(option.screen, navParams)
    }

    //RENDERERS
    const renderFilterIcon = () => {
        if (isAppBar) return <Appbar.Action icon={<CustomIcon icon={faFilter} color={theme.colors.appBarIcon} />} />
        else return <CustomIcon icon={faFilter} />
    }

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <CustomIcon icon={faFilter} color={theme.colors.white} size={15} />
                    <Text style={[theme.customFontMSregular.header, { color: '#fff', textAlign: 'center', marginLeft: 10 }]}>Filtrer par</Text>
                </View>
                <CustomIcon onPress={toggleFilter} icon={faTimes} color={theme.colors.white} />
            </View>
        )
    }

    const renderOptions = () => {
        return options.map((option) => renderOption(option))
    }

    const renderOption = (option) => {

        if (option.type === 'picker')
            return (
                <Picker
                    title={option.title}
                    value={option.value}
                    selectedValue={option.value}
                    onValueChange={(value) => setFilter(option.field, value)}
                    elements={option.values} />
            )

        else if (option.type === 'screen')
            return (
                <TouchableOpacity onPress={() => onPressScreenPicker(option)}>
                    <TextInput
                        label={option.title}
                        value={option.value}
                        editable={false} />
                </TouchableOpacity>
            )
    }

    const renderFooter = () => {
        return (
            <View style={styles.buttonsContainer}>
                <Button mode="outlined" onPress={resetFilter} style={{ width: constants.ScreenWidth * 0.45 }} outlinedColor={theme.colors.primary}>
                    Réinitialiser
                </Button>
                <Button mode="contained" onPress={toggleFilter} style={{ width: constants.ScreenWidth * 0.4, backgroundColor: theme.colors.primary }} >
                    Confirmer
                </Button>
            </View>
        )
    }

    return (
        <PopupMenu renderer={SlideInMenu} opened={opened} onBackdropPress={toggleFilter} style={menuStyle}>
            <MenuTrigger onPress={toggleFilter}>
                {renderFilterIcon()}
            </MenuTrigger>

            <MenuOptions optionsContainerStyle={{ height: constants.ScreenHeight * 0.935, elevation: 50 }}>

                {renderHeader()}

                <View style={{ paddingHorizontal: theme.padding, paddingVertical: 5 }}>
                    {renderOptions()}
                    {renderFooter()}
                </View>

            </MenuOptions>

        </PopupMenu>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
        paddingHorizontal: theme.padding,
        paddingVertical: 10
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    }
})

export default withNavigation(Filter)

