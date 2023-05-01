import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';

export default function ProfileScreen({navigation}) {
  const ZA = 'Žilina';
  const BA = 'Bratislava';
  const BB = 'Banská Bystrica';
  const KE = 'Košice';
  const UL = 'User Location';
  const onPressed = city => {
    navigation.navigate('Map', {cityName: city});
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={36} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Find your ATM</Text>
        </View>
        <View style={styles.content}>
          <CustomButton text={ZA} onPress={() => onPressed(ZA)} type="THIRD" />
          <CustomButton text={BA} onPress={() => onPressed(BA)} type="THIRD" />
          <CustomButton text={KE} onPress={() => onPressed(KE)} type="THIRD" />
          <CustomButton text={BB} onPress={() => onPressed(BB)} type="THIRD" />
          <CustomButton text={UL} onPress={() => onPressed(UL)} type="THIRD" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  headerText: {
    position: 'absolute',
    left: '40%', // Center the text
    transform: [{translateX: -40}], // Move the text 20 pixels to the left
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
  },
  backButton: {
    padding: 10,
  },
});
