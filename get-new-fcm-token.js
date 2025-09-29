const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getNewFCMToken() {
    try {
        console.log('🔄 새로운 FCM 토큰 발급 방법...');
        console.log('');
        console.log('📱 APK에서 새로운 FCM 토큰을 발급받으려면:');
        console.log('');
        console.log('1. APK를 완전히 삭제');
        console.log('2. APK를 다시 설치');
        console.log('3. APK를 실행하고 로그인');
        console.log('4. FCM 토큰이 팝업으로 표시될 것입니다');
        console.log('');
        console.log('또는 기존 APK에서:');
        console.log('');
        console.log('1. APK를 완전히 종료 (백그라운드에서도 제거)');
        console.log('2. Android 설정 → 앱 → 신한챗봇 → 저장공간 → 데이터 삭제');
        console.log('3. APK를 다시 실행하고 로그인');
        console.log('4. 새로운 FCM 토큰이 생성됩니다');
        console.log('');
        console.log('🔧 App.js에서 FCM 토큰을 강제로 새로 발급받는 방법:');
        console.log('');
        console.log('APK에서 개발자 도구를 열고 다음 코드를 실행:');
        console.log('');
        console.log('```javascript');
        console.log('import messaging from \'@react-native-firebase/messaging\';');
        console.log('');
        console.log('const refreshFCMToken = async () => {');
        console.log('    try {');
        console.log('        // 기존 토큰 삭제');
        console.log('        await messaging().deleteToken();');
        console.log('        console.log(\'기존 FCM 토큰 삭제됨\');');
        console.log('');
        console.log('        // 새로운 토큰 발급');
        console.log('        const newToken = await messaging().getToken();');
        console.log('        console.log(\'새로운 FCM 토큰:\', newToken);');
        console.log('        return newToken;');
        console.log('    } catch (error) {');
        console.log('        console.error(\'FCM 토큰 새로고침 실패:\', error);');
        console.log('    }');
        console.log('};');
        console.log('');
        console.log('refreshFCMToken();');
        console.log('```');
        console.log('');
        console.log('새로운 FCM 토큰을 받으시면 알려주세요!');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

getNewFCMToken();
