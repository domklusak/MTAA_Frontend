import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import axiosInstance from '../../navigation/axiosConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {KeyboardAvoidingView} from 'react-native';

const ChatScreen = ({route}) => {
  const {chat} = route.params ?? {};
  const acc_data = route.params.acc_data ?? {};
  const this_room = acc_data.rooms.filter(
    rooms => chat.rooms.includes(rooms) && acc_data.rooms.includes(rooms),
  )[0];
  const [message, setMessage] = useState('');
  const [chat_data, setChatdata] = useState([]);
  const scrollViewRef = useRef();
  const ws = useRef(null);
  const navigation = useNavigation();

  /*WEB_Socket*/

  useEffect(() => {
    ws.current = new WebSocket(`ws://dominik-2.local:8000/ws/room/${this_room}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = event => {
      const message2 = JSON.parse(event.data);
      console.log('Received message:', message2);
      setChatdata(stare_data => [...stare_data, message2]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  /*GET messages*/

  useEffect(() => {
    axiosInstance
      .get(`/messages?room_id=${this_room}`)
      .then(response => {
        if (response.data) {
          const updatedChatData = response.data.map(msg => {
            if (msg.image_type === 'image/jpg') {
              return {
                ...msg,
                image_base64: msg.image_base64,
              };
            } else {
              return msg;
            }
          });
          setChatdata(updatedChatData);
        } else {
          console.log('Response data is empty');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [this_room]);

  /*POST message*/

  const handleMessageSend = async () => {
    console.log(`Sending message "${message}" to  ${chat.id}`);
    try {
      let data = {
        type: 'chat_message',
        message: message,
        sender_id: acc_data.id,
        room_id: this_room,
      };
      ws.current.send(JSON.stringify(data));
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  /*Keyboard state*/

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardStatus(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardStatus(false),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLayout = () => {
    if (keyboardStatus) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  };

  const destroyMessage = async messageId => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      setChatdata(chat_data.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleImageSend = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const asset = response.assets[0];
        const uri = asset.uri;
        const type = asset.type;
        const name = asset.fileName;

        try {
          const base64Image = await RNFS.readFile(uri, 'base64');

          let data = {
            type: 'image_message',
            message: message,
            sender_id: acc_data.id,
            room_id: this_room,
            image: {
              uri,
              type,
              name,
              base64: base64Image,
            },
          };
          ws.current.send(JSON.stringify(data));
          setMessage('');
        } catch (error) {
          console.error('Error sending image message:', error);
          return null;
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backIcon}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {chat.name} {chat.surname}
        </Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContentContainer}
        onLayout={handleLayout}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: false})
        }>
        {chat_data.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.account === acc_data.id ? styles.myMessageContainer : null,
            ]}>
            <View
              style={[
                styles.messageBubble,
                msg.account === acc_data.id ? styles.myMessageBubble : null,
              ]}>
              <Text style={styles.messageTimestamp}>
                {moment(msg.send_time).format('LT')}
              </Text>
              {msg.image_type === 'image/jpg' || msg.image ? (
                <Image
                  source={{
                    uri: msg.image_base64
                      ? `data:image/jpg;base64,${msg.image_base64}`
                      : msg.image,
                  }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.messageText}>{msg.text}</Text>
              )}
            </View>
            {msg.account === acc_data.id && (
              <TouchableOpacity
                onPress={() => destroyMessage(msg.id)}
                style={styles.deleteIcon}>
                <Ionicons name="trash" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here"
          value={message}
          onChangeText={setMessage}
          multiline
          onFocus={() => scrollViewRef.current.scrollToEnd({animated: true})}
        />
        <TouchableOpacity style={styles.imageButton} onPress={handleImageSend}>
          <Ionicons name="image" size={24} color="#007aff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007aff',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  imageButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
  },
  messageBubble: {
    backgroundColor: '#E0E5EF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  myMessageBubble: {
    backgroundColor: 'rgba(0,122,255,0.6)',
  },
  messageText: {
    color: 'rgb(0,0,0)',
    fontSize: 18,
  },
  senderName: {
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 50,
  },
  leftSenderName: {
    marginLeft: 10,
    marginRight: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backIcon: {
    borderRadius: 20,
  },
  messageTimestamp: {
    fontSize: 13,
    color: '#4b4b4b',
    alignSelf: 'center',
  },
  deleteIcon: {
    alignSelf: 'center',
    margin: 3,
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default ChatScreen;
