import * as React from 'react';
import { TouchableOpacity } from 'react-native'
import { Appbar as appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigation } from 'react-navigation'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faBars, faRedo, faPaperclip, faEllipsisVv, faTrash, faCheck, faPaperPlane, faPen } from '@fortawesome/pro-light-svg-icons'

import CustomIcon from "./CustomIcon"
import Loading from './Loading'

import * as theme from '../core/theme'

const Appbar = ({
    white,
    back, customBackHandler, blackBack, close, title, search, dots, check, send, attach, menu, edit, del, refresh, loading, controller,
    titleText, controllerIcon,
    searchBar,
    handleSearch, handleSubmit, handleSend, handleAttachement, handleMore, handleEdit, handleAction, handleDelete, handleRefresh,
    navigation, goBack, style, ...props }) => {

    let navBack = () => navigation.goBack()
    const showMenu = () => navigation.openDrawer()

    const AppBarIcon = ({ icon, onPress, style }) => {
        const faIcon = <FontAwesomeIcon icon={icon} size={24} />
        return <appbar.Action icon={faIcon} onPress={onPress} />
    }

    //White background
    if (white) {
        return (
            <appbar.Header style={[{ backgroundColor: '#ffffff', elevation: 0 }, style]}>
                <AppBarIcon icon={faArrowLeft} onPress={customBackHandler || navBack} />
                {title && <appbar.Content title={titleText} titleStyle={theme.robotoRegular.h3} />}
            </appbar.Header>
        )
    }

    else return (
        <appbar.Header style={[{ backgroundColor: theme.colors.appBar, elevation: 0 }, style]}>
            {back && <AppBarIcon icon={faArrowLeft} onPress={customBackHandler || navBack} />}
            {menu && <AppBarIcon icon={faBars} onPress={showMenu} />}
            {searchBar}
            {title && <appbar.Content title={titleText} titleStyle={theme.robotoLight.h3} />}
            {refresh && <AppBarIcon icon={faRedo} onPress={handleRefresh} />}
            {attach && <AppBarIcon icon={faPaperclip} onPress={handleAttachement} />}
            {dots && <AppBarIcon icon={faEllipsisVv} onPress={handleMore} />}
            {del && <AppBarIcon icon={faTrash} onPress={handleDelete} />}
            {loading && <Loading size='small' color='#fff' style={{ position: 'absolute', right: 15 }} />}
            {check && <AppBarIcon icon={faCheck} onPress={handleSubmit} />}
            {send && <AppBarIcon icon={faPaperPlane} onPress={handleSend} />}
            {edit && <AppBarIcon icon={faPen} onPress={handleEdit} />}
            {controller && <appbar.Action icon={controllerIcon} onPress={handleAction} />}
        </appbar.Header>
    )
}

export default withNavigation(Appbar)