import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';

const Input = ({value, onChangeText, placeholder, secureTextEntry}) => {
  const handleFocus = () => {
    console.log('Input is focused');
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        autoCapitalize={'none'}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        placeholderTextColor="#5c5c5c"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  input: {
    color: 'black',
  },
});

export default Input;
