// src/screens/chat/HomeScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>SHChatbot</Text>
        <TouchableOpacity>
          <Text style={styles.profile}>프로필</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.guideRow}>
        <Text style={styles.guideIcon}>ⓘ</Text>
        <Text style={styles.guideText}>가이드</Text>
      </View>

      <TouchableOpacity
        style={styles.chatBox}
        onPress={() => navigation.navigate('Chat')}
      >
        <Image
          source={require('../../../assets/images/mascot.png')}
          style={styles.avatar}
        />
        <Text style={styles.chatText}>대화 하기</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FavoriteList')} // ✅ 여기 수정됨
        >
          <Text style={styles.buttonText}>좋아요</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WelfareDetail')}
        >
          <Text style={styles.buttonText}>즐겨찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f9b9c',
  },
  profile: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  guideIcon: {
    color: '#3f9b9c',
    fontSize: 16,
    marginRight: 5,
  },
  guideText: {
    color: '#222',
    fontSize: 16,
  },
  chatBox: {
    backgroundColor: '#51b8b7',
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  chatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 0.48,
    backgroundColor: '#51b8b7',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});
