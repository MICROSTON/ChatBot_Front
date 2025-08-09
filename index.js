import 'react-native-gesture-handler'; // 👈 가장 위에!
import { registerRootComponent } from 'expo';
import App from './App';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
}

// 👇 반드시 감싼 Root 컴포넌트를 등록합니다
registerRootComponent(Root);
