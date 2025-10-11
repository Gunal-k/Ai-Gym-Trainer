import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext"; // Import the context

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); // Get the login function from context

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // The context handles the API call, storage, and navigation change!
    login(email, password);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b1220", justifyContent: "center", padding: 20 }}>
      <Text style={{ color: "#00e6a8", fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 20 }}>
        Login
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#9aa4b2"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: "#0724", color: "#fff", padding: 15, borderRadius: 12, marginBottom: 12 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* ...your password input and other buttons... */}
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#00e6a8", padding: 15, borderRadius: 12, alignItems: "center" }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 15 }}>
        <Text style={{ color: "#9aa4b2", textAlign: "center" }}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}