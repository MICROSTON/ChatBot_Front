import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import NotificationCard from '../../components/NotificationCard';
import { API_BASE_URL } from '../../../config/config';
import dummyNotifications from '../../../config/dummyNotifications';

const CATEGORIES = [
  { ageGroupNum: 1, label: '임산부/여자' },
  { ageGroupNum: 2, label: '영유아' },
  { ageGroupNum: 3, label: '청소년' },
  { ageGroupNum: 4, label: '청년' },
  { ageGroupNum: 5, label: '중장년' },
  { ageGroupNum: 6, label: '어르신' },
  { ageGroupNum: 7, label: '장애인' },
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
  const [notifications, setNotifications] = useState([]);
  const [userNum, setUserNum] = useState(null); // 실제 로그인 유저 번호로 세팅 필요

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // 기존 데이터 초기화 (임시)
        await AsyncStorage.removeItem(STORAGE_KEY);
        
        const savedCategories = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          console.log('로드된 카테고리:', parsedCategories);
          setSelectedCategories(parsedCategories);

          const count = Object.values(parsedCategories).filter(val => val).length;
          setSelectedCount(count);
        } else {
          // 초기 상태 설정
          const initialCategories = {};
          CATEGORIES.forEach(category => {
            initialCategories[category.ageGroupNum] = false;
          });
          console.log('초기 카테고리 설정:', initialCategories);
          setSelectedCategories(initialCategories);
          setSelectedCount(0);
        }
      } catch (error) {
        console.error('카테고리 로드 오류:', error);
      }
    };

    loadCategories();
    checkNotificationPermissions();
    fetchNotifications();
    // 실제 로그인 유저 정보에서 userNum을 받아와야 함
    // setUserNum(로그인된 유저의 userNum);
  }, []);

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
      const selectedAgeGroupNums = Object.entries(categories)
        .filter(([_, isSelected]) => isSelected)
        .map(([ageGroupNum]) => Number(ageGroupNum));

      const response = await fetch(`${API_BASE_URL}/notifications/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: token,
          userNum,
          ageGroupNums: selectedAgeGroupNums
        }),
      });

      const result = await response.json();
      console.log('서버 응답:', result);

      Alert.alert('알림', '카테고리 알림 설정이 저장되었습니다.');
    } catch (error) {
      console.error('서버 전송 오류:', error);
      Alert.alert('오류', '카테고리 설정 저장 중 문제가 발생했습니다.');
    }
  };

  // 서버에서 알림 리스트 받아오기
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setNotifications(result.notifications || []);
    } catch (error) {
      setNotifications(dummyNotifications);
    }
  };

  // 카테고리 토글 처리 - 디버깅 버전
  const toggleCategory = (ageGroupNum) => {
    console.log('=== toggleCategory 호출 ===');
    console.log('ageGroupNum:', ageGroupNum);
    console.log('현재 selectedCategories:', selectedCategories);
    console.log('현재 selectedCount:', selectedCount);
    
    const isCurrentlySelected = selectedCategories[ageGroupNum];
    console.log('isCurrentlySelected:', isCurrentlySelected);

    // 현재 선택되어 있다면 -> 해제 (항상 허용)
    if (isCurrentlySelected) {
      console.log('-> 해제 처리');
      const newSelectedCategories = {
        ...selectedCategories,
        [ageGroupNum]: false
      };
      
      const newCount = Object.values(newSelectedCategories).filter(val => val).length;
      console.log('newSelectedCategories:', newSelectedCategories);
      console.log('newCount:', newCount);
      
      setSelectedCategories(newSelectedCategories);
      setSelectedCount(newCount);
      saveCategories(newSelectedCategories);
      return;
    }

    // 현재 선택되어 있지 않다면 -> 선택 시도
    console.log('-> 선택 시도');
    console.log('현재 selectedCount:', selectedCount, 'MAX_SELECTIONS:', MAX_SELECTIONS);
    
    // 이미 최대 개수에 도달했는지 확인
    if (selectedCount >= MAX_SELECTIONS) {
      console.log('-> 최대 개수 도달, 선택 불가');
      Alert.alert('알림', `최대 ${MAX_SELECTIONS}개 카테고리만 선택할 수 있습니다.`);
      return;
    }

    // 선택 가능한 경우
    console.log('-> 선택 가능, 처리 중');
    const newSelectedCategories = {
      ...selectedCategories,
      [ageGroupNum]: true
    };
    
    const newCount = Object.values(newSelectedCategories).filter(val => val).length;
    console.log('newSelectedCategories:', newSelectedCategories);
    console.log('newCount:', newCount);
    
    setSelectedCategories(newSelectedCategories);
    setSelectedCount(newCount);
    saveCategories(newSelectedCategories);
  };

  const saveCategories = async (categories) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      const token = await registerForPushNotifications();
      if (token) {
        await sendCategorySelectionToServer(token, categories);
      }
    } catch (error) {
      console.error('카테고리 저장 오류:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>즐겨찾기</Text>
            <View style={styles.rightPlaceholder} />
          </View>

          <View style={styles.divider} />

          {/* 알림 미리보기
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#447473' }}>
              알림 미리보기
            </Text>
            {notifications.map(noti => (
              <NotificationCard key={noti.id} message={noti.message} />
            ))}
          </View>*/}

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

          <View style={styles.categoryContainer}>
            {CATEGORIES.map((category) => (
              <View key={category.ageGroupNum} style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <Switch
                  trackColor={{ false: '#E0E0E0', true: '#A8E0D9' }}
                  thumbColor={selectedCategories[category.ageGroupNum] ? '#55B7B5' : '#f4f3f4'}
                  ios_backgroundColor="#E0E0E0"
                  onValueChange={() => toggleCategory(category.ageGroupNum)}
                  value={selectedCategories[category.ageGroupNum] || false}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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