import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import images from assets
import AnnouncementsImage from '../assets/announcements.jpg';
import UpcomingShowsImage from '../assets/upcoming shows.jpg';
import BehindTheScenesImage from '../assets/behind the scenes.jpg';
import UnreleasedMusicImage from '../assets/unreleased music.png';
import MerchandiseImage from '../assets/merchandise.png';
import FanChatImage from '../assets/fanchat.jpg';
import HeaderBackground from '../assets/header.png';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={HeaderBackground} style={styles.header} imageStyle={{ resizeMode: 'cover' }}>
        <Text style={styles.headerTitle}>TRISTAN</Text>
        <Text style={styles.subText}>Welcome to the official fan community</Text>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="white" style={styles.menuIconShadow} />
        </TouchableOpacity>
      </ImageBackground>

      {menuVisible && (
        <View style={styles.menuContainer}>
          {[
            { name: 'The Story', screen: 'TheStory' },
            { name: 'Announcements', screen: 'Announcements' },
            { name: 'Upcoming Shows', screen: 'UpcomingShows' },
            { name: 'Behind The Scenes', screen: 'BehindTheScenes' },
            { name: 'Unreleased Music', screen: 'UnreleasedMusic' },
            { name: 'Fan Chat', screen: 'FanChat' },
            { name: 'Fan Content', screen: 'FanContent' },
            { name: 'Fan Leaderboard', screen: 'FanLeaderboard' },
            { name: 'Merch', screen: 'Merch' },
            { name: 'Perks', screen: 'Perks' },
            { name: 'Support', screen: 'Support' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LATEST ANNOUNCEMENTS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
          <Image source={AnnouncementsImage} style={styles.imageBox} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UPCOMING SHOWS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UpcomingShows')}>
          <Image source={UpcomingShowsImage} style={styles.imageBox} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BEHIND THE SCENES</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BehindTheScenes')}>
          <Image source={BehindTheScenesImage} style={styles.imageBox} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UNRELEASED MUSIC</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UnreleasedMusic')}>
          <Image source={UnreleasedMusicImage} style={styles.imageBox} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MERCHANDISE</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Merch')}>
          <Image source={MerchandiseImage} style={styles.imageBox} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAN CHAT</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FanChat')}>
          <Image source={FanChatImage} style={styles.imageBox} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 18,
    color: 'white',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  menuIconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageBox: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
});