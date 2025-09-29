import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import NotificationCard from '../../components/NotificationCard';
import { CONFIG } from '../../../config/config';
import dummyNotifications from '../../../config/dummyNotifications';
import { BookmarkContext } from '../../context/BookmarkContext';
import { AuthContext } from '../../context/AuthContext';

const CATEGORIES = [
  { ageGroupNum: 1, label: '임산부/여자' },
  { ageGroupNum: 2, label: '영유아' },
  { ageGroupNum: 3, label: '청소년' },
  { ageGroupNum: 4, label: '청년' },
  { ageGroupNum: 5, label: '중장년' },
  { ageGroupNum: 6, label: '어르신' },
  { ageGroupNum: 7, label: '장애인' },
];

// const MAX_SELECTIONS = 3; // 개수 제한 제거
const STORAGE_KEY = 'notification_categories';

// 알림 설정
// Firebase FCM 알림 핸들러는 App.js에서 설정됨

const BookmarkScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userNum, setUserNum] = useState(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  
  // Context 사용
  const { addBookmark, removeBookmark, bookmarks, error: bookmarkError } = useContext(BookmarkContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // 기존 북마크 데이터를 먼저 확인
        if (bookmarks && bookmarks.length > 0) {
          console.log('기존 북마크 목록:', bookmarks);
          
          // 북마크에 있는 카테고리들을 선택된 상태로 설정
          const syncedCategories = {};
          CATEGORIES.forEach(category => {
            syncedCategories[category.ageGroupNum] = bookmarks.some(
              bookmark => bookmark.ageGroupNum === category.ageGroupNum
            );
          });
          
          console.log('북마크 기반 동기화된 카테고리:', syncedCategories);
          setSelectedCategories(syncedCategories);
          
          const count = Object.values(syncedCategories).filter(val => val).length;
          setSelectedCount(count);
          
          // AsyncStorage에도 저장
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncedCategories));
        } else {
          // 북마크가 없으면 저장된 카테고리 설정을 로드
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
        }
      } catch (error) {
        console.error('카테고리 로드 오류:', error);
      }
    };

    loadCategories();
    checkNotificationPermissions();
    fetchNotifications();
    fetchNotificationStatus();
    
    // 로그인된 사용자 정보 설정 (테스트용으로 usertester 사용)
    const testUserId = userInfo?.id || "usertester";
    setUserNum(testUserId);
    console.log('BookmarkScreen 사용자 ID:', testUserId);
  }, [userInfo, bookmarks]);

  const checkNotificationPermissions = async () => {
    if (!Device.isDevice) {
      console.log('실제 기기가 아니므로 알림을 사용할 수 없습니다.');
      return;
    }

    try {
      // Expo Go 환경에서는 Firebase 권한 요청 건너뜀
      if (Constants.appOwnership === 'expo') {
        console.log('Expo Go 환경 - Firebase 권한 요청 건너뜀');
        return;
      }

      // 실제 빌드에서만 Firebase 권한 요청
      console.log('실제 빌드 환경 - Firebase 권한 요청');
      const { default: messaging } = await import('@react-native-firebase/messaging');
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert(
          '알림 권한 필요',
          '새로운 복지정보 알림을 받으려면 알림 권한이 필요합니다.',
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      console.log('Firebase 권한 요청 실패, Expo Push Notifications 사용:', error.message);
    }
  };

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      Alert.alert('알림', '실제 기기에서만 푸시 알림을 사용할 수 있습니다.');
      return null;
    }

    try {
      // 권한 요청
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

      // 모든 환경에서 Expo Push Token 사용 (통일된 방식)
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Expo Push Token 획득 성공:', token.data);
      return token.data;
      
    } catch (error) {
      console.error('푸시 토큰 획득 오류:', error);
      // 테스트용 더미 토큰 반환
      console.log('모든 토큰 획득 실패, 더미 토큰 사용');
      return 'ExponentPushToken[TEST_DUMMY_TOKEN_FOR_TESTING]';
    }
  };

  // 서버에 카테고리 선택 정보 전송
  const sendCategorySelectionToServer = async (token, categories) => {
    try {
      const selectedAgeGroupNums = Object.entries(categories)
        .filter(([_, isSelected]) => isSelected)
        .map(([ageGroupNum]) => Number(ageGroupNum));

      console.log('선택된 연령대:', selectedAgeGroupNums);
      console.log('사용자 ID:', userNum);

      const response = await fetch(`${CONFIG.apiUrl}/notification/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userNum,
          pushToken: token,
          ageGroups: selectedAgeGroupNums,
          isActive: isNotificationEnabled  // 현재 알림 활성화 상태 포함
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('서버 응답:', result);

      Alert.alert('알림', '카테고리 알림 설정이 저장되었습니다.');
    } catch (error) {
      console.error('서버 전송 오류:', error);
      Alert.alert('오류', '카테고리 설정 저장 중 문제가 발생했습니다: ' + error.message);
    }
  };

  // 서버에서 알림 리스트 받아오기
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${CONFIG.apiUrl}/notifications/list`, {
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

  // 카테고리 토글 처리 - 북마크 추가/삭제 기능 포함
  const toggleCategory = async (ageGroupNum) => {
    console.log('=== toggleCategory 호출 ===');
    console.log('ageGroupNum:', ageGroupNum);
    console.log('현재 selectedCategories:', selectedCategories);
    console.log('현재 selectedCount:', selectedCount);
    
    const isCurrentlySelected = selectedCategories[ageGroupNum];
    console.log('isCurrentlySelected:', isCurrentlySelected);

    // 현재 선택되어 있다면 -> 해제 (북마크 삭제)
    if (isCurrentlySelected) {
      console.log('-> 해제 처리 (북마크 삭제)');
      
      try {
        const result = await removeBookmark({ 
          userNum: userInfo?.id, 
          ageGroupNum 
        });
        
        if (result) {
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
          
          Alert.alert('성공', '북마크가 해제되었습니다.');
        } else {
          Alert.alert('오류', '북마크 해제에 실패했습니다.');
        }
      } catch (error) {
        console.error('북마크 해제 오류:', error);
        Alert.alert('오류', '북마크 해제 중 문제가 발생했습니다.');
      }
      return;
    }

    // 현재 선택되어 있지 않다면 -> 선택 시도 (북마크 추가)
    console.log('-> 선택 시도 (북마크 추가)');
    console.log('현재 selectedCount:', selectedCount);
    
    // 개수 제한 제거됨 - 무제한 선택 가능

    // 선택 가능한 경우 - 북마크 추가
    console.log('-> 선택 가능, 북마크 추가 중');
    
    try {
      const result = await addBookmark({ 
        userNum: userInfo?.id, 
        ageGroupNum 
      });
      
      if (result) {
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
        
        Alert.alert('성공', '북마크가 추가되었습니다.');
      } else {
        Alert.alert('오류', '북마크 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크 추가 오류:', error);
      Alert.alert('오류', '북마크 추가 중 문제가 발생했습니다.');
    }
  };

  const saveCategories = async (categories) => {
    try {
      console.log('=== 카테고리 저장 시작 ===');
      console.log('저장할 카테고리:', categories);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      console.log('AsyncStorage에 카테고리 저장 완료');
      
      // 푸시 알림 토큰 등록 및 서버 전송
      console.log('푸시 알림 토큰 등록 시작...');
      const token = await registerForPushNotifications();
      
      if (token) {
        console.log('푸시 토큰 획득 성공:', token.substring(0, 20) + '...');
        
        if (userInfo?.id) {
          console.log('사용자 ID 확인됨:', userInfo.id);
          console.log('서버로 푸시 알림 설정 전송 시작...');
          await sendCategorySelectionToServer(token, categories);
        } else {
          console.error('사용자 ID가 없어서 서버 전송을 건너뜀');
        }
      } else {
        console.error('푸시 토큰을 획득할 수 없음');
        Alert.alert('알림', '푸시 알림 토큰을 획득할 수 없습니다. 알림 권한을 확인해주세요.');
      }
      
      console.log('=== 카테고리 저장 완료 ===');
    } catch (error) {
      console.error('카테고리 저장 오류:', error);
      Alert.alert('오류', '카테고리 설정 저장 중 문제가 발생했습니다: ' + error.message);
    }
  };

  // 알람 토글 처리
  const toggleNotification = async () => {
    try {
      if (!userInfo?.id) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      // 1단계: 서버 연결 테스트 (핑)
      try {
        console.log('=== 서버 연결 테스트 ===');
        console.log('핑 URL:', `${CONFIG.apiUrl}/notification/usertester`);
        const pingResponse = await fetch(`${CONFIG.apiUrl}/notification/usertester`);
        console.log('핑 응답 상태:', pingResponse.status);
        if (pingResponse.ok) {
          console.log('✅ 서버 연결 성공');
        } else {
          console.log('❌ 서버 연결 실패 - 상태:', pingResponse.status);
          Alert.alert('오류', `서버에 연결할 수 없습니다. 상태: ${pingResponse.status}`);
          return;
        }
      } catch (pingError) {
        console.log('❌ 서버 연결 테스트 실패:', pingError.message);
        Alert.alert('오류', `서버에 연결할 수 없습니다: ${pingError.message}`);
        return;
      }

      const newNotificationState = !isNotificationEnabled;
      console.log('알림 상태 변경:', newNotificationState);

      // 푸시 알림 토큰 등록 및 서버 전송
      const token = await registerForPushNotifications();
      
      if (token) {
        console.log('푸시 토큰 획득 성공:', token.substring(0, 20) + '...');
        
        const selectedAgeGroupNums = Object.entries(selectedCategories)
          .filter(([_, isSelected]) => isSelected)
          .map(([ageGroupNum]) => Number(ageGroupNum));

        console.log('선택된 연령대:', selectedAgeGroupNums);
        console.log('사용자 ID:', userInfo.id);

        const requestData = {
          userId: userInfo.id,
          pushToken: token,
          ageGroups: selectedAgeGroupNums,
          isActive: newNotificationState
        };
        
        console.log('=== 서버 요청 데이터 ===');
        console.log('API URL:', `${CONFIG.apiUrl}/notification/register`);
        console.log('Request Data:', JSON.stringify(requestData, null, 2));
        
        // 실제 전송할 JSON 문자열 확인
        const jsonBody = JSON.stringify(requestData);
        console.log('=== JSON Body 확인 ===');
        console.log('JSON Body:', jsonBody);
        console.log('JSON Body Length:', jsonBody.length);
        console.log('JSON Body Type:', typeof jsonBody);
        
        const response = await fetch(`${CONFIG.apiUrl}/notification/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: jsonBody,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('=== 서버 응답 ===');
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(result, null, 2));

        // 성공적으로 저장되면 상태 업데이트
        setIsNotificationEnabled(newNotificationState);
        Alert.alert('알림', newNotificationState ? '푸시 알림이 활성화되었습니다.' : '푸시 알림이 비활성화되었습니다.');
      } else {
        console.error('푸시 토큰을 획득할 수 없음');
        Alert.alert('알림', '푸시 알림 토큰을 획득할 수 없습니다. 알림 권한을 확인해주세요.');
      }
    } catch (error) {
      console.error('알람 토글 오류:', error);
      Alert.alert('오류', '알림 설정 변경 중 문제가 발생했습니다: ' + error.message);
    }
  };

  // 현재 알람 설정 상태 조회
  const fetchNotificationStatus = async () => {
    try {
      if (!userInfo?.id) {
        console.log('사용자 ID가 없어서 알림 상태 조회를 건너뜀');
        return;
      }

      console.log('=== 알림 상태 조회 ===');
      console.log('조회할 사용자 ID:', userInfo.id);
      console.log('API URL:', `${CONFIG.apiUrl}/notification/${userInfo.id}`);

      const response = await fetch(`${CONFIG.apiUrl}/notification/${userInfo.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('응답 상태:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('=== 알림 상태 조회 결과 ===');
        console.log('Response Data:', JSON.stringify(result, null, 2));
        console.log('isActive 값:', result.isActive);
        
        // 서버에서 PushNotificationResponseDto를 직접 반환하므로 result.isActive로 접근
        setIsNotificationEnabled(result.isActive ?? true);
        console.log('알림 상태 설정됨:', result.isActive ?? true);
      } else {
        console.error('알림 상태 조회 실패:', response.status);
      }
    } catch (error) {
      console.error('알람 상태 조회 오류:', error);
    }
  };

  // 카테고리 토글 처리 - 북마크 추가/삭제 기능 포함

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
              알림 받고 싶은 카테고리를 선택하세요
            </Text>
          </View>

          {/* 알람 온오프 토글 */}
          <View style={styles.notificationToggleContainer}>
            <Text style={styles.notificationToggleLabel}>푸시 알림</Text>
            <Switch
              trackColor={{ false: '#E0E0E0', true: '#A8E0D9' }}
              thumbColor={isNotificationEnabled ? '#55B7B5' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleNotification}
              value={isNotificationEnabled}
            />
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

          {/* 에러 메시지 표시 */}
          {bookmarkError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{bookmarkError}</Text>
            </View>
          )}
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
  },
  buttonContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  addBookmarkButton: {
    backgroundColor: '#55B7B5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#364144',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#CCCCCC',
  },
  addBookmarkButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
  },
  bookmarkListContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 10,
  },
  bookmarkListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bookmarkText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  notificationToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 20,
  },
  notificationToggleLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookmarkScreen;