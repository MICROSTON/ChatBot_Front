import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import FavoriteListScreen from '../screens/FavoriteListScreen';
import WelfareDetailScreen from '../screens/WelfareDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SHChatbot' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: '챗봇 상담', headerBackVisible: false }} />
      <Stack.Screen name="Favorites" component={FavoriteListScreen} options={{ title: '좋아요 목록' }} />
      <Stack.Screen name="WelfareDetail" component={WelfareDetailScreen} options={{ title: '상세 정보' }} />
    </Stack.Navigator>
  );
}
