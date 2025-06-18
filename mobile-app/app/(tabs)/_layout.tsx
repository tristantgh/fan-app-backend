// Path: mobile-app/app/(tabs)/_layout.tsx
import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('DEBUG: Tabs Layout Loading');

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('DEBUG: Checking auth in tabs');
        const userId = await AsyncStorage.getItem('userId');
        console.log('DEBUG: Found userId:', userId);

        if (!userId) {
          console.log('DEBUG: No userId, redirecting to login');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('DEBUG: Auth check failed:', error);
        router.replace('/(auth)/login');
      }
    }

    checkAuth();
  }, [router]);

  console.log('DEBUG: Tabs Layout Rendering');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <ExploreIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home-outline" color={color} size={size} />
);

const ExploreIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="search-outline" color={color} size={size} />
);