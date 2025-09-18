import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../../styles/colors';
import useAuth from '../../hooks/useAuth';

const FindPasswordScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const { findPassword, isLoading } = useAuth();

  const handleFindPassword = async () => {
    if (!id.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('알림', '전화번호를 입력해주세요.');
      return;
    }
    const result = await findPassword(id.trim(), phone.trim());
    if (result.success && (result.data?.password || result.data?.pw)) {
      navigation.navigate('FindResult', {
        type: 'password',
        result: result.data?.password || result.data?.pw, // password 또는 pw 둘 다 지원
        message: result.data?.message || '비밀번호를 찾았습니다.'
      });
    } else {
      Alert.alert('알림', result.message || '입력하신 정보와 일치하는 사용자가 없습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>비밀번호 찾기</Text>
            <View style={styles.underline} />
          </View>

          {/* 아이디 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*아이디</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="아이디를 입력하세요."
              value={id}
              onChangeText={setId}
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          {/* 전화번호 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*전화번호</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="전화번호를 입력하세요. (- 제외)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!isLoading}
            />
          </View>

          {/* 비밀번호 찾기 버튼 */}
          <TouchableOpacity 
            style={[styles.findButton, isLoading && styles.disabledButton]} 
            onPress={handleFindPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>비밀번호 찾기</Text>
            )}
          </TouchableOpacity>

          {/* 로그인 화면으로 돌아가기 버튼 */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>로그인 화면으로 돌아가기</Text>
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
  formContainer: {
    width: '90%',
    backgroundColor: '#EBF6FA',
    borderRadius: 20,
    padding: 30,
    borderWidth: 3,
    borderColor: '#637D85',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#447473',
  },
  underline: {
    width: '100%',
    height: 3,
    backgroundColor: '#447473',
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#637D85',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  findButton: {
    backgroundColor: '#55B7B5',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#637D85',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});

export default FindPasswordScreen;