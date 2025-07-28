import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// 예시 키워드 (나중에 API에서 받아오도록 변경 가능)
const mockKeywords = [
  '임산부 교통비 지원',
  '위기 임산부 지원',
  '산전 검사 지원',
  '영유아 건강검진',
];

export default function WelfareButtons({ selectedCategory, onSendMessage }) {
  const handleKeywordClick = (keyword) => {
    onSendMessage(keyword);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {mockKeywords.map((keyword, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleKeywordClick(keyword)}
        >
          <Text style={styles.buttonText}>{keyword}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: '#FEFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3AAFA9',
  },
  buttonText: {
    fontSize: 14,
    color: '#3AAFA9',
  },
});
