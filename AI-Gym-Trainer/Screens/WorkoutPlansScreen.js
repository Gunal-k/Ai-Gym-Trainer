import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator, // --- ADDED for loading state
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// --- ADDED: Import your AI logic and Firebase services ---
import { generateWorkoutPlan } from '../utils/generateWorkoutPlan';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// --- MODIFIED: ExerciseCard now uses the new data structure ---
const ExerciseCard = ({ item }) => (
  <View style={styles.exerciseCard}>
    <Image source={{ uri: item.exercise.image }} style={styles.exerciseImage} />
    <View style={styles.exerciseContent}>
      <Text style={styles.exerciseTitle}>{item.exercise.name}</Text>
      <Text style={styles.exerciseDetails}>{item.exercise.description}</Text>
      <View style={styles.exerciseSets}>
        <MaterialCommunityIcons name="weight-lifter" size={16} color={COLORS.textSecondary} />
        <Text style={styles.exerciseSetsText}>{item.sets} sets of {item.reps}</Text>
      </View>
      {/* This button can later navigate to an instruction screen */}
      <TouchableOpacity style={styles.detailsButtonSecondary}>
        <Text style={styles.detailsButtonTextSecondary}>View Instructions</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const WorkoutPlansScreen = ({ route }) => {
  // --- ADDED: State management for dynamic data ---
  const { analysisResult } = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(true); // --- MODIFIED: Use a single loading state ---
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data for header:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  // --- ADDED: useEffect to fetch user data and generate the plan ---
  useEffect(() => {
    const initializePlan = async () => {
      setLoading(true); // Start loading
      setError(null);   // Clear previous errors
      try {
        // 1. Fetch user's profile data
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user is logged in.");
        }
        
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          
          // 2. Generate the workout plan
          if (analysisResult && userData) {
            const plan = generateWorkoutPlan(analysisResult, userData);
            setGeneratedPlan(plan);
          } else {
            throw new Error("Missing analysis or user data.");
          }
        } else {
          throw new Error("Could not find user profile.");
        }
      } catch (err) {
        console.error("Failed to generate workout plan:", err);
        setError(err.message);
      } finally {
        // 3. ALWAYS stop loading, whether it succeeded or failed
        setLoading(false);
      }
    };
    initializePlan();
  }, [analysisResult]); // Rerun if the analysis result changes

  // --- MODIFIED: Loading and Error UI States ---
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Generating your personalized plan...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text style={{ marginTop: 10, textAlign: 'center' }}>Failed to generate plan: {error}</Text>
      </SafeAreaView>
    );
  }

  // This will show if the plan is null for some other reason
  if (!generatedPlan) {
    return (
        <SafeAreaView style={[styles.safeArea, styles.center]}>
            <Text>No workout plan could be generated.</Text>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Workout Plan</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textDark} />
          {userProfile ? (
            <Image
              source={{ uri: userProfile.profilePic || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImage} /> // Placeholder while loading
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Your Personalized Plan</Text>
        <View style={styles.planCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop' }}
            style={styles.planImage}
          />
          <View style={styles.planContent}>
            <View style={styles.planHeader}>
              {/* --- MODIFIED: Use generated plan title --- */}
              <Text style={styles.planTitle}>{generatedPlan.title}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>AI Generated</Text></View>
            </View>
            <Text style={styles.planDescription}>
              This plan has been tailored for you based on your body analysis and goals.
            </Text>
            <View style={styles.planStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.statText}>Approx. 45 mins</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="dumbbell" size={16} color={COLORS.textSecondary} />
                {/* --- MODIFIED: Use dynamic exercise count --- */}
                <Text style={styles.statText}>{generatedPlan.workout.length} Exercises</Text>
              </View>
            </View>
            <View style={styles.planButtons}>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercises in Your Plan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* --- MODIFIED: Map over the generated workout --- */}
          {generatedPlan.workout.map(item => (
            <ExerciseCard key={item.exercise.id} item={item} />
          ))}
        </ScrollView>
        <Text style={styles.sectionTitle}>Workout Tips</Text>

        <View style={styles.tipCard}>

          <Ionicons name="bulb-outline" size={24} color={COLORS.primary} style={styles.tipIcon} />

          <View style={styles.tipContent}>

            <Text style={styles.tipTitle}>Stay Hydrated!</Text>

            <Text style={styles.tipText}>

              Remember to drink plenty of water throughout your workout and recovery to maintain peak performance and prevent dehydration. Proper hydration is key.

            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.backgroundLight },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 32, height: 32, borderRadius: 16, marginLeft: 16 },
  scrollContainer: { paddingBottom: 100, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 16, marginTop: 10 },
  planCard: { backgroundColor: COLORS.card, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  planImage: { width: '100%', height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  planContent: { padding: 16 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  badge: { backgroundColor: '#4A5568', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: COLORS.textLight, fontSize: 12, fontWeight: '600' },
  planDescription: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 16 },
  planStats: { flexDirection: 'row', marginBottom: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border, paddingVertical: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statText: { marginLeft: 8, color: COLORS.textSecondary, fontWeight: '500' },
  planButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  startButton: { flex: 1, backgroundColor: COLORS.secondaryGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginRight: 8 },
  startButtonText: { color: COLORS.textLight, fontWeight: 'bold', fontSize: 16 },
  detailsButton: { flex: 1, backgroundColor: COLORS.backgroundLight, padding: 14, borderRadius: 12, alignItems: 'center', marginLeft: 8, borderWidth: 1, borderColor: COLORS.border },
  detailsButtonText: { color: COLORS.textDark, fontWeight: 'bold', fontSize: 16 },
  exerciseCard: { backgroundColor: COLORS.card, borderRadius: 16, marginRight: 16, width: 280, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, marginBottom:10 },
  exerciseImage: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  exerciseContent: { padding: 16 },
  exerciseTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  exerciseDetails: { fontSize: 12, color: COLORS.textSecondary, marginVertical: 8 },
  exerciseSets: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  exerciseSetsText: { marginLeft: 8, color: COLORS.textSecondary, fontSize: 12 },
  detailsButtonSecondary: { backgroundColor: COLORS.backgroundLight, padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  detailsButtonTextSecondary: { color: COLORS.textDark, fontWeight: '600' },
  tipCard: { flexDirection: 'row', backgroundColor: COLORS.card, padding: 16, borderRadius: 16, alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.border },
  tipIcon: { marginRight: 12 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 4 },
  tipText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
});

export default WorkoutPlansScreen;