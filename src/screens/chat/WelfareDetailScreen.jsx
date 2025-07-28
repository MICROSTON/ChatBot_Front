import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const WelfareDetailScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.content}</Text>
      <Text style={styles.detail}>{item.detail}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
  },
  detail: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default WelfareDetailScreen;
