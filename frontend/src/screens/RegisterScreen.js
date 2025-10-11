import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  // --- All state should be inside the component ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // For the peek feature

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      // IMPORTANT: Make sure this is the correct IP for your setup
      await axios.post("http://192.168.1.5:8000/register", {
        username,
        email,
        password,
      });
      
      Alert.alert("Success", "Registration successful! Please log in.");
      navigation.navigate('Login');
    } catch (error) {
      // Check for specific backend error messages if they exist
      const errorMessage = error.response?.data?.detail || "An error occurred. Please try again.";
      console.error(error);
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b1220", justifyContent: "center", padding: 20 }}>
      <Text style={{ color: "#00e6a8", fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 20 }}>
        Create Account
      </Text>
      
      <TextInput
        placeholder="Username"
        placeholderTextColor="#9aa4b2"
        value={username}
        onChangeText={setUsername}
        style={{ backgroundColor: "#071024", color: "#fff", padding: 15, borderRadius: 12, marginBottom: 12 }}
      />
      
      <TextInput
        placeholder="Email"
        placeholderTextColor="#9aa4b2"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: "#071024", color: "#fff", padding: 15, borderRadius: 12, marginBottom: 12 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Password Input with Peek Feature */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#071024',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 15,
      }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9aa4b2"
          value={password}
          onChangeText={setPassword}
          style={{
            flex: 1,
            color: '#fff',
            paddingVertical: 15,
          }}
          secureTextTextEntry={!isPasswordVisible} // Corrected prop name
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons 
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
            size={24} 
            color="#9aa4b2" 
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: "#00e6a8", padding: 15, borderRadius: 12, alignItems: "center" }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 15 }}>
        <Text style={{ color: "#9aa4b2", textAlign: "center" }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}