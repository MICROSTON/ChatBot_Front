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

// 더미 북마크 데이터
const dummyBookmarks = [
  { ageGroupNum: 1, ageGroupName: '영유아', benefits: [] },
  { ageGroupNum: 2, ageGroupName: '청소년', benefits: [] },
  { ageGroupNum: 3, ageGroupName: '청년', benefits: [] },
  { ageGroupNum: 4, ageGroupName: '중년', benefits: [] },
  { ageGroupNum: 5, ageGroupName: '노년', benefits: [] },
];

// 북마크 목록 조회
export const fetchBookmarks = async (userId) => {
  if (!CONFIG?.apiUrl) {
    console.log('API URL이 설정되지 않았습니다.');
    return {
      success: false,
      data: [],
      error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
    };
  }

  try {
    const url = API_ENDPOINTS.welfare.bookmarks.list.replace('{id}', userId);
    console.log('북마크 조회 요청 URL:', `${CONFIG?.apiUrl}${url}`);
    console.log('북마크 조회 요청 메서드: GET');
    console.log('사용자 ID:', userId);
    const response = await axios.get(`${CONFIG?.apiUrl}${url}`);
    console.log('북마크 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('북마크 조회 오류:', error);
    console.error('요청 URL:', `${CONFIG?.apiUrl}${API_ENDPOINTS.welfare.bookmarks.list.replace('{id}', userId)}`);
    console.error('응답 상태:', error.response?.status);
    console.error('응답 데이터:', error.response?.data);
    // API 오류 시 빈 배열 반환
    return {
      success: false,
      data: [],
      error: '북마크 조회 중 오류가 발생했습니다.'
    };
  }
};

// 북마크 추가
export const addBookmarkToServer = async ({ userNum, ageGroupNum }) => {
  if (!CONFIG?.apiUrl) {
    console.log('API URL이 설정되지 않았습니다.');
    return {
      success: false,
      error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
    };
  }

  try {
    console.log('북마크 추가 요청 데이터:', { id: userNum, ageGroupNum });
    const response = await axios.post(`${CONFIG?.apiUrl}${API_ENDPOINTS.welfare.bookmarks.add}`, {
      id: userNum,
      ageGroupNum
    });
    console.log('북마크 추가 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('북마크 추가 오류:', error);
    console.error('요청 데이터:', { id: userNum, ageGroupNum });
    console.error('응답 상태:', error.response?.status);
    console.error('응답 데이터:', error.response?.data);
    return {
      success: false,
      error: '북마크 추가 중 오류가 발생했습니다.'
    };
  }
};

// 북마크 제거
export const removeBookmarkFromServer = async ({ userNum, ageGroupNum }) => {
  if (!CONFIG?.apiUrl) {
    console.log('API URL이 설정되지 않았습니다.');
    return {
      success: false,
      error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
    };
  }

  try {
    console.log('북마크 제거 요청 데이터:', { id: userNum, ageGroupNum });
    const response = await axios.delete(`${CONFIG?.apiUrl}${API_ENDPOINTS.welfare.bookmarks.remove}`, {
      data: { id: userNum, ageGroupNum }
    });
    console.log('북마크 제거 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('북마크 제거 오류:', error);
    console.error('요청 데이터:', { id: userNum, ageGroupNum });
    console.error('응답 상태:', error.response?.status);
    console.error('응답 데이터:', error.response?.data);
    return {
      success: false,
      error: '북마크 제거 중 오류가 발생했습니다.'
    };
  }
};