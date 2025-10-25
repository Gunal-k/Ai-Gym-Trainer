// App.js
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import your actual screens
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import CreateProfileScreen from './Screens/CreateProfileScreen';
import PhotoAnalysisScreen from './Screens/PhotoAnalysisScreen'; // <-- IMPORT THIS

// Placeholder Screens for the tabs
import WorkoutPlansScreen from './Screens/WorkoutPlansScreen'; // <-- IMPORT THIS
import ChatbotScreen from './Screens/ChatbotScreen';
import LiveCameraScreen from './Screens/LiveCameraScreen';
import ProfileScreen from './Screens/ProfileScreen';


const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createStackNavigator(); // <-- CREATE A STACK FOR THE WORKOUT TAB

// Define the stack for the Workout tab
function WorkoutNavigator() {
  return (
    <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkoutStack.Screen name="PhotoAnalysis" component={PhotoAnalysisScreen} />
      <WorkoutStack.Screen name="WorkoutPlans" component={WorkoutPlansScreen} />
    </WorkoutStack.Navigator>
  );
}

// Define the main app tabs
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF', // Set a background color for the tab bar
          borderTopColor: '#E5E7EB', // Add a border
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'WorkoutTab') {
            iconName = 'barbell'; // Changed to a more fitting icon
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'ChatbotTab') {
            iconName = 'chat-processing-outline';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'LiveCameraTab') {
            iconName = 'camera-reverse-outline'; // Changed to a more fitting icon
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'ProfileTab') {
            iconName = 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      {/* Use the WorkoutNavigator for the first tab */}
      <Tab.Screen name="WorkoutTab" component={WorkoutNavigator} options={{ tabBarLabel: 'Workout' }} />
      <Tab.Screen name="ChatbotTab" component={ChatbotScreen} options={{ tabBarLabel: 'Chatbot' }} />
      <Tab.Screen name="LiveCameraTab" component={LiveCameraScreen} options={{ tabBarLabel: 'Live Camera' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow screens */}
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
        <AuthStack.Screen name="CreateProfile" component={CreateProfileScreen} />
        
        {/* Main app with tabs */}
        <AuthStack.Screen name="MainApp" component={MainAppTabs} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default App;