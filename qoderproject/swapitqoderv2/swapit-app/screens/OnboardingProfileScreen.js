import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
// Import Auth context and API service
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, createUserProfile } from '../utils/api';

const OnboardingProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    // Don't automatically request location on mount
    // Let the user trigger it manually
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationError(null);
      
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // Get current location
        let locationData = await Location.getCurrentPositionAsync({});
        
        // In a real app, you would use reverse geocoding to get the actual address
        // For now, we'll just set a placeholder text
        setLocation('Current Location');
        setLocationError(null);
      } else if (status === 'denied') {
        setLocationError('Permission to access location was denied');
        Alert.alert(
          'Permission Required',
          'Location permission is required to get your current location. Please enable location services in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettings() }
          ]
        );
      } else if (status === 'undetermined') {
        // Permission request was not made yet, try again
        setLocationError('Please allow location access when prompted');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to retrieve location');
      Alert.alert('Location Error', 'Unable to retrieve your location. Please try again or enter manually.');
    }
  };

  const selectProfileImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takeProfilePhoto = async () => {
    // Request permission to access camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    // Simple validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    try {
      // Update or create user profile
      if (authUser && authUser.id) {
        // Prepare profile data
        const profileData = {
          name: name.trim(),
          email: authUser.email,
          bio: bio.trim(),
          location: location.trim()
        };
        
        // Use the robust update function that handles both update and create
        await updateUserProfile(authUser.id, profileData);
      } else {
        throw new Error('User is not authenticated or user ID is missing');
      }
      
      // Navigate to next onboarding screen
      navigation.replace('OnboardingCategories');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save profile information. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar - Step 1 of 3 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '33.33%' }]} />
        </View>
      </View>
      
      {/* App Bar with Back Button */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>How should we address you</Text>
        </View>
        
        <View style={styles.form}>
          {/* Profile Photo */}
          <View style={styles.profilePhotoContainer}>
            <TouchableOpacity style={styles.profilePhotoButton} onPress={selectProfileImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePhotoPlaceholder}>
                  <MaterialIcons name="person" size={40} color="#6E6D7A" />
                  <Text style={styles.profilePhotoText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={takeProfilePhoto}>
              <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write your name here"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          {/* Bio Text Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="You can add your bio here (optional)"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Location Input */}
          <View style={styles.inputContainer}>
            <View style={styles.locationInputWrapper}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="Enter location"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity onPress={getCurrentLocation} style={styles.locationButton}>
                <MaterialIcons name="my-location" size={20} color="#021229" />
              </TouchableOpacity>
            </View>
            {locationError ? (
              <Text style={styles.errorText}>{locationError}</Text>
            ) : null}
          </View>
        </View>
      </View>
      
      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.continueButton, !name.trim() && styles.disabledButton]} 
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  progress: {
    height: '100%',
    backgroundColor: '#119C21',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textContainer: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#021229',
  },
  form: {
    gap: 16,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profilePhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePhotoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoText: {
    fontSize: 12,
    color: '#6E6D7A',
    marginTop: 4,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    alignSelf: 'stretch',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#6E6D7A',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationInput: {
    flex: 1,
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  locationButton: {
    padding: 4,
    marginLeft: 8,
  },
  locationIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  disabledButton: {
    backgroundColor: '#C7D1D9',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingProfileScreen;