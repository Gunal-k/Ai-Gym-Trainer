import React, { useState, useEffect } from 'react'; // useEffect was missing
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { signOut } from "firebase/auth";

// --- FIREBASE IMPORTS ---
import { auth, db, storage } from '../firebaseConfig'; // Make sure this path is correct
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const GOALS = [
  'Lose Weight',
  'Build Muscle',
  'Improve Endurance',
  'Maintain Fitness',
  'Increase Flexibility',
  'Build lean muscle mass',
];

const ProfileScreen = ({ navigation }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', options: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  // Fetch profile data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true; // Prevents state updates on unmounted component

      const fetchProfileData = async () => {
        setIsLoading(true);
        try {
          const user = auth.currentUser;
          if (user && isActive) {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setProfile(docSnap.data());
            } else {
              const defaultProfile = {
                name: user.displayName || 'New User',
                email: user.email,
                height: '', weight: '', gender: '', goal: '',
                profilePic: user.photoURL || '',
              };
              setProfile(defaultProfile);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Optionally, set an error state here to show a message to the user
        } finally {
          // This block ALWAYS runs, whether the fetch succeeds or fails.
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      fetchProfileData();

      return () => {
        isActive = false; // Cleanup function
      };
    }, [])
  );

  const uploadImageToCloudinary = async (uri) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: `image/jpeg`, // Or use a library to detect mimetype
      name: `profile-pic.jpg`,
    });
    formData.append('upload_preset', uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Upload failed: ' + (data.error ? data.error.message : 'Unknown error'));
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage here
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        handleInputChange('profilePic', result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error saving profile:", error);

      // Log full error payload if available
      if (error.customData) {
        console.error("Error customData:", error.customData);
      }
      if (error.customData && error.customData.serverResponse) {
        console.error("Server response:", error.customData.serverResponse);
      }

      Alert.alert("Error", "Could not save your changes. Please try again.");
    }
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (!user || !profile) {
      Alert.alert("Error", "Could not save profile. No user found.");
      return;
    }

    setIsSaving(true);
    let dataToSave = { ...profile };

    try {
      // Check if a NEW image was picked (the URI will start with 'file://')
      if (profile.profilePic && profile.profilePic.startsWith('file://')) {
        // Upload to Cloudinary instead of Firebase Storage
        const downloadURL = await uploadImageToCloudinary(profile.profilePic);
        
        // Update the data object with the new public URL from Cloudinary
        dataToSave.profilePic = downloadURL;
      }

      // Update the user's document in Firestore (this part is the same)
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, dataToSave);
      
      setProfile(dataToSave);
      Alert.alert("Success", "Your profile has been updated.");
      setIsEditMode(false);

    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Could not save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const openPickerModal = (type, options) => {
    setModalContent({ type, options });
    setModalVisible(true);
  };

  const handleSelection = (value) => {
    handleInputChange(modalContent.type, value);
    setModalVisible(false);
  };

  // Reusable components (DetailRow, InputField, PickerField) are great, no changes needed.
  const DetailRow = ({ label, value }) => ( <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View> );
  const InputField = ({ label, value, onChangeText, unit, keyboardType = 'default' }) => ( <View style={styles.inputGroup}><Text style={styles.label}>{label}</Text><View style={styles.inputContainer}><TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholderTextColor={COLORS.textSecondary} />{unit && <Text style={styles.unitText}>{unit}</Text>}</View></View> );
  const PickerField = ({ label, value, onPress }) => ( <View style={styles.inputGroup}><Text style={styles.label}>{label}</Text><TouchableOpacity style={styles.pickerContainer} onPress={onPress}><Text style={styles.pickerText}>{value || 'Select...'}</Text><Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} /></TouchableOpacity></View> );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select {modalContent.type}</Text>
          {modalContent.options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.modalOption} onPress={() => handleSelection(option)}>
              <Text style={styles.modalOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (isLoading) {
    return ( <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={COLORS.primary} /></SafeAreaView> );
  }

  if (!profile) {
    return ( <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}><Text>Could not load profile.</Text><TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}><Text style={styles.actionButtonText}>Log Out</Text></TouchableOpacity></SafeAreaView> );
  }

  const renderViewMode = () => (
    <>
      <View style={styles.card}><View style={styles.userInfo}><Image
        source={{ uri: profile.profilePic }}
        style={styles.profilePicSmall}
      /><View><Text style={styles.userName}>{profile.name}</Text><Text style={styles.userEmail}>{profile.email}</Text></View></View></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Personal Details</Text><DetailRow label="Height" value={`${profile.height || 'N/A'} cm`} /><DetailRow label="Weight" value={`${profile.weight || 'N/A'} kg`} /><DetailRow label="Gender" value={profile.gender || 'N/A'} /></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Fitness Goals</Text><Text style={styles.goalText}>{profile.goal || 'N/A'}</Text></View>
      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditMode(true)}><Text style={styles.actionButtonText}>Edit Profile</Text></TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}><Text style={styles.actionButtonText}>Log Out</Text></TouchableOpacity>
    </>
  );

  const renderEditMode = () => (
    <>
      <View style={{ alignItems: 'center', marginBottom: 24 }}><TouchableOpacity onPress={handlePickImage}>
  <Image 
    source={{ uri: profile.profilePic }} 
    style={styles.profilePicLarge} 
  />
  <View style={styles.profilePicOverlay}>
    <Ionicons name="camera-outline" size={24} color={'#fff'} />
  </View>
</TouchableOpacity></View>
      <View style={styles.card}><InputField label="Full Name" value={profile.name} onChangeText={(val) => handleInputChange('name', val)} /></View>
      <View style={styles.card}><InputField label="Height" value={String(profile.height)} onChangeText={(val) => handleInputChange('height', val)} unit="cm" keyboardType="numeric" /><InputField label="Weight" value={String(profile.weight)} onChangeText={(val) => handleInputChange('weight', val)} unit="kg" keyboardType="numeric" /><PickerField label="Gender" value={profile.gender} onPress={() => openPickerModal('gender', GENDERS)} /></View>
      <View style={styles.card}><PickerField label="Your Goals" value={profile.goal} onPress={() => openPickerModal('goal', GOALS)} /></View>
      <TouchableOpacity style={styles.actionButton} onPress={handleSaveChanges} disabled={isSaving}>{isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Save Changes</Text>}</TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        {isEditMode ? (
          <TouchableOpacity onPress={() => !isSaving && setIsEditMode(false)}>
            <Text style={{ color: COLORS.primary, padding: 10 }}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isEditMode ? renderEditMode() : renderViewMode()}
        {/* --- FIX #1: Added this line to render the modal --- */}
        {renderModal()} 
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Your existing styles are great and do not need changes ---
// (Make sure to have styles for everything, including 'editButton' and 'logoutButton')
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f7f8fa' }, // Example color
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    scrollContainer: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    profilePicSmall: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    userName: { fontSize: 20, fontWeight: 'bold' },
    userEmail: { fontSize: 14, color: 'gray' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    detailLabel: { fontSize: 16, color: 'gray' },
    detailValue: { fontSize: 16, fontWeight: '500' },
    goalText: { fontSize: 16, lineHeight: 24 },
    editButton: { backgroundColor: '#3498db', padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 10 },
    logoutButton: { backgroundColor: '#e74c3c', padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 10 },
    actionButton: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 28, alignItems: 'center', marginTop: 10 },
    actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    profilePicLarge: { width: 120, height: 120, borderRadius: 60 },
    profilePicOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, color: 'gray', marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12 },
    input: { flex: 1, padding: 12, fontSize: 16 },
    unitText: { fontSize: 16, color: 'gray', paddingRight: 12 },
    pickerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12 },
    pickerText: { fontSize: 16, paddingRight: 10 },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingVertical: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalOptionText: { textAlign: 'center', fontSize: 18 },
});

export default ProfileScreen;