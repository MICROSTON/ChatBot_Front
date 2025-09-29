const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fixFCM404Error() {
    try {
        console.log('🔧 FCM 404 오류 해결 방법...');
        console.log('');
        console.log('❌ 현재 문제:');
        console.log('- FCM Legacy API에서 404 Not Found 오류');
        console.log('- FCM 서버 키가 유효하지 않거나 만료됨');
        console.log('- Firebase 프로젝트 설정 문제');
        console.log('');
        console.log('✅ 해결 방법:');
        console.log('');
        console.log('1️⃣ Firebase 콘솔에서 서버 키 확인:');
        console.log('   - Firebase 콘솔 → 프로젝트 설정 → 클라우드 메시징');
        console.log('   - "서버 키" 섹션에서 현재 키 확인');
        console.log('   - 키가 비어있거나 "키 없음"으로 표시되면 새로 생성');
        console.log('');
        console.log('2️⃣ 새로운 서버 키 생성:');
        console.log('   - Firebase 콘솔 → 프로젝트 설정 → 클라우드 메시징');
        console.log('   - "서버 키" 섹션에서 "새 키 생성" 클릭');
        console.log('   - 새로운 서버 키를 복사');
        console.log('');
        console.log('3️⃣ 현재 사용 중인 서버 키:');
        console.log('   BBNV8ohv5GbC4huWJFMipmrH-hIceEaAE4HUo42mp0oDwlk_jVeYzcw76scHbk-uam6DgdQCgTe6MqcitlZ3f9I');
        console.log('');
        console.log('4️⃣ 새로운 서버 키를 application-prod.properties에 업데이트:');
        console.log('   - fcm.server.key=새로운_서버_키');
        console.log('');
        console.log('5️⃣ 백엔드 재빌드 및 재시작:');
        console.log('   - ./gradlew clean build -x test');
        console.log('   - 서버 재시작');
        console.log('');
        console.log('🚀 빠른 해결책:');
        console.log('');
        console.log('Firebase 콘솔에서 서버 키를 확인하고 알려주세요!');
        console.log('새로운 서버 키를 받으면 바로 업데이트하겠습니다.');
        console.log('');
        console.log('🔍 추가 확인사항:');
        console.log('- Firebase 프로젝트가 활성화되어 있는지 확인');
        console.log('- 클라우드 메시징이 활성화되어 있는지 확인');
        console.log('- 프로젝트 ID가 올바른지 확인: shinhanchatbot-b582b');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

fixFCM404Error();
