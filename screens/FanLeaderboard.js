import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function FanLeaderboard() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>FAN LEADERBOARD</Text>
      <Text style={styles.subText}>
        Compete for exclusive PRIZES by streaming, buying merch, attending shows, and more!
      </Text>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Fan of the Month</Text>
        <Text style={styles.placeholderText}>Coming Soon!</Text>
      </View>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Top Streamers</Text>
        <Text style={styles.placeholderText}>Coming Soon!</Text>
      </View>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Top Merch Buyers</Text>
        <Text style={styles.placeholderText}>Coming Soon!</Text>
      </View>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Top Show Attendees</Text>
        <Text style={styles.placeholderText}>Coming Soon!</Text>
      </View>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Fan Referrals</Text>
        <Text style={styles.placeholderText}>Coming Soon!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  leaderboardSection: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placeholderText: {
    color: '#777',
  },
});