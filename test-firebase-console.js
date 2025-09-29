const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFirebaseConsole() {
    try {
        console.log('🔥 Firebase 콘솔에서 직접 FCM 알림 전송 테스트...');
        
        // 현재 등록된 FCM 토큰
        const fcmToken = 'dVJeUdikR6WbN7-K85f1a5:APA91bGeIS8P5yE9cZmalZOExG2-Fv99iEJL_YKa09HZ1oXdGzZlzD6qaLZsrIWqeu0_wKx4I4Re1xEf5EDi76d0grrYHJJJly-fsTISLZkhwj8RsfAtDPI';
        
        console.log('📱 FCM 토큰:', fcmToken);
        console.log('');
        console.log('🔧 Firebase 콘솔에서 다음 단계를 따라해주세요:');
        console.log('');
        console.log('1. Firebase 콘솔 (https://console.firebase.google.com) 접속');
        console.log('2. 프로젝트: shinhanchatbot-b582b 선택');
        console.log('3. 왼쪽 메뉴에서 "Messaging" 클릭');
        console.log('4. "새 캠페인" → "알림" 선택');
        console.log('5. 알림 제목: "Firebase 콘솔 테스트"');
        console.log('6. 알림 텍스트: "Firebase 콘솔에서 직접 보낸 알림입니다"');
        console.log('7. "다음" 클릭');
        console.log('8. "앱" 선택 → "Android 앱" 선택');
        console.log('9. "FCM 등록 토큰" 선택');
        console.log('10. 토큰 입력란에 다음 토큰을 복사해서 붙여넣기:');
        console.log('');
        console.log('📋 FCM 토큰 (복사용):');
        console.log(fcmToken);
        console.log('');
        console.log('11. "다음" → "다음" → "게시" 클릭');
        console.log('');
        console.log('📱 APK에서 알림을 확인해보세요!');
        console.log('');
        console.log('만약 Firebase 콘솔에서도 알림이 오지 않는다면:');
        console.log('- FCM 토큰이 만료되었거나 유효하지 않음');
        console.log('- APK를 완전히 삭제하고 다시 설치 필요');
        console.log('- Firebase 프로젝트 설정 문제');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

testFirebaseConsole();
