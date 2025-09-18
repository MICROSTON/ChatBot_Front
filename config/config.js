// 애플리케이션 환경 설정
const ENVIRONMENTS = {
  dev: {
    // React Native 앱에서 접근 가능한 IP 주소
    // 실제 기기에서 컴퓨터의 IP 주소 사용
    apiUrl: 'http://13.239.18.67:8080',  
    // apiUrl: 'http://10.0.2.2:8080',  // Android 에뮬레이터용
    // apiUrl: 'http://localhost:8080',  // iOS 시뮬레이터용
    timeout: 10000, // API 요청 타임아웃 (ms)
    enableLogging: true,
    useDummyData: false,  // 개발 환경: 실제 API 사용 (백엔드 연동) - 더미 데이터 완전 비활성화
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

// API 엔드포인트 - 백엔드 실제 구조에 맞게 수정
export const API_ENDPOINTS = { 
  auth: {
    login: '/auth/login',                // 로그인
    signup: '/auth/signup',              // 회원가입
    findId: '/auth/find-id',             // 아이디 찾기
    findPassword: '/auth/find-password', // 비밀번호 찾기
    checkId: '/auth/check-id',           // 아이디 중복 확인
    reissue: '/auth/reissue',            // 토큰 갱신
  },
  user: {
    profile: "/user/me/{userNum}",
    update: "/user/update/{userNum}",
    withdraw: "/user/delete/{userNum}",
  },
  welfare: {
    likes: {
      getUserLikes: '/likes/{userId}',        // GET /likes/{userId}
      addLike: '/likes/add',                  // POST /likes/add
      removeLike: '/likes/remove',            // DELETE /likes/remove
    },
    bookmarks: {
      list: '/welfare/bookmarks/{id}',        // 북마크 목록 조회
      add: '/welfare/bookmarks/add',          // 북마크 추가
      remove: '/welfare/bookmarks/remove',    // 북마크 삭제
    },
  },
  chat: {
    listSearch: '/shinhan/bokji/list-search',     // 카테고리 목록
    ageSearch: '/shinhan/bokji/age-search',       // 연령대별 검색
    search: '/shinhan/bokji/search',              // 복지 검색
    detail: '/shinhan/bokji/detail/{benefitCode}', // 복지 상세
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
  // API 설정
  apiUrl: 'http://13.239.18.67:8080', 
  timeout: 30000, // 30초로 증가 (프로필 조회 등 느린 요청을 위해)
  
  // 더미데이터 사용 여부 (실제 API 사용)
  useDummyData: false, // 실제 API 사용 - 더미 데이터 완전 비활성화
  pagination: {
    defaultPageSize: 10,
  },
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

// 앱 버전 정보
export const APP_VERSION = '1.0.0';

export default CONFIG;