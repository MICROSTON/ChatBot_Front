import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 홈 화면 import
import HomeScreen from './src/screens/main/HomeScreen'; // 경로는 실제 파일 위치에 맞게 수정해주세요
import GuideScreen from './src/screens/onboarding/GuideScreen';
import { hasSeenGuide } from './src/services/guideService';

const Stack = createStackNavigator();

export default function App() {
  // 가이드 표시 상태
  const [showGuide, setShowGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 가이드 표시 여부 확인
  useEffect(() => {
    const checkGuideStatus = async () => {
      try {
        const seen = await hasSeenGuide();
        setShowGuide(!seen); // 가이드를 본 적이 없으면 표시
      } catch (error) {
        console.error('가이드 상태 확인 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkGuideStatus();
  }, []);

  // 가이드 닫기 핸들러
  const handleGuideClose = () => {
    setShowGuide(false);
  };

  // 가이드 버튼 클릭 핸들러 (수동으로 가이드 열기)
  const handleShowGuide = () => {
    setShowGuide(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home">
            {props => (
              <HomeScreen
                {...props}
                onShowGuide={handleShowGuide}
              />
            )}
          </Stack.Screen>
          {/* 필요한 경우 다른 화면들을 여기에 추가 */}
        </Stack.Navigator>

        {/* 가이드 모달 컴포넌트 - 화면 위에 오버레이로 표시 */}
        <GuideScreen
          visible={showGuide} 
          onClose={handleGuideClose}
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});