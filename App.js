import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { BookmarkProvider } from './src/context/BookmarkContext';

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

const Stack = createStackNavigator();

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  // HomeScreen이 처음 마운트될 때 가이드 자동 표시
  const handleHomeMount = () => {
    setShowGuide(true);
  };

  const handleGuideClose = () => setShowGuide(false);
  const handleShowGuide = () => setShowGuide(true);

  return (
    <AuthProvider>
      <BookmarkProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <DismissKeyboard>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#00A3FF' },
                gestureEnabled: false 
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="FindId" component={FindIdScreen} />
              <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
              <Stack.Screen name="FindResult" component={FindResultScreen} />
              <Stack.Screen name="SignupScreen1" component={SignupScreen1} />
              <Stack.Screen name="SignupScreen2" component={SignupScreen2} />
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
            </Stack.Navigator>
          </DismissKeyboard>
        </NavigationContainer>
      </BookmarkProvider>
    </AuthProvider>
  );
}