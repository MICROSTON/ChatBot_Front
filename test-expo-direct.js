// Expo에서 직접 알림을 보내는 테스트 스크립트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Expo Push API를 사용한 직접 알림 전송
async function sendExpoNotification(token, title, body, data = {}) {
    const expoPushUrl = 'https://exp.host/--/api/v2/push/send';
    
    const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data
    };
    
    try {
        console.log('📤 Expo 알림 전송 중...');
        console.log('토큰:', token);
        console.log('메시지:', message);
        
        const response = await fetch(expoPushUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Expo 알림 전송 성공!');
            console.log('응답:', result);
            return result;
        } else {
            console.log('❌ Expo 알림 전송 실패');
            console.log('응답:', result);
            return null;
        }
        
    } catch (error) {
        console.error('❌ 전송 중 오류:', error);
        return null;
    }
}

// 백엔드 API를 통한 알림 전송 테스트
async function testBackendNotification() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('🔧 백엔드 API 테스트 시작...');
        
        // 1. 테스트용 푸시 알림 전송
        console.log('1️⃣ 백엔드에서 푸시 알림 전송...');
        const response = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=1&benefitName=테스트복지`, {
            method: 'POST',
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 백엔드 알림 전송 성공:', result);
        } else {
            const errorText = await response.text();
            console.log('❌ 백엔드 알림 전송 실패:', errorText);
        }
        
        // 2. 등록된 알림 설정 확인
        console.log('\n2️⃣ 등록된 알림 설정 확인...');
        const debugResponse = await fetch(`${API_BASE}/notification/debug/all`);
        
        if (debugResponse.ok) {
            const debugResult = await debugResponse.json();
            console.log('📋 등록된 알림 설정:', debugResult);
        } else {
            console.log('❌ 알림 설정 조회 실패');
        }
        
    } catch (error) {
        console.error('❌ 백엔드 테스트 중 오류:', error);
    }
}

// 메인 테스트 함수
async function main() {
    console.log('🧪 Expo 푸시 알림 테스트 시작\n');
    
    // 실제 토큰이 필요합니다 (앱에서 발급받은 토큰)
    const testToken = process.argv[2];
    
    if (!testToken || testToken === 'undefined') {
        console.log('⚠️  실제 Expo 토큰이 필요합니다.');
        console.log('사용법: node test-expo-direct.js "ExponentPushToken[실제토큰]"');
        console.log('\n📱 앱에서 토큰을 발급받으려면:');
        console.log('1. 앱을 실행하고 로그인하세요');
        console.log('2. 개발자 도구에서 다음 코드를 실행하세요:');
        console.log(`
        import * as Notifications from 'expo-notifications';
        import Constants from 'expo-constants';
        
        const getToken = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('알림 권한이 필요합니다');
                return;
            }
            
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
            const tokenRes = await Notifications.getExpoPushTokenAsync({ projectId });
            console.log('Expo Push Token:', tokenRes.data);
            return tokenRes.data;
        };
        
        getToken();
        `);
        console.log('3. 발급받은 토큰을 사용하여 테스트하세요\n');
        
        // 백엔드 테스트만 실행
        await testBackendNotification();
        return;
    }
    
    console.log('사용할 토큰:', testToken);
    
    // 1. Expo 직접 전송 테스트
    console.log('='.repeat(50));
    console.log('1️⃣ Expo 직접 전송 테스트');
    console.log('='.repeat(50));
    
    await sendExpoNotification(
        testToken,
        '🧪 Expo 테스트 알림',
        'Expo에서 직접 보낸 알림입니다!',
        { 
            ageGroupNum: 1,
            test: true,
            timestamp: new Date().toISOString()
        }
    );
    
    console.log('\n');
    
    // 2. 백엔드 API 테스트
    console.log('='.repeat(50));
    console.log('2️⃣ 백엔드 API 테스트');
    console.log('='.repeat(50));
    
    await testBackendNotification();
    
    console.log('\n✅ 모든 테스트 완료!');
    console.log('📱 앱에서 알림을 확인해보세요.');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    sendExpoNotification,
    testBackendNotification
};
