import React from 'react';
import { ScrollView, View } from 'react-native';
import dummyNotifications from '../../../config/dummyNotifications';
import NotificationCard from '../../components/NotificationCard';

export default function NotificationScreen() {
  return (
    <ScrollView style={{ backgroundColor: '#CFF3F7', flex: 1 }}>
      <View style={{ marginTop: 30 }}>
        {dummyNotifications.map(noti => (
          <NotificationCard key={noti.id} message={noti.message} />
        ))}
      </View>
    </ScrollView>
  );
}