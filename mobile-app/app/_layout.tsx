import { Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';

console.log('ROOT LAYOUT FILE LOADED'); // Debug Point 1

export default function RootLayout() {
  const pathname = usePathname();
  
  useEffect(() => {
    console.log('ROOT LAYOUT MOUNTED, Path:', pathname); // Debug Point 2
  }, [pathname]);

  return (
    <Stack 
      initialRouteName="/(auth)/login"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}