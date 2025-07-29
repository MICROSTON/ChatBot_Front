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
    login: '/auth/login',                // 로그인
    signup: '/auth/signup',              // 회원가입
    findId: '/auth/find-id',             // 아이디 찾기
    findPassword: '/auth/find-password', // 비밀번호 찾기
    checkId: '/auth/check-id',           // 아이디 중복 확인
  },
  user: {
    profile: '/users/me',                // 내 프로필 정보 조회
    update: '/users/update',             // 내 프로필 정보 수정
  },
  welfare: {
    like: '/welfare/likelist',               // 좋아요 복지 목록 조회(다시 지정 필요)
    bookmarks: {
      list: '/welfare/bookmarks',        // 북마크 목록 조회
      add: '/welfare/bookmarks/add',     // 북마크 추가
      remove: '/welfare/bookmarks/remove', // 북마크 삭제
    },
  },
  //chat 기능 엔드포인트 다시 지정 필요
  chat: {
    send: '/chat/send',                  // 챗봇 메시지 전송
    history: '/chat/history',            // 챗봇 대화 내역 조회
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