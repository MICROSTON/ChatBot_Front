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

// JWT 형식의 더미 토큰 생성 함수
const generateDummyJWT = (id) => {
  const header = btoa(JSON.stringify({ "alg": "HS256", "typ": "JWT" }));
  const payload = btoa(JSON.stringify({ 
    "sub": id, 
    "iat": Math.floor(Date.now() / 1000),
    "exp": Math.floor(Date.now() / 1000) + 3600
  }));
  const signature = btoa("dummy_signature_" + Math.random().toString(36).substring(2, 15));
  return `${header}.${payload}.${signature}`;
};

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

    apiClient.interceptors.request.use(
      async (config) => {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    console.log('API 클라이언트 초기화 성공:', CONFIG.apiUrl);
  } else {
    console.log('API URL이 설정되지 않아 더미 데이터 모드로 동작합니다');
  }
} catch (error) {
  console.error('API 클라이언트 초기화 오류:', error);
}

// 로그인 함수
export const login = async (id, pw) => {
  console.log('login 호출됨 - 더미데이터 모드:', CONFIG?.useDummyData);

  try {
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 로그인 시도...');
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = DUMMY_USERS.find(
        u => u.id === id && u.pw === pw
      );
      if (user) {
        const token = generateDummyJWT(id);
        const { pw, ...userInfo } = user;
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
      console.log('실제 API로 로그인 시도');
      const response = await apiClient.post('/auth/login', { id, pw });
      if (response.data && response.data.token && response.data.user) {
        return {
          success: true,
          data: {
            token: response.data.token,
            user: response.data.user,
            message: response.data.message || '로그인 성공'
          }
        };
      }
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
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 회원가입 처리...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isDuplicate = DUMMY_USERS.some(user => user.id === userData.id);
      if (isDuplicate) {
        return {
          success: false,
          message: '이미 사용 중인 아이디입니다.'
        };
      }
      return {
        success: true,
        data: {
          message: '회원가입이 완료되었습니다.'
        }
      };
    } else {
      console.log('실제 API로 회원가입 시도');
      // userData는 반드시 아래 변수명으로 구성되어야 함
      // { id, pw, name, phone, birth, homeMember, income, address }
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
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);

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
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 아이디 찾기...');
      const user = DUMMY_USERS.find(
        u => u.name === name && u.phone === phone
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      if (user) {
        return {
          success: true,
          data: {
            id: user.id,
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
export const findPassword = async (id, phone) => {
  console.log('findPassword 호출됨 - 더미데이터 모드:', CONFIG?.useDummyData);

  try {
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 비밀번호 찾기...');
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = DUMMY_USERS.find(
        u => u.id === id && u.phone === phone
      );
      if (user) {
        return {
          success: true,
          data: {
            pw: user.pw,
            message: '비밀번호를 찾았습니다.'
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
      const response = await apiClient.post('/auth/find-password', { id, phone });
      // 응답 구조를 더미와 동일하게 가공
      if (response.data && response.data.pw) {
        return {
          success: true,
          data: {
            pw: response.data.pw,
            message: response.data.message || '비밀번호를 찾았습니다.'
          }
        };
      } else {
        return {
          success: false,
          message: response.data?.message || '입력하신 정보와 일치하는 사용자가 없습니다.'
        };
      }
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
export const checkIdDuplicate = async (id) => {
  if (!id || id.trim() === '') {
    return {
      success: false,
      message: '아이디를 입력해주세요.'
    };
  }

  const trimmedId = id.trim();
  console.log('중복 확인 요청 아이디:', trimmedId);
  console.log('DUMMY_USERS 목록:', DUMMY_USERS.map(u => u.id));

  try {
    if (CONFIG?.useDummyData === true || !apiClient) {
      console.log('더미 데이터로 아이디 중복 확인 중...');
      await new Promise(resolve => setTimeout(resolve, 500));
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
      // 파라미터명 id로 변경
      const response = await apiClient.get('/auth/check-id', {params:{ id: trimmedId }});
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