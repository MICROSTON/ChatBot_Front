import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { colors } from '../../styles/colors';
import useAuth from '../../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();


  const handleLogin = async () => {
    // 유효성 검사
    if (!id.trim() || !password.trim()) {
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    const result = await login(id.trim(), password.trim());

    
      
    if (result.success) {
      Alert.alert('성공', '로그인되었습니다.');
      // 메인 화면으로 이동
      navigation.navigate('Home');
    } else {
      // 로그인 실패
      Alert.alert('알림', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 로고 이미지 */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* 로그인 폼 */}
        <View style={styles.formContainer}>
          {/* 아이디 입력 필드와 찾기 버튼 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>*아이디</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FindId')}>
                  <View style={styles.findButton}>
                    <Text style={styles.findButtonText}>아이디 찾기</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="아이디를 입력하세요."
              value={id}
              onChangeText={setId}
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          {/* 비밀번호 입력 필드와 찾기 버튼 */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>*비밀번호</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FindPassword')}>
                  <View style={styles.findButton}>
                    <Text style={styles.findButtonText}>비밀번호 찾기</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* 로그인 버튼 - 로딩 상태 반영 */}
          <TouchableOpacity 
            style={[styles.actionButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Text>
          </TouchableOpacity>

          {/* 회원가입 버튼 */}
          <TouchableOpacity 
            style={[styles.actionButton, isLoading && styles.disabledButton]}
            onPress={() => navigation.navigate('SignupScreen1')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
 },
 logoImage: {
    width: 170,
    height: 170,
    marginBottom: 30,
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#EBF6FA',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#447473',
    padding: 35,
  },
  inputGroup: {
    marginBottom: 40,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  findButton: {
    backgroundColor: '#C9EAEC',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  findButtonText: {
    fontSize: 9,
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: '#637D85',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 14,
    backgroundColor: colors.white,
  },
  // 로딩 중 입력 필드 스타일
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  actionButton: {
    backgroundColor: colors.button.primary,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#637D85',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  // 로딩 중 버튼 스타일
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
  },
});

export default LoginScreen;