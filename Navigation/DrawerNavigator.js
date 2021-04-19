import React, { Component } from 'react'
import { Text } from 'react-native'

import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import { AuthStack, AppStack } from './StackNavigators'
import AuthLoadingScreen from '../screens/Authentication/AuthLoadingScreen'

import { constants } from '../core/constants'
import DrawerMenu from './Drawer'

const AppDrawer = createDrawerNavigator({
  App: {
    screen: AppStack,
    path: ''
  }
}
  , {
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


const MyApp = createSwitchNavigator(
  {
    Starter: AuthLoadingScreen,
    App: AppDrawer,
    Auth: AuthStack,
  },
)


const previousGetActionForPathAndParams = MyApp.router.getActionForPathAndParams;

Object.assign(MyApp.router, {
  getActionForPathAndParams(path, params) {
    // const isAuthLink = path.startsWith('auth-link');

    // if (isAuthLink) {
    return NavigationActions.navigate({
      routeName: 'Starter',
      params: { ...params, path },
    });
    //  }

  //  return previousGetActionForPathAndParams(path, params);
  },
});

const App = createAppContainer(MyApp)

const prefix = /https:\/\/synergys.page.link\/|synergys:\/\//

const MainApp = () => <App uriPrefix={prefix} />

export default MainApp
