// 알림 기능 테스트 스크립트
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

// 테스트용 더미 데이터
const testData = {
  userId: 'testuser123',
  pushToken: 'ExponentPushToken[test-token-12345]',
  ageGroups: [1, 2, 3] // 청소년, 청년, 중년
};

// 1. FCM 토큰 등록 테스트
async function testRegisterPushToken() {
  console.log('🔔 FCM 토큰 등록 테스트 시작...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/notification/register`, testData);
    console.log('✅ 토큰 등록 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 토큰 등록 실패:', error.response?.data || error.message);
    return false;
  }
}

// 2. 알림 설정 조회 테스트
async function testGetNotificationSettings() {
  console.log('🔍 알림 설정 조회 테스트 시작...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/notification/${testData.userId}`);
    console.log('✅ 알림 설정 조회 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 알림 설정 조회 실패:', error.response?.data || error.message);
    // 404는 정상 (아직 등록되지 않은 사용자)
    if (error.response?.status === 404) {
      console.log('ℹ️ 사용자가 아직 등록되지 않음 (정상)');
      return true;
    }
    return false;
  }
}

// 3. 연령대별 알림 전송 테스트
async function testSendNotification() {
  console.log('📤 알림 전송 테스트 시작...');
  
  try {
    // 각 연령대별로 알림 전송
    for (let ageGroup = 1; ageGroup <= 4; ageGroup++) {
      const response = await axios.post(`${API_BASE_URL}/notification/test-push?ageGroupNum=${ageGroup}&benefitName=테스트복지${ageGroup}`);
      console.log(`✅ 연령대 ${ageGroup} 알림 전송 성공:`, response.data);
    }
    return true;
  } catch (error) {
    console.error('❌ 알림 전송 실패:', error.response?.data || error.message);
    return false;
  }
}

// 4. 서버 상태 확인
async function checkServerStatus() {
  console.log('🖥️ 백엔드 서버 상태 확인...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ 서버 상태 정상:', response.data);
    return true;
  } catch (error) {
    console.log('⚠️ 루트 엔드포인트 404 (정상), 다른 엔드포인트로 확인...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/notification/${testData.userId}`);
      console.log('✅ 서버 응답 정상');
      return true;
    } catch (error2) {
      // 404는 정상 (아직 등록되지 않은 사용자)
      if (error2.response?.status === 404) {
        console.log('✅ 서버 응답 정상 (404는 예상된 응답)');
        return true;
      }
      console.error('❌ 서버 연결 실패:', error2.message);
      return false;
    }
  }
}

// 전체 테스트 실행
async function runAllTests() {
  console.log('🚀 알림 기능 테스트 시작\n');
  
  const serverOk = await checkServerStatus();
  if (!serverOk) {
    console.log('❌ 서버가 실행되지 않았습니다. 백엔드 서버를 먼저 시작해주세요.');
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  
  const tokenRegistered = await testRegisterPushToken();
  console.log('\n' + '='.repeat(50));
  
  const settingsRetrieved = await testGetNotificationSettings();
  console.log('\n' + '='.repeat(50));
  
  const notificationSent = await testSendNotification();
  console.log('\n' + '='.repeat(50));
  
  // 결과 요약
  console.log('\n📊 테스트 결과 요약:');
  console.log(`서버 상태: ${serverOk ? '✅ 정상' : '❌ 실패'}`);
  console.log(`토큰 등록: ${tokenRegistered ? '✅ 성공' : '❌ 실패'}`);
  console.log(`설정 조회: ${settingsRetrieved ? '✅ 성공' : '❌ 실패'}`);
  console.log(`알림 전송: ${notificationSent ? '✅ 성공' : '❌ 실패'}`);
  
  if (serverOk && tokenRegistered && settingsRetrieved && notificationSent) {
    console.log('\n🎉 모든 알림 기능이 정상적으로 작동합니다!');
  } else {
    console.log('\n⚠️ 일부 기능에 문제가 있습니다. 로그를 확인해주세요.');
  }
}

// 테스트 실행
runAllTests().catch(console.error);
