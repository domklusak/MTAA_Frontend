import {View, Image, StyleSheet, Alert} from 'react-native';
import React, {useContext, useState} from 'react';
import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
import axiosInstance, {setAuthToken} from '../../navigation/axiosConfig';
import UserDataContext from '../../components/UserDataContext';

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {setUserData} = useContext(UserDataContext);
  const onSignInPressed = () => {
    //backe
    axiosInstance
      .post('auth/token/', {
        username: username,
        password: password,
      })
      .then(response => {
        if (response.data) {
          setAuthToken(response.data.token);
          setUserData({
            account_id: response.data.account_id,
          });
          navigation.navigate('Main');
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        Alert.alert(
          'Wrong credentials',
          'Your username or password is incorrect',
          [{text: 'Return', onPress: () => console.log('OK Pressed')}],
        );
      });
  };
  const onForgotPasswordPressed = () => {
    console.warn('onForgotPasswordPressed');
  };
  const onSingUpPress = () => {
    navigation.navigate('SignUp');
  };
  return (
    <View style={styles.root}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <CustomButton text="Sign In" onPress={onSignInPressed} type="PRIMARY" />
      <View style={styles.side}>
        <View style={{flex: 1}}>
          <CustomButton
            text="Forgot password?"
            onPress={onForgotPasswordPressed}
            type="TERTIARY"
          />
        </View>
        <View style={{flex: 1}}>
          <CustomButton
            text="Create account"
            onPress={onSingUpPress}
            type="TERTIARY"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  side: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
  },
  logo: {
    width: '70%',
    height: '70%',
    maxWidth: 300,
    maxHeight: 300,
  },
});

export default SignInScreen;
