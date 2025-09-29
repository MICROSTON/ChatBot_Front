const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fixFCMAuth() {
    try {
        console.log('🔧 FCM v1 API 인증 문제 해결 방법...');
        console.log('');
        console.log('❌ 현재 문제:');
        console.log('- FCM v1 API는 서버 키가 아닌 OAuth 2.0 인증이 필요');
        console.log('- 현재 사용 중인 서버 키는 FCM v1 API에서 작동하지 않음');
        console.log('- 401 Unauthorized 오류 발생');
        console.log('');
        console.log('✅ 해결 방법:');
        console.log('');
        console.log('1. Firebase 콘솔에서 서비스 계정 키 생성:');
        console.log('   - Firebase 콘솔 → 프로젝트 설정 → 서비스 계정');
        console.log('   - "새 비공개 키 생성" 클릭');
        console.log('   - JSON 파일 다운로드');
        console.log('');
        console.log('2. 서비스 계정 JSON 파일을 서버에 업로드:');
        console.log('   - 다운로드한 JSON 파일을 서버의 /home/ec2-user/ 경로에 업로드');
        console.log('   - 파일명: firebase-service-account.json');
        console.log('');
        console.log('3. 백엔드 코드 수정:');
        console.log('   - PushNotificationService.java에서 OAuth 2.0 인증 사용');
        console.log('   - 서버 키 대신 서비스 계정 JSON 파일 사용');
        console.log('');
        console.log('4. 또는 FCM Legacy API로 되돌리기:');
        console.log('   - FCM v1 API 대신 Legacy API 사용');
        console.log('   - 기존 서버 키 방식 유지');
        console.log('');
        console.log('🚀 빠른 해결책: FCM Legacy API로 되돌리기');
        console.log('');
        console.log('PushNotificationService.java를 다음과 같이 수정:');
        console.log('');
        console.log('```java');
        console.log('// FCM Legacy API 사용');
        console.log('String firebaseUrl = "https://fcm.googleapis.com/fcm/send";');
        console.log('headers.set("Authorization", "key=" + fcmServerKey);');
        console.log('');
        console.log('String requestBody = objectMapper.writeValueAsString(Map.of(');
        console.log('    "to", pushToken,');
        console.log('    "notification", Map.of(');
        console.log('        "title", title,');
        console.log('        "body", body');
        console.log('    ),');
        console.log('    "data", Map.of("ageGroupNum", String.valueOf(ageGroupNum))');
        console.log('));');
        console.log('```');
        console.log('');
        console.log('이 방법이 더 간단하고 빠릅니다!');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

fixFCMAuth();
