import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import CustomButton from '../../components/CustomButton';

export default function PaymentScreen({navigation}) {
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}>
      {/* Main container */}
      <View style={styles.usersContainer}>
        {/* User info */}
        <View style={styles.userInfo}>
          <Image source={Logo} style={styles.imgStyle} resizeMode="contain" />
          <View style={{marginLeft: 50}}>
            <Text style={styles.textStyle}>User Tag</Text>
            <Text style={styles.textStyle}>User Name</Text>
          </View>
        </View>
        {/* Account balance */}
        <Text style={styles.textStyle}>Account Balance</Text>
      </View>
      <View style={styles.lineContainer} />
      {/* Other user container */}
      <View style={styles.otherUserContainer}>
        <Text style={styles.textStyle}>Amount</Text>
        <View>
          <Text style={styles.textStyle}>Other User Tag</Text>
          <Text style={styles.textStyle}>Other User Name</Text>
        </View>
        <Image source={Logo} style={styles.imgStyle} resizeMode="contain" />
      </View>
      {/* Payment info container */}
      <View style={styles.paymentContainer}>
        <TextInput style={styles.amountInput} placeholder="Suma na odoslanie" />
        <TextInput style={styles.noteInput} placeholder="Poznámka" multiline />
      </View>
      {/* Buttons container */}
      <View style={styles.buttonsContainer}>
        <CustomButton text="Cancel" type="paymentScreen" />
        <CustomButton text="Pay" type="paymentScreen" />
      </View>
    </KeyboardAvoidingView>
  );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  usersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '2%',
    paddingTop: '2%',
    paddingBottom: '2%',
    backgroundColor: 'rgba(0,122,255,0.6)',
    borderRadius: 10,
    margin: '2%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '2%',
    paddingTop: '2%',
    backgroundColor: '#E0E5EF',
    borderRadius: 10,
    margin: '2%',
  },
  paymentContainer: {
    paddingHorizontal: '2%',
    paddingTop: '4%',
    backgroundColor: 'rgba(0,122,255,0.6)',
    borderRadius: 10,
    margin: '2%',
    padding: '2%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: '5%',
    backgroundColor: '#E0E5EF',
    borderRadius: 10,
    padding: '2%',
    margin: '2%',
  },
  imgStyle: {
    width: 70,
    height: 70,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#ffffff',
    marginBottom: '2%',
  },
  lineContainer: {
    borderBottomColor: '#3B71F3',
    borderBottomWidth: 2,
    width: '80%',
    marginTop: '2%',
    marginBottom: '2%',
    alignSelf: 'center',
  },
  textStyle: {
    color: 'black',
  },
  amountInput: {
    borderColor: '#3B71F3',
    borderWidth: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    fontSize: width * 0.04,
    marginBottom: '4%',
  },
  noteInput: {
    borderColor: '#3B71F3',
    borderWidth: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    fontSize: width * 0.04,
    minHeight: height * 0.2,
    maxHeight: height * 0.3,
  },
});
