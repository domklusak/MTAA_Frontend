import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

const CustomButton = ({onPress, text, type}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, styles[`container_${type}`]]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  container_PRIMARY: {
    width: '100%',
    backgroundColor: '#3B71F3',
  },
  container_TERTIARY: {
    width: '100%',
  },
  container_THIRD: {
    width: '90%',
    backgroundColor: '#3B71F3',
    arginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
  text_TERTIARY: {
    color: 'grey',
  },
  text_THIRD: {
    color: 'white',
    fontWeight: 'bold',
  },
  container_paymentScreen: {
    width: '45%',
    backgroundColor: '#3B71F3',
  },
  container_profileScreen: {
    marginBottom: 20,
    width: '40%',
    backgroundColor: '#0066ff',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: '10%',
  },
});

export default CustomButton;
