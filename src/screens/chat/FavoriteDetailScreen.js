import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return dateString;
  }
};

const BG = require('../../../assets/images/background2.png'); 

export default function FavoriteDetailScreen({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{item.benefitName}</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.headerSeparatorInner} />
      </View>

      {/* 메인 콘텐츠 영역 */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 복지 내용 박스 */}
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>
            {item.benefitContext || '복지 상세 정보가 없습니다.'}
            {item.benefitCondition && `\n\n신청 조건: ${item.benefitCondition}`}
            {item.benefitStartDate && item.benefitEndDate && 
              `\n\n신청 기간: ${formatDate(item.benefitStartDate)} ~ ${formatDate(item.benefitEndDate)}`}
            {item.benefitUrl && `\n\n관련 링크: ${item.benefitUrl}`}
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    opacity: 0.15,
  },
  
  // ChatScreen과 완전 동일한 헤더 스타일
  header: {
    backgroundColor: 'transparent',
    paddingTop: 60,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 32,
  },
  headerSeparatorInner: {
    height: 1,
    backgroundColor: '#000',
    marginHorizontal: 20,
  },
  
  // 스크롤 영역
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  
  // 콘텐츠 박스
  contentBox: {
    backgroundColor: '#C9EAEC',
    borderRadius: 20,
    padding: 20,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    textAlign: 'left',
  },
});