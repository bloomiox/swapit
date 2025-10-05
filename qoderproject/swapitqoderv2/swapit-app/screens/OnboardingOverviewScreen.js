import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const OnboardingOverviewScreen = ({ navigation }) => {
  const handleAddFirstItem = () => {
    // Navigate to add item screen or relevant screen
    console.log('Add first item pressed');
  };

  const handleStartSwapping = () => {
    // Navigate to main app
    navigation.replace('MainTabs');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar - Step 3 of 3 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '100%' }]} />
        </View>
      </View>

      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5EC" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonIcon} />
        </TouchableOpacity>
      </View>

      {/* Congrats Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.congratsIllustration}>
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
          <Text style={styles.outlinedButtonText}>Add First Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.containedButton} onPress={handleStartSwapping}>
          <Text style={styles.containedButtonText}>Start Swapping</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.indicatorBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#FFFFFF',
    marginBottom: 28,
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
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#021229',
    opacity: 0.5,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  congratsIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  illustrationText: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6E6D7A',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D8F7D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#119C21',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
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