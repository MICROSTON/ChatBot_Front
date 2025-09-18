const axios = require('axios');

const BASE_URL = 'http://13.239.18.67:8080';

// API 테스트 함수들
async function testAuthAPI() {
  console.log('=== 인증 API 테스트 ===');
  
  try {
    // 1. 회원가입 테스트
    console.log('1. 회원가입 테스트...');
    const signupData = {
      id: 'testuser1234',
      pw: 'testpass123',
      name: '테스트유저',
      phone: '01012345678',
      birth: '19900101',
      homeMember: '3',
      income: '4',
      address: '서울시 강남구'
    };
    
    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, signupData);
    console.log('회원가입 성공:', signupResponse.data);
    
    // 2. 정상 로그인 테스트
    console.log('2. 정상 로그인 테스트...');
    const loginData = {
      id: 'testuser1234',
      pw: 'testpass123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('로그인 성공:', loginResponse.data);
    
    // 3. 잘못된 아이디로 로그인 테스트
    console.log('3. 잘못된 아이디로 로그인 테스트...');
    try {
      const wrongIdData = {
        id: 'wronguser',
        pw: 'testpass123'
      };
      
      const wrongIdResponse = await axios.post(`${BASE_URL}/auth/login`, wrongIdData);
      console.log('잘못된 아이디 로그인 결과:', wrongIdResponse.data);
    } catch (error) {
      console.log('잘못된 아이디 오류:', error.response?.data);
    }
    
    // 4. 잘못된 비밀번호로 로그인 테스트
    console.log('4. 잘못된 비밀번호로 로그인 테스트...');
    try {
      const wrongPwData = {
        id: 'testuser1234',
        pw: 'wrongpassword'
      };
      
      const wrongPwResponse = await axios.post(`${BASE_URL}/auth/login`, wrongPwData);
      console.log('잘못된 비밀번호 로그인 결과:', wrongPwResponse.data);
    } catch (error) {
      console.log('잘못된 비밀번호 오류:', error.response?.data);
    }
    
    return loginResponse.data;
    
  } catch (error) {
    console.error('인증 API 테스트 실패:', error.response?.data || error.message);
    return null;
  }
}

async function testWelfareAPI() {
  console.log('\n=== 복지 API 테스트 ===');
  
  try {
    // 1. 연령대별 검색 테스트
    console.log('1. 연령대별 검색 테스트...');
    const ageResponse = await axios.get(`${BASE_URL}/shinhan/bokji/age-search`);
    console.log('연령대별 검색 성공:', ageResponse.data);
    
    // 2. 카테고리 목록 테스트
    console.log('2. 카테고리 목록 테스트...');
    const categoryResponse = await axios.get(`${BASE_URL}/shinhan/bokji/list-search`);
    console.log('카테고리 목록 성공:', categoryResponse.data);
    
    // 3. 복지 검색 테스트 (페이지네이션 적용)
    console.log('3. 복지 검색 테스트 (첫 페이지)...');
    const searchResponse1 = await axios.get(`${BASE_URL}/shinhan/bokji/search?ageGroupNum=1&categoryNum=10&page=0&size=5`);
    console.log('복지 검색 첫 페이지 성공:', searchResponse1.data);
    console.log('첫 페이지 결과 개수:', searchResponse1.data.length);
    
    // 4. 복지 검색 테스트 (두 번째 페이지)
    console.log('4. 복지 검색 테스트 (두 번째 페이지)...');
    const searchResponse2 = await axios.get(`${BASE_URL}/shinhan/bokji/search?ageGroupNum=1&categoryNum=10&page=1&size=5`);
    console.log('복지 검색 두 번째 페이지 성공:', searchResponse2.data);
    console.log('두 번째 페이지 결과 개수:', searchResponse2.data.length);
    
  } catch (error) {
    console.error('복지 API 테스트 실패:', error.response?.data || error.message);
  }
}

async function testLikeAPI(userNum) {
  console.log('\n=== 좋아요 API 테스트 ===');
  
  try {
    // 1. 좋아요 목록 조회 테스트
    console.log('1. 좋아요 목록 조회 테스트...');
    const likesResponse = await axios.get(`${BASE_URL}/likes/${userNum}`);
    console.log('좋아요 목록 성공:', likesResponse.data);
    
    // 2. 좋아요 추가 테스트
    console.log('2. 좋아요 추가 테스트...');
    const addLikeData = {
      id: userNum,  // 백엔드 DTO에서 기대하는 필드명
      benefitCode: 1
    };
    
    const addLikeResponse = await axios.post(`${BASE_URL}/likes/add`, addLikeData);
    console.log('좋아요 추가 성공:', addLikeResponse.data);
    
  } catch (error) {
    console.error('좋아요 API 테스트 실패:', error.response?.data || error.message);
  }
}

async function testBookmarkAPI(userNum) {
  console.log('\n=== 북마크 API 테스트 ===');
  
  try {
    // 1. 북마크 목록 조회 테스트
    console.log('1. 북마크 목록 조회 테스트...');
    const bookmarksResponse = await axios.get(`${BASE_URL}/welfare/bookmarks/${userNum}`);
    console.log('북마크 목록 성공:', bookmarksResponse.data);
    
    // 2. 북마크 추가 테스트
    console.log('2. 북마크 추가 테스트...');
    const addBookmarkData = {
      id: userNum,
      ageGroupNum: 1
    };
    
    const addBookmarkResponse = await axios.post(`${BASE_URL}/welfare/bookmarks/add`, addBookmarkData);
    console.log('북마크 추가 성공:', addBookmarkResponse.data);
    
  } catch (error) {
    console.error('북마크 API 테스트 실패:', error.response?.data || error.message);
  }
}

// 메인 테스트 함수
async function runAllTests() {
  console.log('백엔드 API 연동 테스트 시작...\n');
  
  // 1. 인증 테스트
  const authResult = await testAuthAPI();
  
  if (authResult && authResult.userNum) {
    const userNum = authResult.userNum;
    
    // 2. 복지 API 테스트
    await testWelfareAPI();
    
    // 3. 좋아요 API 테스트
    await testLikeAPI(userNum);
    
    // 4. 북마크 API 테스트
    await testBookmarkAPI(userNum);
  }
  
  console.log('\n=== 모든 테스트 완료 ===');
}

// 테스트 실행
runAllTests().catch(console.error);

