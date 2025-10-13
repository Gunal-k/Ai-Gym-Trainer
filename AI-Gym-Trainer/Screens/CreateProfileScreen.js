import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const GOALS = [
  'Lose Weight',
  'Build Muscle',
  'Improve Endurance',
  'Maintain Fitness',
  'Increase Flexibility',
];

const CreateProfileScreen = ({ navigation }) => {
  const [gender, setGender] = useState(null); // 'Male' or 'Female'
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState(null); // This would hold the selected goal
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);

  const handleOpenGoalModal = () => {
    setGoalModalVisible(true);
  };

  const handleGoalSelection = (selectedGoal) => {
    setGoal(selectedGoal);
    setGoalModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">

          <Text style={styles.headerTitle}>Create Your Fitness Profile</Text>

          {/* Personal Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'Male' && styles.genderButtonSelected,
                ]}
                onPress={() => setGender('Male')}>
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'Male' && styles.genderButtonTextSelected,
                  ]}>
                Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'Female' && styles.genderButtonSelected,
                ]}
                onPress={() => setGender('Female')}>
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'Female' && styles.genderButtonTextSelected,
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Physical Metrics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Metrics</Text>
            <Text style={styles.label}>Height</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., 175"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <Text style={styles.unitText}>cm</Text>
            </View>

            <Text style={styles.label}>Weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., 70"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <Text style={styles.unitText}>kg</Text>
            </View>

            <Text style={styles.label}>Fitness Goal</Text>
            <TouchableOpacity
              style={[styles.inputContainer, goal && styles.pickerContainerSelected]}
              onPress={handleOpenGoalModal}>
              <Text
                style={[
                  styles.pickerText,
                  goal ? styles.pickerTextSelected : styles.pickerTextPlaceholder,
                ]}>
                {goal || 'Select your primary goal...'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Create Profile Button */}
          <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('MainApp')}>
            <Text style={styles.createButtonText}>Create Profile</Text>
          </TouchableOpacity>

          {/* Goal Selection Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isGoalModalVisible}
            onRequestClose={() => setGoalModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Your Goal</Text>
                {GOALS.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.modalItem}
                    onPress={() => handleGoalSelection(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setGoalModalVisible(false)}>
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: COLORS.card,
  },
  genderButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  }, 
  genderButtonText: {
    fontSize: 16,
    paddingHorizontal: 8,
    color: COLORS.text,
  },
  genderButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  unitText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
  },
  pickerTextPlaceholder: {
    color: COLORS.textSecondary,
  },
  pickerTextSelected: {
    color: COLORS.text,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#1F2937', // Dark text on green button for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
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
  pickerContainerSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  },
});

export default CreateProfileScreen;