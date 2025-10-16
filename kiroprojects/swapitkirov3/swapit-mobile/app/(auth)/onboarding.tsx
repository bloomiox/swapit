import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../src/components/shared/Button/Button';
import { TextInput } from '../../src/components/forms/TextInput';
import { useAuthStore } from '../../src/stores/authStore';
import { locationService } from '../../src/services/location';
import { notificationService } from '../../src/services/notifications';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<any>;
}

interface ProfileData {
  bio: string;
  location: string;
  interests: string[];
}

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  profileData: ProfileData;
  setProfileData: (data: Partial<ProfileData>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Available interest categories
const INTEREST_CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'phone-portrait' },
  { id: 'clothing', name: 'Clothing', icon: 'shirt' },
  { id: 'books', name: 'Books', icon: 'book' },
  { id: 'sports', name: 'Sports', icon: 'basketball' },
  { id: 'home', name: 'Home & Garden', icon: 'home' },
  { id: 'toys', name: 'Toys & Games', icon: 'game-controller' },
  { id: 'music', name: 'Music', icon: 'musical-notes' },
  { id: 'art', name: 'Art & Crafts', icon: 'brush' },
  { id: 'automotive', name: 'Automotive', icon: 'car' },
  { id: 'beauty', name: 'Beauty', icon: 'flower' },
  { id: 'fitness', name: 'Fitness', icon: 'fitness' },
  { id: 'food', name: 'Food & Drinks', icon: 'restaurant' },
];

// Welcome Step Component
const WelcomeStep: React.FC<StepProps> = ({ onNext }) => (
  <View style={styles.stepContainer}>
    <View style={styles.welcomeContent}>
      <View style={styles.logoContainer}>
        <Ionicons name="swap-horizontal" size={64} color="#119C21" />
      </View>
      
      <Text style={styles.welcomeTitle}>Welcome to SwapIt!</Text>
      <Text style={styles.welcomeSubtitle}>
        Let's set up your profile so you can start discovering and swapping amazing items with your community.
      </Text>
      
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Ionicons name="search" size={24} color="#119C21" />
          <Text style={styles.featureText}>Discover items near you</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="swap-horizontal" size={24} color="#119C21" />
          <Text style={styles.featureText}>Trade with your community</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="heart" size={24} color="#119C21" />
          <Text style={styles.featureText}>Give items a second life</Text>
        </View>
      </View>
    </View>
    
    <Button
      title="Get Started"
      onPress={onNext}
      style={styles.nextButton}
    />
  </View>
);

// Profile Setup Step Component
const ProfileSetupStep: React.FC<StepProps> = ({ 
  onNext, 
  onBack, 
  profileData, 
  setProfileData 
}) => {
  const [errors, setErrors] = useState<{ bio?: string; location?: string }>({});

  const validateAndNext = () => {
    const newErrors: { bio?: string; location?: string } = {};
    
    if (!profileData.bio.trim()) {
      newErrors.bio = 'Please tell us a bit about yourself';
    } else if (profileData.bio.trim().length < 10) {
      newErrors.bio = 'Bio should be at least 10 characters';
    }
    
    if (!profileData.location.trim()) {
      newErrors.location = 'Please enter your location';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.stepTitle}>Tell us about yourself</Text>
      </View>
      
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepSubtitle}>
          Help others get to know you better by sharing a bit about yourself and your location.
        </Text>
        
        <TextInput
          label="Bio"
          placeholder="Tell us about yourself, your interests, what you're looking to swap..."
          value={profileData.bio}
          onChangeText={(value) => {
            setProfileData({ bio: value });
            if (errors.bio) {
              const newErrors = { ...errors };
              delete newErrors.bio;
              setErrors(newErrors);
            }
          }}
          error={errors.bio}
          multiline
          numberOfLines={4}
          maxLength={500}
          helperText={`${profileData.bio.length}/500 characters`}
          containerStyle={styles.bioInput}
        />
        
        <TextInput
          label="Location"
          placeholder="Enter your city or area"
          value={profileData.location}
          onChangeText={(value) => {
            setProfileData({ location: value });
            if (errors.location) {
              const newErrors = { ...errors };
              delete newErrors.location;
              setErrors(newErrors);
            }
          }}
          error={errors.location}
          leftIcon="location"
          helperText="This helps others find items near you"
        />
      </ScrollView>
      
      <Button
        title="Continue"
        onPress={validateAndNext}
        style={styles.nextButton}
      />
    </View>
  );
};

// Interest Selection Step Component
const InterestSelectionStep: React.FC<StepProps> = ({ 
  onNext, 
  onBack, 
  profileData, 
  setProfileData 
}) => {
  const toggleInterest = (interestId: string) => {
    const currentInterests = profileData.interests;
    const isSelected = currentInterests.includes(interestId);
    
    if (isSelected) {
      setProfileData({ 
        interests: currentInterests.filter(id => id !== interestId) 
      });
    } else {
      setProfileData({ 
        interests: [...currentInterests, interestId] 
      });
    }
  };

  const validateAndNext = () => {
    if (profileData.interests.length === 0) {
      Alert.alert(
        'Select Interests',
        'Please select at least one category you\'re interested in.',
        [{ text: 'OK' }]
      );
      return;
    }
    onNext();
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.stepTitle}>What interests you?</Text>
      </View>
      
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepSubtitle}>
          Select categories you're interested in. This helps us show you relevant items.
        </Text>
        
        <View style={styles.interestsGrid}>
          {INTEREST_CATEGORIES.map((category) => {
            const isSelected = profileData.interests.includes(category.id);
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.interestCard,
                  isSelected && styles.interestCardSelected
                ]}
                onPress={() => toggleInterest(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={32}
                  color={isSelected ? '#FFFFFF' : '#119C21'}
                />
                <Text style={[
                  styles.interestText,
                  isSelected && styles.interestTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={styles.selectionCount}>
          {profileData.interests.length} categories selected
        </Text>
      </ScrollView>
      
      <Button
        title="Continue"
        onPress={validateAndNext}
        style={styles.nextButton}
      />
    </View>
  );
};

// Location Permission Step Component
const LocationPermissionStep: React.FC<StepProps> = ({ 
  onNext, 
  onBack, 
  isLoading, 
  setIsLoading 
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestLocationPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await locationService.requestPermissions();
      setPermissionGranted(granted);
      
      if (granted) {
        // Try to get current location to test
        await locationService.getCurrentLocation();
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'There was an issue accessing your location. You can enable it later in settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const skipLocation = () => {
    Alert.alert(
      'Skip Location',
      'You can enable location services later in your profile settings to see nearby items.',
      [
        { text: 'Go Back', style: 'cancel' },
        { text: 'Skip', onPress: onNext }
      ]
    );
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.stepTitle}>Enable Location</Text>
      </View>
      
      <View style={styles.stepContent}>
        <View style={styles.permissionIcon}>
          <Ionicons 
            name={permissionGranted ? "checkmark-circle" : "location"} 
            size={80} 
            color={permissionGranted ? "#119C21" : "#6B7280"} 
          />
        </View>
        
        <Text style={styles.stepSubtitle}>
          {permissionGranted 
            ? "Great! Location access enabled successfully."
            : "Allow SwapIt to access your location to discover items near you and help others find your listings."
          }
        </Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Ionicons name="search" size={20} color="#119C21" />
            <Text style={styles.benefitText}>Find items nearby</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="map" size={20} color="#119C21" />
            <Text style={styles.benefitText}>Show your items to local users</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="notifications" size={20} color="#119C21" />
            <Text style={styles.benefitText}>Get notified about nearby items</Text>
          </View>
        </View>
        
        {permissionGranted && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>
              Location access is now enabled. You're all set!
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        {!permissionGranted ? (
          <>
            <Button
              title={isLoading ? "Requesting..." : "Enable Location"}
              onPress={requestLocationPermission}
              disabled={isLoading}
              style={styles.nextButton}
            />
            <TouchableOpacity onPress={skipLocation} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button
            title="Continue"
            onPress={onNext}
            style={styles.nextButton}
          />
        )}
      </View>
    </View>
  );
};

// Notification Permission Step Component
const NotificationPermissionStep: React.FC<StepProps> = ({ 
  onNext, 
  onBack, 
  isLoading, 
  setIsLoading 
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestNotificationPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermissions();
      setPermissionGranted(granted);
    } catch (error) {
      Alert.alert(
        'Notification Error',
        'There was an issue setting up notifications. You can enable them later in settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const skipNotifications = () => {
    Alert.alert(
      'Skip Notifications',
      'You can enable notifications later in your profile settings to stay updated on swap requests and messages.',
      [
        { text: 'Go Back', style: 'cancel' },
        { text: 'Skip', onPress: onNext }
      ]
    );
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.stepTitle}>Stay Updated</Text>
      </View>
      
      <View style={styles.stepContent}>
        <View style={styles.permissionIcon}>
          <Ionicons 
            name={permissionGranted ? "checkmark-circle" : "notifications"} 
            size={80} 
            color={permissionGranted ? "#119C21" : "#6B7280"} 
          />
        </View>
        
        <Text style={styles.stepSubtitle}>
          {permissionGranted 
            ? "Perfect! You'll now receive important notifications."
            : "Enable notifications to stay updated on swap requests, messages, and new items near you."
          }
        </Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Ionicons name="swap-horizontal" size={20} color="#119C21" />
            <Text style={styles.benefitText}>New swap requests</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="chatbubble" size={20} color="#119C21" />
            <Text style={styles.benefitText}>Messages from other users</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="location" size={20} color="#119C21" />
            <Text style={styles.benefitText}>Items available nearby</Text>
          </View>
        </View>
        
        {permissionGranted && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>
              Notifications are now enabled. You won't miss anything important!
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        {!permissionGranted ? (
          <>
            <Button
              title={isLoading ? "Setting up..." : "Enable Notifications"}
              onPress={requestNotificationPermission}
              disabled={isLoading}
              style={styles.nextButton}
            />
            <TouchableOpacity onPress={skipNotifications} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button
            title="Continue"
            onPress={onNext}
            style={styles.nextButton}
          />
        )}
      </View>
    </View>
  );
};

// Completion Step Component
const CompletionStep: React.FC<StepProps> = ({ 
  profileData, 
  isLoading, 
  setIsLoading 
}) => {
  const { user } = useAuthStore();

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // TODO: Update user profile with onboarding data when API is available
      // await userApi.updateProfile({
      //   bio: profileData.bio,
      //   location_name: profileData.location,
      //   interests: profileData.interests,
      //   onboarding_completed: true
      // });
      
      // For now, just navigate to main app
      router.replace('/(tabs)/discover');
    } catch (error) {
      Alert.alert(
        'Setup Error',
        'There was an issue completing your setup. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.completionContent}>
        <View style={styles.completionIcon}>
          <Ionicons name="checkmark-circle" size={100} color="#119C21" />
        </View>
        
        <Text style={styles.completionTitle}>You're all set!</Text>
        <Text style={styles.completionSubtitle}>
          Welcome to SwapIt, {user?.user_metadata?.full_name || 'there'}! 
          Your profile is ready and you can start discovering amazing items in your community.
        </Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Profile Summary:</Text>
          <View style={styles.summaryItem}>
            <Ionicons name="person" size={16} color="#6B7280" />
            <Text style={styles.summaryText}>Bio: {profileData.bio.substring(0, 50)}...</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.summaryText}>Location: {profileData.location}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="heart" size={16} color="#6B7280" />
            <Text style={styles.summaryText}>
              Interests: {profileData.interests.length} categories selected
            </Text>
          </View>
        </View>
      </View>
      
      <Button
        title={isLoading ? "Finishing setup..." : "Start Swapping!"}
        onPress={completeOnboarding}
        disabled={isLoading}
        style={styles.nextButton}
      />
    </View>
  );
};

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    location: '',
    interests: [],
  });

  const scrollViewRef = useRef<ScrollView>(null);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      subtitle: 'Get started with SwapIt',
      component: WelcomeStep,
    },
    {
      id: 'profile',
      title: 'Profile Setup',
      subtitle: 'Tell us about yourself',
      component: ProfileSetupStep,
    },
    {
      id: 'interests',
      title: 'Interests',
      subtitle: 'What are you interested in?',
      component: InterestSelectionStep,
    },
    {
      id: 'location',
      title: 'Location',
      subtitle: 'Enable location services',
      component: LocationPermissionStep,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Stay updated',
      component: NotificationPermissionStep,
    },
    {
      id: 'completion',
      title: 'Complete',
      subtitle: 'You\'re ready to go!',
      component: CompletionStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Scroll to next step
      scrollViewRef.current?.scrollTo({
        x: nextStep * screenWidth,
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Scroll to previous step
      scrollViewRef.current?.scrollTo({
        x: prevStep * screenWidth,
        animated: true,
      });
    }
  };

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>

      {/* Step Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.stepsContainer}
      >
        {steps.map((step) => {
          const StepComponent = step.component;
          return (
            <View key={step.id} style={styles.stepWrapper}>
              <StepComponent
                onNext={handleNext}
                onBack={handleBack}
                profileData={profileData}
                setProfileData={updateProfileData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#119C21',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepsContainer: {
    flex: 1,
  },
  stepWrapper: {
    width: screenWidth,
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#021229',
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  nextButton: {
    marginTop: 'auto',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Welcome Step Styles
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#021229',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
    fontWeight: '500',
  },
  
  // Profile Setup Styles
  bioInput: {
    marginBottom: 24,
  },
  
  // Interest Selection Styles
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  interestCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  interestCardSelected: {
    backgroundColor: '#119C21',
    borderColor: '#119C21',
  },
  interestText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  interestTextSelected: {
    color: '#FFFFFF',
  },
  selectionCount: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Permission Steps Styles
  permissionIcon: {
    alignItems: 'center',
    marginBottom: 32,
  },
  benefitsList: {
    marginTop: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  successMessage: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successText: {
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Completion Step Styles
  completionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionIcon: {
    marginBottom: 32,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#021229',
    marginBottom: 16,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
});