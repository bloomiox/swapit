import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, createUserProfile } from '../utils/api';

const OnboardingOverviewScreen = ({ navigation }) => {
  const { user } = useAuth();

  const handleGetStarted = async () => {
    try {
      // Mark onboarding as completed in the user's profile
      if (user) {
        // Prepare update data
        const updateData = {
          onboarding_completed: true
        };
        
        // Try to update the profile first
        try {
          await updateUserProfile(user.id, updateData);
        } catch (updateError) {
          // If update fails because profile doesn't exist or RLS violation, create it
          if (updateError.code === 'PGRST116' || updateError.code === '42501') {
            await createUserProfile(user.id, updateData);
          } else {
            throw updateError;
          }
        }
      }
      
      // Navigate to the main app
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      // Still navigate to the main app even if we can't update the status
      navigation.replace('MainTabs');
    }
  };

  const handleAddFirstItem = () => {
    // Mark onboarding as completed and navigate to AddItem screen
    handleGetStarted().then(() => {
      navigation.replace('MainTabs'); // Navigate to main tabs first
      // Then navigate to AddItem within the main app
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar - Step 3 of 3 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '100%' }]} />
        </View>
      </View>
      
      {/* Status Bar */}
      <View style={styles.statusBar} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustrationText}>🎉</Text>
        </View>
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>You are all set!</Text>
        <Text style={styles.subtitle}>Ready to start swapping? Add your first item or browse what's available in your area.</Text>
      </View>

      {/* User Profile Info */}
      <View style={styles.infoContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.cameraButton}>
              <View style={styles.cameraIcon} />
            </View>
          </View>
          
          <View style={styles.profileText}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileDescription}>Eco-conscious swapper. Love giving items a second life! Text</Text>
          </View>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon} />
            <Text style={styles.detailText}>Rorschach, Sankt Gallen</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon} />
            <Text style={styles.detailText}>Joined at 19 Dec 2024</Text>
          </View>
        </View>

        <View style={styles.interestsSection}>
          <Text style={styles.interestsTitle}>Interests</Text>
          <View style={styles.badgesContainer}>
            <View style={styles.badge}>
              <View style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Books</Text>
            </View>
            
            <View style={styles.badge}>
              <View style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Electronics</Text>
            </View>
            
            <View style={styles.badge}>
              <View style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Sports & Fitness</Text>
            </View>
            
            <View style={styles.badge}>
              <View style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Toys & Games</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.outlinedButton} onPress={handleAddFirstItem}>
          <Text style={styles.outlinedButtonText}>Add your first item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.containedButton} onPress={handleGetStarted}>
          <Text style={styles.containedButtonText}>Get started</Text>
        </TouchableOpacity>
      </View>
      
      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.indicatorBar} />
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
  statusBar: {
    height: 44,
    backgroundColor: '#F7F5EC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  illustrationText: {
    fontSize: 100,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#021229',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6D7A',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#021229',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#119C21',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  profileText: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 4,
  },
  profileDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6E6D7A',
    lineHeight: 20,
  },
  profileDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    backgroundColor: '#6E6D7A',
    opacity: 0.5,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6E6D7A',
  },
  interestsSection: {
    justifyContent: 'center',
  },
  interestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
    backgroundColor: '#021229',
    opacity: 0.3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#021229',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  outlinedButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
  },
  containedButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  indicatorBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#021229',
  },
});

export default OnboardingOverviewScreen;