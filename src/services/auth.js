import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../../config/config';
import { DUMMY_USERS } from '../../config/dummyData';

// 스토리지 키 상수
const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_INFO: 'userInfo',
  SETTINGS: 'userSettings',
};

// Axios 인스턴스 생성 (실제 API 연동 시 사용)
let apiClient = null;
console.log('CONFIG 확인:', CONFIG);
console.log('useDummyData 확인:', CONFIG ? CONFIG.useDummyData : 'CONFIG가 없음');

try {
  if (CONFIG && CONFIG.apiUrl) {
    apiClient = axios.create({
      baseURL: CONFIG.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: CONFIG.timeout || 10000,
    });
    console.log('API 클라이언트 초기화 성공:', CONFIG.apiUrl);
  } else {
    console.log('API URL이 설정되지 않아 더미 데이터 모드로 동작합니다');
  }
} catch (error) {
  console.error('API 클라이언트 초기화 오류:', error);
}

// 로그인 함수
export const login = async (userId, password) => {
  console.log('login 호출됨 - 더미데이터 모드:', CONFIG?.useDummyData);
  
  try {
    // 더미 데이터 모드 또는 API 클라이언트가 없는 경우
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 로그인 시도...');
      
      // 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 더미 데이터에서 사용자 찾기
      const user = DUMMY_USERS.find(
        u => u.id === userId && u.password === password
      );
      
      if (user) {
        // 더미 토큰 생성
        const token = 'dummy_token_' + Math.random().toString(36).substring(2, 15);
        
        // 비밀번호 제외한 사용자 정보
        const { password, ...userInfo } = user;
        
        return {
          success: true,
          data: {
            token,
            user: userInfo,
            message: '로그인 성공'
          }
        };
      } else {
        return {
          success: false,
          message: '아이디 또는 비밀번호가 일치하지 않습니다.'
        };
      }
    } else {
      // 실제 API 호출
      console.log('실제 API로 로그인 시도');
      const response = await apiClient.post('/auth/login', { userId, password });
      return response.data;
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류')
    };
  }
};

// 회원가입 함수
export const signup = async (userData) => {
  console.log('signup 호출됨 - 더미데이터 모드:', CONFIG?.useDummyData);
  
  try {
    // 더미 데이터 모드 또는 API 클라이언트가 없는 경우
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 회원가입 처리...');
      
      // 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 아이디 중복 확인
      const isDuplicate = DUMMY_USERS.some(user => user.id === userData.userId);
      
      if (isDuplicate) {
        return {
          success: false,
          message: '이미 사용 중인 아이디입니다.'
        };
      }
      
      // 성공 응답 반환
      return {
        success: true,
        data: {
          message: '회원가입이 완료되었습니다.'
        }
      };
    } else {
      // 실제 API 호출
      console.log('실제 API로 회원가입 시도');
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류')
    };
  }
};

// 로그아웃 함수
export const logout = async () => {
  try {
    // 로컬 스토리지에서 인증 정보 삭제
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
    
    // 더미 데이터 모드 또는 API 클라이언트가 없는 경우
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터 모드로 로그아웃 처리');
      return { success: true };
    } else {
      // 실제 API 호출 (필요한 경우)
      // const response = await apiClient.post('/auth/logout');
      return { success: true };
    }
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return {
      success: false,
      message: '로그아웃 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류')
    };
  }
};

// 아이디 찾기
export const findId = async (name, phone) => {
  console.log('findId 호출됨 - 더미데이터 모드:', CONFIG?.useDummyData);
  
  try {
    // 더미 데이터 모드 또는 API 클라이언트가 없는 경우
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 아이디 찾기...');
      
      // 더미 데이터에서 사용자 찾기
      const user = DUMMY_USERS.find(
        u => u.name === name && u.phone === phone
      );
      
      // 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        return {
          success: true,
          data: {
            userId: user.id,
            message: '아이디를 찾았습니다.'
          }
        };
      } else {
        return {
          success: false,
          message: '입력하신 정보와 일치하는 사용자가 없습니다.'
        };
      }
    } else {
      console.log('실제 API로 아이디 찾기 시도');
      const response = await apiClient.post('/auth/find-id', { name, phone });
      return response.data;
    }
  } catch (error) {
    console.error('아이디 찾기 오류:', error);
    return {
      success: false,
      message: '요청 처리 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류')
    };
  }
};

// 비밀번호 찾기
export const findPassword = async (userId, phone) => {
  console.log('findPassword 호출됨 - 더미데이터 모드:', CONFIG?.useDummyData);
  
  try {
    // 더미 데이터 모드 또는 API 클라이언트가 없는 경우
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 비밀번호 찾기...');
      
      // 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 더미 데이터에서 사용자 찾기
      const user = DUMMY_USERS.find(
        u => u.id === userId && u.phone === phone
      );
      
      if (user) {
        // 임시 비밀번호 생성
        const tempPassword = Math.random().toString(36).slice(-8);
        
        return {
          success: true,
          data: {
            tempPassword,
            message: '임시 비밀번호가 발급되었습니다.'
          }
        };
      } else {
        return {
          success: false,
          message: '입력하신 정보와 일치하는 사용자가 없습니다.'
        };
      }
    } else {
      console.log('실제 API로 비밀번호 찾기 시도');
      const response = await apiClient.post('/auth/find-password', { userId, phone });
      return response.data;
    }
  } catch (error) {
    console.error('비밀번호 찾기 오류:', error);
    return {
      success: false,
      message: '요청 처리 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류')
    };
  }
};

// 아이디 중복 확인
export const checkIdDuplicate = async (userId) => {
  // 입력값 검증 및 전처리
  if (!userId || userId.trim() === '') {
    return {
      success: false,
      message: '아이디를 입력해주세요.'
    };
  }
  
  const trimmedId = userId.trim();
  console.log('중복 확인 요청 아이디:', trimmedId);
  console.log('DUMMY_USERS 목록:', DUMMY_USERS.map(u => u.id));
  
  try {
    // 더미 데이터 모드 또는 API 클라이언트가 없는 경우
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 아이디 중복 확인 중...');
      
      // 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 대소문자 구분 없이 비교
      const isDuplicate = DUMMY_USERS.some(
        user => user.id.toLowerCase() === trimmedId.toLowerCase()
      );
      
      console.log('중복 여부 결과:', isDuplicate);
      
      return {
        success: true,
        data: {
          available: !isDuplicate,
          message: isDuplicate ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
        }
      };
    } else {
      console.log('실제 API로 아이디 중복 확인 시도');
      const response = await apiClient.post('/auth/check-id', { userId: trimmedId });
      return response.data;
    }
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    return {
      success: false,
      message: '요청 처리 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류')
    };
  }
};

// 인증 토큰 저장
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('토큰 저장 오류:', error);
    return false;
  }
};

// 인증 토큰 가져오기
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('토큰 불러오기 오류:', error);
    return null;
  }
};

// 사용자 정보 저장
export const saveUserInfo = async (userInfo) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('사용자 정보 저장 오류:', error);
    return false;
  }
};

// 사용자 정보 가져오기
export const getUserInfo = async () => {
  try {
    const userInfoString = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfoString ? JSON.parse(userInfoString) : null;
  } catch (error) {
    console.error('사용자 정보 불러오기 오류:', error);
    return null;
  }
};

// 사용자 설정 저장
export const saveUserSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('설정 저장 오류:', error);
    return false;
  }
};

// 사용자 설정 가져오기
export const getUserSettings = async () => {
  try {
    const settingsString = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsString ? JSON.parse(settingsString) : null;
  } catch (error) {
    console.error('설정 불러오기 오류:', error);
    return null;
  }
};