import {View, Text, StyleSheet, Alert, CheckBox} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import axiosInstance, {setAuthToken} from '../../navigation/axiosConfig';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRep, setPasswordRep] = useState('');
  const [account_id, setAccount_id] = useState('');
  const navigation = useNavigation();

  const onRegisterPressed = () => {
    console.warn('Register user');
    axios.post('http://localhost:8000/accounts', {
      password: password,
      tag: 'random',
      balance: 1111,
      name: username,
      surname: 'james',
      email: email,
      friends: [],
      claims: [],
      transactions: [],
      rooms: [],
    });

    axiosInstance
      .post('auth/token/', {
        username: email,
        password: password,
      })
      .then(response => {
        if (response.data) {
          console.log(response.data); // log the response data
          setAuthToken(response.data.token);
          setAccount_id(response.data.account_id);
          navigation.navigate('Home');
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

  const onSingInPress = () => {
    navigation.navigate('SignIn');
  };

  const termsPressed = () => {
    console.warn('TermsPressed');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Create an account</Text>
      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <CustomInput placeholder="Email" value={email} onChangeText={setEmail} />
      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <CustomInput
        placeholder="Repeat your password"
        value={passwordRep}
        onChangeText={setPasswordRep}
        secureTextEntry={true}
      />
      <CustomButton
        text="Register"
        onPress={onRegisterPressed}
        type="PRIMARY"
      />
      <Text style={styles.text}>
        Ked sa regnes, akceptujes nase {''}
        <Text style={styles.link} onPress={termsPressed}>
          podmienky
        </Text>{' '}
        ak nie nasrat
      </Text>
      <View style={styles.side}>
        <View style={{flex: 1}}>
          <CustomButton
            text="Have an account? Sign in"
            onPress={onSingInPress}
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
  },
  side: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
  errorTxt: {
    fontSize: 12,
    color: '#FF0D10',
  },
});

export default RegisterScreen;
