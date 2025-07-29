import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Expo 사용 기준
import useBookmarks from '../hooks/useBookmarks';
import { colors } from '../styles/colors';

const WelfareMessageItem = ({ welfare }) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  
  // 현재 복지 정보가 북마크인지 확인
  const bookmarked = isBookmarked(welfare.id);
  
  // 북마크 토글
  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await removeBookmark(welfare.id);
      } else {
        await addBookmark(welfare);
      }
    } catch (error) {
      console.error('북마크 처리 중 오류:', error);
    }
  };

  // URL 링크 열기
  const openUrl = (url) => {
    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{welfare.title}</Text>
        <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
          <Ionicons 
            name={bookmarked ? "heart" : "heart-outline"} 
            size={24} 
            color={bookmarked ? colors.bookmark : colors.bookmarkInactive} 
          />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.content}>{welfare.content}</Text>
      
      {welfare.benefitAmount && (
        <Text style={styles.benefit}>혜택금액: {welfare.benefitAmount}</Text>
      )}
      
      {welfare.category && (
        <View style={styles.category}>
          <Text style={styles.categoryText}>{welfare.category}</Text>
        </View>
      )}
      
      {welfare.url && (
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openUrl(welfare.url)}
        >
          <Text style={styles.linkText}>자세히 보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
    color: colors.secondary
  },
  bookmarkButton: {
    padding: 5,
  },
  content: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 10
  },
  benefit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary,
    marginBottom: 10
  },
  category: {
    backgroundColor: colors.categoryBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  categoryText: {
    fontSize: 12,
    color: colors.secondary
  },
  linkButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  linkText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '500'
  }
});

export default WelfareMessageItem;