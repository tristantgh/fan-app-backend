import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';

export default function FanContent() {
  const openDriveFolder = () => {
    const url = 'https://drive.google.com/drive/folders/1wUQWZM4VDE-bi8Vb8Di9Yj_RTNfMX-8P?usp=sharing';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>FAN CONTENT</Text>
      <Text style={styles.description}>
        Click the link below for official resources like artwork, photos, and lyrics to use in your own content!
      </Text>

      <TouchableOpacity style={styles.button} onPress={openDriveFolder}>
        <Text style={styles.buttonText}>View the Fan Content Folder</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>*New fan content is added regularly!</Text>
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