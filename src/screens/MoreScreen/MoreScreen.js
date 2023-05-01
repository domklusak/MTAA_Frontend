import * as React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import CustomButton from '../../components/CustomButton';

export default function ProfileScreen({navigation}) {
  const onProfilePressed = () => {
    navigation.push('Profile');
  };

  const onBankPressed = () => {
    navigation.push('Bank');
  };

  const onSettingPressed = () => {
    console.log('Setting pressed');
  };

  const onSupportPressed = () => {
    console.log('Support pressed');
  };

  const onFindPeople = () => {
    navigation.navigate('FindPeople');
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <Image source={Logo} style={style.logo} resizeMode="contain" />
      <CustomButton text="Profile" onPress={onProfilePressed} type="THIRD" />
      <CustomButton text="Find a bank" onPress={onBankPressed} type="THIRD" />
      <CustomButton text="Settings" onPress={onSettingPressed} type="THIRD" />
      <CustomButton text="Support" onPress={onSupportPressed} type="THIRD" />
      <CustomButton text="Find people" onPress={onFindPeople} type="THIRD" />
    </View>
  );
}

const style = StyleSheet.create({
  logo: {
    width: '70%',
    height: '70%',
    maxWidth: 300,
    maxHeight: 300,
  },
  container: {
    flex: 1,
    padding: 10,
  },
});
