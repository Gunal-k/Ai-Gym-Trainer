import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../constants/theme';

const LiveCameraScreen = ({ navigation }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [audioFeedback, setAudioFeedback] = useState(true);

  if (!isSessionActive) {
    return (
      <SafeAreaView style={styles.startSessionSafeArea}>
        <StatusBar style="dark" />
        <View style={styles.startSessionContainer}>
          <Ionicons name="sparkles-outline" size={64} color={COLORS.primary} />
          <Text style={styles.startSessionTitle}>Ready for your workout?</Text>
          <Text style={styles.startSessionSubtitle}>
            The AI trainer will use your camera to provide real-time feedback on your form.
          </Text>
          <TouchableOpacity
            style={styles.startSessionButton}
            onPress={() => setIsSessionActive(true)}>
            <Text style={styles.startSessionButtonText}>Start Session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Handle permission states
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
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <CameraView
        style={styles.background}
        facing={facing}
      >
        {/* Dark overlay for better text readability */}
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          {/* The header can be removed if it's part of the tab navigator, 
              or kept if this screen is presented modally. For now, we'll keep it. */}
          <TouchableOpacity style={styles.header}>
             {/* This could navigate back or end the session */}
          </TouchableOpacity>

          <View style={styles.container}>
            {/* Top Content */}
            <View style={styles.topContent}>
              <Text style={styles.title}>Pose Detection Active</Text>
              <Text style={styles.subtitle}>Real-time feedback for perfect form.</Text>
              <TouchableOpacity
                style={styles.audioToggle}
                onPress={() => setAudioFeedback(!audioFeedback)}
              >
                <Ionicons
                  name={audioFeedback ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.audioText}>
                  Audio Feedback {audioFeedback ? "On" : "Off"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Middle Content: Pose Box */}
            <View style={styles.poseBox}>
              <Text style={styles.poseBoxText}>Correcting Form...</Text>
            </View>

            {/* Bottom Content */}
            <View style={styles.bottomContent}>
              <TouchableOpacity
                style={styles.endButton} 
                onPress={() => setIsSessionActive(false)}>
                <Text style={styles.endButtonText}>End Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.transparentBlack,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  topContent: {
    alignItems: 'center',
    marginTop: '5%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  audioToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  audioText: {
    color: COLORS.textLight,
    marginLeft: 8,
    fontWeight: '500',
  },
  poseBox: {
    width: '90%',
    aspectRatio: 2.5 / 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poseBoxText: {
    color: COLORS.textLight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '600',
  },
  bottomContent: {
    marginTop: 20,
    width: '100%',
    paddingBottom: 10, // Space above the tab bar
  },
  endButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  endButtonText: {
    color: COLORS.textDark,
    fontSize: 18,
    fontWeight: 'bold',
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
  // Start Session Styles
  startSessionSafeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  startSessionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  startSessionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginTop: 24,
  },
  startSessionSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 40,
    lineHeight: 24,
  },
  startSessionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 28,
  },
  startSessionButtonText: {
    color: COLORS.textDark,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LiveCameraScreen;