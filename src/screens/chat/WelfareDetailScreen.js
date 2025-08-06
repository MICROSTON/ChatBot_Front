// src/screens/chat/WelfareDetailScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WelfareDetailScreen({ route }) {
  const { item } = route.params; // { Benefit_name, Benefit_content }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 제목 */}
      <Text style={styles.title}>{item.Benefit_name}</Text>

      {/* 제목 하단 구분선 */}
      <View style={styles.separator} />

      {/* 말풍선 형태의 복지 내용 */}
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{item.Benefit_content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 16,
  },
  bubble: {
    backgroundColor: '#C9EAEC',
    borderRadius: 20,
    padding: 16,
    maxWidth: '100%',
  },
  bubbleText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
});
