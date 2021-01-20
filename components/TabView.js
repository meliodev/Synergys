import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView as Tabview, TabBar, SceneMap } from 'react-native-tab-view';
import ListUsers from '../screens/Users/ListUsers'
import ListTeams from '../screens/Users/ListTeams'
import * as theme from '../core/theme'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
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
          indicatorStyle={{ backgroundColor: 'white' }}
          style={{ 
            backgroundColor: '#EBEBEB',
             paddingVertical: 10 }}
          renderLabel={({ route, focused, color }) => (
            <View 
            style={{
              // paddingVertical: 5,
              paddingVertical: 20,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: focused ? '#ffffff' : "#EBEBEB",
              borderRadius: 10
            }}
            >
            <FontAwesome5 
            name= {route.title === "UTILISATEURS" ? "users" : "object-group" } 
            style={{
              marginRight: '3%'
            }}
            />
<Text style={[theme.customFontMSsemibold.body, { color: focused ? '#1B2331' : '#8D8D8D' }]}>
              {route.title}
            </Text>
            </View>
            
          )}
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