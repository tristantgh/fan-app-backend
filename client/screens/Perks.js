import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Perks() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PERKS</Text>
      <Text style={styles.subText}>
        As a member, you get access to these exclusive perks:
      </Text>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>🎤 Free Meet & Greet For Life</Text>
        <Text style={styles.perkDesc}>Get exclusive access to meet and greets at every show, completely free for members.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>📺 Exclusive Zoom Hangs Only For Members</Text>
        <Text style={styles.perkDesc}>Member-only Zoom hangs with live performances, Q&As, and more!</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>🎶 Access To New Music Early</Text>
        <Text style={styles.perkDesc}>Upcoming music will be released exclusively on the app before Spotify, Apple, etc.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>🔓 Unreleased Music</Text>
        <Text style={styles.perkDesc}>Access exclusive tracks, demos, and unreleased content not available anywhere else.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>🛍️ Exclusive Tristies Only Merch</Text>
        <Text style={styles.perkDesc}>Special merchandise available only for members.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>💸 Discount On All Merch</Text>
        <Text style={styles.perkDesc}>Get special pricing on all merchandise in the store.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>📣 Announcements</Text>
        <Text style={styles.perkDesc}>Posted in the app first before Instagram, TikTok, etc.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>📷 Exclusive Behind-The-Scenes Content</Text>
        <Text style={styles.perkDesc}>Get access to exclusive content showing Tristan's creative process.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>🏆 Leaderboard System</Text>
        <Text style={styles.perkDesc}>Win prizes for streaming the most, coming to the most shows, or purchasing the most merch.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>💬 Group Chat</Text>
        <Text style={styles.perkDesc}>No separation by state or country. Everyone from everywhere can chat, and Tristan is in it too!</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>🌟 Special Thank You Recognition</Text>
        <Text style={styles.perkDesc}>All members have their name included in a special Thank You section in the description of all Tristan's content.</Text>
      </View>

      <View style={styles.perkItem}>
        <Text style={styles.perkTitle}>✉️ Direct Message Access To Tristan</Text>
        <Text style={styles.perkDesc}>Members are guaranteed Tristan will see and get to their messages as soon as possible.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  perkItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  perkTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  perkDesc: {
    fontSize: 16,
    color: '#555',
  },
});