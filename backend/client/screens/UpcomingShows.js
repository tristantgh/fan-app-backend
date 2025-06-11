// client/screens/UpcomingShows.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function UpcomingShows() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>UPCOMING SHOWS</Text>
      <TextInput
        placeholder="Search by venue or location... ALL REGIONS"
        style={styles.search}
        placeholderTextColor="#888"
      />
      <View style={styles.messageContainer}>
        <Text style={styles.message}>No upcoming shows found. Check back soon for new tour dates!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  messageContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
});