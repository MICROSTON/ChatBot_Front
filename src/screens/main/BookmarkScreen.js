import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
// 푸시알림
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const CATEGORIES = [
  { id: 'pregnant', label: '임산부/여자' },
  { id: 'infant', label: '영유아' },
  { id: 'teenager', label: '청소년' },
  { id: 'youth', label: '청년' },
  { id: 'middleage', label: '중장년' },
  { id: 'elderly', label: '어르신' },
  { id: 'disabled', label: '장애인' },
];

const MAX_SELECTIONS = 3;
const STORAGE_KEY = 'notification_categories';

// 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const BookmarkScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);

  // 저장된 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const savedCategories = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          setSelectedCategories(parsedCategories);
          
          // 선택된 카테고리 수 계산
          const count = Object.values(parsedCategories).filter(val => val).length;
          setSelectedCount(count);
        }
      } catch (error) {
        console.error('카테고리 로드 오류:', error);
      }
    };
    
    loadCategories();
    
    // 앱 로드시 알림 권한 확인
    checkNotificationPermissions();
  }, []);

  // 알림 권한 확인 및 요청
  const checkNotificationPermissions = async () => {
    if (!Constants.isDevice) {
      console.log('실제 기기가 아니므로 알림을 사용할 수 없습니다.');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
      console.log('알림 권한 요청 중...');
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '알림 권한 필요',
          '새로운 복지정보 알림을 받으려면 알림 권한이 필요합니다.',
          [{ text: '확인' }]
        );
      }
    }
  };

  // 푸시 알림 토큰 획득
  const registerForPushNotifications = async () => {
    if (!Constants.isDevice) {
      Alert.alert('알림', '실제 기기에서만 푸시 알림을 사용할 수 있습니다.');
      return null;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('알림', '푸시 알림 권한이 필요합니다.');
      return null;
    }
    
    try {
      // 토큰 획득
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      console.log('Push Token:', token);
      return token;
    } catch (error) {
      console.error('푸시 토큰 획득 오류:', error);
      return null;
    }
  };

  // 서버에 카테고리 선택 정보 전송
  const sendCategorySelectionToServer = async (token, categories) => {
    try {
      // 선택된 카테고리 ID만 추출
      const selectedCategoryIds = Object.entries(categories)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      console.log('서버에 전송할 데이터:', { 
        pushToken: token, 
        categories: selectedCategoryIds 
      });
      
      // API 호출 예시 (실제 서버 API로 변경 필요)
      // const response = await fetch('https://your-api.com/notifications/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     pushToken: token,
      //     categories: selectedCategoryIds
      //   }),
      // });
      // 
      // const result = await response.json();
      // console.log('서버 응답:', result);
      
      Alert.alert('알림', '카테고리 알림 설정이 저장되었습니다.');
    } catch (error) {
      console.error('서버 전송 오류:', error);
      Alert.alert('오류', '카테고리 설정 저장 중 문제가 발생했습니다.');
    }
  };

  // 카테고리 토글 처리
  const toggleCategory = (categoryId) => {
    // 현재 상태 확인
    const isCurrentlySelected = selectedCategories[categoryId];
    
    // 이미 3개 선택되어 있고, 새로운 카테고리를 선택하려는 경우
    if (selectedCount >= MAX_SELECTIONS && !isCurrentlySelected) {
      Alert.alert('알림', `최대 ${MAX_SELECTIONS}개 카테고리만 선택할 수 있습니다.`);
      return;
    }
    
    // 토글 상태 업데이트
    const newSelectedCategories = {
      ...selectedCategories,
      [categoryId]: !isCurrentlySelected
    };
    
    setSelectedCategories(newSelectedCategories);
    
    // 선택된 카테고리 수 계산
    const newCount = Object.values(newSelectedCategories).filter(val => val).length;
    setSelectedCount(newCount);
    
    // 변경사항 저장
    saveCategories(newSelectedCategories);
  };

  // 선택한 카테고리 저장 및 서버 전송
  const saveCategories = async (categories) => {
    try {
      // 로컬 스토리지에 저장
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      
      // 디바이스 토큰 획득
      const token = await registerForPushNotifications();
      
      // 선택한 카테고리와 토큰을 서버로 전송
      if (token) {
        await sendCategorySelectionToServer(token, categories);
      }
    } catch (error) {
      console.error('카테고리 저장 오류:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>즐겨찾기</Text>
          <View style={styles.rightPlaceholder} />
        </View>
        
        <View style={styles.divider} />

        {/* 챗봇 캐릭터와 안내 메시지 */}
        <View style={styles.instructionContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.chatbotImage}
            defaultSource={require('../../../assets/images/logo.png')}
          />
          <Text style={styles.instructionText}>
            알림 받고 싶은 카테고리를 3개 선택하세요
          </Text>
        </View>

        {/* 카테고리 리스트 */}
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <Switch
                trackColor={{ false: '#E0E0E0', true: '#A8E0D9' }}
                thumbColor={selectedCategories[category.id] ? '#55B7B5' : '#f4f3f4'}
                ios_backgroundColor="#E0E0E0"
                onValueChange={() => toggleCategory(category.id)}
                value={selectedCategories[category.id] || false}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rightPlaceholder: {
    width: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    left: 0,               
    right: 0,             
    marginTop: 60,  
  },
  instructionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chatbotImage: {
    width: 120,
    height: 120,
    borderRadius: 40,
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 15,
    color: '#333',
  },
  categoryContainer: {
    backgroundColor: '#C9EAEC',
    margin: 20,
    borderRadius: 15,
    padding: 30,
    borderColor: '#447473',
    borderWidth: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#D8F0F0',
  },
  categoryLabel: {
    fontSize: 16,
    color: '#333',
  }
});

export default BookmarkScreen;