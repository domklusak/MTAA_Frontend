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

  return (
    <View style={style.container}>
      <Image source={Logo} style={style.logo} resizeMode="contain" />
      <CustomButton
        text="Profile"
        onPress={onProfilePressed}
        type="THIRD"
        style={style.button}
      />
      <CustomButton
        text="Find a bank"
        onPress={onBankPressed}
        type="THIRD"
        style={style.button}
      />
      <CustomButton
        text="Settings"
        onPress={onSettingPressed}
        type="THIRD"
        style={style.button}
      />
      <CustomButton
        text="Support"
        onPress={onSupportPressed}
        type="THIRD"
        style={style.button}
      />
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
    alignItems: 'center',
  }
});
