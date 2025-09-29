// FCM 직접 전송 테스트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// FCM 서버 키
const FCM_SERVER_KEY = 'BLLMQ_F0xzqVF_2gbrsYsXY16dOSmCLKjvsDe8baFQJZ5_jg0nGLwrxLFsmK6iRppIkNO9puFK6IetRbFKuW-5I';

// 실제 FCM 토큰
const FCM_TOKEN = 'fqin2GAQSX20ogTXdx1gwm:APA91bGLMJMHcBedTYomSp869GKXXyll9YThTztKMQ0aGu4X1Z01FGjFvdC0Un1M84VwwfNAbpqvvKQNVXVEQO--4xUhE8AeIfGmbEQeAvLXT0C5mBZACpg';

async function sendFCMDirect() {
    try {
        console.log('🔥 FCM 직접 전송 시작...\n');
        
        const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
        const message = {
            to: FCM_TOKEN,
            notification: {
                title: '🔥 FCM 직접 테스트',
                body: 'FCM에서 직접 보낸 알림입니다! APK가 열려야 합니다.',
                sound: 'default'
            },
            data: {
                ageGroupNum: '1',
                test: 'true',
                timestamp: new Date().toISOString()
            }
        };
        
        console.log('📤 FCM 메시지 전송 중...');
        console.log('토큰:', FCM_TOKEN.substring(0, 20) + '...');
        console.log('메시지:', message);
        
        const response = await fetch(fcmUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`
            },
            body: JSON.stringify(message),
        });
        
        const result = await response.text();
        console.log('\n📊 FCM 응답:');
        console.log('상태:', response.status);
        console.log('응답:', result);
        
        if (response.ok) {
            console.log('\n✅ FCM 직접 전송 성공!');
            console.log('📱 APK에서 알림을 확인해보세요!');
        } else {
            console.log('\n❌ FCM 직접 전송 실패');
        }
        
    } catch (error) {
        console.error('❌ FCM 전송 중 오류:', error);
    }
}

// 메인 실행
if (require.main === module) {
    sendFCMDirect().catch(console.error);
}

module.exports = { sendFCMDirect };
