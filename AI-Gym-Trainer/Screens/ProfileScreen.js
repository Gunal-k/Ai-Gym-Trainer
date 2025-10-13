import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const GOALS = [
  'Lose Weight',
  'Build Muscle',
  'Improve Endurance',
  'Maintain Fitness',
  'Increase Flexibility',
  'Build lean muscle mass',
];

// This component will manage both viewing and editing states.
const ProfileScreen = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', options: [] });

  // State for user data. Initialize with some mock data.
  const [profile, setProfile] = useState({
    name: 'Sophia Rodriguez',
    email: 'sophia.rodriguez@example.com',
    height: '168',
    weight: '62',
    gender: 'Female',
    goal: 'Build lean muscle mass',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
  });

  // Handler to update profile state
  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveChanges = () => {
    // In a real app, you would save the data to a backend here.
    console.log('Saving changes:', profile);
    setIsEditMode(false);
  };
  
  const openPickerModal = (type, options) => {
    setModalContent({ type, options });
    setModalVisible(true);
  };

  const handleSelection = (value) => {
    // `modalContent.type` will be 'gender' or 'goal'
    handleInputChange(modalContent.type, value);
    setModalVisible(false);
  };

  const handlePickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.8,
    });

    if (!result.canceled) {
      handleInputChange('profilePic', result.assets[0].uri);
    }
  };

  // A reusable component for rows in view mode
  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
  
  // A reusable component for input fields in edit mode
  const InputField = ({ label, value, onChangeText, unit, keyboardType = 'default' }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
        {unit && <Text style={styles.inputUnit}>{unit}</Text>}
      </View>
    </View>
  );

  // A reusable component for dropdowns in edit mode
  const PickerField = ({ label, value, onPress }) => (
      <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TouchableOpacity style={styles.pickerContainer} onPress={onPress}>
              <Text style={styles.pickerText}>{value}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
      </View>
  );


  const renderViewMode = () => (
    <>
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <Image source={{ uri: profile.profilePic }} style={styles.profilePicSmall} />
          <View>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <DetailRow label="Height" value={`${profile.height} cm`} />
        <DetailRow label="Weight" value={`${profile.weight} kg`} />
        <DetailRow label="Gender" value={profile.gender} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fitness Goals</Text>
        <Text style={styles.goalText}>{profile.goal}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditMode(true)}>
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
    </>
  );

  const renderEditMode = () => (
    <>
      <View style={{alignItems: 'center', marginBottom: 24}}>
          <TouchableOpacity onPress={handlePickImage}>
            <Image source={{ uri: profile.profilePic }} style={styles.profilePicLarge} />
            <View style={styles.profilePicOverlay}>
              <Ionicons name="camera-outline" size={24} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <InputField label="Full Name" value={profile.name} onChangeText={(val) => handleInputChange('name', val)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Physical Details</Text>
        <InputField label="Height" value={profile.height} onChangeText={(val) => handleInputChange('height', val)} unit="cm" keyboardType="numeric" />
        <InputField label="Weight" value={profile.weight} onChangeText={(val) => handleInputChange('weight', val)} unit="kg" keyboardType="numeric" />
        <PickerField label="Gender" value={profile.gender} onPress={() => openPickerModal('gender', GENDERS)} />
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fitness Goals</Text>
        <PickerField label="Your Goals" value={profile.goal} onPress={() => openPickerModal('goal', GOALS)} />
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleSaveChanges}>
        <Text style={styles.actionButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text> 
        {isEditMode ? (<TouchableOpacity onPress={() => setIsEditMode(false)}><Text style={{color: COLORS.primary}}>Cancel</Text></TouchableOpacity>) : (<TouchableOpacity onPress={() => setIsEditMode(true)}><Ionicons name="create-outline" size={24} color={COLORS.textDark} /></TouchableOpacity>)}
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isEditMode ? renderEditMode() : renderViewMode()}

        {/* Reusable Picker Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {modalContent.type === 'gender' ? 'Gender' : 'Goal'}</Text>
              {modalContent.options.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => handleSelection(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 16 },
  
  // View Mode Styles
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  profilePicSmall: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  userEmail: { fontSize: 14, color: COLORS.textSecondary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: 16, color: COLORS.textSecondary },
  detailValue: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
  goalText: { fontSize: 16, color: COLORS.textDark, lineHeight: 24 },

  // Edit Mode Styles
  profilePicLarge: { width: 100, height: 100, borderRadius: 50 },
  profilePicOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: COLORS.textDark },
  inputUnit: { fontSize: 16, color: COLORS.textSecondary },
  pickerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14 },
  pickerText: { fontSize: 16, color: COLORS.textDark },

  // Action Button
  actionButton: { backgroundColor: COLORS.secondaryGreen, padding: 18, borderRadius: 28, alignItems: 'center', marginTop: 10 },
  actionButtonText: { color: COLORS.textLight, fontSize: 18, fontWeight: 'bold' },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40, // Extra padding for safe area
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  modalCloseButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;