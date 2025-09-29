const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function androidNotificationDebug() {
    try {
        console.log('🔧 Android 알림 설정 디버깅 가이드...');
        console.log('');
        console.log('📱 Android 설정에서 확인할 사항들:');
        console.log('');
        console.log('1. 알림 권한 확인:');
        console.log('   - 설정 → 앱 → 신한챗봇 → 알림');
        console.log('   - "알림 허용"이 켜져 있는지 확인');
        console.log('   - "중요한 알림"도 켜져 있는지 확인');
        console.log('');
        console.log('2. 배터리 최적화 확인:');
        console.log('   - 설정 → 배터리 → 배터리 최적화');
        console.log('   - 신한챗봇을 "최적화하지 않음"으로 설정');
        console.log('');
        console.log('3. 자동 시작 확인:');
        console.log('   - 설정 → 앱 → 신한챗봇 → 자동 시작');
        console.log('   - "자동 시작 허용"이 켜져 있는지 확인');
        console.log('');
        console.log('4. 백그라운드 앱 새로고침:');
        console.log('   - 설정 → 앱 → 신한챗봇 → 백그라운드 앱 새로고침');
        console.log('   - "백그라운드 앱 새로고침 허용"이 켜져 있는지 확인');
        console.log('');
        console.log('5. Do Not Disturb (방해 금지) 확인:');
        console.log('   - 설정 → 소리 및 진동 → 방해 금지');
        console.log('   - 방해 금지가 켜져 있다면 신한챗봇을 예외로 추가');
        console.log('');
        console.log('6. 알림 채널 확인:');
        console.log('   - 설정 → 앱 → 신한챗봇 → 알림 → 알림 채널');
        console.log('   - 모든 채널이 활성화되어 있는지 확인');
        console.log('');
        console.log('7. 알림 스타일 확인:');
        console.log('   - 설정 → 앱 → 신한챗봇 → 알림 → 알림 스타일');
        console.log('   - "알림 표시"가 켜져 있는지 확인');
        console.log('');
        console.log('8. 잠금 화면 알림 확인:');
        console.log('   - 설정 → 보안 및 개인정보 보호 → 잠금 화면');
        console.log('   - "알림 표시"가 켜져 있는지 확인');
        console.log('');
        console.log('9. 개발자 옵션 확인:');
        console.log('   - 설정 → 개발자 옵션 → "앱이 백그라운드에서 실행 중일 때 알림 표시"');
        console.log('   - 이 옵션이 켜져 있는지 확인');
        console.log('');
        console.log('10. 네트워크 연결 확인:');
        console.log('   - WiFi 또는 모바일 데이터가 정상적으로 연결되어 있는지 확인');
        console.log('   - 방화벽이나 VPN이 FCM을 차단하지 않는지 확인');
        console.log('');
        console.log('🔍 추가 디버깅 방법:');
        console.log('');
        console.log('1. APK 로그 확인:');
        console.log('   - Android Studio의 Logcat에서 "FCM" 또는 "Firebase" 검색');
        console.log('   - 오류 메시지가 있는지 확인');
        console.log('');
        console.log('2. Firebase 콘솔에서 전송 상태 확인:');
        console.log('   - Firebase 콘솔 → Messaging → 전송 기록');
        console.log('   - 알림이 성공적으로 전송되었는지 확인');
        console.log('');
        console.log('3. 다른 앱에서 알림 테스트:');
        console.log('   - 다른 앱(예: Gmail, 카카오톡)에서 알림이 정상적으로 오는지 확인');
        console.log('   - 시스템 알림 설정에 문제가 없는지 확인');
        console.log('');
        console.log('위 설정들을 모두 확인한 후 다시 알림을 테스트해보세요!');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

androidNotificationDebug();
