import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import SettingScreen from '../../screens/SettingScreen/SettingScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';

const homeName = 'Home';
const profileName = 'Profile';
const settingsName = 'Settings';
const Tab = createBottomTabNavigator();

export default function Menu() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (rn === profileName) {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={settingsName} component={SettingScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
