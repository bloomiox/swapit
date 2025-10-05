import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const toggleLocation = () => {
    setLocation(!location);
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const togglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { title: 'Edit Profile', icon: 'person-outline', action: () => navigation.navigate('EditProfile') },
        { title: 'Change Password', icon: 'lock-closed-outline', action: () => console.log('Change Password') },
        { title: 'Privacy Policy', icon: 'shield-checkmark-outline', action: () => console.log('Privacy Policy') },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { title: 'Email Notifications', icon: 'mail-outline', action: toggleEmailNotifications, switch: true, value: emailNotifications },
        { title: 'Push Notifications', icon: 'notifications-outline', action: togglePushNotifications, switch: true, value: pushNotifications },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { title: 'Dark Mode', icon: 'moon-outline', action: toggleDarkMode, switch: true, value: isDarkMode },
        { title: 'Location Services', icon: 'location-outline', action: toggleLocation, switch: true, value: location },
      ]
    }
  ];

  // Apply theme styles
  const themedStyles = {
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    section: {
      ...styles.section,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    settingText: {
      ...styles.settingText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    settingItem: {
      ...styles.settingItem,
      borderBottomColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    appBar: {
      ...styles.appBar,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    appBarTitle: {
      ...styles.appBarTitle,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    statusBar: {
      ...styles.statusBar,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    time: {
      ...styles.time,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    batteryFill: {
      ...styles.batteryFill,
      backgroundColor: isDarkMode ? '#FFFFFF' : '#021229',
    },
    batteryContainer: {
      ...styles.batteryContainer,
      borderColor: isDarkMode ? '#FFFFFF' : '#021229',
    },
  };

  return (
    <View style={themedStyles.container}>
      {/* Status Bar */}
      <View style={themedStyles.statusBar}>
        <Text style={themedStyles.time}>9:41</Text>
        <View style={themedStyles.statusIcons}>
          <Ionicons name="signal" size={16} color={isDarkMode ? '#FFFFFF' : '#021229'} />
          <Ionicons name="wifi" size={16} color={isDarkMode ? '#FFFFFF' : '#021229'} />
          <View style={themedStyles.batteryContainer}>
            <View style={themedStyles.batteryFill} />
          </View>
        </View>
      </View>

      {/* App Bar */}
      <View style={themedStyles.appBar}>
        <TouchableOpacity style={themedStyles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFFFFF' : '#021229'} />
        </TouchableOpacity>
        <Text style={themedStyles.appBarTitle}>Settings</Text>
        <View style={themedStyles.emptySpace} />
      </View>

      <ScrollView style={themedStyles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <View key={index} style={themedStyles.section}>
            <Text style={themedStyles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={themedStyles.settingItem}
                onPress={item.action}
              >
                <View style={themedStyles.settingItemLeft}>
                  <Ionicons name={item.icon} size={20} color={isDarkMode ? '#FFFFFF' : '#021229'} style={themedStyles.settingIcon} />
                  <Text style={themedStyles.settingText}>{item.title}</Text>
                </View>
                {item.switch ? (
                  <Switch
                    trackColor={{ false: isDarkMode ? '#333333' : '#E7E8EC', true: '#119C21' }}
                    thumbColor={item.value ? '#FFFFFF' : isDarkMode ? '#B0B0B0' : '#FFFFFF'}
                    ios_backgroundColor={isDarkMode ? '#333333' : '#E7E8EC'}
                    onValueChange={item.action}
                    value={item.value}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#B0B0B0' : '#6E6D7A'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Delete Account */}
        <View style={themedStyles.section}>
          <TouchableOpacity style={themedStyles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" style={themedStyles.deleteIcon} />
            <Text style={themedStyles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#021229',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteIcon: {
    marginRight: 16,
  },
  deleteAccountText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default SettingsScreen;