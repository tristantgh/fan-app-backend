import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const height = width * (9 / 16);

export default function BehindTheScenes() {
  const [activeTab, setActiveTab] = useState('PROJECTS');

  const projects = [
    { title: '2025 SINGLES', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEpPnlWQD8gHP1ODDHNAn30e' },
    { title: 'THE HEART I FEEL BEAT', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEqfc4vtZ2ATnGNJe1z_Y0dh' },
    { title: 'SUMMER ’24 SINGLES', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEpeoBqwMR2VnkUSpBU8ZLaI' },
    { title: 'SOMETHING I CAN FEEL', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEp1WvNMmB9O9CEEgQzAjnYE' },
    { title: 'GIVE ME SOMETHING REAL', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFErLdH2O1-jlo8Baz_Wyrexm' },
    { title: 'NOMAD', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEpIC3KQakDTRrSh8O5tMRiz' },
  ];

  const liveShows = [
    { title: 'NEW YORK POP-UP 2025', link: 'https://www.youtube.com/embed/AvqdqmmvtwE' },
    { title: 'LA SHOWCASE (2023)', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEpJF73elksEe8yGMXIeZd5L' },
    { title: 'FINDING MY WY (2022)', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEq6nqyw_443lQoU_6FXWqlb' },
    { title: 'WE HAD A POOL PARTY LOL', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEqHpEHOXP6hwF4JD4i3AkWi' },
    { title: 'NOMAD RELEASE SHOW', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEo0qf3aDZdL2lp31ukwVUbl' },
    { title: 'DRUMMING/OPENING ON TOUR (2022)', link: 'https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFEpUtJL90iuC3le06bHaduFv' },
  ];

  const content = activeTab === 'PROJECTS' ? projects : liveShows;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>BEHIND THE SCENES</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'PROJECTS' && styles.activeTab]}
          onPress={() => setActiveTab('PROJECTS')}
        >
          <Text style={[styles.tabText, activeTab === 'PROJECTS' && styles.activeTabText]}>PROJECTS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'LIVE SHOWS' && styles.activeTab]}
          onPress={() => setActiveTab('LIVE SHOWS')}
        >
          <Text style={[styles.tabText, activeTab === 'LIVE SHOWS' && styles.activeTabText]}>LIVE SHOWS</Text>
        </TouchableOpacity>
      </View>

      {content.map((item, index) => (
        <View key={index} style={styles.videoBox}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <WebView
            style={{ width: width - 40, height, borderRadius: 8, marginBottom: 20 }}
            source={{ uri: item.link }}
            allowsFullscreenVideo
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoBox: {
    marginBottom: 30,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});