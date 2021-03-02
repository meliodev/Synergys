import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Appbar as appbar } from 'react-native-paper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars, faFilter, faRedo } from '@fortawesome/pro-light-svg-icons'

import Menu from './Menu'
import Filter from './Filter'

import { setFilter } from '../core/utils'

import * as theme from "../core/theme";
import { constants } from '../core/constants'
import { withNavigation } from 'react-navigation'

const PickerBar = ({
    options, functions, menuTrigger, style, navigation,
    main, filterOpened, type, status, priority, project, assignedTo,
    filter, refresh, onRefresh, ...props }) => {

    const types = [
        { label: 'Tous', value: '' },
        { label: 'Normale', value: 'Normale' },
        { label: 'Rendez-vous', value: 'Rendez-vous' },
        { label: 'Visite technique', value: 'Visite technique' },
        { label: 'Installation', value: 'Installation' },
        { label: 'Rattrapage', value: 'Rattrapage' },
        { label: 'Panne', value: 'Panne' },
        { label: 'Entretien', value: 'Entretien' },
    ]

    const priorities = [
        { label: 'Toutes', value: '' },
        { label: 'Urgente', value: 'urgente' },
        { label: 'Moyenne', value: 'moyenne' },
        { label: 'Faible', value: 'faible' },
    ]

    const statuses = [
        { label: 'Tous', value: '' },
        { label: 'En attente', value: 'En attente' },
        { label: 'En cours', value: 'En cours' },
        { label: 'Terminé', value: 'Terminé' },
        { label: 'Annulé', value: 'Annulé' },
    ]

    const showMenu = () => navigation.openDrawer()

    const AppBarIcon = ({ icon, onPress, style }) => {
        const faIcon = <FontAwesomeIcon icon={icon} size={24} />
        return <appbar.Action icon={faIcon} onPress={onPress} />
    }

    const renderLeftIcon = () => {
        return <AppBarIcon icon={faBars} onPress={showMenu} />
    }

    let menuTriggerRef

    return (
        <appbar.Header style={[{ backgroundColor: theme.colors.appBar, elevation: 0 }, style]}>
            {renderLeftIcon()}
            <Menu
                options={options}
                functions={functions}
                menuTrigger={menuTrigger} />

            {<appbar.Content title='' />}

            <Filter
                menuTriggerRef={ref => menuTriggerRef = ref}
                main={main}
                opened={filterOpened}
                toggleFilter={() => main.handleFilter(true)}
                setFilter={(field, value) => setFilter(main, field, value)}
                resetFilter={() => {
                    main.setState({ type: '', status: '', priority: '', assignedTo: { id: '', fullName: '' }, project: { id: '', name: '' } }, () => {
                        main.handleFilter(true)
                    })
                }}
                options={[
                    { id: 0, type: 'picker', title: "Type", values: types, value: type, field: 'type' },
                    { id: 1, type: 'picker', title: "État", values: statuses, value: status, field: 'status' },
                    { id: 2, type: 'picker', title: "Priorité", values: priorities, value: priority, field: 'priority' },
                    { id: 3, type: 'screen', title: "Projet", value: project.name, field: 'project', screen: 'ListProjects', titleText: 'Filtre par projet' },
                    { id: 4, type: 'screen', title: "Affecté à", value: assignedTo.fullName, field: 'assignedTo', screen: 'ListEmployees', titleText: 'Filtre par utilisateur' },
                ]}
                iconColor='#fff' />

            {refresh && <AppBarIcon icon={faRedo} onPress={onRefresh} />}
        </appbar.Header>
    )
}

export default withNavigation(PickerBar)