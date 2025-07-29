import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function NotificationCard({ message }) {
  return (
    <View style={styles.card}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.avatar}
      />
      <View style={styles.textArea}>
        <Text style={styles.title}>SHChatbot</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: 80,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: '#F8FFFB',
  },
  textArea: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4B7B7B',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#222',
  },
});