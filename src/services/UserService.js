import axios from 'axios';
import { CONFIG, API_ENDPOINTS } from '../../config/config';
import { getAuthToken } from './auth';

// 일관된 axios 인스턴스 생성
const api = axios.create({
  baseURL: CONFIG.apiUrl,
  timeout: CONFIG.timeout,
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API 요청:', config.method?.toUpperCase(), config.url);
    return config;
  } catch (error) {
    console.error('요청 인터셉터 오류:', error);
    return config;
  }
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// 사용자 프로필 조회
export const getProfile = async (userNum) => {
  try {
    if (!CONFIG?.apiUrl) {
      console.log('API URL이 설정되지 않았습니다.');
      return {
        success: false,
        data: null,
        error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    if (!userNum) {
      console.log('userNum이 없습니다.');
      return {
        success: false,
        data: null,
        error: '사용자 번호가 필요합니다.'
      };
    }

    const url = API_ENDPOINTS.user.profile.replace('{userNum}', userNum);
    console.log('프로필 조회 요청 URL:', `${CONFIG.apiUrl}${url}`);
    
    const response = await api.get(url);
    console.log('프로필 조회 성공:', response.data);
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
      success: true,
      data: response.data,
      ...response.data
    };
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        data: null,
        error: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        data: null,
        error: '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.'
      };
    }
    
    if (error.response?.status === 404) {
      return {
        success: false,
        data: null,
        error: '사용자를 찾을 수 없습니다.'
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        data: null,
        error: '인증이 필요합니다. 다시 로그인해주세요.'
      };
    }
    
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || '프로필 조회 중 오류가 발생했습니다.'
    };
  }
};

// 사용자 정보 수정
export const updateProfile = async (userNum, updateData) => {
  try {
    if (!CONFIG?.apiUrl) {
      console.log('API URL이 설정되지 않았습니다.');
      return {
        success: false,
        data: null,
        error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    if (!userNum) {
      console.log('userNum이 없습니다.');
      return {
        success: false,
        data: null,
        error: '사용자 번호가 필요합니다.'
      };
    }

    const url = API_ENDPOINTS.user.update.replace('{userNum}', userNum);
    console.log('프로필 수정 요청 URL:', `${CONFIG.apiUrl}${url}`);
    console.log('수정 데이터:', updateData);
    
    const response = await api.put(url, updateData);
    console.log('프로필 수정 성공:', response.data);
    
    return {
      success: true,
      data: response.data,
      ...response.data
    };
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        data: null,
        error: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        data: null,
        error: '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.'
      };
    }
    
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || '프로필 수정 중 오류가 발생했습니다.'
    };
  }
};

// 회원 탈퇴
export const withdrawUser = async (userNum) => {
  try {
    if (!CONFIG?.apiUrl) {
      console.log('API URL이 설정되지 않았습니다.');
      return {
        success: false,
        data: null,
        error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
      };
    }

    if (!userNum) {
      console.log('userNum이 없습니다.');
      return {
        success: false,
        data: null,
        error: '사용자 번호가 필요합니다.'
      };
    }

    const url = API_ENDPOINTS.user.withdraw.replace('{userNum}', userNum);
    console.log('회원 탈퇴 요청 URL:', `${CONFIG.apiUrl}${url}`);
    
    const response = await api.delete(url);
    console.log('회원 탈퇴 성공:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: '회원 탈퇴가 완료되었습니다.'
    };
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        data: null,
        error: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        data: null,
        error: '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.'
      };
    }
    
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || '회원 탈퇴 중 오류가 발생했습니다.'
    };
  }
};