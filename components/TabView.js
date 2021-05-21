import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView as Tabview, TabBar, SceneMap } from 'react-native-tab-view';
import ListUsers from '../screens/Users/ListUsers'
import ListTeams from '../screens/Users/ListTeams'
import * as theme from '../core/theme'
import { constants } from '../core/constants'
import CustomIcon from './CustomIcon';
import { faUser } from '@fortawesome/pro-light-svg-icons';

const initialLayout = { width: Dimensions.get('window').width }

export default class TabView extends React.Component {

  render() {
    const renderScene = ({ route }) => {
      switch (route.key) {
        case 'first':
          return this.props.Tab1;
        case 'second':
          return this.props.Tab2;
        default:
          return null;
      }
    }

    return (
      <Tabview
        renderScene={renderScene}
        initialLayout={initialLayout}
        renderTabBar={props => <TabBar {...props}
          indicatorStyle={{ backgroundColor: theme.colors.tabs }}
          style={{ backgroundColor: theme.colors.tabs, paddingVertical: 10, paddingHorizontal: 5 }}
          renderLabel={({ route, focused, color }) => {

            const isFirstRoute = route.key === 'first'
            const backgroundColor = focused ? theme.colors.white : theme.colors.tabs
            const textColor = focused ? theme.colors.secondary : theme.colors.gray_dark

            let titleLowerCase = route.title.toLowerCase()
            titleLowerCase = titleLowerCase.charAt(0).toUpperCase() + titleLowerCase.slice(1);

            const setIconSize = () => {
              if (isFirstRoute && this.props.icon1 === faUser)
                return 14
              if (!isFirstRoute && this.props.icon2 === faUser)
                return 14
              else return 20
            }

            return (
              <View style={{ flexDirection: 'row', padding: theme.padding, width: constants.ScreenWidth * 0.43, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor, borderRadius: 10 }}>
                <CustomIcon icon={isFirstRoute ? this.props.icon1 : this.props.icon2} size={setIconSize()} color={textColor} style={{ marginRight: 5 }} />
                <Text style={[theme.customFontMSregular.header, { color: textColor, marginLeft: 5, letterSpacing: 0.5 }]}>
                  {/* {route.title} */}
                  {titleLowerCase}
                </Text>
              </View>
            )

          }}
        />}
        {...this.props}
      />
    )
  }

}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});