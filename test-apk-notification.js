// APK에서 알림 테스트를 위한 가이드
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// APK에서 알림 테스트 방법 안내
function showAPKNotificationTest() {
    console.log('📱 APK에서 알림 테스트 방법:\n');
    
    console.log('1️⃣ **APK 내에서 알림 권한 확인**:');
    console.log('   - APK를 실행하고 로그인');
    console.log('   - 앱 내 설정에서 알림 권한이 허용되어 있는지 확인');
    console.log('   - 또는 Android 설정 > 앱 > SHchatbot > 알림에서 확인\n');
    
    console.log('2️⃣ **APK에서 로그아웃 후 재로그인**:');
    console.log('   - APK에서 로그아웃');
    console.log('   - 다시 로그인 (FCM 토큰 재등록)');
    console.log('   - 로그인 시 알림 권한 요청이 나오면 허용\n');
    
    console.log('3️⃣ **APK를 백그라운드로 보내고 테스트**:');
    console.log('   - APK를 실행한 상태에서 홈 버튼을 눌러 백그라운드로 보냄');
    console.log('   - 다른 앱을 실행하거나 잠금 화면으로 이동');
    console.log('   - 백엔드에서 알림 전송 후 알림 수신 확인\n');
    
    console.log('4️⃣ **Android 개발자 옵션 확인**:');
    console.log('   - Android 설정 > 개발자 옵션');
    console.log('   - "앱별 알림 설정" 또는 "알림 앱 우선순위" 확인');
    console.log('   - SHchatbot이 차단되어 있지 않은지 확인\n');
    
    console.log('5️⃣ **APK 재설치**:');
    console.log('   - 기존 APK 제거');
    console.log('   - 새 APK 설치 시 "알림 허용" 선택');
    console.log('   - 설치 후 로그인하여 FCM 토큰 재등록\n');
}

// 백엔드에서 알림 전송 테스트
async function sendTestNotification() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('🧪 백엔드에서 테스트 알림 전송...\n');
        
        const response = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=1&benefitName=APK테스트알림`, {
            method: 'POST',
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 백엔드 알림 전송 성공:', result);
            console.log('\n📱 이제 APK에서 알림을 확인해보세요!');
        } else {
            const errorText = await response.text();
            console.log('❌ 백엔드 알림 전송 실패:', errorText);
        }
        
    } catch (error) {
        console.error('❌ 백엔드 테스트 중 오류:', error);
    }
}

// 등록된 토큰 상태 확인
async function checkTokenStatus() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('🔍 등록된 토큰 상태 확인...\n');
        
        const response = await fetch(`${API_BASE}/notification/debug/all`);
        
        if (response.ok) {
            const users = await response.json();
            
            const fcmUsers = users.filter(user => 
                user.pushToken && 
                !user.pushToken.startsWith('ExponentPushToken') && 
                user.pushToken !== 'FCM_TOKEN_PLACEHOLDER'
            );
            
            console.log('📋 FCM 토큰 등록 현황:');
            console.log('='.repeat(50));
            
            if (fcmUsers.length > 0) {
                fcmUsers.forEach((user, index) => {
                    console.log(`${index + 1}. 사용자: ${user.userId}`);
                    console.log(`   토큰: ${user.pushToken.substring(0, 30)}...`);
                    console.log(`   연령대: ${user.ageGroups.join(', ')}`);
                    console.log(`   활성화: ${user.isActive ? '✅' : '❌'}`);
                    console.log('');
                });
            } else {
                console.log('❌ 등록된 FCM 토큰이 없습니다.');
                console.log('   APK에서 로그인을 다시 시도해보세요.');
            }
            
        } else {
            console.log('❌ 토큰 상태 확인 실패');
        }
        
    } catch (error) {
        console.error('❌ 토큰 상태 확인 중 오류:', error);
    }
}

// 메인 실행 함수
async function main() {
    console.log('📱 APK 알림 테스트 도구\n');
    
    // 1. 토큰 상태 확인
    await checkTokenStatus();
    
    // 2. APK 테스트 방법 안내
    showAPKNotificationTest();
    
    // 3. 테스트 알림 전송
    console.log('🧪 테스트 알림 전송...\n');
    await sendTestNotification();
    
    console.log('\n✅ APK 알림 테스트 완료!');
    console.log('📱 위의 방법들을 시도한 후 알림을 확인해보세요.');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    showAPKNotificationTest,
    sendTestNotification,
    checkTokenStatus
};
