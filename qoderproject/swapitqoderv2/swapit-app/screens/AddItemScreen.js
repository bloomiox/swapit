import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useTheme } from '../contexts/ThemeContext';
import BoostItemPopup from '../components/BoostItemPopup';

const AddItemScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
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

  // Sample categories data
  const categories = [
    'Electronics', 'Books', 'Clothing', 'Home & Garden', 
    'Toys & Games', 'Sports & Fitness', 'Art & Crafts', 
    'Beauty & Personal Care', 'Automotive', 'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

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

  // Apply theme styles
  const themedStyles = {
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    appBar: {
      ...styles.appBar,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    appBarTitle: {
      ...styles.appBarTitle,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    content: {
      ...styles.content,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    header: {
      ...styles.header,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    label: {
      ...styles.label,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    labelContainer: {
      ...styles.labelContainer,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    helperText: {
      ...styles.helperText,
      color: isDarkMode ? '#B0B0B0' : '#6E6D7A',
    },
    addPhotoButton: {
      ...styles.addPhotoButton,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    plusIconContainer: {
      ...styles.plusIconContainer,
      backgroundColor: isDarkMode ? '#333333' : '#D8F7D7',
    },
    photoPlaceholder: {
      ...styles.photoPlaceholder,
      backgroundColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    photoContainer: {
      ...styles.photoContainer,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    removePhotoButton: {
      ...styles.removePhotoButton,
      backgroundColor: '#F44336',
    },
    listItem: {
      ...styles.listItem,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    selectedListItem: {
      ...styles.selectedListItem,
      borderColor: isDarkMode ? '#119C21' : '#416B40',
      backgroundColor: isDarkMode ? '#119C21' : '#D8F7D7',
    },
    primaryText: {
      ...styles.primaryText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    selectedPrimaryText: {
      ...styles.selectedPrimaryText,
      color: isDarkMode ? '#FFFFFF' : '#416B40',
    },
    secondaryText: {
      ...styles.secondaryText,
      color: isDarkMode ? '#B0B0B0' : '#6E6D7A',
    },
    input: {
      ...styles.input,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    placeholderText: {
      ...styles.placeholderText,
      color: isDarkMode ? '#B0B0B0' : '#6E6D7A',
    },
    textArea: {
      ...styles.textArea,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    conditionBadge: {
      ...styles.conditionBadge,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    selectedConditionBadge: {
      ...styles.selectedConditionBadge,
      borderColor: isDarkMode ? '#119C21' : '#416B40',
      backgroundColor: isDarkMode ? '#119C21' : '#D8F7D7',
    },
    conditionText: {
      ...styles.conditionText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    selectedConditionText: {
      ...styles.selectedConditionText,
      color: isDarkMode ? '#FFFFFF' : '#416B40',
    },
    inputWithBadges: {
      ...styles.inputWithBadges,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    badge: {
      ...styles.badge,
      backgroundColor: '#119C21',
    },
    badgeText: {
      ...styles.badgeText,
      color: '#FFFFFF',
    },
    buttonsContainer: {
      ...styles.buttonsContainer,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    checkboxText: {
      ...styles.checkboxText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    checkbox: {
      ...styles.checkbox,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    selectedCheckbox: {
      ...styles.selectedCheckbox,
      backgroundColor: '#119C21',
      borderColor: '#119C21',
    },
    addButton: {
      ...styles.addButton,
      backgroundColor: '#119C21',
    },
    addButtonText: {
      ...styles.addButtonText,
      color: '#FFFFFF',
    },
    section: {
      ...styles.section,
      backgroundColor: isDarkMode ? '#121212' : '#F7F5EC',
    },
    modalContainer: {
      ...styles.modalContainer,
      backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      ...styles.modalContent,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    modalTitle: {
      ...styles.modalTitle,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    modalItem: {
      ...styles.modalItem,
      borderBottomColor: isDarkMode ? '#333333' : '#E7E8EC',
    },
    modalItemText: {
      ...styles.modalItemText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
  };

  return (
    <View style={themedStyles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#121212" : "#F7F5EC"} />
      
      {/* App Bar */}
      <View style={themedStyles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={themedStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFFFFF" : "#021229"} />
        </TouchableOpacity>
        <Text style={themedStyles.appBarTitle}>Add Item</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView style={themedStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={themedStyles.header}>Add Item</Text>
        
        {/* Photos Section */}
        <View style={themedStyles.section}>
          <View style={themedStyles.labelContainer}>
            <Text style={themedStyles.label}>Photos</Text>
            <Text style={themedStyles.helperText}>Min 3 & Max 7 photos (each up to 10 MB)</Text>
          </View>
          <View style={themedStyles.photosRow}>
            <TouchableOpacity style={themedStyles.addPhotoButton} onPress={selectImage}>
              <View style={themedStyles.plusIconContainer}>
                <Ionicons name="plus" size={24} color={isDarkMode ? "#FFFFFF" : "#416B40"} />
              </View>
            </TouchableOpacity>
            
            {/* Photo placeholders */}
            {images.map((imageUri, index) => (
              <View key={index} style={themedStyles.photoContainer}>
                <Image source={{ uri: imageUri }} style={themedStyles.photoPlaceholder} />
                <TouchableOpacity 
                  style={themedStyles.removePhotoButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Item Type Section */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Item Type</Text>
          <View style={themedStyles.selectorRow}>
            <TouchableOpacity 
              style={[themedStyles.listItem, itemType === 'swap' && themedStyles.selectedListItem]}
              onPress={() => setItemType('swap')}
            >
              <View style={themedStyles.leftAdornment}>
                <Ionicons name="repeat" size={20} color={itemType === 'swap' ? (isDarkMode ? '#FFFFFF' : '#416B40') : (isDarkMode ? '#FFFFFF' : '#021229')} />
              </View>
              <View style={themedStyles.textContainer}>
                <Text style={[themedStyles.primaryText, itemType === 'swap' && themedStyles.selectedPrimaryText]}>Swap It</Text>
                <Text style={themedStyles.secondaryText}>Exchange for other items</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[themedStyles.listItem, itemType === 'drop' && themedStyles.selectedListItem]}
              onPress={() => setItemType('drop')}
            >
              <View style={themedStyles.leftAdornment}>
                <Ionicons name="arrow-redo" size={20} color={itemType === 'drop' ? (isDarkMode ? '#FFFFFF' : '#416B40') : (isDarkMode ? '#FFFFFF' : '#021229')} />
              </View>
              <View style={themedStyles.textContainer}>
                <Text style={[themedStyles.primaryText, itemType === 'drop' && themedStyles.selectedPrimaryText]}>Drop It</Text>
                <Text style={themedStyles.secondaryText}>Give away for free</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Input */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Title</Text>
          <TextInput
            style={themedStyles.input}
            placeholder="ex: iPhone"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={isDarkMode ? "#B0B0B0" : "#6E6D7A"}
            color={isDarkMode ? "#FFFFFF" : "#021229"}
          />
        </View>

        {/* Description Input */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Description</Text>
          <TextInput
            style={[themedStyles.input, themedStyles.textArea]}
            placeholder="Tell others about this item..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={isDarkMode ? "#B0B0B0" : "#6E6D7A"}
            color={isDarkMode ? "#FFFFFF" : "#021229"}
          />
        </View>

        {/* Category Input */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Category</Text>
          <TouchableOpacity 
            style={themedStyles.input} 
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={category ? themedStyles.primaryText : themedStyles.placeholderText}>
              {category || 'Select Category'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={isDarkMode ? "#FFFFFF" : "#021229"} />
          </TouchableOpacity>
        </View>

        {/* Condition Selector */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Condition</Text>
          <TouchableOpacity 
            style={themedStyles.input} 
            onPress={() => setShowConditionModal(true)}
          >
            <Text style={condition ? themedStyles.primaryText : themedStyles.placeholderText}>
              {condition || 'Select Condition'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={isDarkMode ? "#FFFFFF" : "#021229"} />
          </TouchableOpacity>
        </View>

        {/* Location Input */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.label}>Location</Text>
          <View style={themedStyles.inputWithIcon}>
            <TextInput
              style={[themedStyles.input, { flex: 1, paddingRight: 40 }]}
              placeholder="Enter location"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor={isDarkMode ? "#B0B0B0" : "#6E6D7A"}
              color={isDarkMode ? "#FFFFFF" : "#021229"}
            />
            <TouchableOpacity style={themedStyles.inputIcon} onPress={getCurrentLocation}>
              <Ionicons name="location" size={20} color={isDarkMode ? "#FFFFFF" : "#021229"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Swap Preferences */}
        <View style={themedStyles.section}>
          <View style={themedStyles.labelContainer}>
            <Text style={themedStyles.label}>Swap Preferences</Text>
            <Text style={themedStyles.helperText}>What items would you like to receive in exchange?</Text>
          </View>
          <View style={themedStyles.inputWithBadges}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={themedStyles.badgesContainer}>
              {swapPreferences.map((pref, index) => (
                <View key={index} style={themedStyles.badge}>
                  <Text style={themedStyles.badgeText}>{pref}</Text>
                  <TouchableOpacity onPress={() => removePreference(index)}>
                    <Ionicons name="close" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TextInput
              style={[themedStyles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Add preference (e.g. Books, Electronics)"
              value={newPreference}
              onChangeText={setNewPreference}
              placeholderTextColor={isDarkMode ? "#B0B0B0" : "#6E6D7A"}
              color={isDarkMode ? "#FFFFFF" : "#021229"}
              onSubmitEditing={addPreference}
            />
            <TouchableOpacity style={themedStyles.addButtonSmall} onPress={addPreference}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={themedStyles.buttonsContainer}>
        <TouchableOpacity 
          style={themedStyles.checkboxContainer}
          onPress={() => setAddAnother(!addAnother)}
        >
          <View style={[themedStyles.checkbox, addAnother && themedStyles.selectedCheckbox]}>
            {addAnother && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={themedStyles.checkboxText}>Add another item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={themedStyles.addButton} onPress={handleAddItem}>
          <Text style={themedStyles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={themedStyles.modalContainer}>
          <View style={themedStyles.modalContent}>
            <View style={themedStyles.modalHeader}>
              <Text style={themedStyles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#021229"} />
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
        <View style={themedStyles.modalContainer}>
          <View style={themedStyles.modalContent}>
            <View style={themedStyles.modalHeader}>
              <Text style={themedStyles.modalTitle}>Select Condition</Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#021229"} />
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
        onClose={() => {
          setShowBoostPopup(false);
          navigation.goBack();
        }}
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
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
    paddingTop: 50,
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  content: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    margin: 16,
  },
  section: {
    marginBottom: 24,
    marginHorizontal: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  plusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D8F7D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#E7E8EC',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  selectedListItem: {
    borderColor: '#416B40',
    backgroundColor: '#D8F7D7',
  },
  leftAdornment: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 4,
  },
  selectedPrimaryText: {
    color: '#416B40',
  },
  secondaryText: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  conditionBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    backgroundColor: '#FFFFFF',
  },
  selectedConditionBadge: {
    borderColor: '#416B40',
    backgroundColor: '#D8F7D7',
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#021229',
    marginLeft: 4,
  },
  selectedConditionText: {
    color: '#416B40',
  },
  inputWithBadges: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#119C21',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E7E8EC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedCheckbox: {
    backgroundColor: '#119C21',
    borderColor: '#119C21',
  },
  checkboxText: {
    fontSize: 16,
    color: '#021229',
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
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
});

export default AddItemScreen;