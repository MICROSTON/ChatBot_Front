import axios from 'axios';
import { CONFIG, API_ENDPOINTS } from '../../config/config';
import { getAuthToken } from './auth';

const api = axios.create({
  baseURL: CONFIG.apiUrl,
  timeout: CONFIG.timeout,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 북마크 목록 조회
export const fetchBookmarks = async (userId) => {
  try {
    const url = API_ENDPOINTS.welfare.bookmarks.list.replace('{id}', userId);
    console.log('북마크 조회 요청 URL:', `${CONFIG.apiUrl}${url}`);
    console.log('북마크 조회 요청 메서드: GET');
    console.log('사용자 ID:', userId);
    
    const response = await api.get(url);
    console.log('북마크 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('북마크 조회 오류:', error);
    console.error('요청 URL:', `${CONFIG.apiUrl}${API_ENDPOINTS.welfare.bookmarks.list.replace('{id}', userId)}`);
    console.error('응답 상태:', error.response?.status);
    console.error('응답 데이터:', error.response?.data);
    throw error;
  }
};

// 북마크 추가
export const addBookmarkToServer = async ({ userNum, ageGroupNum }) => {
  try {
    console.log('북마크 추가 요청 데이터:', { id: userNum, ageGroupNum });
    const response = await api.post(API_ENDPOINTS.welfare.bookmarks.add, { 
      id: userNum,  // 백엔드에서 기대하는 필드명
      ageGroupNum 
    });
    console.log('북마크 추가 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('북마크 추가 오류:', error);
    console.error('요청 데이터:', { id: userNum, ageGroupNum });
    console.error('응답 상태:', error.response?.status);
    console.error('응답 데이터:', error.response?.data);
    throw error;
  }
};

// 북마크 제거
export const removeBookmarkFromServer = async ({ userNum, ageGroupNum }) => {
  try {
    console.log('북마크 제거 요청 데이터:', { id: userNum, ageGroupNum });
    const response = await api.delete(API_ENDPOINTS.welfare.bookmarks.remove, {
      data: { 
        id: userNum,  // 백엔드에서 기대하는 필드명
        ageGroupNum 
      }
    });
    console.log('북마크 제거 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('북마크 제거 오류:', error);
    console.error('요청 데이터:', { id: userNum, ageGroupNum });
    console.error('응답 상태:', error.response?.status);
    console.error('응답 데이터:', error.response?.data);
    throw error;
  }
};