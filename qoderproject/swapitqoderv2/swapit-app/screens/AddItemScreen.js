import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useTheme } from '../contexts/ThemeContext';
import BoostItemPopup from '../components/BoostItemPopup';
// Import Auth context
import { useAuth } from '../contexts/AuthContext';

const AddItemScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { user, isEmailVerified } = useAuth();
  const [itemType, setItemType] = useState('swap'); // 'swap' or 'drop'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('New');
  const [location, setLocation] = useState('');
  const [swapPreferences, setSwapPreferences] = useState([]);
  const [addAnother, setAddAnother] = useState(false);
  const [images, setImages] = useState([]);
  const [newPreference, setNewPreference] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showBoostPopup, setShowBoostPopup] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  // Sample categories data
  const categories = [
    'Electronics', 'Books', 'Clothing', 'Home & Garden', 
    'Toys & Games', 'Sports & Fitness', 'Art & Crafts', 
    'Beauty & Personal Care', 'Automotive', 'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Check if user is verified before allowing access to add item
  useEffect(() => {
    if (user && !isEmailVerified()) {
      setShowVerificationAlert(true);
    }
  }, [user, isEmailVerified]);

  // Get user's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      // In a real app, you would convert coordinates to address using reverse geocoding
      // For now, we'll just set a placeholder
      setLocation('Current Location');
    } catch (error) {
      console.error('Error getting location:', error);
      setLocation('Berkeley, CA');
    }
  };

  const handleAddItem = () => {
    // Handle adding the item
    console.log({
      itemType,
      title,
      description,
      category,
      condition,
      location,
      swapPreferences,
      addAnother,
      images
    });
    
    if (addAnother) {
      // Reset form fields except addAnother
      setTitle('');
      setDescription('');
      setCategory('');
      setCondition('New');
      setLocation('');
      setSwapPreferences([]);
      setImages([]);
      setNewPreference('');
    } else {
      // Show boost popup after adding item
      setShowBoostPopup(true);
    }
  };

  const handleBoostItem = (option) => {
    setShowBoostPopup(false);
    // In a real app, this would integrate with Payrexx payment system
    console.log('Boosting item for', option.days, 'days at', option.price);
    Alert.alert(
      'Boost Item',
      `You've selected to boost your item for ${option.days} day${option.days > 1 ? 's' : ''} at ${option.price}. This would integrate with Payrexx payment system.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const selectImage = async () => {
    // Check if we've reached the maximum number of images
    if (images.length >= 7) {
      Alert.alert('Maximum Images', 'You can only upload up to 7 images.');
      return;
    }

    // Show options to select image from camera or gallery
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: pickImageFromCamera,
        },
        {
          text: 'Gallery',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromCamera = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const pickImageFromGallery = async () => {
    // Request gallery permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to make this work!');
      return;
    }

    // Launch image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 7 - images.length, // Limit selection based on remaining slots
    });

    if (!result.canceled) {
      // Add selected images to the state
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const addPreference = () => {
    if (newPreference.trim()) {
      setSwapPreferences([...swapPreferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const removePreference = (index) => {
    const newPreferences = [...swapPreferences];
    newPreferences.splice(index, 1);
    setSwapPreferences(newPreferences);
  };

  const handleVerifyEmail = () => {
    setShowVerificationAlert(false);
    navigation.navigate('EmailVerification');
  };

  const handleGoBack = () => {
    setShowVerificationAlert(false);
    navigation.goBack();
  };

  // Apply theme styles
  const themedStyles = {
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    header: {
      ...styles.header,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F7F5EC',
    },
    title: {
      ...styles.title,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    formContainer: {
      ...styles.formContainer,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#FFFFFF',
    },
    label: {
      ...styles.label,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    input: {
      ...styles.input,
      backgroundColor: isDarkMode ? '#2d2d2d' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#6E6D7A',
      borderColor: isDarkMode ? '#444444' : '#E7E8EC',
    },
    textArea: {
      ...styles.textArea,
      backgroundColor: isDarkMode ? '#2d2d2d' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#6E6D7A',
      borderColor: isDarkMode ? '#444444' : '#E7E8EC',
    },
    pickerContainer: {
      ...styles.pickerContainer,
      backgroundColor: isDarkMode ? '#2d2d2d' : '#FFFFFF',
      borderColor: isDarkMode ? '#444444' : '#E7E8EC',
    },
    pickerText: {
      ...styles.pickerText,
      color: isDarkMode ? '#FFFFFF' : '#6E6D7A',
    },
    imageUploadContainer: {
      ...styles.imageUploadContainer,
      backgroundColor: isDarkMode ? '#2d2d2d' : '#FFFFFF',
      borderColor: isDarkMode ? '#444444' : '#E7E8EC',
    },
    preferenceContainer: {
      ...styles.preferenceContainer,
      backgroundColor: isDarkMode ? '#2d2d2d' : '#FFFFFF',
      borderColor: isDarkMode ? '#444444' : '#E7E8EC',
    },
    preferenceText: {
      ...styles.preferenceText,
      color: isDarkMode ? '#FFFFFF' : '#6E6D7A',
    },
    addButton: {
      ...styles.addButton,
      backgroundColor: isDarkMode ? '#119C21' : '#119C21',
    },
    addButtonText: {
      ...styles.addButtonText,
      color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
    },
    addItemButton: {
      ...styles.addItemButton,
      backgroundColor: isDarkMode ? '#119C21' : '#119C21',
    },
    addItemButtonText: {
      ...styles.addItemButtonText,
      color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
    },
  };

  return (
    <View style={themedStyles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#121212' : '#F7F5EC'} />
      
      {/* Header */}
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFFFFF' : '#021229'} />
        </TouchableOpacity>
        <Text style={themedStyles.title}>Add Item</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Verification Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showVerificationAlert}
        onRequestClose={handleGoBack}
      >
        <View style={themedStyles.centeredView}>
          <View style={themedStyles.modalView}>
            <View style={themedStyles.iconContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF9500" />
            </View>
            
            <Text style={themedStyles.modalTitle}>Email Verification Required</Text>
            
            <Text style={themedStyles.modalMessage}>
              Please verify your email address to add items and access other features.
            </Text>
            
            <View style={themedStyles.modalButtonContainer}>
              <TouchableOpacity
                style={[themedStyles.modalButton, themedStyles.verifyButton]}
                onPress={handleVerifyEmail}
              >
                <Text style={themedStyles.verifyButtonText}>Verify Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[themedStyles.modalButton, themedStyles.cancelButton]}
                onPress={handleGoBack}
              >
                <Text style={themedStyles.cancelButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Form */}
      <ScrollView style={themedStyles.formContainer} contentContainerStyle={themedStyles.formContent}>
        {/* Item Type Selector */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Item Type</Text>
          <View style={themedStyles.segmentedControl}>
            <TouchableOpacity
              style={[themedStyles.segment, itemType === 'swap' && themedStyles.activeSegment]}
              onPress={() => setItemType('swap')}
            >
              <Text style={[themedStyles.segmentText, itemType === 'swap' && themedStyles.activeSegmentText]}>Swap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[themedStyles.segment, itemType === 'drop' && themedStyles.activeSegment]}
              onPress={() => setItemType('drop')}
            >
              <Text style={[themedStyles.segmentText, itemType === 'drop' && themedStyles.activeSegmentText]}>Drop Off</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Title</Text>
          <TextInput
            style={themedStyles.input}
            placeholder="Enter item title"
            placeholderTextColor={isDarkMode ? '#888888' : '#C7D1D9'}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Description</Text>
          <TextInput
            style={[themedStyles.input, themedStyles.textArea]}
            placeholder="Describe your item"
            placeholderTextColor={isDarkMode ? '#888888' : '#C7D1D9'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Category</Text>
          <TouchableOpacity
            style={themedStyles.pickerContainer}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={themedStyles.pickerText}>
              {category || 'Select category'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={isDarkMode ? '#FFFFFF' : '#6E6D7A'} />
          </TouchableOpacity>
        </View>

        {/* Condition */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Condition</Text>
          <TouchableOpacity
            style={themedStyles.pickerContainer}
            onPress={() => setShowConditionModal(true)}
          >
            <Text style={themedStyles.pickerText}>
              {condition}
            </Text>
            <Ionicons name="chevron-down" size={20} color={isDarkMode ? '#FFFFFF' : '#6E6D7A'} />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Location</Text>
          <View style={themedStyles.locationContainer}>
            <TextInput
              style={[themedStyles.input, themedStyles.locationInput]}
              placeholder="Enter location"
              placeholderTextColor={isDarkMode ? '#888888' : '#C7D1D9'}
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={themedStyles.locationButton}>
              <Ionicons name="location" size={20} color="#021229" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Images */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Images</Text>
          <TouchableOpacity style={themedStyles.imageUploadContainer} onPress={selectImage}>
            <Ionicons name="camera" size={24} color={isDarkMode ? '#FFFFFF' : '#6E6D7A'} />
            <Text style={themedStyles.imageUploadText}>Upload Images</Text>
          </TouchableOpacity>
          
          {/* Image previews */}
          {images.length > 0 && (
            <ScrollView horizontal style={themedStyles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <View key={index} style={themedStyles.imagePreviewWrapper}>
                  <Image source={{ uri }} style={themedStyles.imagePreview} />
                  <TouchableOpacity
                    style={themedStyles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Swap Preferences (only for swap items) */}
        {itemType === 'swap' && (
          <View style={themedStyles.section}>
            <Text style={themedStyles.label}>Swap Preferences</Text>
            <View style={themedStyles.preferenceContainer}>
              <TextInput
                style={[themedStyles.input, themedStyles.preferenceInput]}
                placeholder="What would you like to swap for?"
                placeholderTextColor={isDarkMode ? '#888888' : '#C7D1D9'}
                value={newPreference}
                onChangeText={setNewPreference}
              />
              <TouchableOpacity style={themedStyles.addButton} onPress={addPreference}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Preference tags */}
            {swapPreferences.length > 0 && (
              <View style={themedStyles.preferenceTagsContainer}>
                {swapPreferences.map((preference, index) => (
                  <View key={index} style={themedStyles.preferenceTag}>
                    <Text style={themedStyles.preferenceText}>{preference}</Text>
                    <TouchableOpacity onPress={() => removePreference(index)}>
                      <Ionicons name="close" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Add Another Toggle */}
        <View style={themedStyles.section}>
          <View style={themedStyles.toggleContainer}>
            <Text style={themedStyles.toggleLabel}>Add another item after this</Text>
            <TouchableOpacity
              style={[themedStyles.toggle, addAnother && themedStyles.toggleActive]}
              onPress={() => setAddAnother(!addAnother)}
            >
              <View style={[themedStyles.toggleThumb, addAnother && themedStyles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Item Button */}
      <View style={themedStyles.buttonContainer}>
        <TouchableOpacity style={themedStyles.addItemButton} onPress={handleAddItem}>
          <Text style={themedStyles.addItemButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={themedStyles.centeredView}>
          <View style={themedStyles.modalView}>
            <View style={themedStyles.modalHeader}>
              <Text style={themedStyles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#021229'} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={themedStyles.modalItem}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={themedStyles.modalItemText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Condition Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConditionModal}
        onRequestClose={() => setShowConditionModal(false)}
      >
        <View style={themedStyles.centeredView}>
          <View style={themedStyles.modalView}>
            <View style={themedStyles.modalHeader}>
              <Text style={themedStyles.modalTitle}>Select Condition</Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#021229'} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {conditions.map((cond, index) => (
                <TouchableOpacity
                  key={index}
                  style={themedStyles.modalItem}
                  onPress={() => {
                    setCondition(cond);
                    setShowConditionModal(false);
                  }}
                >
                  <Text style={themedStyles.modalItemText}>{cond}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Boost Item Popup */}
      <BoostItemPopup
        visible={showBoostPopup}
        onClose={() => setShowBoostPopup(false)}
        onBoost={handleBoostItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#021229',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  formContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 8,
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
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F7F5EC',
    borderRadius: 16,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeSegment: {
    backgroundColor: '#119C21',
  },
  segmentText: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: '#D8F7D7',
    borderRadius: 16,
    padding: 12,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
    padding: 16,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#6E6D7A',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginTop: 12,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  preferenceInput: {
    flex: 1,
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  preferenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  preferenceText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#021229',
  },
  toggle: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E7E8EC',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#119C21',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    marginLeft: 26,
  },
  buttonContainer: {
    padding: 16,
  },
  addItemButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addItemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#021229',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
  },
  modalItemText: {
    fontSize: 16,
    color: '#021229',
  },
  iconContainer: {
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6E6D7A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButton: {
    backgroundColor: '#119C21',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F7F5EC',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  cancelButtonText: {
    color: '#021229',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddItemScreen;