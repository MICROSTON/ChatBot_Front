import AsyncStorage from '@react-native-async-storage/async-storage';

// 모든 AsyncStorage 데이터 확인
export const checkAllStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = {};
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      data[key] = value;
    }
    
    console.log('=== AsyncStorage 전체 데이터 ===');
    console.log(data);
    return data;
  } catch (error) {
    console.error('스토리지 데이터 확인 오류:', error);
    return null;
  }
};

// 인증 관련 데이터만 확인
export const checkAuthData = async () => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    const guideShown = await AsyncStorage.getItem('guide_shown');
    
    console.log('=== 인증 관련 데이터 ===');
    console.log('authToken:', authToken);
    console.log('userInfo:', userInfo);
    console.log('guide_shown:', guideShown);
    
    return { authToken, userInfo, guideShown };
  } catch (error) {
    console.error('인증 데이터 확인 오류:', error);
    return null;
  }
};

// 모든 데이터 초기화 (테스트용)
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('모든 AsyncStorage 데이터가 초기화되었습니다.');
  } catch (error) {
    console.error('데이터 초기화 오류:', error);
  }
};

// 특정 키만 삭제
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`${key} 키가 삭제되었습니다.`);
  } catch (error) {
    console.error(`${key} 삭제 오류:`, error);
  }
};
