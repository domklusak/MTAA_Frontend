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
import axiosInstance from '../../navigation/axiosConfig';
import userDataContext from '../../components/UserDataContext';
import {useContext, useEffect, useState} from 'react';

export default function PaymentScreen({navigation, route}) {
  const {accsFriend} = route.params ?? {};
  const {userData} = useContext(userDataContext);
  const [acc_data, setAccData] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosInstance.get(
          `accounts/${userData.account_id}`,
        );
        if (response.data) {
          console.log('Account GET request payment screen ok');
          setAccData(response.data);
        } else {
          console.log('Response data is empty');
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  }, []);

  async function sendPayment() {
    console.log('Pica: ', paymentInfo);
    try {
      await axiosInstance.post(
        `/transactions?account_id=${userData.account_id}`,
        {
          amount: paymentInfo.amount,
          note: paymentInfo.noteT,
          send_time: 'who cares',
          dest_account: accsFriend.id,
        },
      );
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}>
      <View style={styles.usersContainer}>
        {/* User info */}
        <View style={styles.userInfo}>
          <Image source={Logo} style={styles.imgStyle} resizeMode="contain" />
          <View style={{marginLeft: 50}}>
            <Text style={styles.textStyle}>{acc_data.tag}</Text>
            <Text style={styles.textStyle}>
              {acc_data.name} {acc_data.surname}
            </Text>
          </View>
        </View>
        {/* Account balance */}
        <Text style={styles.textStyle}>
          {acc_data.balance ? (
            acc_data.balance.toFixed(2)
          ) : (
            <Text>Loading data...</Text>
          )}
        </Text>
      </View>
      <View style={styles.lineContainer} />
      {/* Other user container */}
      {accsFriend ? (
        <View style={styles.otherUserContainer}>
          <Text style={styles.textStyle}>Debt/Claim</Text>
          <View>
            <Text style={styles.textStyle}>{accsFriend.tag}</Text>
            <Text style={styles.textStyle}>
              {accsFriend.name} {accsFriend.surname}
            </Text>
          </View>
          <Image source={Logo} style={styles.imgStyle} resizeMode="contain" />
        </View>
      ) : (
        <View style={styles.otherUserContainer}>
          <Text style={styles.textStyle}>Debt/Claim</Text>
          <View>
            <Text style={styles.textStyle}>Unknown tag</Text>
            <Text style={styles.textStyle}>Unknown user</Text>
          </View>
          <Image source={Logo} style={styles.imgStyle} resizeMode="contain" />
        </View>
      )}
      {/* Payment info container */}
      <View style={styles.paymentContainer}>
        <TextInput
          style={styles.amountInput}
          placeholder="Amount to be sent"
          onChangeText={newAmount =>
            setPaymentInfo(prevState => ({...prevState, amount: newAmount}))
          }
        />
        <TextInput
          style={styles.noteInput}
          placeholder="Note for receiver"
          multiline
          onChangeText={newNote =>
            setPaymentInfo(prevState => ({...prevState, noteT: newNote}))
          }
        />
      </View>
      {/* Buttons container */}
      <View style={styles.buttonsContainer}>
        <CustomButton
          text="Cancel"
          type="paymentScreen"
          onPress={() => navigation.navigate('Home')}
        />
        <CustomButton
          text="Pay"
          type="paymentScreen"
          onPress={() => sendPayment()}
        />
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
