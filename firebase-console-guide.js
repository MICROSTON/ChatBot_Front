const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function firebaseConsoleGuide() {
    try {
        console.log('🔥 Firebase 콘솔에서 직접 알림 보내는 방법...');
        console.log('');
        console.log('📱 단계별 가이드:');
        console.log('');
        console.log('1️⃣ Firebase 콘솔 접속:');
        console.log('   - https://console.firebase.google.com');
        console.log('   - 프로젝트: shinhanchatbot-b582b 선택');
        console.log('');
        console.log('2️⃣ Cloud Messaging 메뉴:');
        console.log('   - 왼쪽 메뉴에서 "Messaging" 클릭');
        console.log('   - "새 캠페인" 버튼 클릭');
        console.log('   - "알림" 선택');
        console.log('');
        console.log('3️⃣ 알림 내용 작성:');
        console.log('   - 알림 제목: "Firebase 콘솔 테스트"');
        console.log('   - 알림 텍스트: "Firebase 콘솔에서 직접 보낸 알림입니다"');
        console.log('   - "다음" 클릭');
        console.log('');
        console.log('4️⃣ 대상 선택:');
        console.log('   - "앱" 선택');
        console.log('   - "Android 앱" 선택');
        console.log('   - "FCM 등록 토큰" 선택');
        console.log('');
        console.log('5️⃣ FCM 토큰 입력:');
        console.log('   - 토큰 입력란에 다음 토큰을 복사해서 붙여넣기:');
        console.log('');
        console.log('📋 FCM 토큰 (복사용):');
        console.log('dVJeUdikR6WbN7-K85f1a5:APA91bGeIS8P5yE9cZmalZOExG2-Fv99iEJL_YKa09HZ1oXdGzZlzD6qaLZsrIWqeu0_wKx4I4Re1xEf5EDi76d0grrYHJJJly-fsTISLZkhwj8RsfAtDPI');
        console.log('');
        console.log('6️⃣ 알림 전송:');
        console.log('   - "다음" 클릭');
        console.log('   - "다음" 클릭 (스케줄링 건너뛰기)');
        console.log('   - "게시" 클릭');
        console.log('');
        console.log('📱 APK에서 알림 확인:');
        console.log('   - APK가 실행 중인지 확인');
        console.log('   - 알림이 오는지 확인');
        console.log('   - 알림을 클릭해서 APK가 열리는지 확인');
        console.log('');
        console.log('🔍 만약 Firebase 콘솔에서도 알림이 오지 않는다면:');
        console.log('   - FCM 토큰이 만료되었거나 유효하지 않음');
        console.log('   - APK를 완전히 삭제하고 다시 설치 필요');
        console.log('   - Firebase 프로젝트 설정 문제');
        console.log('');
        console.log('🚀 Firebase 콘솔에서 직접 알림을 보내보세요!');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

firebaseConsoleGuide();
