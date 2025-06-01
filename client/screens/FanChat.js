import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';

export default function FanChat() {
  const openInstagramChat = () => {
    const url = 'https://www.instagram.com/direct/inbox/'; // Placeholder, replace with your actual group chat link
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>FAN CHAT</Text>
      <Text style={styles.description}>
        Join the exclusive Instagram group chat for Tristies! Get real-time updates, connect with other fans, and chat with Tristan directly.
      </Text>

      <TouchableOpacity style={styles.button} onPress={openInstagramChat}>
        <Text style={styles.buttonText}>Join the Instagram Group Chat</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>*Must have an Instagram account to join.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});