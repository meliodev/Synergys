import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView as Tabview, TabBar, SceneMap } from 'react-native-tab-view';
import ListUsers from '../screens/Users/ListUsers'
import ListTeams from '../screens/Users/ListTeams'
import * as theme from '../core/theme'
import { constants } from '../core/constants'
import CustomIcon from './CustomIcon';

const initialLayout = { width: Dimensions.get('window').width }

export default class TabView extends React.Component {

  render() {
    const renderScene = ({ route, active }) => {
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
          indicatorStyle={{ backgroundColor: theme.colors.gray_light }}
          style={{ backgroundColor: theme.colors.gray_light, paddingVertical: constants.ScreenHeight * 0.025 }}
          renderLabel={({ route, focused, color }) => {

            const backgroundColor = active ? theme.colors.gray_light : theme.colors.white
            const textColor = active ? theme.colors.gray_dark : theme.colors.secondary

            return (
              <View style={{ flexDirection: 'row', padding: theme.padding, width: constants.ScreenWidth * 0.45, justifyContent: 'center', backgroundColor: backgroundColor, borderRadius: 10 }}>
                <CustomIcon icon={route.key === 'first' ? this.props.icon1 : this.props.icon2} style={{ color: textColor }} />
                <Text style={[theme.robotoRegular.body, { color: textColor, marginLeft: 7 }]}>
                  {route.title}
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