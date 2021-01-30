import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView as Tabview, TabBar, SceneMap } from 'react-native-tab-view';
import ListUsers from '../screens/Users/ListUsers'
import ListTeams from '../screens/Users/ListTeams'
import * as theme from '../core/theme'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CustomIcons from './CustomIcons';
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
              paddingVertical: 20,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: focused ? '#ffffff' : "#EBEBEB",
              borderRadius: 10
            }}
            >
              <CustomIcons 
             name= {route.title === "UTILISATEURS" ? "mask-group-36" : route.title === "ÉQUIPES" ? "mask-group-35" : 
             route.title === "Planning" ? 'mask-group-6' : route.title === "Mon Agenda" ? 'mask-group-5' : 'users'} 
             style={{
              marginRight: '5%'
            }}
            color={focused ? '#1B2331' : '#8D8D8D'}
            size={20}
              />
            {/* <FontAwesome5 
            name= {route.title === "UTILISATEURS" ? "users" : route.title === "ÉQUIPES" ? "object-group" : 
            route.title === "Mon Agenda" ? 'users' : route.title === "Mon Agenda" ? 'users' : 'users'} 
            style={{
              marginRight: '5%'
            }}
           
            /> */}
<Text 
style={
  [
    theme.customFontMSsemibold.body, 
  { color: focused ? '#1B2331' : '#8D8D8D', fontSize: 16 }
  ]
}>
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