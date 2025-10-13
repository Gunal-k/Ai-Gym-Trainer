import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Mock data to build the UI without a backend
const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'ai',
    type: 'text',
    content: "Hello! I'm your AI Gym Trainer. How can I assist you with your fitness journey today?",
    timestamp: '10:00 AM',
  },
  {
    id: '2',
    sender: 'user',
    type: 'text',
    content: 'I need some diet advice for losing fat.',
    timestamp: '10:01 AM',
  },
  {
    id: '3',
    sender: 'ai',
    type: 'text',
    content: 'Great! To help me tailor the best advice, could you tell me a bit about your current eating habits or any dietary restrictions?',
    timestamp: '10:02 AM',
  },
  {
    id: '4',
    sender: 'ai',
    type: 'text',
    content: 'For effective fat loss, consider focusing on a balanced intake of protein, healthy fats, and complex carbohydrates. Aim for a caloric deficit of 300-500 calories per day.',
    timestamp: '10:05 AM',
  },
  {
    id: '5',
    sender: 'ai',
    type: 'dietPlan',
    title: 'Personalized Diet Plan: Fat Loss',
    items: [
      'Prioritize lean proteins: chicken, fish, legumes.',
      'Increase fiber intake: fruits, vegetables, whole grains.',
      'Healthy fats: avocados, nuts, olive oil (in moderation).',
      'Hydration: Drink at least 2-3 liters of water daily.',
      'Limit processed foods and sugary drinks.',
    ],
    timestamp: '10:06 AM',
  },
  {
    id: '6',
    sender: 'user',
    type: 'text',
    content: 'What kind of workouts should I do?',
    timestamp: '10:10 AM',
  },
  {
    id: '7',
    sender: 'ai',
    type: 'workoutPlan',
    title: 'Effective Fat Loss Workout Routine',
    items: [
      'Incorporate 3-4 days of strength training per week (full body or split).',
      'Add 150-300 minutes of moderate-intensity cardio, or 75-150 minutes of vigorous-intensity cardio weekly.',
      'Include HIIT sessions 1-2 times a week for maximum calorie burn.',
      'Ensure proper warm-up and cool-down for each session.',
    ],
    timestamp: '10:11 AM',
  },
];

const ChatbotScreen = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Math.random().toString(),
      sender: 'user',
      type: 'text',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    // Here you would typically send the message to your backend
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    if (item.type === 'text') {
      return (
        <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={isUser ? styles.userText : styles.aiText}>{item.content}</Text>
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      );
    }

    if (item.type === 'dietPlan' || item.type === 'workoutPlan') {
      return (
        <View style={[styles.messageRow, styles.aiRow]}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name={item.type === 'dietPlan' ? 'silverware-fork-knife' : 'dumbbell'}
                size={24}
                color={COLORS.primaryAction}
              />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            {item.items.map((point, index) => (
              <View key={index} style={styles.cardListItem}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.userBubble} />
                <Text style={styles.cardListText}>{point}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.cardButton}>
              <Text style={styles.cardButtonText}>
                {item.type === 'dietPlan' ? 'Generate Full Meal Plan' : 'Start Workout Session'}
              </Text>
            </TouchableOpacity>
          </View>
           <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Gym Trainer</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          // The inverted prop is not used here to keep the natural top-to-bottom order for cards
        />

        <View style={styles.suggestionArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.suggestionChip}><Text style={styles.suggestionText}>Generate a 7-day meal plan</Text></TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}><Text style={styles.suggestionText}>Recommend a beginner routine</Text></TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor={COLORS.textSecondary}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textDark },
  container: { flex: 1, backgroundColor: COLORS.background },
  messageList: { padding: 16 },
  messageRow: { marginBottom: 4 },
  aiRow: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  userRow: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { padding: 12, borderRadius: 18, maxWidth: '80%' },
  userBubble: { backgroundColor: COLORS.userBubble, borderTopRightRadius: 4 },
  aiBubble: { backgroundColor: COLORS.aiBubble, borderTopLeftRadius: 4 },
  userText: { color: COLORS.textLight, fontSize: 15 },
  aiText: { color: COLORS.textDark, fontSize: 15 },
  timestamp: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, marginHorizontal: 8 },
  card: { backgroundColor: COLORS.aiCard, borderRadius: 16, padding: 16, maxWidth: '90%', borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginLeft: 8 },
  cardListItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardListText: { flex: 1, marginLeft: 8, color: COLORS.textDark, fontSize: 14, lineHeight: 20 },
  cardButton: { backgroundColor: COLORS.primaryAction, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  cardButtonText: { color: COLORS.textLight, fontWeight: 'bold' }, 
  suggestionArea: { paddingVertical: 8, paddingLeft: 16, backgroundColor: COLORS.background },
  suggestionChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.background, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  suggestionText: { color: COLORS.textDark },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#FFFFFF' },
  textInput: { flex: 1, backgroundColor: COLORS.aiBubble, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, marginRight: 8 },
  sendButton: { backgroundColor: COLORS.userBubble, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});

export default ChatbotScreen;