const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkFirebaseConsole() {
    try {
        console.log('🔍 Firebase 콘솔에서 서버 키 확인 방법...');
        console.log('');
        console.log('📋 단계별 확인 방법:');
        console.log('');
        console.log('1️⃣ Firebase 콘솔 접속:');
        console.log('   https://console.firebase.google.com');
        console.log('');
        console.log('2️⃣ 프로젝트 선택:');
        console.log('   shinhanchatbot-b582b 프로젝트 선택');
        console.log('');
        console.log('3️⃣ 프로젝트 설정 이동:');
        console.log('   왼쪽 메뉴 상단의 ⚙️ (톱니바퀴) 아이콘 클릭');
        console.log('   → "프로젝트 설정" 클릭');
        console.log('');
        console.log('4️⃣ Cloud Messaging 탭 선택:');
        console.log('   "Cloud Messaging" 탭 클릭');
        console.log('');
        console.log('5️⃣ 서버 키 확인:');
        console.log('   "프로젝트 자격 증명" 섹션에서');
        console.log('   "서버 키" 항목 확인');
        console.log('   (AIzaSy...로 시작하는 긴 문자열)');
        console.log('');
        console.log('🔑 현재 사용 중인 키들:');
        console.log('1. BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I');
        console.log('2. AIzaSyA_QUO8OYxY4MQye61DAvc6IqUMBb9tWIg');
        console.log('');
        console.log('❓ 문제 가능성:');
        console.log('- 서버 키가 잘못되었을 수 있음');
        console.log('- Firebase 프로젝트 설정 문제');
        console.log('- FCM API 사용량 초과');
        console.log('- 네트워크 또는 방화벽 문제');
        console.log('');
        console.log('✅ 해결 방법:');
        console.log('1. Firebase 콘솔에서 정확한 서버 키 확인');
        console.log('2. 서버 키를 백엔드에 업데이트');
        console.log('3. 서버 재시작');
        console.log('4. 알림 테스트');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

checkFirebaseConsole();
