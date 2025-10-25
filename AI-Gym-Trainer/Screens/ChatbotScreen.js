import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator, // --- ADDED
  Alert,             // --- ADDED
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import Markdown from 'react-native-markdown-display';

// --- ADDED: Set your backend URL here ---
const backendUrl = `http://${process.env.EXPO_PUBLIC_YOUR_COMPUTER_IP}:8001/chatbot`;

const ChatbotScreen = () => {
  // --- MODIFIED: Removed mock data, added loading state ---
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      type: 'text',
      content: "Hello! I'm your AI Gym Trainer. How can I assist you with your fitness journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  // --- MODIFIED: The handleSend function is now async and calls the backend ---
  const handleSend = async (messageText) => {
    const textToSend = messageText || inputText.trim();
    if (textToSend.length === 0) return;

    const newMessage = {
      id: Math.random().toString(),
      sender: 'user',
      type: 'text',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || 'Failed to get response from AI.');
      }

      const aiMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        type: 'text', // For now, we assume all responses are text. See note below.
        content: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Error sending message to backend:", error);
      Alert.alert("Connection Error", "I'm having trouble connecting to the AI brain. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- ADDED: Handler for suggestion chips ---
  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion); // Set text in input
    handleSend(suggestion);   // Immediately send it
  };

  useEffect(() => {
    if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const markdownStyles = StyleSheet.create({
        heading1: {
            fontSize: 22,
            fontWeight: 'bold',
            color: COLORS.textDark,
            marginTop: 10,
            marginBottom: 5,
        },
        strong: {
            fontWeight: 'bold',
        },
        list_item: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginVertical: 4,
        },
        bullet_list_icon: {
            marginRight: 8,
            fontSize: 16,
            lineHeight: 24, // Align with text
            color: COLORS.textDark,
        },
        text: { // General text style for the bot
            color: COLORS.textDark,
            fontSize: 15,
        },
    });

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    // if (item.type === 'text') {
    //   return (
    //     <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
    //       <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
    //         <Text style={isUser ? styles.userText : styles.aiText}>{item.content}</Text>
    //       </View>
    //       <Text style={styles.timestamp}>{item.timestamp}</Text>
    //     </View>
    //   );
    // }

    // if (item.type === 'dietPlan' || item.type === 'workoutPlan') {
    //   return (
    //     <View style={[styles.messageRow, styles.aiRow]}>
    //       <View style={styles.card}>
    //         <View style={styles.cardHeader}>
    //           <MaterialCommunityIcons
    //             name={item.type === 'dietPlan' ? 'silverware-fork-knife' : 'dumbbell'}
    //             size={24}
    //             color={COLORS.primaryAction}
    //           />
    //           <Text style={styles.cardTitle}>{item.title}</Text>
    //         </View>
    //         {item.items.map((point, index) => (
    //           <View key={index} style={styles.cardListItem}>
    //             <Ionicons name="checkmark-circle" size={18} color={COLORS.userBubble} />
    //             <Text style={styles.cardListText}>{point}</Text>
    //           </View>
    //         ))}
    //         <TouchableOpacity style={styles.cardButton}>
    //           <Text style={styles.cardButtonText}>
    //             {item.type === 'dietPlan' ? 'Generate Full Meal Plan' : 'Start Workout Session'}
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //        <Text style={styles.timestamp}>{item.timestamp}</Text>
    //     </View>
    //   );
    // }

    // return null;
    return (
            <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    
                    {/* --- 3. USE MARKDOWN FOR AI, TEXT FOR USER --- */}
                    {isUser ? (
                        <Text style={styles.userText}>{item.content}</Text>
                    ) : (
                        <Markdown style={markdownStyles}>{item.content}</Markdown>
                    )}

                </View>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        );
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
        />

        {/* --- ADDED: AI "is typing..." indicator --- */}
        {isLoading && (
            <View style={[styles.messageRow, styles.aiRow]}>
                <View style={[styles.bubble, styles.aiBubble]}>
                    <ActivityIndicator size="small" color={COLORS.textDark} />
                </View>
            </View>
        )}

        <View style={styles.suggestionArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.suggestionChip} onPress={() => handleSuggestionPress('Generate a 7-day meal plan')}>
              <Text style={styles.suggestionText}>Generate a 7-day meal plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip} onPress={() => handleSuggestionPress('Recommend a beginner routine')}>
              <Text style={styles.suggestionText}>Recommend a beginner routine</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor={COLORS.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()} // Allows sending with keyboard "Go" button
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()} disabled={isLoading}>
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
  timestamp: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, marginHorizontal: 8, paddingHorizontal:5 },
  card: { backgroundColor: COLORS.aiCard, borderRadius: 16, padding: 16, maxWidth: '90%', borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginLeft: 8 },
  cardListItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardListText: { flex: 1, marginLeft: 8, color: COLORS.textDark, fontSize: 14, lineHeight: 20 },
  cardButton: { backgroundColor: COLORS.primaryAction, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  cardButtonText: { color: COLORS.textLight, fontWeight: 'bold' }, 
  suggestionArea: { paddingVertical: 8, paddingLeft: 16, backgroundColor: COLORS.background },
  suggestionChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.background, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  suggestionText: { color: COLORS.textDark,paddingHorizontal: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#FFFFFF' },
  textInput: { flex: 1, backgroundColor: COLORS.aiBubble, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, marginRight: 8 },
  sendButton: { backgroundColor: COLORS.userBubble, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});

export default ChatbotScreen;