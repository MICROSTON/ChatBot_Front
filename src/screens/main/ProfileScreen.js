import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfile, withdrawUser } from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';

// 중위소득 옵션 (EditProfileScreen과 동일하게 정의)
const incomeOptions = [
  { label: '50% 이하', value: '1' },
  { label: '60%', value: '2' },
  { label: '70%', value: '3' },
  { label: '80%', value: '4' },
  { label: '90%', value: '5' },
  { label: '100%', value: '6' },
  { label: '110%', value: '7' },
  { label: '120%', value: '8' },
  { label: '130%', value: '9' },
  { label: '140%', value: '10' },
  { label: '150%', value: '12' },
  { label: '160%', value: '13' },
  { label: '170%', value: '14' },
  { label: '180%', value: '15' },
  { label: '190%', value: '16' },
  { label: '200%', value: '17' },
  { label: '210%', value: '18' },
  { label: '220%', value: '19' },
  { label: '230%', value: '20' },
  { label: '240%', value: '21' },
  { label: '250%', value: '22' },
  { label: '260%', value: '23' },
  { label: '270%', value: '24' },
  { label: '280%', value: '25' },
  { label: '290%', value: '26' },
  { label: '300% 이상', value: '27' },
];

// income 값을 라벨로 변환하는 함수
const getIncomeLabel = (incomeValue) => {
  const option = incomeOptions.find(opt => opt.value === incomeValue?.toString());
  return option ? option.label : '';
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout, userInfo } = useAuth();
  const userNum = route.params?.userNum || userInfo?.userNum || userInfo?.id;
  
  // userNum을 숫자로 변환
  const numericUserNum = typeof userNum === 'string' ? parseInt(userNum) : userNum;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        if (route.params?.profile) {
          setProfile(route.params.profile);
          return;
        }

        // 사용자 정보가 없으면 로그인 화면으로 이동
        if (!userInfo) {
          console.log('사용자 정보가 없어서 로그인 화면으로 이동');
          navigation.replace('Login');
          return;
        }

        console.log('프로필 조회 시작 - userNum:', numericUserNum);
        const result = await getProfile(numericUserNum);
        console.log('프로필 조회 결과:', result);
        
        if (result && result.success) {
          setProfile(result.data || result);
        } else {
          console.error('프로필 조회 실패:', result?.error);
          Alert.alert('오류', result?.error || '프로필 정보를 불러올 수 없습니다.');
        }
      } catch(error) {
        console.error('프로필 조회 오류:', error);
        Alert.alert('오류', '프로필 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [numericUserNum, route.params?.profile, userInfo, navigation]);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('로그아웃', '로그아웃 되었습니다.', [
        { text: '확인', onPress: () => navigation.replace('Login') }
      ]);
    } catch (error) {
      Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleWithdraw = () => {
    Alert.alert('회원탈퇴', '정말 탈퇴하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          try {
            await withdrawUser(numericUserNum);
            Alert.alert('탈퇴 완료', '회원탈퇴 처리되었습니다.', [
              { text: '확인', onPress: () => navigation.replace('Login') }
            ]);
          } catch(error) {
            Alert.alert('오류', '회원탈퇴 실패');
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>프로필 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>프로필 정보를 불러올 수 없습니다.</Text>
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
        <Text style={styles.value}>{getIncomeLabel(profile.income)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>주소</Text>
        <Text style={styles.value}>{profile.address}</Text>
      </View>

      <View style={styles.divider} />

      {/* 프로필 수정 버튼 */}
      <TouchableOpacity 
        style={styles.editButton} 
        onPress={() => navigation.navigate('EditProfile', { profile, userNum: numericUserNum })}
      >
        <Text style={styles.editButtonText}>프로필 수정</Text>
      </TouchableOpacity>

      <View style={styles.rowDivider} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
        <Text style={styles.withdrawText}>회원탈퇴</Text>
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