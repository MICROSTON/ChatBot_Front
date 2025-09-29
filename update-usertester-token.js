const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function updateUsertesterToken() {
    try {
        console.log('🔄 usertester의 FCM 토큰 업데이트 시작...');
        
        const API_BASE = 'http://13.239.18.67:8080';
        const newFCMToken = 'dVJeUdikR6WbN7-K85f1a5:APA91bGeIS8P5yE9cZmalZOExG2-Fv99iEJL_YKa09HZ1oXdGzZlzD6qaLZsrIWqeu0_wKx4I4Re1xEf5EDi76d0grrYHJJJly-fsTISLZkhwj8RsfAtDPI';
        
        const response = await fetch(`${API_BASE}/notification/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: 'usertester', 
                pushToken: newFCMToken, 
                ageGroups: [1,2,3,4,5,6,7] 
            }),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ usertester FCM 토큰 업데이트 성공:', result);
        } else {
            console.log('❌ usertester FCM 토큰 업데이트 실패:', result);
        }
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

updateUsertesterToken();
