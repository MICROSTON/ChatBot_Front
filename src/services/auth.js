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

// CONFIG가 로드되었는지 확인
if (typeof CONFIG !== 'undefined') {
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

      // 응답 인터셉터 - 토큰 만료 시 자동 갱신
      apiClient.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              // 저장된 refresh token으로 토큰 갱신 시도
              const refreshToken = await AsyncStorage.getItem('refreshToken');
              if (refreshToken) {
                const reissueResponse = await reissueToken(refreshToken);
                if (reissueResponse.success) {
                  // 새로운 토큰으로 원래 요청 재시도
                  const newToken = await getAuthToken();
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  return apiClient(originalRequest);
                }
              }
            } catch (reissueError) {
              console.error('토큰 갱신 실패:', reissueError);
            }
          }
          
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
} else {
  console.log('CONFIG가 아직 로드되지 않았습니다. 더미 데이터 모드로 동작합니다.');
}

// 로그인 함수
export const login = async (id, pw) => {
  console.log('login 호출됨 - 실제 API 모드');

  try {
    // 더미데이터 모드 완전 비활성화
    if (!apiClient) {
      console.log('API 클라이언트가 초기화되지 않았습니다.');
      return {
        success: false,
        message: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    console.log('실제 API로 로그인 시도');
    console.log('요청 데이터:', { id, pw });
    try {
      const response = await apiClient.post('/auth/login', { id, pw });
      console.log('백엔드 로그인 응답:', response.data);
      
      // 백엔드 응답 구조에 맞게 변환
      const transformedResponse = {
        success: true,
        data: {
          token: response.data.tokenDto?.accessToken,
          user: {
            id: id,
            userNum: response.data.userNum, // 백엔드에서 제공하는 userNum
          },
          message: response.data.message
        }
      };
      
      console.log('변환된 응답:', transformedResponse);
      return transformedResponse;
    } catch (apiError) {
      console.error('로그인 API 요청 실패:', apiError.response?.status, apiError.response?.data);
      
      // 백엔드 에러 응답 처리
      if (apiError.response?.status === 400) {
        // 백엔드에서 반환하는 구체적인 오류 메시지 사용
        const errorMessage = apiError.response.data?.message || '로그인 정보가 올바르지 않습니다.';
        return {
          success: false,
          message: errorMessage
        };
      } else if (apiError.response?.status === 401) {
        return {
          success: false,
          message: '아이디 또는 비밀번호가 일치하지 않습니다.'
        };
      } else if (apiError.code === 'ECONNREFUSED' || apiError.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
        };
      } else {
        return {
          success: false,
          message: '로그인 중 오류가 발생했습니다: ' + (apiError.message || '알 수 없는 오류')
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
  console.log('signup 호출됨 - 실제 API 모드');

  try {
    // 더미데이터 모드 완전 비활성화
    if (!apiClient) {
      console.log('API 클라이언트가 초기화되지 않았습니다.');
      return {
        success: false,
        message: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    console.log('실제 API로 회원가입 시도');
    // userData는 반드시 아래 변수명으로 구성되어야 함
    // { id, pw, name, phone, birth, homeMember, income, address }
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('회원가입 오류:', error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
      };
    }
    
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

    if ((CONFIG && CONFIG.useDummyData === true) || !apiClient) {
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
  console.log('findId 호출됨 - 실제 API 모드');

  try {
    // 더미데이터 모드 완전 비활성화
    if (!apiClient) {
      console.log('API 클라이언트가 초기화되지 않았습니다.');
      return {
        success: false,
        message: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    console.log('실제 API로 아이디 찾기 시도');
    console.log('요청 데이터:', { name, phone });
    try {
      const response = await apiClient.post('/auth/find-id', { name, phone });
      console.log('백엔드 응답:', response.data);
      return response.data;
    } catch (apiError) {
      console.error('아이디 찾기 API 요청 실패:', apiError.response?.status, apiError.response?.data);
      
      if (apiError.response?.status === 400) {
        return {
          success: false,
          message: apiError.response.data?.message || '입력하신 정보와 일치하는 사용자가 없습니다.'
        };
      } else if (apiError.code === 'ECONNREFUSED' || apiError.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
        };
      } else {
        throw apiError;
      }
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
  console.log('findPassword 호출됨 - 실제 API 모드');
  console.log('입력된 id:', id);
  console.log('입력된 phone:', phone);

  try {
    // 더미데이터 모드 완전 비활성화
    if (!apiClient) {
      console.log('API 클라이언트가 초기화되지 않았습니다.');
      return {
        success: false,
        message: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    console.log('실제 API로 비밀번호 찾기 시도');
    console.log('요청 데이터:', { id, phone });
    try {
      const response = await apiClient.post('/auth/find-password', { id, phone });
      console.log('백엔드 응답:', response.data);
      return response.data;
    } catch (apiError) {
      console.error('비밀번호 찾기 API 요청 실패:', apiError.response?.status, apiError.response?.data);
      
      if (apiError.response?.status === 400) {
        return {
          success: false,
          message: apiError.response.data?.message || '입력하신 정보와 일치하는 사용자가 없습니다.'
        };
      } else if (apiError.code === 'ECONNREFUSED' || apiError.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
        };
      } else {
        throw apiError;
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

  try {
    // 더미데이터 모드 완전 비활성화
    if (!apiClient) {
      console.log('API 클라이언트가 초기화되지 않았습니다.');
      return {
        success: false,
        message: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    console.log('실제 API로 아이디 중복 확인 시도');
    // 파라미터명 id로 변경
    const response = await apiClient.get('/auth/check-id', { params: { id: trimmedId } });

    return {
      success: true,
      data: {
        available: response.data.available,
        message: response.data.message
      }
    };
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
      };
    }
    
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

// JWT 토큰 갱신
export const reissueToken = async (refreshToken) => {
  try {
    if (!apiClient) {
      console.log('API 클라이언트가 초기화되지 않았습니다.');
      return {
        success: false,
        message: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    console.log('JWT 토큰 갱신 시도');
    const response = await apiClient.post('/auth/reissue', {
      refreshToken: refreshToken
    });

    if (response.data.success) {
      console.log('토큰 갱신 성공');
      return {
        success: true,
        data: response.data.data
      };
    } else {
      console.log('토큰 갱신 실패:', response.data.message);
      return {
        success: false,
        message: response.data.message
      };
    }
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return {
      success: false,
      message: '토큰 갱신 중 오류가 발생했습니다.'
    };
  }
};