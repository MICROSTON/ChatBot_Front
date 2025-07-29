import AsyncStorage from '@react-native-async-storage/async-storage';

// 로컬 스토리지 키
const GUIDE_STORAGE_KEY = 'hasSeenGuide';

/**
 * 사용자가 가이드를 이미 봤는지 확인
 * @returns {Promise<boolean>} 가이드를 이미 봤는지 여부
 */
export const hasSeenGuide = async () => {
  try {
    const value = await AsyncStorage.getItem(GUIDE_STORAGE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('가이드 상태 확인 오류:', error);
    return false;
  }
};

/**
 * 가이드를 본 것으로 표시
 * @returns {Promise<void>}
 */
export const markGuideAsSeen = async () => {
  try {
    await AsyncStorage.setItem(GUIDE_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('가이드 상태 저장 오류:', error);
  }
};

/**
 * 가이드 상태 초기화 (테스트용)
 * @returns {Promise<void>}
 */
export  const resetGuideState = async () => {
  try {
    await AsyncStorage.removeItem(GUIDE_STORAGE_KEY);
  } catch (error) {
    console.error('가이드 상태 초기화 오류:', error);
  }
};