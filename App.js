import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext'; // 임시 파일
import { BookmarkProvider } from './src/context/BookmarkContext';
import BookmarkScreen from './src/screens/main/BookmarkScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BookmarkProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Bookmarks">
              <Stack.Screen 
                name="Bookmarks" 
                component={BookmarkScreen} 
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </BookmarkProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}