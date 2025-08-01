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
export const addBookmarkToServer = async ({ userNum, ageGroupNum }) => {
  try {
    const response = await api.post(API_ENDPOINTS.welfare.bookmarks.add, { userNum, ageGroupNum });
    return response.data;
  } catch (error) {
    console.error('북마크 추가 오류:', error);
    throw error;
  }
};

// 북마크 제거
export const removeBookmarkFromServer = async ({ userNum, ageGroupNum }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.welfare.bookmarks.remove}/${userNum}/${ageGroupNum}`
    );
    return response.data;
  } catch (error) {
    console.error('북마크 제거 오류:', error);
    throw error;
  }
};