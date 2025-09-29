import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation, route, onShowGuide, onMount }) {
  useEffect(() => {
    console.log('HomeScreen 마운트 - route.params:', route.params);
    if (route.params?.showGuide === true || route.params === undefined) {
      console.log('HomeScreen에서 onMount 호출');
      onMount();
    }
    
    // 푸시 알림 클릭으로 인한 화면 이동 처리
    checkPendingNotification();
  }, [route.params?.showGuide, onMount]);

  const checkPendingNotification = async () => {
    try {
      const pendingNotification = await AsyncStorage.getItem('pendingNotification');
      if (pendingNotification) {
        const notificationData = JSON.parse(pendingNotification);
        console.log('대기 중인 알림 처리:', notificationData);
        
        // AsyncStorage에서 제거
        await AsyncStorage.removeItem('pendingNotification');
        
        // 해당 화면으로 이동
        if (notificationData.screen === 'Chat' && notificationData.params?.ageGroupNum) {
          navigation.navigate('Chat', { 
            selectedAgeGroup: notificationData.params.ageGroupNum 
          });
        }
      }
    } catch (error) {
      console.error('대기 중인 알림 처리 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        {/* 텍스트 대신 이미지 로고 사용 */}
        <Image
          source={require('../../../assets/images/SHChatbot.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../../assets/icons/profile.png')} // 아이콘 파일 경로에 맞게 수정
            style={ styles.profileIcon }
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* 상단에 가이드/대화하기/버튼 */}
      <View style={styles.topArea}>
        <TouchableOpacity style={styles.guideRow} onPress={onShowGuide}>
          <Text style={styles.guideIcon} allowFontScaling={false}>ⓘ</Text>
          <Text style={styles.guideText} allowFontScaling={false}>가이드</Text>
        </TouchableOpacity>

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
            onPress={() => navigation.navigate('FavoriteList')}
          >
            <Text style={styles.buttonText}>좋아요</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Bookmark')}
          >
            <Text style={styles.buttonText}>즐겨찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
    paddingRight: 20, 
  },
  logo: {
    width: 190,
    height: 40,
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  divider: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  topArea: {
    alignItems: 'center',
    marginTop: 0,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  guideIcon: {
    fontSize: 40,
    lineHeight: 44,
    color: '#E3A772',
    marginRight: 6,
    marginTop: 100,
  },
  guideText: {
    fontSize: 36,
    lineHeight: 42,
    color: '#333',
    marginTop: 100,
  },
  chatBox: {
    backgroundColor: '#55B7B5',
    borderRadius: 24,
    paddingVertical: 50,
    alignItems: 'center',
    width: 260,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#364144',
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  chatText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260,
  },
  button: {
    flex: 0.48,
    backgroundColor: '#55B7B5',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#364144',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f9b9c',
  },
  profileIcon: {
    width: 27,
    height: 27,
    marginRight: 18,
    marginTop: 10,
  },
});