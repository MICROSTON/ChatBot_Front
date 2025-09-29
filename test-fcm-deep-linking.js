// FCM 딥링킹 문제 해결을 위한 테스트 스크립트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// FCM 서버 키
const FCM_SERVER_KEY = 'BLLMQ_F0xzqVF_2gbrsYsXY16dOSmCLKjvsDe8baFQJZ5_jg0nGLwrxLFsmK6iRppIkNO9puFK6IetRbFKuW-5I';

// FCM 직접 전송 테스트 (딥링킹 확인용)
async function sendFCMTestNotification() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('🔥 FCM 직접 전송 테스트 시작...\n');
        
        // 등록된 FCM 토큰 확인
        const response = await fetch(`${API_BASE}/notification/debug/all`);
        const users = await response.json();
        
        const fcmUsers = users.filter(user => 
            user.pushToken && 
            !user.pushToken.startsWith('ExponentPushToken') && 
            user.pushToken !== 'FCM_TOKEN_PLACEHOLDER'
        );
        
        if (fcmUsers.length === 0) {
            console.log('❌ 등록된 FCM 토큰이 없습니다.');
            return;
        }
        
        console.log(`📱 발견된 FCM 사용자: ${fcmUsers.length}명`);
        fcmUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.userId}: ${user.pushToken.substring(0, 20)}...`);
        });
        
        // FCM 직접 전송
        const fcmUser = fcmUsers[0];
        console.log(`\n📤 FCM 직접 전송: ${fcmUser.userId}`);
        
        const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
        const message = {
            to: fcmUser.pushToken,
            notification: {
                title: '🔥 FCM 직접 테스트',
                body: 'FCM에서 직접 보낸 알림입니다!',
                sound: 'default'
            },
            data: {
                ageGroupNum: '1',
                test: 'true',
                timestamp: new Date().toISOString()
            }
        };
        
        const fcmResponse = await fetch(fcmUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`
            },
            body: JSON.stringify(message),
        });
        
        const fcmResult = await fcmResponse.json();
        
        if (fcmResponse.ok) {
            console.log('✅ FCM 직접 전송 성공:', fcmResult);
        } else {
            console.log('❌ FCM 직접 전송 실패:', fcmResult);
        }
        
    } catch (error) {
        console.error('❌ FCM 테스트 중 오류:', error);
    }
}

// 백엔드 API를 통한 알림 전송
async function sendBackendNotification() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('\n🔧 백엔드 API를 통한 알림 전송...\n');
        
        const response = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=1&benefitName=FCM딥링킹테스트`, {
            method: 'POST',
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 백엔드 알림 전송 성공:', result);
        } else {
            const errorText = await response.text();
            console.log('❌ 백엔드 알림 전송 실패:', errorText);
        }
        
    } catch (error) {
        console.error('❌ 백엔드 테스트 중 오류:', error);
    }
}

// 딥링킹 문제 해결 방법 안내
function showDeepLinkingSolutions() {
    console.log('\n🔧 Expo Go가 열리는 문제 해결 방법:\n');
    
    console.log('1️⃣ **가장 확실한 방법 - Expo Go 앱 삭제/비활성화**:');
    console.log('   - Android 설정 > 앱 > Expo Go > 삭제 또는 비활성화');
    console.log('   - 이렇게 하면 Expo Push Token이 있어도 APK가 열립니다\n');
    
    console.log('2️⃣ **Android 알림 설정 변경**:');
    console.log('   - Android 설정 > 앱 > 기본 앱 > 알림');
    console.log('   - 또는 Android 설정 > 앱 > 고급 > 기본 앱');
    console.log('   - 알림 앱을 "SHchatbot"으로 설정\n');
    
    console.log('3️⃣ **앱별 알림 설정 확인**:');
    console.log('   - Android 설정 > 앱 > SHchatbot > 알림');
    console.log('   - 알림이 활성화되어 있는지 확인\n');
    
    console.log('4️⃣ **개발자 옵션 확인**:');
    console.log('   - 개발자 옵션 > "앱별 알림 설정" 확인');
    console.log('   - 또는 "알림 앱 우선순위" 설정\n');
    
    console.log('5️⃣ **APK 재설치**:');
    console.log('   - 기존 APK 제거 후 새로 설치');
    console.log('   - 설치 시 "알림 허용" 선택\n');
}

// 메인 실행 함수
async function main() {
    console.log('🔥 FCM 딥링킹 테스트 시작\n');
    
    // 1. FCM 직접 전송 테스트
    await sendFCMTestNotification();
    
    // 2. 백엔드 API 테스트
    await sendBackendNotification();
    
    // 3. 해결 방법 안내
    showDeepLinkingSolutions();
    
    console.log('\n✅ FCM 딥링킹 테스트 완료!');
    console.log('📱 위의 방법들을 시도한 후 알림을 다시 클릭해보세요.');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    sendFCMTestNotification,
    sendBackendNotification,
    showDeepLinkingSolutions
};
