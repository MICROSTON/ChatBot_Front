import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { updateProfile } from '../../services/UserService';

export default function EditProfileScreen({ navigation, route }) {
  const { profile, userNum } = route.params;

  // 변수명 백엔드와 맞춤
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [birth, setBirth] = useState(profile.birth || '');
  const [homeMember, setHomeMember] = useState(profile.homeMember || '');
  const [income, setIncome] = useState(profile.income || '');
  const [address, setAddress] = useState(profile.address || '');

  // 주소 분리
  const [province, setProvince] = useState(address.split(' ')[0] || '');
  const [city, setCity] = useState(address.split(' ')[1] || '');

  // 모달 상태
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [provinceModalVisible, setProvinceModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  // 중위소득 옵션
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

  // 시/도 옵션
  const provinceOptions = [
    { label: '경기도', value: '경기도' },
  ];

  // 시/군/구 옵션
  const cityOptions = [
    { label: '의정부시', value: '의정부시' },
  ];

  // 모달 선택 함수
  const handleIncomeSelect = (selectedLabel) => {
    setIncome(selectedLabel);
    setIncomeModalVisible(false);
  };
  const handleProvinceSelect = (selectedLabel) => {
    setProvince(selectedLabel);
    setProvinceModalVisible(false);
  };
  const handleCitySelect = (selectedLabel) => {
    setCity(selectedLabel);
    setCityModalVisible(false);
  };

  // 선택기 렌더 함수
  const renderSelector = (label, value, placeholder, onPress, disabled) => (
    <TouchableOpacity
      style={[styles.selectorContainer, disabled && styles.disabledInput]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.selectorText,
        !value && styles.placeholderText
      ]}>
        {value || placeholder}
      </Text>
    </TouchableOpacity>
  );

  // 모달 렌더 함수
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
                  <Text style={{ fontSize: 20 }}>×</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => onSelect(item.label)}
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

  const handleSave = async () => {
    const updated = {
      name,
      phone,
      birth,
      homeMember,
      income,
      address: `${province} ${city}`,
    };
    try {
      await updateProfile(userNum, updated);
      Alert.alert('수정 완료', '프로필이 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('Profile', { profile: updated, userNum }) }
      ]);
    } catch {
      Alert.alert('오류', '프로필 수정 실패');
    }
  };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.inputLabel}>*이름</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름" />

      <Text style={styles.inputLabel}>*전화번호</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="전화번호" keyboardType="phone-pad" />

      <Text style={styles.inputLabel}>*생년월일</Text>
      <TextInput style={styles.input} value={birth} onChangeText={setBirth} placeholder="생년월일" />

      {/* 가구원수 입력 */}
      <Text style={styles.label}>*가구원 수</Text>
      <TextInput
        style={styles.input}
        value={homeMember}
        onChangeText={setHomeMember}
        placeholder="가구원 수를 입력하세요."
        keyboardType="numeric"
      />

      {/* 중위소득 선택 */}
      <Text style={styles.label}>*중위소득</Text>
      {renderSelector(
        '중위소득',
        income,
        '중위소득을 선택하세요',
        () => setIncomeModalVisible(true),
        false
      )}

      {/* 주소 선택 */}
      <Text style={styles.label}>*주소</Text>
      <View style={styles.addressContainer}>
        <View style={styles.addressField}>
          {renderSelector(
            '시/도',
            province,
            '시/도',
            () => setProvinceModalVisible(true),
            false
          )}
        </View>
        <View style={styles.addressField}>
          {renderSelector(
            '시/군/구',
            city,
            '시/군/구',
            () => setCityModalVisible(true),
            false
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>수정완료</Text>
      </TouchableOpacity>

      {/* 모달들 */}
      {renderOptionModal(
        incomeModalVisible,
        incomeOptions,
        handleIncomeSelect,
        () => setIncomeModalVisible(false),
        "중위소득 선택"
        )}

        {/* 시/도 모달 */}
        {renderOptionModal(
        provinceModalVisible,
        provinceOptions,
        handleProvinceSelect,
        () => setProvinceModalVisible(false),
        "시/도 선택"
        )}

        {/* 시/군/구 모달 */}
        {renderOptionModal(
        cityModalVisible,
        cityOptions,
        handleCitySelect,
        () => setCityModalVisible(false),
        "시/군/구 선택"
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16,
},
header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'space-between',
},
inputLabel: { // 입력 박스 위 라벨
    fontSize: 15,
    color: '#333',
    marginLeft: 3,
    marginBottom: 4,
    marginTop: 10,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#637D85', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12, 
    fontSize: 16 
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
  label: { 
    fontSize: 15, 
    color: '#333', 
    marginBottom: 5 
},
  saveButton: { 
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
  saveButtonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: 'bold' 
},
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#637D85',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addressField: {
    width: '48%',
  },
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