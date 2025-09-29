const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFCMServerKey() {
    try {
        console.log('🔑 FCM 서버 키 테스트...');
        console.log('');
        
        // FCM 서버 키들
        const serverKeys = [
            'BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I',
            'AAAA8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I',
            'AIzaSyA_QUO8OYxY4MQye61DAvc6IqUMBb9tWIg'
        ];
        
        const fcmToken = 'dKmXRTzDSJGCaYHEZEproh:APA91bH6_U1_jFSUoeh8afkLmCLLJzWL3dj9MIOzAaeRgIkh2XSE9NCuvQUthqS1Z9jvTaHxFpkJ5k1qw4ixOctEgBsByvfrLtpLMXxztL-36Jn0uBh-QeY';
        
        for (let i = 0; i < serverKeys.length; i++) {
            const serverKey = serverKeys[i];
            console.log(`\n${i + 1}️⃣ 서버 키 테스트: ${serverKey.substring(0, 20)}...`);
            
            try {
                const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `key=${serverKey}`
                    },
                    body: JSON.stringify({
                        to: fcmToken,
                        notification: {
                            title: 'FCM 서버 키 테스트',
                            body: `서버 키 ${i + 1}번 테스트`
                        },
                        data: {
                            test: 'true'
                        }
                    })
                });
                
                const result = await response.text();
                console.log(`   상태: ${response.status}`);
                console.log(`   응답: ${result.substring(0, 100)}...`);
                
                if (response.status === 200) {
                    console.log('   ✅ 성공!');
                    break;
                } else {
                    console.log('   ❌ 실패');
                }
            } catch (error) {
                console.log(`   ❌ 오류: ${error.message}`);
            }
        }
        
        console.log('\n🔍 Firebase 콘솔에서 서버 키 확인 방법:');
        console.log('1. Firebase Console → 프로젝트 설정');
        console.log('2. 클라우드 메시징 탭');
        console.log('3. 서버 키 복사');
        console.log('');
        console.log('📱 또는 Firebase Admin SDK 사용:');
        console.log('- 서비스 계정 키 파일 다운로드');
        console.log('- OAuth 2.0 인증 사용');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

testFCMServerKey();
