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

export default function ProfileScreen({navigation}) {
  const [acc_data, setAccData] = useState([]);
  const {userData} = useContext(userDataContext);
  const [acc_friends, setAccfriends] = useState([]);
  const [tempFriend, setTempFriend] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`accounts/${userData.account_id}`)
      .then(response => {
        if (response.data) {
          console.log('Account GET request friends screen ok');
          setAccData(response.data);
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    async function fetch_friends() {
      await acc_data.friends.map(friendId => {
        axiosInstance
          .get(`accounts/${friendId}`)
          .then(response => {
            if (response.data) {
              setAccfriends(prevState => [...prevState, response.data]);
            } else {
              console.log('Response data is empty');
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
    fetch_friends();
  }, [acc_data]);

  const handleMessageFriend = async friend => {
    try {
      const sharedRooms = acc_data.rooms.filter(room =>
        friend.rooms.includes(room),
      );

      if (sharedRooms.length > 0) {
        navigation.navigate('Chat', {chat: friend, acc_data: acc_data});
      } else {
        const response = await axiosInstance.post('rooms', {
          name: 'yes_sir',
          create_time: '',
          owner: userData.account_id,
        });

        const tempAccData = {...acc_data};
        tempAccData.rooms.push(response.data.id);
        setAccData(tempAccData);

        const tempFriend = await axiosInstance.put(`accounts/${friend.id}`, {
          id: friend.id,
          password: friend.password,
          tag: friend.tag,
          balance: friend.balance,
          name: friend.name,
          surname: friend.surname,
          email: friend.email,
          friends: friend.friends,
          claims: friend.claims,
          transactions: friend.transactions,
          rooms: [...friend.rooms, response.data.id],
        });

        navigation.navigate('Chat', {
          chat: tempFriend.data,
          acc_data: acc_data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
      <ScrollView>
        {acc_friends.map((item, index) => (
          <Card containerStyle={styles.card} key={index}>
            <View style={styles.friendContainer}>
              <Image source={Logo} style={styles.profileImage} />
              <Text style={styles.name}>
                {item.name}
                {item.surname}
              </Text>
              <View style={styles.icons}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Payment', {
                      accsFriend: item,
                      signedAcc: acc_data,
                    })
                  }>
                  <Ionicons name="cash-outline" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMessageFriend(item)}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color="blue"
                    style={styles.messageIcon}
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
  card: {
    borderRadius: 10,
  },
  friendContainer: {
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
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
});
