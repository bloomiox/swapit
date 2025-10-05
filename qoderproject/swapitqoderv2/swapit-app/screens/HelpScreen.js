import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('How it Works');

  const tabs = [
    'How it Works', 
    'About us', 
    'Contact Us', 
    'Privacy Policy', 
    'Impressum',
    'FAQ',
    'Terms of Service',
    'Safety Tips'
  ];

  const renderTab = (tabName) => (
    <TouchableOpacity 
      key={tabName}
      style={[styles.tab, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{tabName}</Text>
    </TouchableOpacity>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'How it Works':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>How SwapIt Works</Text>
            <Text style={styles.contentText}>
              SwapIt is a platform that allows you to exchange items with other users instead of buying new ones. 
              This helps reduce waste and gives your items a second life.
            </Text>
            <Text style={styles.contentText}>
              1. Add items you want to swap by taking photos and providing details
            </Text>
            <Text style={styles.contentText}>
              2. Browse items from other users that you're interested in
            </Text>
            <Text style={styles.contentText}>
              3. Make a swap request by offering one of your items in return
            </Text>
            <Text style={styles.contentText}>
              4. Chat with the other user to arrange the exchange
            </Text>
            <Text style={styles.contentText}>
              5. Meet up and complete the swap!
            </Text>
          </View>
        );
      case 'About us':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>About SwapIt</Text>
            <Text style={styles.contentText}>
              SwapIt was founded in 2024 with a mission to promote sustainable consumption by making it easy 
              for people to exchange items instead of buying new ones.
            </Text>
            <Text style={styles.contentText}>
              Our team believes that many items we own can have a second life with someone else, and we're 
              committed to building a platform that makes this process simple, safe, and enjoyable.
            </Text>
          </View>
        );
      case 'Contact Us':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Contact Us</Text>
            <Text style={styles.contentText}>
              Have questions or feedback? We'd love to hear from you!
            </Text>
            <Text style={styles.contentText}>
              Email: support@swapit.com
            </Text>
            <Text style={styles.contentText}>
              Phone: +1 (555) 123-4567
            </Text>
            <Text style={styles.contentText}>
              Address: 123 Green Street, Eco City, EC 12345
            </Text>
          </View>
        );
      case 'Privacy Policy':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Privacy Policy</Text>
            <Text style={styles.contentText}>
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect 
              your personal information when you use SwapIt.
            </Text>
            <Text style={styles.contentText}>
              We collect information you provide directly to us, such as when you create an account, post items, 
              or communicate with other users.
            </Text>
            <Text style={styles.contentText}>
              We use this information to provide and improve our services, communicate with you, and personalize 
              your experience.
            </Text>
          </View>
        );
      case 'Impressum':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Impressum</Text>
            <Text style={styles.contentText}>
              SwapIt GmbH
            </Text>
            <Text style={styles.contentText}>
              Registered Office: Berlin, Germany
            </Text>
            <Text style={styles.contentText}>
              Commercial Register: District Court of Berlin, HRB 123456
            </Text>
            <Text style={styles.contentText}>
              VAT ID: DE123456789
            </Text>
            <Text style={styles.contentText}>
              Managing Directors: John Doe, Jane Smith
            </Text>
          </View>
        );
      case 'FAQ':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Frequently Asked Questions</Text>
            <Text style={styles.contentText}>
              <Text style={styles.faqQuestion}>How do I add an item to swap?</Text>
              {'\n'}
              Tap the "+" button at the bottom of the screen, then follow the prompts to add photos and details of the item you want to swap.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.faqQuestion}>How do I request a swap?</Text>
              {'\n'}
              Browse items on the Home screen or use the search function. When you find an item you want, tap on it and select "Request Swap".
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.faqQuestion}>How do I communicate with other users?</Text>
              {'\n'}
              After making a swap request, you can chat with the other user directly through the app to arrange the exchange.
            </Text>
            <Text style={styles.contentText}>
              <Text style={styles.faqQuestion}>Is there a fee to use SwapIt?</Text>
              {'\n'}
              Basic swapping is completely free. We offer optional premium features for users who want to boost their items' visibility.
            </Text>
          </View>
        );
      case 'Terms of Service':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Terms of Service</Text>
            <Text style={styles.contentText}>
              These Terms of Service govern your use of the SwapIt platform. By using our services, you agree to these terms.
            </Text>
            <Text style={styles.contentText}>
              You must be at least 13 years old to use SwapIt. If you are under 18, you must have parental consent.
            </Text>
            <Text style={styles.contentText}>
              You are responsible for the content you post, including item descriptions and photos. You must not post illegal, 
              harmful, or inappropriate content.
            </Text>
            <Text style={styles.contentText}>
              SwapIt is not responsible for the items exchanged between users. We recommend meeting in public places and 
              verifying the condition of items before completing exchanges.
            </Text>
          </View>
        );
      case 'Safety Tips':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Safety Tips</Text>
            <Text style={styles.contentText}>
              Your safety is our priority. Follow these tips for a secure swapping experience:
            </Text>
            <Text style={styles.contentText}>
              1. Meet in public places like cafes, libraries, or community centers
            </Text>
            <Text style={styles.contentText}>
              2. Tell a friend or family member about your swap meeting
            </Text>
            <Text style={styles.contentText}>
              3. Verify the condition of items before completing the exchange
            </Text>
            <Text style={styles.contentText}>
              4. Trust your instincts - if something feels off, don't proceed
            </Text>
            <Text style={styles.contentText}>
              5. Use the in-app chat to communicate before meeting in person
            </Text>
            <Text style={styles.contentText}>
              6. Bring a friend along for your first few swaps
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>How SwapIt Works</Text>
            <Text style={styles.contentText}>
              SwapIt is a platform that allows you to exchange items with other users instead of buying new ones. 
              This helps reduce waste and gives your items a second life.
            </Text>
          </View>
        );
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
        <Text style={styles.appBarTitle}>Help</Text>
        <View style={styles.emptySpace} />
      </View>
      
      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
            <View style={styles.tabs}>
              {tabs.map(tab => renderTab(tab))}
            </View>
          </ScrollView>
        </View>
        
        {/* Content */}
        <ScrollView style={styles.contentScrollView}>
          {getContent()}
        </ScrollView>
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
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabsScrollView: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#D8F7D7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6E6D7A',
  },
  activeTabText: {
    color: '#119C21',
  },
  contentScrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: '#6E6D7A',
    lineHeight: 24,
    marginBottom: 16,
  },
  faqQuestion: {
    fontWeight: '700',
    color: '#021229',
  },
});

export default HelpScreen;