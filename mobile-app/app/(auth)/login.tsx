// mobile-app/app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Text, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE = Constants.expoConfig?.extra?.API_BASE_URL 
  || 'http://localhost:3000'; // fallback for dev

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, skip straight to tabs
  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => {
      if (id) router.replace('/(tabs)');
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please fill both fields');
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Login failed');
      }
      // save userId for session persistence:
      await AsyncStorage.setItem('userId', String(json.userId));
      // navigate into main app:
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Log In' }} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading 
        ? <ActivityIndicator size="large" />
        : <Button title="Log In" onPress={handleLogin} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  input: {
    borderWidth:1, borderColor:'#ccc', borderRadius:5,
    padding:12, marginBottom:16
  },
});