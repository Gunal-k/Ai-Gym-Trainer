import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#121212',
  primary: '#ff7a00',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  accent: '#00e6a8',
  blueCard: '#2c3e50',
};

// Mock Data - Replace with your API data
const recentActivities = [
  { id: '1', title: 'Push-Up Challenge', time: 'Today, 2:30 PM', duration: '25 min', calories: '180 cal', image: require('../assets/pushup.jpg'), status: 'Completed' },
  { id: '2', title: 'Morning Cardio', time: 'Yesterday, 7:00 AM', duration: '30 min', calories: '220 cal', image: require('../assets/cardio.jpg'), status: 'Completed' },
];

const ActivityItem = ({ activity }) => (
  <View style={styles.activityItem}>
    <Image source={activity.image} style={styles.activityImage} />
    <View style={styles.activityDetails}>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityTime}>{activity.time}</Text>
      <Text style={styles.activityStats}>{`${activity.duration} ${activity.calories}`}</Text>
    </View>
    <Text style={[styles.activityStatus, activity.status === 'Completed' ? styles.completed : styles.pending]}>{activity.status}</Text>
  </View>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Good Morning, Alex!</Text>
            <Text style={styles.headerDate}>October 10, 2025</Text>
          </View>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </View>

        <View style={styles.recommendedCard}>
          <View style={styles.recommendedTextContainer}>
            <Text style={styles.recommendedLabel}>Today's Recommended</Text>
            <Text style={styles.recommendedTitle}>Upper Body Strength</Text>
            <View style={styles.recommendedDetails}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.recommendedDetailText}>45 min</Text>
              <Ionicons name="pulse-outline" size={16} color={COLORS.textSecondary} style={{ marginLeft: 16 }} />
              <Text style={styles.recommendedDetailText}>Intermediate</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="resize-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Workouts This Week</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="flame-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="leaf-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Personal Bests</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        {recentActivities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.quickStartButton}>
        <Ionicons name="play" size={24} color="#000" />
        <Text style={styles.quickStartText}>Quick Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  headerTitle: { color: COLORS.text, fontSize: 24, fontWeight: 'bold' },
  headerDate: { color: COLORS.textSecondary, fontSize: 14 },
  recommendedCard: { backgroundColor: COLORS.blueCard, borderRadius: 20, padding: 20, marginBottom: 20 },
  recommendedTextContainer: { marginBottom: 20 },
  recommendedLabel: { color: COLORS.textSecondary, fontSize: 14 },
  recommendedTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  recommendedDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  recommendedDetailText: { color: COLORS.textSecondary, marginLeft: 5 },
  startButton: { backgroundColor: COLORS.text, paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  startButtonText: { color: COLORS.blueCard, fontWeight: 'bold', fontSize: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statBox: { alignItems: 'center' },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  statLabel: { color: COLORS.textSecondary, fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: COLORS.primary, fontSize: 14 },
  activityItem: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 15, padding: 15, marginBottom: 10, alignItems: 'center' },
  activityImage: { width: 50, height: 50, borderRadius: 10, marginRight: 15 },
  activityDetails: { flex: 1 },
  activityTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  activityTime: { color: COLORS.textSecondary, fontSize: 12 },
  activityStats: { color: COLORS.textSecondary, fontSize: 12, marginTop: 5 },
  activityStatus: { fontSize: 12, fontWeight: 'bold' },
  completed: { color: COLORS.accent },
  pending: { color: COLORS.textSecondary },
  quickStartButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  quickStartText: { color: '#000', fontWeight: 'bold', marginLeft: 5 },
});