const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fixBackendFCM() {
    try {
        console.log('🔧 백엔드 FCM 설정 문제 해결 방법...');
        console.log('');
        console.log('❌ 현재 문제:');
        console.log('- 백엔드에서 FCM API 호출이 실패하고 있음');
        console.log('- 서버 로그에서 404 오류가 발생');
        console.log('- 환경변수로 설정한 FCM 서버 키가 제대로 로드되지 않음');
        console.log('');
        console.log('✅ 해결 방법:');
        console.log('');
        console.log('1️⃣ 서버에서 환경변수 확인:');
        console.log('   ssh -i shinhan.pem ec2-user@13.239.18.67');
        console.log('   echo $FCM_SERVER_KEY');
        console.log('');
        console.log('2️⃣ 환경변수가 설정되지 않았다면:');
        console.log('   export FCM_SERVER_KEY="BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I"');
        console.log('   echo $FCM_SERVER_KEY');
        console.log('');
        console.log('3️⃣ 기존 서버 프로세스 종료:');
        console.log('   pkill -f "java.*chatbot"');
        console.log('   sudo fuser -k 8080/tcp');
        console.log('');
        console.log('4️⃣ 환경변수와 함께 서버 재시작:');
        console.log('   cd /home/ec2-user');
        console.log('   FCM_SERVER_KEY="BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I" nohup java -jar chatbot-0.0.1-SNAPSHOT.jar > logs/chatbot.log 2>&1 &');
        console.log('');
        console.log('5️⃣ 서버 상태 확인:');
        console.log('   ps aux | grep java');
        console.log('   tail -f logs/chatbot.log');
        console.log('');
        console.log('6️⃣ 알림 테스트:');
        console.log('   node test-usertester-notification.js');
        console.log('');
        console.log('🔑 FCM 서버 키:');
        console.log('   BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I');
        console.log('');
        console.log('🚀 이제 서버에서 환경변수를 설정하고 재시작해보세요!');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

fixBackendFCM();
