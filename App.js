import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { TouchableWithoutFeedback, Keyboard, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Firebase 임시 비활성화 (Expo Go 테스트용)
// import { initializeApp } from '@react-native-firebase/app';
// import messaging from '@react-native-firebase/messaging';

// Context Providers
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { WelfareProvider } from './src/context/WelfareContext';
import { LikeProvider } from './src/context/LikeContext';

// 스크린들
import SplashScreen from './src/screens/main/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import FindIdScreen from './src/screens/auth/FindIdScreen';
import FindPasswordScreen from './src/screens/auth/FindPasswordScreen';
import FindResultScreen from './src/screens/auth/FindResultScreen';
import SignupScreen1 from './src/screens/auth/SignupScreen1';
import SignupScreen2 from './src/screens/auth/SignupScreen2';
import HomeScreen from './src/screens/main/HomeScreen';
import BookmarkScreen from './src/screens/main/BookmarkScreen';
import NotificationScreen from './src/screens/main/NotificationScreen';
import GuideScreen from './src/screens/onboarding/GuideScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import EditProfileScreen from './src/screens/main/EditProfileScreen';

// 채팅 관련 스크린들
import ChatScreen from './src/screens/chat/ChatScreen';
import FavoriteListScreen from './src/screens/chat/FavoriteListScreen';
import WelfareDetailScreen from './src/screens/chat/WelfareDetailScreen';
import FavoriteDetailScreen from './src/screens/chat/FavoriteDetailScreen';

const Stack = createStackNavigator();

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
);

// 내부 네비게이션 컴포넌트
const AppNavigator = () => {
  const { userToken, isBootstrapping, userInfo } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [guideChecked, setGuideChecked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notification, setNotification] = useState(false);

  // 푸시 알림 설정
  useEffect(() => {
    // 알림 동작 설정
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // 포그라운드에서 알림 수신 리스너
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('포그라운드에서 알림 수신:', notification);
      setNotification(notification);
    });

    // 백그라운드에서 알림 클릭 리스너
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('백그라운드에서 알림 클릭:', response);
      handleNotificationResponse(response);
    });

    // 앱이 백그라운드에서 알림으로 열렸을 때 처리
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        console.log('앱이 알림으로 열림:', response);
        handleNotificationResponse(response);
      }
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  // 알림 응답 처리 함수
  const handleNotificationResponse = (response) => {
    try {
      const notificationData = response.notification.request.content.data;
      console.log('알림 데이터:', notificationData);
      
      if (notificationData?.ageGroupNum) {
        // AsyncStorage에 알림 정보 저장 (HomeScreen에서 처리)
        AsyncStorage.setItem('pendingNotification', JSON.stringify({
          screen: 'Chat',
          params: {
            ageGroupNum: notificationData.ageGroupNum
          }
        })).catch(error => {
          console.error('알림 정보 저장 실패:', error);
        });
      }
    } catch (error) {
      console.error('알림 응답 처리 오류:', error);
    }
  };

  // Expo Push 토큰 발급 및 서버 등록 (prod 서버)
  const registerExpoPushToken = async (userId = 'myuser', ageGroups = [1, 2, 3, 4, 5, 6, 7]) => {
    try {
      // 권한 요청
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('알림 권한 미허용');
        return;
      }

      // projectId는 app.json의 extra.eas.projectId 사용
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
      if (!projectId) {
        console.log('Expo projectId 미설정');
        return;
      }

      // Debug: 현재 사용 중인 EAS Project ID 표시
      console.log('EAS projectId:', projectId);
      Alert.alert('EAS projectId', String(projectId));

      const tokenRes = await Notifications.getExpoPushTokenAsync({ projectId });
      const expoPushToken = tokenRes?.data;
      if (!expoPushToken) {
        console.log('Expo Push 토큰 발급 실패');
        return;
      }
      
      console.log('발급된 Expo Push 토큰:', expoPushToken);
      console.log('등록할 사용자 ID:', userId);

      // 서버 등록 (EC2 prod API)
      const API_BASE = 'http://13.239.18.67:8080';
      const res = await fetch(`${API_BASE}/notification/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pushToken: expoPushToken, ageGroups }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.log('푸시 토큰 등록 실패:', res.status, data);
      } else {
        console.log('푸시 토큰 등록 성공:', data);
      }
    } catch (e) {
      console.log('푸시 토큰 등록 오류:', e);
    }
  };

  // FCM 토큰 발급 및 서버 등록 (로그인 후 호출)
  const registerFCMToken = async (userId, ageGroups = [1, 2, 3, 4, 5, 6, 7]) => {
    try {
      console.log('🔥 FCM 토큰 발급 및 등록 시작 - userId:', userId);
      
      const { default: messaging } = await import('@react-native-firebase/messaging');
      const fcmToken = await messaging().getToken();
      
      if (fcmToken) {
        console.log('✅ FCM 토큰 발급 성공:', fcmToken);
        Alert.alert('FCM 토큰', `FCM 토큰: ${fcmToken}\n\n이 토큰을 복사해서 알려주세요!`);
        
        // 서버에 FCM 토큰 등록
        const API_BASE = 'http://13.239.18.67:8080';
        const response = await fetch(`${API_BASE}/notification/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: `${userId}_fcm`, 
            pushToken: fcmToken, 
            ageGroups 
          }),
        });
        
        if (response.ok) {
          console.log('✅ FCM 토큰 서버 등록 성공');
          Alert.alert('FCM 등록 성공', 'FCM 토큰이 성공적으로 등록되었습니다.');
        } else {
          console.log('❌ FCM 토큰 서버 등록 실패');
          Alert.alert('FCM 등록 실패', 'FCM 토큰 등록에 실패했습니다.');
        }
      } else {
        console.log('❌ FCM 토큰 발급 실패');
        Alert.alert('FCM 토큰 오류', 'FCM 토큰을 발급받을 수 없습니다.');
      }
    } catch (error) {
      console.log('❌ FCM 토큰 등록 오류:', error);
      Alert.alert('FCM 오류', 'FCM 토큰 등록 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 앱 시작 시 OTA 업데이트 자동 확인 및 적용 (EAS 빌드에서만)
  useEffect(() => {
    (async () => {
      try {
        // EAS 빌드에서만 업데이트 체크
        if (Constants.appOwnership !== 'expo' && Updates.isEnabled) {
          console.log('EAS Update 체크 시작...');
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            console.log('업데이트 발견! 다운로드 중...');
            await Updates.fetchUpdateAsync();
            console.log('업데이트 완료! 앱 재시작 중...');
            await Updates.reloadAsync();
          } else {
            console.log('업데이트 없음');
          }
        } else {
          console.log('EAS Update 체크 건너뜀 (Expo Go 환경)');
        }
      } catch (e) {
        console.log('OTA update check failed:', e);
      }
    })();
  }, []);

  // Firebase FCM 푸시 알림 리스너 설정 (조건부 실행)
  useEffect(() => {
    const setupFirebaseListeners = async () => {
      try {
        // Expo Go 환경에서는 Firebase 사용하지 않음
        if (Constants.appOwnership === 'expo') {
          console.log('Expo Go 환경 - Firebase 알림 리스너 건너뜀');
          return;
        }

        // 실제 빌드 환경에서 Firebase 설정
        console.log('실제 빌드 환경 - Firebase 알림 리스너 설정 시도');
        
        // 동적 import로 Firebase 로드
        const { default: messaging } = await import('@react-native-firebase/messaging');
        
        // 포그라운드 메시지 리스너
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
          console.log('포그라운드 메시지 수신:', remoteMessage);
          Alert.alert('새로운 알림', remoteMessage.notification?.body || '새로운 복지 정보가 있습니다.');
        });

        // FCM 토큰 새로고침 리스너 (Firebase 공식 권장사항)
        messaging().onTokenRefresh(async (newToken) => {
          console.log('🔄 FCM 토큰 새로고침 감지:', newToken);
          try {
            // 새로운 토큰을 서버에 등록
            const API_BASE = 'http://13.239.18.67:8080';
            const response = await fetch(`${API_BASE}/notification/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                userId: 'usertester_fcm', 
                pushToken: newToken, 
                ageGroups: [1,2,3,4,5,6,7] 
              }),
            });
            
            if (response.ok) {
              console.log('✅ 새로운 FCM 토큰 서버 등록 성공');
              Alert.alert('FCM 토큰 업데이트', '새로운 FCM 토큰이 서버에 등록되었습니다.');
            } else {
              console.log('❌ 새로운 FCM 토큰 서버 등록 실패');
            }
          } catch (error) {
            console.log('❌ FCM 토큰 새로고침 처리 오류:', error);
          }
        });

        // 백그라운드/종료 상태에서 알림 클릭 리스너
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('백그라운드에서 알림 클릭:', remoteMessage);
          
          const ageGroupNum = remoteMessage.data?.ageGroupNum;
          if (ageGroupNum) {
            console.log('연령대 {}의 복지 목록으로 이동', ageGroupNum);
            AsyncStorage.setItem('pendingNotification', JSON.stringify({
              screen: 'Chat',
              params: { ageGroupNum: parseInt(ageGroupNum) }
            }));
          }
        });

        // 앱이 종료된 상태에서 알림으로 앱이 열린 경우
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('앱 종료 상태에서 알림으로 열림:', remoteMessage);
              
              const ageGroupNum = remoteMessage.data?.ageGroupNum;
              if (ageGroupNum) {
                AsyncStorage.setItem('pendingNotification', JSON.stringify({
                  screen: 'Chat',
                  params: { ageGroupNum: parseInt(ageGroupNum) }
                }));
              }
            }
          });

        console.log('Firebase 알림 리스너 설정 완료');
        
        return () => {
          unsubscribeForeground();
        };
        
      } catch (error) {
        console.log('Firebase 설정 실패, Expo Push Notifications 사용:', error.message);
        // Firebase 실패 시 Expo Push Notifications 사용
        return () => {};
      }
    };

    setupFirebaseListeners();
  }, []);

  // 앱 시작 시 가이드 상태 확인
  useEffect(() => {
    const checkGuideStatus = async () => {
      try {
        const hasSeenGuide = await AsyncStorage.getItem('guide_shown');
        console.log('가이드 상태 확인:', hasSeenGuide);
        if (hasSeenGuide === 'true') {
          setGuideChecked(true);
        } else {
          setGuideChecked(false);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('가이드 상태 확인 오류:', error);
        setGuideChecked(false);
        setIsInitialized(true);
      }
    };
    
    checkGuideStatus();
  }, []);

  // 사용자 토큰이 변경될 때 가이드 상태 재확인
  useEffect(() => {
    if (userToken && isInitialized) {
      // 사용자 로그인 후 Expo 토큰 등록 시도 (실제 로그인 사용자 ID 사용)
      console.log('userInfo 확인:', userInfo);
      const actualUserId = userInfo?.userId || userInfo?.username || 'myuser';
      console.log('실제 사용자 ID로 토큰 등록:', actualUserId);
      console.log('userToken 존재:', !!userToken);
      console.log('isInitialized:', isInitialized);
      registerExpoPushToken(actualUserId, [1, 2, 3, 4, 5, 6, 7]);
      
      // FCM 토큰 등록 (APK 환경에서만)
      if (Constants.appOwnership !== 'expo') {
        console.log('🔥 로그인 후 FCM 토큰 등록 시작');
        registerFCMToken(actualUserId, [1, 2, 3, 4, 5, 6, 7]);
      }

      const checkAndShowGuide = async () => {
        try {
          const hasSeenGuide = await AsyncStorage.getItem('guide_shown');
          console.log('사용자 로그인 후 가이드 상태 재확인:', hasSeenGuide);
          if (hasSeenGuide !== 'true') {
            console.log('가이드 표시 준비 완료');
            setGuideChecked(false);
            // 자동 로그인 후 바로 가이드 표시
            setTimeout(() => {
              console.log('자동 로그인 후 가이드 표시');
              setShowGuide(true);
            }, 500); // 약간의 지연을 두어 화면이 완전히 로드된 후 가이드 표시
          } else {
            setGuideChecked(true);
          }
        } catch (error) {
          console.error('가이드 상태 재확인 오류:', error);
          setGuideChecked(false);
        }
      };
      
      checkAndShowGuide();
    }
  }, [userToken, isInitialized, userInfo]);

  const handleHomeMount = () => {
    console.log('Home 마운트, 가이드 체크 상태:', guideChecked, '사용자 토큰:', userToken);
    if (userToken && !guideChecked && isInitialized) {
      console.log('가이드 표시');
      setShowGuide(true);
    }
  };

  const handleGuideClose = async () => {
    try {
      await AsyncStorage.setItem('guide_shown', 'true');
      setGuideChecked(true);
      setShowGuide(false);
      console.log('가이드 닫기 완료');
    } catch (error) {
      console.error('가이드 상태 저장 오류:', error);
      setShowGuide(false);
    }
  };

  const handleShowGuide = () => {
    console.log('수동으로 가이드 표시');
    setShowGuide(true);
  };

  // 로딩 중이면 스플래시 화면 표시
  if (isBootstrapping || !isInitialized) {
    console.log('로딩 중 또는 초기화 중...');
    return <SplashScreen />;
  }

  console.log('네비게이션 렌더링 - userToken:', userToken, 'guideChecked:', guideChecked);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <DismissKeyboard>
        <Stack.Navigator
          initialRouteName={userToken ? "Home" : "Login"}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#00A3FF' },
            gestureEnabled: false 
          }}
        >
          {/* 인증이 필요한 스크린들 */}
          {!userToken ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="FindId" component={FindIdScreen} />
              <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
              <Stack.Screen name="FindResult" component={FindResultScreen} />
              <Stack.Screen name="SignupScreen1" component={SignupScreen1} />
              <Stack.Screen name="SignupScreen2" component={SignupScreen2} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home">
                {props => (
                  <>
                    <HomeScreen
                      {...props}
                      onShowGuide={handleShowGuide}
                      onMount={handleHomeMount}
                    />
                    <GuideScreen
                      visible={showGuide}
                      onClose={handleGuideClose}
                    />
                  </>
                )}
              </Stack.Screen>
              
              <Stack.Screen name="Bookmark" component={BookmarkScreen} />
              <Stack.Screen name="Notification" component={NotificationScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />

              {/* 채팅 관련 스크린들 */}
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="WelfareDetail" component={WelfareDetailScreen} />
              <Stack.Screen name="FavoriteList" component={FavoriteListScreen} />
              <Stack.Screen name="FavoriteDetail" component={FavoriteDetailScreen} />
            </>
          )}
        </Stack.Navigator>
      </DismissKeyboard>
    </NavigationContainer>
  );
};

export default function App() {
  // Firebase 초기화 및 FCM 토큰 요청
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Firebase 앱 초기화
        await initializeApp();
        console.log('Firebase 앱 초기화 완료');

        // FCM 토큰 요청
        try {
          const fcmToken = await messaging().getToken();
          console.log('FCM 토큰:', fcmToken);
        } catch (tokenError) {
          console.log('FCM 토큰 획득 실패 (Firebase 설정 필요):', tokenError);
        }

        // 알림 권한 요청
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('FCM 알림 권한 허용됨');
        } else {
          console.log('FCM 알림 권한 거부됨');
        }

      } catch (error) {
        console.error('Firebase 초기화 오류:', error);
      }
    };

    initializeFirebase();
  }, []);

  return (
    <AuthProvider>
      <BookmarkProvider>
        <WelfareProvider>
          <LikeProvider>
            <AppNavigator />
          </LikeProvider>
        </WelfareProvider>
      </BookmarkProvider>
    </AuthProvider>
  );
}