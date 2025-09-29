// 알림 딥링킹 문제 해결을 위한 설정 확인 스크립트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 백엔드에서 알림 설정 확인
async function checkNotificationSettings() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('🔍 현재 알림 설정 확인...\n');
        
        const response = await fetch(`${API_BASE}/notification/debug/all`);
        
        if (response.ok) {
            const users = await response.json();
            
            console.log('📋 등록된 알림 설정:');
            console.log('='.repeat(60));
            
            users.forEach((user, index) => {
                console.log(`${index + 1}. 사용자: ${user.userId}`);
                console.log(`   토큰 타입: ${user.pushToken.startsWith('ExponentPushToken') ? 'Expo Push Token' : 'FCM Token'}`);
                console.log(`   토큰: ${user.pushToken}`);
                console.log(`   연령대: ${user.ageGroups.join(', ')}`);
                console.log(`   활성화: ${user.isActive ? '✅' : '❌'}`);
                console.log('');
            });
            
            return users;
        } else {
            console.log('❌ 알림 설정 조회 실패');
            return [];
        }
        
    } catch (error) {
        console.error('❌ 알림 설정 조회 중 오류:', error);
        return [];
    }
}

// 알림 딥링킹 문제 해결 방법 안내
function showDeepLinkingSolutions() {
    console.log('🔧 알림 딥링킹 문제 해결 방법:\n');
    
    console.log('1️⃣ Android 설정에서 알림 앱 변경:');
    console.log('   - Android 설정 > 앱 > 기본 앱 > 알림');
    console.log('   - 또는 Android 설정 > 앱 > 고급 > 기본 앱');
    console.log('   - 알림 앱을 "SHchatbot"으로 설정\n');
    
    console.log('2️⃣ 앱별 알림 설정 확인:');
    console.log('   - Android 설정 > 앱 > SHchatbot > 알림');
    console.log('   - 알림이 활성화되어 있는지 확인\n');
    
    console.log('3️⃣ Expo Go 앱 비활성화:');
    console.log('   - Android 설정 > 앱 > Expo Go > 비활성화');
    console.log('   - 또는 Expo Go 앱 삭제\n');
    
    console.log('4️⃣ APK 재설치:');
    console.log('   - 기존 APK 제거 후 새로 설치');
    console.log('   - 설치 시 "알림 허용" 선택\n');
    
    console.log('5️⃣ 개발자 옵션 확인:');
    console.log('   - 개발자 옵션 > "앱별 알림 설정" 확인');
    console.log('   - 또는 "알림 앱 우선순위" 설정\n');
}

// 테스트용 알림 전송 (딥링킹 확인용)
async function sendTestNotificationWithDeepLink() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('📤 딥링킹 테스트용 알림 전송...\n');
        
        const response = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=1&benefitName=딥링킹테스트`, {
            method: 'POST',
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 테스트 알림 전송 성공:', result);
            console.log('\n📱 이제 알림을 클릭해서 어떤 앱이 열리는지 확인해보세요!');
        } else {
            const errorText = await response.text();
            console.log('❌ 테스트 알림 전송 실패:', errorText);
        }
        
    } catch (error) {
        console.error('❌ 테스트 알림 전송 중 오류:', error);
    }
}

// 메인 실행 함수
async function main() {
    console.log('🔧 알림 딥링킹 문제 해결 도구\n');
    
    // 1. 현재 알림 설정 확인
    await checkNotificationSettings();
    
    // 2. 해결 방법 안내
    showDeepLinkingSolutions();
    
    // 3. 테스트용 알림 전송
    console.log('🧪 딥링킹 테스트를 위한 알림 전송...\n');
    await sendTestNotificationWithDeepLink();
    
    console.log('\n✅ 딥링킹 문제 해결 도구 완료!');
    console.log('📱 위의 방법들을 시도한 후 알림을 다시 클릭해보세요.');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    checkNotificationSettings,
    showDeepLinkingSolutions,
    sendTestNotificationWithDeepLink
};
