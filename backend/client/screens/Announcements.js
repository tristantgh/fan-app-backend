import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Announcements() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>ANNOUNCEMENTS</Text>

      <View style={styles.announcement}>
        <Text style={styles.title}>OMG HI THANK YOU FOR BEING HERE TOUR ASAP!!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  announcement: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});