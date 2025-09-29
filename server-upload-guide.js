const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function serverUploadGuide() {
    try {
        console.log('🚀 서버에 직접 업로드하는 방법...');
        console.log('');
        console.log('📋 필요한 파일:');
        console.log('   - chatbot-0.0.1-SNAPSHOT.jar (백엔드 JAR 파일)');
        console.log('   - shinhan.pem (SSH 키 파일)');
        console.log('');
        console.log('🔧 업로드 방법:');
        console.log('');
        console.log('1️⃣ 백엔드 JAR 파일 빌드:');
        console.log('   cd ChatBot_BackEnd/chatbot');
        console.log('   ./gradlew clean build -x test');
        console.log('');
        console.log('2️⃣ JAR 파일을 서버에 업로드:');
        console.log('   scp -i shinhan.pem build/libs/chatbot-0.0.1-SNAPSHOT.jar ec2-user@13.239.18.67:/home/ec2-user/');
        console.log('');
        console.log('3️⃣ 서버에 접속:');
        console.log('   ssh -i shinhan.pem ec2-user@13.239.18.67');
        console.log('');
        console.log('4️⃣ 서버에서 기존 프로세스 종료:');
        console.log('   pkill -f "java.*chatbot"');
        console.log('   sudo fuser -k 8080/tcp');
        console.log('');
        console.log('5️⃣ 환경변수와 함께 서버 재시작:');
        console.log('   cd /home/ec2-user');
        console.log('   FCM_SERVER_KEY="BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I" nohup java -jar chatbot-0.0.1-SNAPSHOT.jar > logs/chatbot.log 2>&1 &');
        console.log('');
        console.log('6️⃣ 서버 상태 확인:');
        console.log('   ps aux | grep java');
        console.log('   tail -f logs/chatbot.log');
        console.log('');
        console.log('🔑 FCM 서버 키:');
        console.log('   BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I');
        console.log('');
        console.log('📱 서버 정보:');
        console.log('   - 서버 주소: 13.239.18.67');
        console.log('   - 사용자: ec2-user');
        console.log('   - SSH 키: shinhan.pem');
        console.log('   - 포트: 8080');
        console.log('');
        console.log('✅ 완료 후 알림 테스트:');
        console.log('   node test-usertester-notification.js');
        console.log('');
        console.log('🚀 이제 서버에 직접 업로드해보세요!');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

serverUploadGuide();
