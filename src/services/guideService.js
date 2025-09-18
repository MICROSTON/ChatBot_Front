import AsyncStorage from '@react-native-async-storage/async-storage';

const GUIDE_STORAGE_KEY = 'guide_shown';

export const checkGuideStatus = async () => {
  try {
    const status = await AsyncStorage.getItem(GUIDE_STORAGE_KEY);
    return status === 'true';
  } catch (error) {
    console.error('가이드 상태 확인 오류:', error);
    return false;
  }
};

export const setGuideShown = async () => {
  try {
    await AsyncStorage.setItem(GUIDE_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('가이드 상태 저장 오류:', error);
  }
};

export const resetGuideStatus = async () => {
  try {
    await AsyncStorage.removeItem(GUIDE_STORAGE_KEY);
  } catch (error) {
    console.error('가이드 상태 초기화 오류:', error);
  }
};

// 테스트용: 모든 가이드 관련 상태 초기화
export const clearAllGuideData = async () => {
  try {
    await AsyncStorage.removeItem(GUIDE_STORAGE_KEY);
    await AsyncStorage.removeItem('hasSeenGuide');
    console.log('모든 가이드 데이터가 초기화되었습니다.');
  } catch (error) {
    console.error('가이드 데이터 초기화 오류:', error);
  }
};

// 강제로 가이드 표시되도록 설정
export const forceShowGuide = async () => {
  try {
    await AsyncStorage.removeItem(GUIDE_STORAGE_KEY);
    await AsyncStorage.removeItem('hasSeenGuide');
    console.log('가이드가 강제로 표시되도록 설정되었습니다.');
  } catch (error) {
    console.error('가이드 강제 표시 설정 오류:', error);
  }
};