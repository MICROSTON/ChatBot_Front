import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/styles/colors';
import { AuthProvider } from './src/context/AuthContext';

// 인증 관련 화면들 import
import LoginScreen from './src/screens/auth/LoginScreen';
import FindIdScreen from './src/screens/auth/FindIdScreen';
import FindPasswordScreen from './src/screens/auth/FindPasswordScreen';
import FindResultScreen from './src/screens/auth/FindResultScreen';
import SignupScreen1 from './src/screens/auth/SignupScreen1';
import SignupScreen2 from './src/screens/auth/SignupScreen2';

// Stack 네비게이터 생성 (이 부분이 빠져있었습니다)
const Stack = createStackNavigator();

// 키보드 숨김 컴포넌트
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <DismissKeyboard>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{ 
              headerShown: false,
              cardStyle: { backgroundColor: '#00A3FF' }
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="FindId" component={FindIdScreen} />
            <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
            <Stack.Screen name="FindResult" component={FindResultScreen} />
            <Stack.Screen name="SignupScreen1" component={SignupScreen1} />
            <Stack.Screen name="SignupScreen2" component={SignupScreen2} />
            {/* 나중에 메인 화면 추가 */}
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          </Stack.Navigator>
        </DismissKeyboard>
      </NavigationContainer>
    </AuthProvider>
  );
}

