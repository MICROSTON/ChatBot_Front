// FCM 토큰 테스트를 위한 스크립트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// FCM 서버 키 (application.properties에서 가져온 값)
const FCM_SERVER_KEY = 'BLLMQ_F0xzqVF_2gbrsYsXY16dOSmCLKjvsDe8baFQJZ5_jg0nGLwrxLFsmK6iRppIkNO9puFK6IetRbFKuW-5I';

// FCM을 통한 직접 알림 전송
async function sendFCMNotification(token, title, body, data = {}) {
    const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
    
    const message = {
        to: token,
        notification: {
            title: title,
            body: body,
            sound: 'default'
        },
        data: data
    };
    
    try {
        console.log('📤 FCM 알림 전송 중...');
        console.log('토큰:', token);
        console.log('메시지:', message);
        
        const response = await fetch(fcmUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`
            },
            body: JSON.stringify(message),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ FCM 알림 전송 성공!');
            console.log('응답:', result);
            return result;
        } else {
            console.log('❌ FCM 알림 전송 실패');
            console.log('응답:', result);
            return null;
        }
        
    } catch (error) {
        console.error('❌ 전송 중 오류:', error);
        return null;
    }
}

// 백엔드 API를 통한 FCM 알림 전송 테스트
async function testBackendFCM() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('🔧 백엔드 FCM API 테스트 시작...');
        
        // 1. FCM 토큰 등록 테스트
        console.log('1️⃣ FCM 토큰 등록 테스트...');
        const registerResponse = await fetch(`${API_BASE}/notification/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'fcmtestuser',
                pushToken: 'FCM_TOKEN_PLACEHOLDER', // 실제 FCM 토큰으로 교체 필요
                ageGroups: [1, 2, 3],
                isActive: true
            }),
        });
        
        if (registerResponse.ok) {
            const registerResult = await registerResponse.json();
            console.log('✅ FCM 토큰 등록 성공:', registerResult);
        } else {
            const errorText = await registerResponse.text();
            console.log('❌ FCM 토큰 등록 실패:', errorText);
        }
        
        // 2. FCM 알림 전송 테스트
        console.log('\n2️⃣ FCM 알림 전송 테스트...');
        const sendResponse = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=1&benefitName=FCM테스트복지`, {
            method: 'POST',
        });
        
        if (sendResponse.ok) {
            const sendResult = await sendResponse.json();
            console.log('✅ FCM 알림 전송 성공:', sendResult);
        } else {
            const errorText = await sendResponse.text();
            console.log('❌ FCM 알림 전송 실패:', errorText);
        }
        
        // 3. 등록된 알림 설정 확인
        console.log('\n3️⃣ 등록된 알림 설정 확인...');
        const debugResponse = await fetch(`${API_BASE}/notification/debug/all`);
        
        if (debugResponse.ok) {
            const debugResult = await debugResponse.json();
            console.log('📋 등록된 알림 설정:', debugResult);
        } else {
            console.log('❌ 알림 설정 조회 실패');
        }
        
    } catch (error) {
        console.error('❌ 백엔드 FCM 테스트 중 오류:', error);
    }
}

// APK에서 FCM 토큰을 발급받는 방법 안내
function showFCMTokenInstructions() {
    console.log('📱 APK에서 FCM 토큰을 발급받으려면:');
    console.log('1. APK를 빌드하고 설치하세요');
    console.log('2. 앱을 실행하고 로그인하세요');
    console.log('3. 개발자 도구에서 다음 코드를 실행하세요:');
    console.log(`
    import messaging from '@react-native-firebase/messaging';
    
    const getFCMToken = async () => {
        try {
            // 알림 권한 요청
            const authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            
            if (enabled) {
                console.log('FCM 알림 권한 허용됨');
                
                // FCM 토큰 가져오기
                const fcmToken = await messaging().getToken();
                console.log('FCM Token:', fcmToken);
                return fcmToken;
            } else {
                console.log('FCM 알림 권한 거부됨');
            }
        } catch (error) {
            console.error('FCM 토큰 발급 실패:', error);
        }
    };
    
    getFCMToken();
    `);
    console.log('4. 발급받은 FCM 토큰을 사용하여 테스트하세요\n');
}

// 메인 테스트 함수
async function main() {
    console.log('🔥 FCM 푸시 알림 테스트 시작\n');
    
    // 실제 FCM 토큰이 필요합니다 (APK에서 발급받은 토큰)
    const fcmToken = process.argv[2];
    
    if (!fcmToken || fcmToken === 'undefined') {
        console.log('⚠️  실제 FCM 토큰이 필요합니다.');
        console.log('사용법: node test-fcm-token.js "FCM_TOKEN"');
        console.log('\n');
        showFCMTokenInstructions();
        
        // 백엔드 테스트만 실행
        await testBackendFCM();
        return;
    }
    
    console.log('사용할 FCM 토큰:', fcmToken);
    
    // 1. FCM 직접 전송 테스트
    console.log('='.repeat(50));
    console.log('1️⃣ FCM 직접 전송 테스트');
    console.log('='.repeat(50));
    
    await sendFCMNotification(
        fcmToken,
        '🔥 FCM 테스트 알림',
        'FCM에서 직접 보낸 알림입니다!',
        { 
            ageGroupNum: 1,
            test: true,
            timestamp: new Date().toISOString()
        }
    );
    
    console.log('\n');
    
    // 2. 백엔드 API 테스트
    console.log('='.repeat(50));
    console.log('2️⃣ 백엔드 FCM API 테스트');
    console.log('='.repeat(50));
    
    await testBackendFCM();
    
    console.log('\n✅ 모든 FCM 테스트 완료!');
    console.log('📱 APK에서 알림을 확인해보세요.');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    sendFCMNotification,
    testBackendFCM,
    showFCMTokenInstructions
};
