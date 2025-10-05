import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DistanceFilterScreen = ({ navigation, route }) => {
  const { selectedDistance, onDistanceSelect } = route.params || {};
  const [localSelectedDistance, setLocalSelectedDistance] = useState(selectedDistance || 10);

  const handleApply = () => {
    if (onDistanceSelect) {
      onDistanceSelect(localSelectedDistance);
    }
    navigation.goBack();
  };

  const handleReset = () => {
    setLocalSelectedDistance(10);
  };

  const handleDistanceChange = (value) => {
    setLocalSelectedDistance(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5EC" />
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Distance</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{localSelectedDistance} km</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${(localSelectedDistance / 50) * 100}%` }
                ]} 
              />
              <TouchableOpacity 
                style={[
                  styles.sliderThumb, 
                  { left: `${(localSelectedDistance / 50) * 100}%` }
                ]} 
                onLayout={(event) => {
                  // This is just to make sure the thumb is properly positioned
                }}
              />
            </View>
          </View>
          <View style={styles.distanceLabels}>
            <Text style={styles.distanceLabel}>0 km</Text>
            <Text style={styles.distanceLabel}>50 km</Text>
          </View>
          
          {/* Distance Options */}
          <View style={styles.distanceOptions}>
            {[5, 10, 20, 30, 50].map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.distanceOption,
                  localSelectedDistance === distance && styles.selectedDistanceOption
                ]}
                onPress={() => handleDistanceChange(distance)}
              >
                <Text style={[
                  styles.distanceOptionText,
                  localSelectedDistance === distance && styles.selectedDistanceOptionText
                ]}>
                  {distance} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
    paddingTop: 50,
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  resetButton: {
    padding: 4,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#119C21',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  distanceContainer: {
    alignItems: 'center',
    padding: 16,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 16,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E7E8EC',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#119C21',
    borderRadius: 2,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#119C21',
    position: 'absolute',
    top: -8,
    marginLeft: -10,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  distanceOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    backgroundColor: '#FFFFFF',
  },
  selectedDistanceOption: {
    borderColor: '#119C21',
    backgroundColor: '#D8F7D7',
  },
  distanceOptionText: {
    fontSize: 14,
    color: '#021229',
  },
  selectedDistanceOptionText: {
    color: '#119C21',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
  },
  applyButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DistanceFilterScreen;