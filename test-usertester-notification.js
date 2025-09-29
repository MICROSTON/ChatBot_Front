const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUsertesterNotification() {
    try {
        console.log('🎯 usertester에게 FCM 알림 전송 테스트...');
        
        const API_BASE = 'http://13.239.18.67:8080';
        
        const response = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=1&benefitName=FCM테스트복지`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ usertester FCM 알림 전송 성공:', result);
        } else {
            console.log('❌ usertester FCM 알림 전송 실패:', result);
        }
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

testUsertesterNotification();
