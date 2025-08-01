import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfile, deleteUser } from '../../services/UserService';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const userNum = route.params?.userNum;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (route.params?.profile) {
      setProfile(route.params.profile);
      return;
    }
    (async () => {
      try {
        const data = await getProfile(userNum);
        setProfile(data);
      } catch {
        Alert.alert('오류', '프로필 정보를 불러올 수 없습니다.');
      }
    })();
  }, [userNum, route.params?.profile]);

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 되었습니다.', [
      { text: '확인', onPress: () => navigation.replace('Login') }
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert('회원탈퇴', '정말 탈퇴하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(userNum);
            Alert.alert('탈퇴 완료', '회원탈퇴 처리되었습니다.', [
              { text: '확인', onPress: () => navigation.replace('Login') }
            ]);
          } catch {
            Alert.alert('오류', '회원탈퇴 실패');
          }
        }
      }
    ]);
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>프로필 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { showGuide: false })}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>이름</Text>
        <Text style={styles.value}>{profile.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>전화번호</Text>
        <Text style={styles.value}>{profile.phone}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>생년월일</Text>
        <Text style={styles.value}>{profile.birth}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>가구원 수</Text>
        <Text style={styles.value}>{profile.homeMember}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>중위소득</Text>
        <Text style={styles.value}>{profile.income}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>주소</Text>
        <Text style={styles.value}>{profile.address}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.rowDivider} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
      <View style={styles.rowDivider} />
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
        <Text style={styles.withdrawText}>회원탈퇴</Text>
      </TouchableOpacity>
      <View style={styles.rowDivider} />
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { profile, userNum })}>
        <Text style={styles.editButtonText}>수정하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 70,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  backIcon: { 
    fontSize: 22, 
    color: '#333', 
    width: 24 
},
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
},
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
},
rowDivider: {
  height: 1,
  backgroundColor: '#eee',
  marginHorizontal: 0,
},
  label: { 
    fontSize: 18, 
    color: '#000000',
    fontWeight: 'bold',
},
  value: { 
    fontSize: 16, 
    color: '#8B8B8B' 
},
  editButton: { 
    alignSelf: 'center',
    margin: 18, 
    backgroundColor: '#447473', 
    borderRadius: 8, 
    alignItems: 'center', 
    paddingVertical: 14,
    width: 148,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 40,
    marginBottom: 18,
},
  editButtonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: 'bold' 
},
  divider: { 
    height: 25, 
    backgroundColor: '#f5f5f5', 
    marginHorizontal: 0, 
    marginVertical: 0, 
    borderRadius: 4, 
},
  logoutButton: { 
    marginHorizontal: 18, 
    marginTop: 0, 
    paddingVertical: 14 
},
  logoutText: { 
    color: '#D77B7B', 
    fontSize: 18, 
    textAlign: 'left' 
},
  withdrawButton: { 
    marginHorizontal: 18, 
    marginTop: 0, 
    paddingVertical: 14 
},
  withdrawText: { 
    color: '#D77B7B', 
    fontSize: 18, 
    textAlign: 'left' 
},
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
},
});