import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const height = width * (9 / 16); // 16:9 aspect ratio

export default function UnreleasedMusic() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>UNRELEASED MUSIC</Text>

      <View style={styles.section}>
        <Text style={styles.subTitle}>EARLY ACCESS</Text>
        <Text style={styles.description}>Coming soon...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>UNRELEASED TRACKS</Text>
        <WebView
          style={{ width: width - 40, height }}
          source={{ uri: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFErRtSWC2XtMwAVCa3yE0rqS' }}
          allowsFullscreenVideo
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});