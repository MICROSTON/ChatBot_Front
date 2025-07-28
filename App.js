import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import GuideScreen from './src/screens/onboarding/GuideScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  // 가이드 표시 상태
  const [showGuide, setShowGuide] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* 테스트용 메인 화면 */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>신한 챗봇 - 가이드 테스트</Text>
          <Text style={styles.subtitle}>
            현재 가이드 기능 테스트를 위한 임시 화면입니다.
          </Text>
          
          <TouchableOpacity 
            style={styles.guideButton} 
            onPress={() => setShowGuide(true)}
          >
            <Text style={styles.buttonText}>가이드 보기</Text>
          </TouchableOpacity>
        </View>
        
        {/* 가이드 모달 컴포넌트 */}
        <GuideScreen
          visible={showGuide} 
          onClose={() => setShowGuide(false)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  guideButton: {
    backgroundColor: '#55B7B5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
});