import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { CameraView, useCameraPermissions } from 'expo-camera';

// We get the 'navigation' prop from React Navigation
// --- IMPORTANT ---
// 1. Find your computer's current Local IP Address (e.g., 192.168.1.15).
// 2. Replace 'YOUR_COMPUTER_IP' below with that address.
// 3. Make sure your phone/emulator and computer are on the SAME Wi-Fi network.
// Note: If using an Android Emulator, you can often use '10.0.2.2' instead of your IP.
const backendUrl = 'http://10.0.2.2:8000/analyze/snapshot';

const PhotoAnalysisScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // --- ADDED for loading state ---

  // --- MODIFIED: The handleConfirm function ---
  const handleConfirm = async () => {
    if (!imageUri) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'user-photo.jpg',
    });

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Analysis failed.');
      }
      
      console.log('Analysis successful:', result.landmarks.length, 'landmarks found.');

      // Navigate to the next screen, passing the analysis results as a parameter
      navigation.navigate('WorkoutPlans', { analysisResult: result });

    } catch (error) {
      console.error('Failed to analyze image:', error);
      Alert.alert('Analysis Error', error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const handleRetake = () => {
    setImageUri(null);
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Body Analysis</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <CameraView style={styles.camera} facing="front" ref={cameraRef} />
          )}
          <View style={styles.imageOverlay}>
            <Text style={styles.overlayText}>
              Ensure your full body is visible within the frame.
            </Text>
          </View>
        </View>
        
        {imageUri ? (
          <View style={styles.actionsContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              
              {/* --- MODIFIED: Confirm Button with loading state --- */}
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm & Analyze</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Ionicons name="camera-outline" size={32} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* The manual TabBar View has been REMOVED from here */}
    </SafeAreaView>
  );
};

// Styles remain the same, but remove tabBar, tabIconContainer, and tabLabel
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  camera: {
    flex: 1,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
  },
  overlayText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  actionsContainer: {
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: COLORS.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  retakeButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primaryAction,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Permission styles
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.textDark,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: COLORS.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PhotoAnalysisScreen;