// 북마크 API 서비스 파일 생성
import axios from 'axios';
import { CONFIG, API_ENDPOINTS } from '../../config/config';
import { getAuthToken } from './auth'; // 인증 토큰 가져오기


// API 인스턴스 생성
const api = axios.create({
  baseURL: CONFIG.apiUrl,
  timeout: CONFIG.timeout,
});

// 요청 인터셉터로 인증 토큰 추가
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 북마크 목록 조회
export const fetchBookmarks = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.welfare.bookmarks.list);
    return response.data;
  } catch (error) {
    console.error('북마크 조회 오류:', error);
    throw error;
  }
};

// 북마크 추가
export const addBookmarkToServer = async (welfareId) => {
  try {
    const response = await api.post(API_ENDPOINTS.welfare.bookmarks.add, { welfareId });
    return response.data;
  } catch (error) {
    console.error('북마크 추가 오류:', error);
    throw error;
  }
};

// 북마크 제거
export const removeBookmarkFromServer = async (welfareId) => {
  try {
    // DELETE 요청 또는 백엔드 명세에 맞게 조정
    const response = await api.delete(
      `${API_ENDPOINTS.welfare.bookmarks.remove}/${welfareId}`
    );
    return response.data;
  } catch (error) {
    console.error('북마크 제거 오류:', error);
    throw error;
  }
};