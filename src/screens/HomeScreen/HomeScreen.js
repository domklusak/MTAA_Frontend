import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import axiosInstance from '../../navigation/axiosConfig';
import userDataContext from '../../components/UserDataContext';

export default function HomeScreen({navigation}) {
  const [acc_data, setAccdata] = useState([]);
  const [chat_data, setChatdata] = useState([]);
  const {userData} = useContext(userDataContext);

  useEffect(() => {
    axiosInstance
      .get(`accounts/${userData.account_id}`)
      .then(response => {
        if (response.data) {
          console.log('Data ok');
          setAccdata(response.data);
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        console.log(error);
      });
    axiosInstance
      .get('accounts')
      .then(response => {
        if (response.data) {
          console.log('Data ok');
          setChatdata(response.data);
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    //Main container
    <View style={styles.mainContainer}>
      <View //Stav Účtu container-----------------------------------------------
        style={styles.accountContainer}>
        {acc_data ? (
          <Text style={styles.accountinfoText}>
            {acc_data.name} {acc_data.surname}
          </Text>
        ) : (
          <Text>Loading data...</Text>
        )}
        <View style={styles.lineContainer} />
        {acc_data.balance ? (
          <Text style={styles.accountinfoText}>
            Zostatok na účte{'\n'}
            {acc_data.balance.toFixed(2)}
          </Text>
        ) : (
          <Text>Loading data...</Text>
        )}
      </View>
      <View style={styles.chatsContainer}>
        <Text style={styles.chatsText}>Chats</Text>
        {chat_data
          .filter(
            item =>
              acc_data.friends.includes(item.id) &&
              item.id !== acc_data.id &&
              item.rooms.some(room => acc_data.rooms.includes(room)),
          )
          .map((item, index) => (
            <TouchableOpacity
              style={styles.singlechatContainer}
              key={index}
              onPress={() =>
                navigation.navigate('Chat', {chat: item, acc_data: acc_data})
              }>
              <Text style={styles.chatText}>
                {item.name} {item.surname}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  accountContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#0066ff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  accountinfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  lineContainer: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  chatsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    padding: 20,
  },
  singlechatContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignSelf: 'stretch',
  },
  chatText: {
    fontSize: 16,
    color: '#0066ff',
  },
  chatsText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 15,
  },
});
