import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import MoreScreen from '../screens/MoreScreen';
import MovementsScreen from '../screens/MovementsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatScreen';
import BankScreen from '../screens/BankScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const homeName = 'Home';
const friendsName = 'Friends';
const moreName = 'More';
const movementsName = 'Movements';
const paymentName = 'Payment';

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'black',
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 10},
        tabBarStyle: {padding: 5, height: 60},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === paymentName) {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (rn === movementsName) {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (rn === friendsName) {
            iconName = focused ? 'people' : 'people-outline';
          } else if (rn === moreName) {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={paymentName} component={PaymentScreen} />
      <Tab.Screen name={movementsName} component={MovementsScreen} />
      <Tab.Screen name={friendsName} component={FriendsScreen} />
      <Tab.Screen name={moreName} component={MoreScreen} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MainTabNavigator} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Bank" component={BankScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
