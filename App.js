import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { initializeApp } from '@react-native-firebase/app';

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
  const { userToken, isBootstrapping } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [guideChecked, setGuideChecked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 푸시 알림 클릭 리스너 설정
  useEffect(() => {
    const notificationListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('푸시 알림 클릭됨:', response);
      
      // 알림 데이터에서 연령대 정보 추출
      const notificationData = response.notification.request.content.data;
      const ageGroupNum = notificationData?.ageGroupNum;
      
      if (ageGroupNum) {
        console.log('연령대 {}의 복지 목록으로 이동', ageGroupNum);
        // 여기서 네비게이션을 처리해야 하지만, 현재 컴포넌트에서는 navigation 객체에 접근할 수 없음
        // 대신 AsyncStorage에 이동할 화면 정보를 저장하고, HomeScreen에서 확인하도록 함
        AsyncStorage.setItem('pendingNotification', JSON.stringify({
          screen: 'Chat',
          params: { ageGroupNum: parseInt(ageGroupNum) }
        }));
      }
    });

    return () => {
      if (notificationListener) {
        notificationListener.remove();
      }
    };
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
  }, [userToken, isInitialized]);

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
  // Firebase 초기화
  useEffect(() => {
    try {
      initializeApp();
      console.log('Firebase 초기화 완료');
    } catch (error) {
      console.error('Firebase 초기화 오류:', error);
    }
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