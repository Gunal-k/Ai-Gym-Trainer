import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator, // Import for loading indicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme'; // Assuming you have this theme file

// --- 1. Import Firebase ---
import { auth } from '../firebaseConfig'; // Assuming you have this file
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [authError, setAuthError] = useState(''); // For Firebase errors
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text || emailRegex.test(text)) {
      setEmailError('');
    } else {
      setEmailError('Invalid email address. Please try again.');
    }
    setEmail(text);
  };

  // --- 2. Modify the handler to be async and use Firebase ---
  const handleLogin = async () => {
    if (email.length > 0 && emailError) {
      return; // Don't submit if there's a validation error
    }
    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setAuthError(''); // Clear previous errors

    try {
      // Sign in user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful for:', userCredential.user.email);

      navigation.navigate('MainApp');
      
      // Successful login will be caught by your onAuthStateChanged listener
      // which should handle navigation to the main part of the app.

    } catch (err) {
      // Handle Firebase errors (e.g., wrong-password, user-not-found)
      setAuthError('Invalid email or password. Please try again.');
      console.error("Firebase login error:", err.code, err.message);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
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
          {/* Logo and App Name */}
          <View style={styles.logoContainer}>
            <Ionicons name="sparkles" size={50} color={COLORS.primary} />
            <Text style={styles.appName}>AI GYM TRAINER</Text>
          </View>

          {/* Welcome Text */}
          <Text style={styles.welcomeText}>Welcome Back</Text>

          {/* ... your Email Input JSX is perfect, no changes needed ... */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !!emailError && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={validateEmail}
            />
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>
          
          {/* ... your Password Input JSX is perfect, no changes needed ... */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordLabelContainer}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Auth Error Message */}
          {!!authError && <Text style={styles.errorText}>{authError}</Text>}

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton} 
            // --- 3. CRITICAL FIX: Changed this to call the correct function ---
            onPress={handleLogin}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.textLight} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.newUserText}>New user? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ... your styles are perfect, no changes needed
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Assuming COLORS.background
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    color: '#32B768', // Assuming COLORS.primary
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 12,
  },
  welcomeText: {
    color: '#000', // Assuming COLORS.textDark
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#000', // Assuming COLORS.textDark
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB', // Assuming COLORS.gray
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000', // Assuming COLORS.textDark
  },
  inputError: {
    borderColor: '#D8000C', // Assuming COLORS.error
  },
  errorText: {
    color: '#D8000C', // Assuming COLORS.error
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center', // Centered the auth error
  },
  passwordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#32B768', // Assuming COLORS.primary
    fontSize: 14,
    fontWeight: '500',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB', // Assuming COLORS.gray
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000', // Assuming COLORS.textDark
  },
  eyeIcon: {
    padding: 12,
  },
  loginButton: {
    backgroundColor: '#32B768', // Assuming COLORS.primary
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff', // Assuming COLORS.textLight
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  newUserText: {
    color: '#6B7280', // Assuming COLORS.textSecondary
    fontSize: 16,
  },
  signUpLink: {
    color: '#32B768', // Assuming COLORS.primary
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;