import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import CustomButton from '../../components/CustomButton';
import axiosInstance from '../../navigation/axiosConfig';
import userDataContext from '../../components/UserDataContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
export default function ProfileScreen({navigation}) {
  const [text, setText] = useState('');
  const [profile, setProfile] = useState('');
  const {userData} = useContext(userDataContext);

  const [isAlertActive, setIsAlertActive] = useState(false);
  const showAlert = alertText => {
    if (!isAlertActive) {
      setIsAlertActive(true);
      Alert.alert('Alert', alertText, [
        {
          text: 'OK',
          onPress: () => setIsAlertActive(false),
        },
      ]);
    }
  };

  {
    /*GET request or fetch from cache if not empty*/
  }

  useEffect(() => {
    const handleConnectionChange = async state => {
      if (state.isConnected) {
        const response = await axiosInstance.get(
          `accounts/${userData.account_id}`,
        );
        if (response.data) {
          console.log('Data from server');
          setProfile(response.data);
          setText(response.data.name);
          await AsyncStorage.setItem(
            `profile:${userData.account_id}`,
            JSON.stringify(response.data),
          );
        } else {
          console.log('Response data is empty');
        }
      } else {
        fetchData();
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectionChange);

    return () => {
      unsubscribe();
    };
  }, [userData]);

  const fetchData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(
        `profile:${userData.account_id}`,
      );
      if (cachedData) {
        console.log('Data from cache');
        setProfile(JSON.parse(cachedData));
        setText(JSON.parse(cachedData).name);
      }
    } catch (error) {
      console.log('Error loading data from cache', error);
    }
  };

  const url = `accounts/${userData.account_id}`;
  const data = {
    id: profile.account_id,
    password: profile.password,
    tag: profile.tag,
    balance: profile.balance,
    name: text,
    surname: profile.surname,
    email: profile.email,
    friends: profile.friends,
    claims: profile.claims,
    transactions: profile.transactions,
    rooms: profile.rooms,
  };

  {
    /*PUT request or cache data if no connection*/
  }

  const putName = async () => {
    if (profile.name === text) {
      showAlert('Nothing to change');
      return;
    }

    console.log('Data', profile);

    const networkState = await NetInfo.fetch();
    console.log(networkState);
    if (networkState.isConnected) {
      axiosInstance
        .put(url, data)
        .then(async response => {
          if (response.data) {
            console.log('Name updated successfully');
            setProfile({...profile, name: text});
            await AsyncStorage.setItem(
              `profile:${userData.account_id}`,
              JSON.stringify({...profile, name: text}),
            );
            showAlert('Name changed');
            showNotification(
              'Your name has changed!',
              'If you didnt changed your name, please change your password.',
            );
          } else {
            console.log('Response data is empty');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      // Save the pending request to AsyncStorage
      await AsyncStorage.setItem('pendingRequest', JSON.stringify({url, data}));
      console.log('Saving data to the cache');
      showAlert('Name will be changed when the connection is resumed');
    }
  };

  const showNotification = (title, message) => {
    setTimeout(() => {
      PushNotificationIOS.presentLocalNotification({
        alertTitle: title,
        alertBody: message,
      });
    }, 2000); // 2000 milliseconds (2 seconds) delay
  };

  {
    /*Execute request when connection resumed*/
  }

  useEffect(() => {
    const handleConnectionChange = async state => {
      if (state.isConnected) {
        // Check if there is a pending request in AsyncStorage
        const pendingRequest = await AsyncStorage.getItem('pendingRequest');
        if (pendingRequest) {
          const {url, data} = JSON.parse(pendingRequest);

          axiosInstance
            .put(url, data)
            .then(async response => {
              if (response.data) {
                console.log('Name updated successfully');
                setProfile({...profile, name: data.name});
                await AsyncStorage.setItem(
                  `profile:${userData.account_id}`,
                  JSON.stringify({...profile, name: data.name}),
                );
                showAlert('Name changed');
              } else {
                console.log('Response data is empty');
              }
              // Clear the pending request from AsyncStorage
              await AsyncStorage.removeItem('pendingRequest');
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectionChange);

    return () => {
      unsubscribe();
    };
  }, [userData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('More')}
          style={styles.backIcon}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Ionicons name="arrow-back" size={36} color="#fff" />
        </TouchableOpacity>
      </View>
      <Image source={Logo} style={styles.profileImage} resizeMode="contain" />
      <View style={styles.infoContainer}>
        <View style={styles.makeChange}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            defaultValue={profile.name}
            onChangeText={setText}
          />
        </View>
        <View style={styles.makeChange}>
          <Text style={styles.label}>Surname:</Text>
          <Text style={styles.value}>{profile.surname}</Text>
        </View>
        <View style={styles.makeChange}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>
      </View>
      <CustomButton text="Change name" type="profileScreen" onPress={putName} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingRight: '33%',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#ffffff',
    marginTop: -75,
    marginBottom: 20,
  },
  infoContainer: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 15,
  },
  makeChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066ff',
  },
  value: {
    fontSize: 18,
    color: '#777',
  },
  input: {
    fontSize: 18,
    color: '#777',
    borderBottomWidth: 2,
    borderBottomColor: '#0066ff',
    paddingBottom: 2,
    width: '60%',
    textAlign: 'right',
  },
  backIcon: {
    borderRadius: 20,
  },
});
