import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export default function MapScreen({navigation, route}) {
  const {cityName} = route.params;
  // eslint-disable-next-line no-shadow
  const getInitialRegion = cityName => {
    switch (cityName) {
      case 'Žilina':
        return zaRegion;
      case 'Bratislava':
        return baRegion;
      case 'Košice':
        return keRegion;
      case 'Banská Bystrica':
        return bbRegion;
      case 'User Location':
        return location;
    }
  };

  const [mapRegion, setMapRegion] = useState(getInitialRegion(cityName));

  const [location, setLocation] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    if (cityName === 'User Location') {
      Geolocation.requestAuthorization();
      Geolocation.getCurrentPosition(
        position => {
          const crd = position.coords;
          const newLocation = {
            latitude: crd.latitude,
            longitude: crd.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          setLocation(newLocation);
          setMapRegion(newLocation); // Add this line
          console.log('som neger');
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } else {
      setMapRegion(getInitialRegion(cityName));
    }
  }, [cityName]);

  const [zaRegion] = useState({
    latitude: 49.224887,
    longitude: 18.740026,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    adress: 'Námestie Andreja Hlinku 7B, 010 01 Žilina',
  });
  const [baRegion] = useState({
    latitude: 48.153101,
    longitude: 17.071407,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    adress: 'Ilkovičova 2, 842 16 Karlova Ves',
  });
  const [keRegion] = useState({
    latitude: 48.712477,
    longitude: 21.242962,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    adress: 'Ružová, 040 11 Košice',
  });
  const [bbRegion] = useState({
    latitude: 48.737194,
    longitude: 19.147268,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    adress: 'Námestie Š. Moysesa 48, 974 01 Banská Bystrica',
  });

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.text}>{cityName}</Text>
      </View>
      <MapView style={styles.map} region={mapRegion}>
        <Marker
          coordinate={getInitialRegion(cityName)}
          title={getInitialRegion(cityName).adress}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 10,
    paddingLeft: 10,
    zIndex: 1,
  },
  text: {
    fontSize: 24,
    margin: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
