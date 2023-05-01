import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import axiosInstance from '../../navigation/axiosConfig';
import userDataContext from '../../components/UserDataContext';

export default function ProfileScreen({navigation}) {
  const {userData} = useContext(userDataContext);
  const [accFriends, setAccFriends] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`transactions?account_transactions=${userData.account_id}`)
      .then(response => {
        if (response.data) {
          console.log(userData);
          console.log('Data ok');
          setAccFriends(response.data);
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const renderTransaction = (transaction, index) => (
    <View key={transaction.id} style={style.transactionContainer}>
      <Text style={style.transactionTitle}>{`Transaction ${index + 1}`}</Text>
      <Text style={style.transactionDetail}>
        Amount: {transaction.amount} €
      </Text>
      <Text style={style.transactionDetail}>
        Date: {formatDate(transaction.time)}
      </Text>
    </View>
  );

  return (
    <View style={style.container}>
      <Text style={{fontSize: 26, fontWeight: 'bold'}}></Text>
      <ScrollView>{accFriends.map(renderTransaction)}</ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  status: {
    padding: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDetail: {
    marginTop: 4,
  },
});
