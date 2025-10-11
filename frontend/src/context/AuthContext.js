import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://192.168.1.5:8000/login", {
        email,
        password,
      });
      
      // Check if response.data exists before trying to access it
      if (response && response.data) {
        const token = response.data.access_token;

        if (token) {
          setUserToken(token);
          await AsyncStorage.setItem('userToken', token);
        } else {
          // This will be caught by the catch block below
          throw new Error("Token not found in server response");
        }
      } else {
        // This will also be caught
        throw new Error("Empty response from server");
      }

    } catch (e) {
      console.log(`Login error: ${e}`);
      Alert.alert("Login Failed", "Invalid email or password.");
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      let token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};