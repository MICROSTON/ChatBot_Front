// FCM 직접 전송 테스트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// FCM 서버 키
const FCM_SERVER_KEY = 'BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I';

// 실제 FCM 토큰 (최신)
const FCM_TOKEN = 'feHfMaPYRdWSXGUfK-9wC6:APA91bGRo5KILjuFdDtpS5HF6j9jVhXKhC6ss-B8v-rlLC_iqh91-Mot3HOatt4LemGjSsgRs-iAmSvzBzrD5IwMRK5m6ZuSu2vN-JRpYFZGjFLVi8SbZ4Q';

async function sendFCMDirect() {
    try {
        console.log('🔥 FCM 직접 전송 테스트 시작...\n');
        
        const fcmUrl = 'https://fcm.googleapis.com/v1/projects/shinhanchatbot-b582b/messages:send';
        const message = {
            to: FCM_TOKEN,
            notification: {
                title: '🔥 FCM 직접 테스트',
                body: 'FCM에서 직접 보낸 알림입니다! APK가 열려야 합니다.',
                sound: 'default',
                icon: 'ic_notification'
            },
            data: {
                ageGroupNum: '1',
                test: 'true',
                timestamp: new Date().toISOString()
            },
            priority: 'high'
        };
        
        console.log('📤 FCM 메시지 전송 중...');
        console.log('토큰:', FCM_TOKEN.substring(0, 30) + '...');
        console.log('메시지:', JSON.stringify(message, null, 2));
        
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
            console.log('오류 코드:', response.status);
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
