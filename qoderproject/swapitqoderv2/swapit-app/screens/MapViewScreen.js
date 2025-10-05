import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapViewScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const sampleItems = [
    {
      id: '1',
      title: 'Stool',
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      id: '2',
      title: 'Designer Handbag',
      latitude: 37.78925,
      longitude: -122.4314,
    },
    {
      id: '3',
      title: 'Sofa chair',
      latitude: 37.78725,
      longitude: -122.4334,
    },
  ];

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {sampleItems.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.title}
              onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
            />
          ))}
        </MapView>
      )}

      {/* View Switcher */}
      <View style={styles.viewSwitcher}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="list" size={20} color="#021229" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.viewButton, styles.activeViewButton]}>
          <Ionicons name="map" size={20} color="#021229" />
        </TouchableOpacity>
      </View>

      {/* Location Button */}
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={() => {
          // In a real app, this would re-center the map on the user's current location
        }}
      >
        <Ionicons name="locate" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  map: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  viewSwitcher: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeViewButton: {
    backgroundColor: '#D8F7D7',
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MapViewScreen;