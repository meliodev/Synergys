
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

const { SlideInMenu } = renderers

const Filter = ({ main, opened, toggleFilter, setFilter, resetFilter, options, functions, menuStyle, isAppBar = false, ...props }) => {

    //Screen filters: refresh selected value
    const refreshClient = (isPro, id, nom, prenom) => {
        toggleFilter()
        let fullName = isPro ? nom : `${prenom} ${nom}`
        let client = { id, fullName }
        main.setState({ client })
    }

    const refreshProject = (project) => {
        toggleFilter()
        main.setState({ project })
    }

    const refreshEmployee = (isPro, id, prenom, nom) => {
        toggleFilter()
        const assignedTo = { id, fullName: `${prenom} ${nom}`, error: '' }
        main.setState({ assignedTo })
    }

    const renderFilterIcon = () => {
        if (isAppBar) return <Appbar.Action icon={<CustomIcon icon={faFilter} color={theme.colors.appBarIcon} />} />
        else return <CustomIcon icon={faFilter} />
    }

    return (
        <PopupMenu renderer={SlideInMenu} opened={opened} onBackdropPress={toggleFilter} style={menuStyle}>
            <MenuTrigger onPress={toggleFilter}>
                {renderFilterIcon()}
            </MenuTrigger>

            <MenuOptions optionsContainerStyle={{ height: constants.ScreenHeight * 0.935, elevation: 50 }}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <CustomIcon icon={faFilter} color={theme.colors.white} size={15} />
                        <Text style={[theme.customFontMSregular.header, { color: '#fff', textAlign: 'center', marginLeft: 10 }]}>Filtrer par</Text>
                    </View>
                    <CustomIcon onPress={toggleFilter} icon={faTimes} color={theme.colors.white} />
                </View>


                <View style={{ paddingHorizontal: theme.padding, paddingVertical: 5, }}>
                    {options.map((option) => {
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
                                <TouchableOpacity onPress={() => {
                                    if (option.disabled) return

                                    toggleFilter()

                                    let refresh
                                    let userType = ''
                                    if (option.screen === 'ListClients') {
                                        refresh = refreshClient
                                        userType = 'client'
                                    }

                                    else if (option.screen === 'ListProjects')
                                        refresh = refreshProject

                                    else if (option.screen === 'ListEmployees') {
                                        refresh = refreshEmployee
                                        userType = 'utilisateur'
                                    }

                                    props.navigation.navigate(option.screen, { onGoBack: refresh, userType: userType, titleText: option.titleText, showButton: false, isRoot: false })
                                }}>
                                    <TextInput
                                        label={option.title}
                                        value={option.value}
                                        editable={false} />
                                </TouchableOpacity>
                            )
                    })
                    }

                    <View style={styles.buttonContainer}>
                        <Button mode="outlined" onPress={resetFilter} style={{ width: constants.ScreenWidth * 0.45 }} outlinedColor={theme.colors.primary}>
                            Réinitialiser
                        </Button>
                        <Button mode="contained" onPress={toggleFilter} style={{ width: constants.ScreenWidth * 0.4, backgroundColor: theme.colors.primary }} >
                            Confirmer
                        </Button>
                    </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    }
})

export default withNavigation(Filter)




// shouldComponentUpdate(nextProps, nextState) {
//     console.log('shouldComponentUpdate..')
//     console.log(this.state.status)
//     console.log(nextState.status)

//     const { items, filteredItems, type, status, priority, assignedTo, project, filterOpened } = this.state
//     const changeItems = items !== nextState.items
//     const changeFilteredItems = items !== nextState.filteredItems
//     const changeType = type !== nextState.type
//     const changeStatus = status !== nextState.status
//     const changePriority = priority !== nextState.priority
//     const changeAssignedTo = assignedTo !== nextState.assignedTo
//     const changeProject = project !== nextState.project
//     const changeFilterOpened = filterOpened !== nextState.filterOpened

//     if (changeItems) console.log('Items changed')
//     if (changeFilteredItems) console.log('Filtered Items changed')
//     if (changeType) console.log('Type changed')
//     if (changeStatus) console.log('Status changed')
//     if (changePriority) console.log('Priority changed')
//     if (changeAssignedTo) console.log('AssignedTo changed')
//     if (changeProject) console.log('Project changed')
//     if (changeFilterOpened) console.log('FilterOpened changed')

//     const predicate0 = (changeItems)
//     const predicate1 = (changeFilteredItems || changeFilterOpened)
//     const predicate2 = (changeType || changeStatus || changePriority || changeAssignedTo || changeProject)

//     const predicate = (changeItems || changeType || changeStatus || changePriority || changeAssignedTo || changeProject || changeFilterOpened)
//     if (predicate) {
//         // if(!changeFilterOpened)
//         let filteredItems = []
//         const fields = [{ label: 'type', value: type }, { label: 'status', value: status }, { label: 'priority', value: priority }, { label: 'project.id', value: project.id }, { label: 'assignedTo.id', value: assignedTo.id }]
//         filteredItems = handleFilter(items, this.state.filteredItems, fields, KEYS_TO_FILTERS)
//         this.setState({ filteredItems }, () => console.log('filtered items', this.state.filteredItems))
//         return true
//     }

//     if(filteredItems !== nextState.filteredItems) return true
// }

// applyFilter() {
//     toggleFilter(this)

//     const { items, type, status, priority, assignedTo, project, filterOpened } = this.state
//     let filteredItems = []
//     const fields = [{ label: 'type', value: type }, { label: 'status', value: status }, { label: 'priority', value: priority }, { label: 'project.id', value: project.id }, { label: 'assignedTo.id', value: assignedTo.id }]
//     filteredItems = handleFilter(items, filteredItems, fields, KEYS_TO_FILTERS)
//     this.setState({ filteredItems })
// }