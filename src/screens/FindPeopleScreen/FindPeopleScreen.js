import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import axiosInstance from '../../navigation/axiosConfig';
import userDataContext from '../../components/UserDataContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-elements';
import Logo from '../../../assets/images/logo.png';

export default function FindPeople({navigation}) {
  const {userData} = useContext(userDataContext);
  const [notFriends, setNotfriends] = useState([]);
  const [acc_data, setAccdata] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`accounts/${userData.account_id}`)
      .then(response => {
        if (response.data) {
          console.log('Account GET request find people screen ok');
          setAccdata(response.data);
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axiosInstance.get('accounts').then(response => {
      if (response.data) {
        if (acc_data.friends) {
          const notFriends = response.data.filter(
            item =>
              !acc_data.friends.includes(item.id) &&
              item.id !== userData.account_id,
          );
          setNotfriends(prevState => [...prevState, ...notFriends]);
        }
      } else {
        console.log('Response data is empty');
      }
    });
  }, [acc_data]);

  const handleAddFriend = async friend => {
    try {

      await axiosInstance.put(`accounts/${userData.account_id}`, {
        id: acc_data.account_id,
        password: acc_data.password,
        tag: acc_data.tag,
        balance: acc_data.balance,
        name: acc_data.name,
        surname: acc_data.surname,
        email: acc_data.email,
        friends: [...acc_data.friends, friend.id],
        claims: acc_data.claims,
        transactions: acc_data.transactions,
        rooms: acc_data.rooms,
      });

      await axiosInstance.put(`accounts/${friend.id}`, {
        id: friend.id,
        password: friend.password,
        tag: friend.tag,
        balance: friend.balance,
        name: friend.name,
        surname: friend.surname,
        email: friend.email,
        friends: [...friend.friends, userData.account_id],
        claims: friend.claims,
        transactions: friend.transactions,
        rooms: friend.rooms,
      });
      console.log('Friends: ', friend.friends);
      setNotfriends(prevState =>
        prevState.filter(item => item.id !== friend.id),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Find people</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('More')}
          style={styles.backIcon}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Image source={Logo} style={styles.headerImage} resizeMode="contain" />
      <ScrollView>
        {notFriends.map((item, index) => (
          <Card containerStyle={styles.card} key={index}>
            <View style={styles.nonfriendContainer}>
              <Image source={Logo} style={styles.profileImage} />
              <Text style={styles.name}>
                {item.name} {item.surname}
              </Text>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => handleAddFriend(item)}>
                  <Ionicons
                    name="person-add-outline"
                    size={24}
                    color="blue"
                    style={styles.addIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#0066ff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    paddingRight: '25%',
  },
  headerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#ffffff',
    marginTop: -75,
    marginBottom: 20,
  },
  card: {
    borderRadius: 10,
  },
  nonfriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 18,
    color: 'black',
  },
  icons: {
    alignItems: 'center',
  },
  addIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  backIcon: {
    borderRadius: 20,
  },
});
