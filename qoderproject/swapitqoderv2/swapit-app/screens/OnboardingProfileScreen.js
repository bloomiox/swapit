import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OnboardingProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const handleContinue = () => {
    // Simple validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    // Navigate to next onboarding screen
    navigation.replace('OnboardingCategories');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '33%' }]} />
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
              <MaterialIcons name="my-location" size={20} color="#021229" style={styles.locationIcon} />
            </View>
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
  locationIcon: {
    marginLeft: 8,
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