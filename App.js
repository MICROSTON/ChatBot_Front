import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/chat/HomeScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import FavoriteListScreen from './src/screens/chat/FavoriteListScreen';
import WelfareDetailScreen from './src/screens/chat/WelfareDetailScreen';

import { LikeProvider } from './src/context/LikeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LikeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="FavoriteList" component={FavoriteListScreen} />
            <Stack.Screen name="WelfareDetail" component={WelfareDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LikeProvider>
    </GestureHandlerRootView>
  );
}
