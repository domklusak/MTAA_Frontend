import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRep, setPasswordRep] = useState('');
  const navigation = useNavigation();

  const onRegisterPressed = () => {
    axios
      .post('http://dominik-2.local:8000/accounts', {
        password: password,
        tag: 'random',
        balance: 1111,
        name: name,
        surname: surname,
        email: email,
        friends: [],
        claims: [],
        transactions: [],
        rooms: [],
      })
      .then(response => {
        Alert.alert(
          'Registration successful',
          'Proceed to login page to access the application',
          [{text: 'OK', onPress: () => navigation.navigate('SignIn')}],
        );
      })
      .catch(error => {
        console.log('Error in registration:', error);
        Alert.alert(
          'Registration error',
          'There was a problem with your registration',
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
      <CustomInput placeholder="Name" value={name} onChangeText={setName} />
      <CustomInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
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
