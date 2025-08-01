import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard } from 'react-native';
import { colors } from '../../styles/colors';
import useAuth from '../../hooks/useAuth';

const SignupScreen1 = ({ navigation }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const { checkIdDuplicate, isLoading } = useAuth();

  const handleIdChange = (text) => {
    setId(text);
    setIsIdChecked(false);
  };

  const checkIdDuplicateHandler = async () => {
    if (!id.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요.');
      return;
    }
    if (id.length < 6 || id.length > 12) {
      Alert.alert('알림', '아이디는 6~12자리를 입력하세요.');
      return;
    }
    const result = await checkIdDuplicate(id);
    if (result.success) {
      if (result.data && result.data.available) {
        Alert.alert('알림', '사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      } else {
        Alert.alert('알림', '이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      }
    } else {
      Alert.alert('오류', result.message);
    }
  };

  const handleNext = () => {
    if (!id.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요.');
      return;
    }
    if (!isIdChecked) {
      Alert.alert('알림', '아이디 중복 확인을 해주세요.');
      return;
    }
    if (!pw) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return;
    }
    if (pw.length < 6 || pw.length > 15) {
      Alert.alert('알림', '비밀번호는 6~15자리를 입력하세요.');
      return;
    }
    if (pw !== confirmPw) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('알림', '전화번호를 입력해주세요.');
      return;
    }
    navigation.navigate('SignupScreen2', {
      id: id.trim(),
      pw,
      name: name.trim(),
      phone: phone.trim()
    });
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>회원가입</Text>
            <View style={styles.underline} />
          </View>

          {/* 아이디 입력 필드와 중복 확인 버튼 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*아이디</Text>
            <View style={styles.idInputContainer}>
              <TextInput
                style={[styles.idInput, isLoading && styles.disabledInput]}
                placeholder="아이디를 입력하세요."
                value={id}
                onChangeText={handleIdChange} // 수정: 함수 호출로 변경
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={[styles.checkButton, isLoading && styles.disabledButton]} 
                onPress={checkIdDuplicateHandler} 
                disabled={isLoading}
              >
                <Text style={styles.checkButtonText}>
                  {isLoading ? '확인중...' : '중복확인'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputNote}>6~12자리를 입력하세요.</Text>
          </View>

          {/* 비밀번호 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*비밀번호</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="비밀번호를 입력하세요."
              secureTextEntry
              value={pw}
              onChangeText={setPw}
              editable={!isLoading}
            />
            <Text style={styles.inputNote}>6~15자리를 입력하세요.</Text>
          </View>

          {/* 비밀번호 확인 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*비밀번호 확인</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="비밀번호를 입력하세요."
              secureTextEntry
              value={confirmPw}
              onChangeText={setConfirmPw}
              editable={!isLoading}
            />
          </View>

          {/* 이름 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*이름</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="이름을 입력하세요."
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          {/* 전화번호 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*전화번호</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="전화번호를 입력하세요."
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.nextButton, isLoading && styles.disabledButton]} 
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>다음</Text>
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
    padding: 35,
    borderWidth: 3,
    borderColor: '#637D85',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
    marginBottom: 26,
    width: '95%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#637D85',
    backgroundColor: colors.white,
  },
  // 로딩 중 입력 필드 스타일
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  idInputContainer: {
    flexDirection: 'row',
  },
  idInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#637D85',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  checkButton: {
    backgroundColor: '#55B7B5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#637D85',
  },
  checkButtonText: {
    color: colors.black,
    fontWeight: '600',
  },
  // 로딩 중 버튼 스타일
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  inputNote: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: colors.button.primary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#637D85',
  },
  buttonText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
  },
});

export default SignupScreen1;