import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';

export default function Merch() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MERCHANDISE</Text>

      <View style={styles.box}>
        <Text style={styles.subText}>Exclusive Discount Code:</Text>
        <Text style={styles.code}>OGTRISTIES</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.everythingtristan.co/store')}
        >
          <Text style={styles.buttonText}>SHOP OFFICIAL STORE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <Text style={styles.subText}>Exclusive Merch Password:</Text>
        <Text style={styles.code}>forthebestfanseveronly</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.everythingtristan.co/tristiesonly')}
        >
          <Text style={styles.buttonText}>ACCESS EXCLUSIVE STORE</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  box: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  subText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  code: {
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});