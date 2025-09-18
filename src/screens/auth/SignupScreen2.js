import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  Keyboard,
  Modal,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import { colors } from '../../styles/colors';
import useAuth from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용을 위해 추가

const SignupScreen2 = ({ navigation, route }) => {
  // 기존 상태 유지
  const { id, pw, name, phone } = route.params;
  
  const [birth, setBirth] = useState('');
  const [homeMember, setHomeMember] = useState('');
  const [income, setIncome] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  
  // 모달 표시 상태 추가
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [provinceModalVisible, setProvinceModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  const { signup, isLoading } = useAuth();

  // 중위소득 옵션 데이터
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

  // 시/도 옵션 데이터
  const provinceOptions = [
    { label: '경기도', value: '경기도' },
  ];

  // 시/군/구 옵션 데이터
  const cityOptions = [
    { label: '의정부시', value: '의정부시' },
  ];

  // 옵션 선택 처리 함수들
  const handleIncomeSelect = (selectedValue) => {
    setIncome(selectedValue);
    setIncomeModalVisible(false);
  };

  const handleProvinceSelect = (selectedValue) => {
    setProvince(selectedValue);
    setProvinceModalVisible(false);
  };

  const handleCitySelect = (selectedValue) => {
    setCity(selectedValue);
    setCityModalVisible(false);
  };

  // 기존 회원가입 처리 함수
  const handleSignup = async () => {
    if (!birth.trim()) {
      Alert.alert('알림', '생년월일을 입력해주세요.');
      return;
    }
    if (!homeMember.trim()) {
      Alert.alert('알림', '가구원 수를 입력해주세요.');
      return;
    }
    if (!income) {
      Alert.alert('알림', '중위소득을 선택해주세요.');
      return;
    }
    if (!province) {
      Alert.alert('알림', '시/도를 선택해주세요.');
      return;
    }
    if (!city) {
      Alert.alert('알림', '시/군/구를 선택해주세요.');
      return;
    }

    // 회원가입 데이터 준비
    const address = `${province} ${city}`;
    const signupData = {
      id,
      pw,
      name,
      phone,
      birth: birth.trim(),
      homeMember: homeMember.trim(),
      income,
      address
    };

    // 회원가입 처리
    const result = await signup(signupData);

    if (result.success) {
      Alert.alert(
        '회원가입 완료',
        result.message || '회원가입이 성공적으로 완료되었습니다.',
        [{ text: '확인', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('오류', result.message || '회원가입 중 문제가 발생했습니다.');
    }
  };

  // 모달 선택기 렌더링 함수
  const renderOptionModal = (visible, options, onSelect, onClose, title) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => onSelect(item.value)}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // 선택기 컴포넌트 렌더링 함수
  const renderSelector = (label, value, placeholder, onPress, disabled) => (
    <TouchableOpacity 
      style={[
        styles.selectorContainer, 
        disabled && styles.disabledInput
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.selectorText,
        !value && styles.placeholderText
      ]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>회원가입</Text>
            <View style={styles.underline} />
          </View>

          {/* 생년월일 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*생년월일</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="생년월일을 입력하세요."
              keyboardType="numeric"
              value={birth}
              onChangeText={setBirth}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              editable={!isLoading}
            />
          </View>

          {/* 가구원 수 입력 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*가구원 수</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="가구원 수를 입력하세요."
              keyboardType="numeric"
              value={homeMember}
              onChangeText={setHomeMember}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              editable={!isLoading}
            />
          </View>

          {/* 중위소득 선택 필드 - 박스 클릭 방식으로 변경 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*중위소득</Text>
            {renderSelector(
              '중위소득', 
              income ? incomeOptions.find(option => option.value === income)?.label || '' : '',
              '중위소득을 선택하세요', 
              () => !isLoading && setIncomeModalVisible(true),
              isLoading
            )}
            <Text style={styles.inputNote}>중위소득 분위를 선택하세요.</Text>
          </View>

          {/* 주소 선택 필드 - 박스 클릭 방식으로 변경 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*주소</Text>
            <View style={styles.addressContainer}>
              {/* 시/도 선택 */}
              <View style={styles.addressField}>
                {renderSelector(
                  '시/도', 
                  province, 
                  '시/도', 
                  () => !isLoading && setProvinceModalVisible(true),
                  isLoading
                )}
              </View>
              
              {/* 시/군/구 선택 */}
              <View style={styles.addressField}>
                {renderSelector(
                  '시/군/구', 
                  city, 
                  '시/군/구', 
                  () => !isLoading && setCityModalVisible(true),
                  isLoading
                )}
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.disabledButton]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? '가입 중...' : '회원가입 완료'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 선택용 모달들 */}
      {renderOptionModal(
        incomeModalVisible, 
        incomeOptions, 
        handleIncomeSelect, 
        () => setIncomeModalVisible(false),
        "중위소득 선택"
      )}
      
      {renderOptionModal(
        provinceModalVisible, 
        provinceOptions, 
        handleProvinceSelect, 
        () => setProvinceModalVisible(false),
        "시/도 선택"
      )}
      
      {renderOptionModal(
        cityModalVisible, 
        cityOptions, 
        handleCitySelect, 
        () => setCityModalVisible(false),
        "시/군/구 선택"
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 기존 스타일 유지
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
  inputNote: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressField: {
    width: '48%',
  },
  signupButton: {
    backgroundColor: colors.button.primary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#637D85',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
  },

  // 새로운 선택기 스타일
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#637D85',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: colors.white,
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#447473',
  },
  closeButton: {
    padding: 5,
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SignupScreen2;