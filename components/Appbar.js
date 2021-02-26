import * as React from 'react';
import { TouchableOpacity } from 'react-native'
import { Appbar as appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigation } from 'react-navigation'
import { SolidIcons } from 'react-native-fontawesome'

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
    let backColor = close ? '#fff' : '#ffffff'

    //White background
    if (white) {
        return (
            <appbar.Header style={[{ backgroundColor: '#ffffff', elevation: 0 }, style]}>
                <CustomIcon icon={SolidIcons.arrowLeft} />
                {title && <appbar.Content title={titleText} titleStyle={theme.robotoRegular.h3} />}
            </appbar.Header>
        )
    }

    else return (
        <appbar.Header style={[{ backgroundColor: theme.colors.appBar, elevation: 0 }, style]}>
            {back && <CustomIcon icon={SolidIcons.arrowLeft} onPress={customBackHandler || navBack} headerLeft />}
            {menu && <CustomIcon icon={SolidIcons.bars} onPress={showMenu} headerLeft />}
            {searchBar}
            {title && <appbar.Content title={titleText} titleStyle={theme.robotoLight.h3} />}
            {refresh && <CustomIcon icon={SolidIcons.redo} onPress={handleRefresh} headerRight />}
            {attach && <CustomIcon icon={SolidIcons.paperclip} onPress={handleAttachement} headerRight />}
            {dots && <CustomIcon icon={SolidIcons.ellipsisVv} onPress={handleMore} headerRight />}
            {del && <CustomIcon icon={SolidIcons.trash} onPress={handleDelete} headerRight />}
            {loading && <Loading size='small' color='#fff' style={{ position: 'absolute', right: 15 }} />}
            {check && <CustomIcon icon={SolidIcons.check} onPress={handleSubmit} headerRight />}
            {send && <CustomIcon icon={SolidIcons.paperPlane} onPress={handleSend} headerRight />}
            {edit && <CustomIcon icon={SolidIcons.pen} onPress={handleEdit} headerRight />}
            {controller && <appbar.Action icon={controllerIcon} onPress={handleAction} />}
        </appbar.Header>
    )
}

export default withNavigation(Appbar)