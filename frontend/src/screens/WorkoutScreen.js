import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  accent: '#00e6a8',
};

// Mock Data
const workoutHistory = [
  { id: '1', title: 'Upper Body', time: 'Today, 2:30 PM', duration: '25 min', calories: '180 cal', status: 'Completed' },
  { id: '2', title: 'Morning Cardio', time: 'Yesterday, 7:00 AM', duration: '30 min', calories: '220 cal', status: 'Completed' },
  { id: '3', title: 'Leg Day Workout', time: 'Oct 30, 6:00 PM', duration: '40 min', calories: '320 cal', status: 'Pending' },
];

const achievements = [
    {id: '1', title: 'First Week', icon: 'ribbon-outline'},
    {id: '2', title: 'Calorie Burner', icon: 'flame-outline'},
    {id: '3', title: 'Strength Master', icon: 'barbell-outline'},
    {id: '4', title: 'Consistency', icon: 'calendar-outline'},
]

const ActivityItem = ({ item }) => (
  <View style={styles.activityItem}>
    {/* <Image source={require('../assets/workout_placeholder.png')} style={styles.activityImage} /> */}
    <View style={styles.activityDetails}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityTime}>{item.time}</Text>
      <Text style={styles.activityStats}>{`${item.duration} ${item.calories}`}</Text>
    </View>
    <Text style={[styles.activityStatus, item.status === 'Completed' ? styles.completed : styles.pending]}>{item.status}</Text>
  </View>
);

export default function WorkoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <FlatList
          data={workoutHistory}
          renderItem={({ item }) => <ActivityItem item={item} />}
          keyExtractor={item => item.id}
          scrollEnabled={false} // To allow parent ScrollView to control scrolling
        />

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "The only bad workout is the one that didn't happen. Keep pushing your limits and embrace the journey to a stronger you!"
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsContainer}>
          {achievements.map(ach => (
            <View key={ach.id} style={styles.achievementBox}>
                <Ionicons name={ach.icon} size={24} color={COLORS.accent} />
                <Text style={styles.achievementText}>{ach.title}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 20 },
  activityItem: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 15, padding: 15, marginBottom: 10, alignItems: 'center' },
  activityImage: { width: 50, height: 50, borderRadius: 10, marginRight: 15 },
  activityDetails: { flex: 1 },
  activityTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  activityTime: { color: COLORS.textSecondary, fontSize: 12 },
  activityStats: { color: COLORS.textSecondary, fontSize: 12, marginTop: 5 },
  activityStatus: { fontSize: 12, fontWeight: 'bold' },
  completed: { color: COLORS.accent },
  pending: { color: COLORS.textSecondary },
  quoteCard: { backgroundColor: COLORS.card, borderRadius: 15, padding: 20, marginVertical: 20 },
  quoteText: { color: COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', lineHeight: 22 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  achievementsContainer: { flexDirection: 'row' },
  achievementBox: { backgroundColor: COLORS.card, borderRadius: 15, padding: 20, marginRight: 10, alignItems: 'center', width: 120 },
  achievementText: { color: COLORS.text, marginTop: 10, fontSize: 12, textAlign: 'center' },
});