import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme'; // Your theme file

const ExerciseDetailScreen = ({ route, navigation }) => {
  // Get the exercise object passed from the previous screen
  const { exercise } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <ScrollView>
        {/* --- Header Image & Title --- */}
        <ImageBackground source={{ uri: exercise.image }} style={styles.headerImage}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>
        </ImageBackground>

        <View style={styles.container}>
          {/* --- Action Buttons --- */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startButton}
            onPress={() => navigation.navigate('LiveCameraTab')}>
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          </View>

          {/* --- Info Box --- */}
          <View style={styles.infoBox}>
            <View style={styles.infoColumn}>
              <InfoItem icon="time-outline" label="Approx. time" value={`${exercise.time} mins`} />
              <InfoItem icon="analytics-outline" label="Intensity" value={exercise.difficulty} />
            <InfoItem 
            icon="body-outline" 
            label="Target" 
            // Add a check: if exercise.targets is an array, join it. Otherwise, show 'N/A'.
            value={Array.isArray(exercise.targets) ? exercise.targets.join(', ') : 'N/A'} 
            />
            </View>
            <View style={styles.infoColumn}>
              <InfoItem icon="list-outline" label="Sets" value={exercise.sets} />
              <InfoItem icon="checkmark-done-outline" label="Reps" value={exercise.reps} />
            </View>
          </View>

          {/* --- Step-by-Step Instructions --- */}
          <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
          {exercise.steps.map((step) => (
            <View key={step.num} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.num}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            </View>
          ))}

          {/* --- Tip Box --- */}
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color={COLORS.primary} style={styles.tipIcon} />
            <Text style={styles.tipText}>{exercise.tip}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper component for the info box items
const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={COLORS.primary} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  headerImage: {
    width: '100%',
    height: 300,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textLight,
    lineHeight: 34,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    opacity: 0.9,
    marginTop: 4,
  },
  container: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  startButton: {
    flex: 1,
    backgroundColor: COLORS.primaryAction, // A primary color
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  startButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPlanButton: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight, // Lighter color
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: 10,
  },
  addPlanText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  stepHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  stepImage: {
    width: '100%',
    height: 150,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default ExerciseDetailScreen;