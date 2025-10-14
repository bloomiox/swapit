import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import SwapRequestsScreen from './screens/SwapRequestsScreen';
import AddItemScreen from './screens/AddItemScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemDetailsScreen from './screens/ItemDetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SearchScreen from './screens/SearchScreen';
import ChatDetailsScreen from './screens/ChatDetailsScreen';
import UserDetailsScreen from './screens/UserDetailsScreen';
import MapViewScreen from './screens/MapViewScreen';
import FiltersScreen from './screens/FiltersScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import CategoryFilterScreen from './screens/CategoryFilterScreen';
import ConditionFilterScreen from './screens/ConditionFilterScreen';
import DistanceFilterScreen from './screens/DistanceFilterScreen';
import SwapRequestScreen from './screens/SwapRequestScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import OnboardingProfileScreen from './screens/OnboardingProfileScreen';
import OnboardingCategoriesScreen from './screens/OnboardingCategoriesScreen';
import OnboardingOverviewScreen from './screens/OnboardingOverviewScreen';
import HelpScreen from './screens/HelpScreen';
import EditItemScreen from './screens/EditItemScreen';
import BoostItemScreen from './screens/BoostItemScreen';
import MyListingsScreen from './screens/MyListingsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import PaymentScreen from './screens/PaymentScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import ImageCropperScreen from './screens/ImageCropperScreen';
import LocationPickerScreen from './screens/LocationPickerScreen';
import CategorySelectorScreen from './screens/CategorySelectorScreen';
import ReportItemScreen from './screens/ReportItemScreen';
import BlockUserScreen from './screens/BlockUserScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Onboarding stack navigator for users who haven't completed onboarding
function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
      <Stack.Screen name="OnboardingCategories" component={OnboardingCategoriesScreen} />
      <Stack.Screen name="OnboardingOverview" component={OnboardingOverviewScreen} />
    </Stack.Navigator>
  );
}

// Auth stack navigator for unauthenticated users
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
      <Stack.Screen name="OnboardingCategories" component={OnboardingCategoriesScreen} />
      <Stack.Screen name="OnboardingOverview" component={OnboardingOverviewScreen} />
    </Stack.Navigator>
  );
}

// Main tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'repeat' : 'repeat-outline';
          } else if (route.name === 'AddItem') {
            iconName = focused ? 'add' : 'add-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // For the AddItem button, we want it to be larger and always have a background
          if (route.name === 'AddItem') {
            return (
              <View style={{
                backgroundColor: '#119C21',
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons name={iconName} size={24} color="#FFFFFF" />
              </View>
            );
          }

          // For Requests with active state, we need special styling
          if (route.name === 'Requests' && focused) {
            return (
              <View style={{
                backgroundColor: '#D8F7D7',
                borderRadius: 16,
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
              }}>
                <Ionicons name={iconName} size={24} color="#416B40" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#021229',
        tabBarInactiveTintColor: '#6E6D7A',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingVertical: 12,
          height: 80,
          paddingBottom: 32,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Home'
        }} 
      />
      <Tab.Screen 
        name="Requests" 
        component={SwapRequestsScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Requests'
        }} 
      />
      <Tab.Screen 
        name="AddItem" 
        component={AddItemScreen} 
        options={{ 
          headerShown: false, 
          title: 'Add Item',
          tabBarLabel: ''
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Chat'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Profile'
        }} 
      />
    </Tab.Navigator>
  );
}

// Main stack navigator
function MainStack() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();

  // Show splash screen while checking auth state
  if (isLoading) {
    return <SplashScreen />;
  }

  // If user is not logged in, show auth stack
  if (!user) {
    return <AuthStack />;
  }

  // If user is logged in but hasn't completed onboarding, show onboarding stack
  if (!hasCompletedOnboarding()) {
    return <OnboardingStack />;
  }

  // If user is logged in and has completed onboarding, show main app
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="MapView" component={MapViewScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="CategoryFilter" component={CategoryFilterScreen} />
      <Stack.Screen name="ConditionFilter" component={ConditionFilterScreen} />
      <Stack.Screen name="DistanceFilter" component={DistanceFilterScreen} />
      <Stack.Screen name="SwapRequest" component={SwapRequestScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="EditItem" component={EditItemScreen} />
      <Stack.Screen name="BoostItem" component={BoostItemScreen} />
      <Stack.Screen name="MyListings" component={MyListingsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="ImageCropper" component={ImageCropperScreen} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="CategorySelector" component={CategorySelectorScreen} />
      <Stack.Screen name="ReportItem" component={ReportItemScreen} />
      <Stack.Screen name="BlockUser" component={BlockUserScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}