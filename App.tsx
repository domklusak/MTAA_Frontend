import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import 'react-native-gesture-handler';
import Navigation from './src/navigation';
import {UserDataProvider} from './src/components/UserDataContext/UserDataContext';

enableScreens();

const App = () => {
  return (
    <UserDataProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F9FBFC'}}>
        <View style={styles.root}>
          <Navigation />
        </View>
      </SafeAreaView>
    </UserDataProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
