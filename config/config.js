// 애플리케이션 환경 설정
const ENVIRONMENTS = {
  dev: {
    // API 연동시 주소 작성
    apiUrl: null,
    timeout: 10000, // API 요청 타임아웃 (ms)
    enableLogging: true,
    useDummyData: true,  // 개발 환경: 더미 데이터 사용
  },
  staging: {
    apiUrl: 'http://staging-api.example.com/api',
    timeout: 10000,
    enableLogging: true,
    useDummyData: false,  // 스테이징 환경: 실제 API 사용
  },
  prod: {
    apiUrl: 'https://api.example.com/api',
    timeout: 15000,
    enableLogging: false,
    useDummyData: false,  // 프로덕션 환경: 실제 API 사용
  }
};

// 현재 환경 설정
const currentEnv = 'dev';

// API 엔드포인트
export const API_ENDPOINTS = { 
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    findId: '/auth/find-id',
    findPassword: '/auth/find-password',
    checkId: '/auth/check-id',
  },
  user: {
    profile: '/users/me',
    update: '/users/update',
  },
  welfare: {
    list: '/welfare/list',
    detail: '/welfare/detail',
    recommend: '/welfare/recommend',
    bookmarks: {
      list: '/shinhan/user/bookmarks',      // 북마크 목록 조회
      add: '/shinhan/user/bookmarks/add',   // 북마크 추가
      remove: '/shinhan/user/bookmarks/remove', // 북마크 삭제
    },
  },
  chat: {
    send: '/chat/send',
    history: '/chat/history',
  }
};

// 로컬 스토리지 키
export const STORAGE_KEYS = { 
  AUTH_TOKEN: 'authToken',
  USER_PROFILE: 'userProfile',
  SETTINGS: 'appSettings',
  BOOKMARKS: 'user_bookmarks',
};

// CONFIG 객체 완성
export const CONFIG = {
  apiUrl: ENVIRONMENTS[currentEnv].apiUrl,
  timeout: ENVIRONMENTS[currentEnv].timeout,
  enableLogging: ENVIRONMENTS[currentEnv].enableLogging,
  useDummyData: ENVIRONMENTS[currentEnv].useDummyData,
  pagination: {
    defaultPageSize: 10,
  },
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

// 앱 버전 정보
export const APP_VERSION = '1.0.0';

export default CONFIG;