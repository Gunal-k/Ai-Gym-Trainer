import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator, // Import for loading indicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

// --- 1. Import Firebase ---
import { auth, db } from '../firebaseConfig'; // Assuming you have this file
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading state

  // --- 2. Modify the handler to be async and use Firebase ---
  const handleCreateProfile = async () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Registration successful for:', user.email);

      // Save user details to Firestore
      // Use the user's UID from Auth as the document ID in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: fullName, // Use the name from the form
        email: email, // Use the email from the form
        height: '', // Default empty value
        weight: '', // Default empty value
        gender: '', // Default empty value
        goal: '', // Default empty value
        profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop', // Default profile picture
        createdAt: new Date(), // Timestamp of creation
      });
      console.log('User profile created in Firestore');
      navigation.navigate('CreateProfile'); // Navigate to Login or MainApp after successful registration
      
      // On success, Firebase's onAuthStateChanged listener will handle navigation
      // so you might not need the navigation.navigate() here if you have a global listener.
      // For now, we can leave it to navigate after successful profile creation.
      // navigation.navigate('MainApp');

    } catch (err) {
      // Handle Firebase errors (e.g., email-already-in-use)
      setError(err.message);
      console.error("Firebase registration error:", err.code, err.message);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SignUp</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        
        {/* ... your Personal Details Card JSX is perfect, no changes needed ... */}
        <View style={styles.card}>
           <Text style={styles.cardTitle}>Personal Details</Text>
           <View style={styles.inputGroup}>
             <Text style={styles.label}>Full Name</Text>
             <TextInput
               style={styles.input}
               placeholder="Enter your full name"
               placeholderTextColor="#6B7280"
               value={fullName}
               onChangeText={setFullName}
             />
           </View>
        </View>

        {/* ... your Account Information Card JSX is perfect, no changes needed ... */}
        <View style={styles.card}>
           <Text style={styles.cardTitle}>Account Information</Text>
           <View style={styles.inputGroup}>
             <Text style={styles.label}>Email</Text>
             <TextInput
               style={styles.input}
               placeholder="Enter your email address"
               placeholderTextColor="#6B7280"
               keyboardType="email-address"
               autoCapitalize="none"
               value={email}
               onChangeText={setEmail}
             />
           </View>
           <View style={styles.inputGroup}>
             <Text style={styles.label}>Password</Text>
             <View style={styles.passwordContainer}>
               <TextInput
                 style={styles.passwordInput}
                 placeholder="Create a strong password"
                 placeholderTextColor="#6B7280"
                 secureTextEntry={!isPasswordVisible}
                 value={password}
                 onChangeText={setPassword}
               />
               <TouchableOpacity
                 onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                 style={styles.eyeIcon}>
                 <Feather
                   name={isPasswordVisible ? 'eye-off' : 'eye'}
                   size={20}
                   color="#6B7280"
                 />
               </TouchableOpacity>
             </View>
           </View>
           <View style={styles.inputGroup}>
             <Text style={styles.label}>Confirm Password</Text>
             <View style={styles.passwordContainer}>
               <TextInput
                 style={styles.passwordInput}
                 placeholder="Confirm your password"
                 placeholderTextColor="#6B7280"
                 secureTextEntry={!isConfirmPasswordVisible}
                 value={confirmPassword}
                 onChangeText={setConfirmPassword}
               />
               <TouchableOpacity
                 onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                 style={styles.eyeIcon}>
                 <Feather
                   name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                   size={20}
                   color="#6B7280"
                 />
               </TouchableOpacity>
             </View>
           </View>
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Create Profile Button */}
        <TouchableOpacity
          style={styles.createButton}
          // --- 3. CRITICAL FIX: Changed this to call the correct function ---
          onPress={handleCreateProfile} 
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Profile</Text>
          )}
        </TouchableOpacity>
        
        {/* ... your "Existing user?" JSX is perfect, no changes needed ... */}
        <View style={styles.signUpContainer}>
           <Text style={styles.newUserText}>Existing user? </Text>
           <TouchableOpacity onPress={() => navigation.navigate('Login')}>
             <Text style={styles.signUpLink}>Log in</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ... your styles are perfect, no changes needed
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20, // Added margin between cards
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 12,
  },
  createButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D8000C', // Red color for errors
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  newUserText: {
    color: '#6B7280',
    fontSize: 16,
  },
  signUpLink: {
    color: '#32B768',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;