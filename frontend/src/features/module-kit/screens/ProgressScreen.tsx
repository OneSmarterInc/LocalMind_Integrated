import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      <Text style={styles.subtitle}>
        Track your cybersecurity learning progress.
      </Text>

      <View style={styles.card}>
        <Text style={styles.score}>0%</Text>

        <Text style={styles.label}>Course Progress</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#F2F5F4',
  },

  subtitle: {
    marginTop: 8,
    color: '#9CA7A4',
    fontSize: 16,
  },

  card: {
    marginTop: 32,
    padding: 30,
    backgroundColor: '#121918',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263330',
  },

  score: {
    fontSize: 42,
    fontWeight: '800',
    color: '#45DDB5',
  },

  label: {
    marginTop: 5,
    color: '#9CA7A4',
  },
});