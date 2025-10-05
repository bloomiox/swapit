import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, StatusBar, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [bio, setBio] = useState('Eco-conscious swapper. Love giving items a second life! Text.\n\n\n');
  const [location, setLocation] = useState('Rorschach, Sankt Gallen');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Request permissions when component mounts
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      }
      
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const handleUpdate = () => {
    // In a real app, you would send the updated profile data to your backend
    console.log('Updating profile:', { fullName, email, bio, location, profileImage });
    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const selectProfileImage = async () => {
    // Show options to select from gallery or camera
    Alert.alert(
      'Select Profile Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: takePhoto,
        },
        {
          text: 'Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.statusIcons}>
          <Ionicons name="signal" size={16} color="#021229" />
          <Ionicons name="wifi" size={16} color="#021229" />
          <View style={styles.batteryContainer}>
            <View style={styles.batteryFill} />
          </View>
        </View>
      </View>
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Edit Profile</Text>
        <View style={styles.emptySpace} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={selectProfileImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <View style={styles.editAvatarIcon}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          {/* Full Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#6E6D7A"
              />
            </View>
          </View>
          
          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <TextInput
                style={styles.input}
                value={email}
                editable={false}
                placeholder="Enter your email"
                placeholderTextColor="#6E6D7A"
              />
            </View>
          </View>
          
          {/* Bio Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bio</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor="#6E6D7A"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
          
          {/* Location Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your location"
                placeholderTextColor="#6E6D7A"
              />
              <TouchableOpacity style={styles.locationIcon}>
                <Ionicons name="location" size={20} color="#021229" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Update Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update</Text>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 7,
    backgroundColor: '#F7F5EC',
    height: 32,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    letterSpacing: -0.41,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batteryContainer: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: '#021229',
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  batteryFill: {
    height: 8,
    backgroundColor: '#021229',
    borderRadius: 2,
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
  },
  emptySpace: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#021229',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarIcon: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingHorizontal: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#021229',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  locationIcon: {
    padding: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  updateButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default EditProfileScreen;