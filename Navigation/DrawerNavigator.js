import React, { Component } from 'react'
import firebase from 'react-native-firebase'

import { createAppContainer, NavigationEvents } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { AuthNavigator, AdminStackNavigator } from './StackNavigators'

import { constants } from '../core/constants'
import DrawerMenu from './Drawer'

const DrawerNavigator = createDrawerNavigator({ 
  Authentication: AuthNavigator,
  AdminStack: AdminStackNavigator,
}
  , {
    initialRouteName: 'Authentication',
    contentComponent: props => <DrawerMenu role={props} {...props} />,
    drawerLockMode: "locked-closed",
    drawerWidth: constants.ScreenWidth * 0.83,
    contentOptions: {
      activeTintColor: 'pink'
    },
    layout: {
      orientation: ["portrait"],
    },
  })

export default createAppContainer(DrawerNavigator)
