// 다양한 연령대 알림 테스트 스크립트
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 연령대별 알림 전송 테스트
async function testAgeGroupNotification(ageGroupNum, benefitName) {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log(`📤 연령대 ${ageGroupNum} 알림 전송 중... (복지: ${benefitName})`);
        
        const response = await fetch(`${API_BASE}/notification/test-push?ageGroupNum=${ageGroupNum}&benefitName=${benefitName}`, {
            method: 'POST',
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ 연령대 ${ageGroupNum} 알림 전송 성공:`, result);
            return true;
        } else {
            const errorText = await response.text();
            console.log(`❌ 연령대 ${ageGroupNum} 알림 전송 실패:`, errorText);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 연령대 ${ageGroupNum} 테스트 중 오류:`, error);
        return false;
    }
}

// 모든 연령대에 대한 알림 테스트
async function testAllAgeGroups() {
    console.log('🎯 모든 연령대 알림 테스트 시작\n');
    
    const ageGroups = [
        { num: 1, name: '유아복지' },
        { num: 2, name: '청소년복지' },
        { num: 3, name: '청년복지' },
        { num: 4, name: '중장년복지' },
        { num: 5, name: '노인복지' },
        { num: 6, name: '장애인복지' },
        { num: 7, name: '기타복지' }
    ];
    
    const results = [];
    
    for (const ageGroup of ageGroups) {
        console.log('='.repeat(50));
        console.log(`🧪 연령대 ${ageGroup.num} 테스트: ${ageGroup.name}`);
        console.log('='.repeat(50));
        
        const success = await testAgeGroupNotification(ageGroup.num, ageGroup.name);
        results.push({ ageGroup: ageGroup.num, name: ageGroup.name, success });
        
        // 각 테스트 사이에 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 결과 요약
    console.log('\n📊 테스트 결과 요약:');
    console.log('='.repeat(50));
    
    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} 연령대 ${result.ageGroup}: ${result.name}`);
    });
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n📈 성공률: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
    
    return results;
}

// 특정 연령대만 테스트
async function testSpecificAgeGroups(ageGroupNums) {
    console.log(`🎯 특정 연령대 알림 테스트: ${ageGroupNums.join(', ')}\n`);
    
    const ageGroupNames = {
        1: '유아복지',
        2: '청소년복지', 
        3: '청년복지',
        4: '중장년복지',
        5: '노인복지',
        6: '장애인복지',
        7: '기타복지'
    };
    
    const results = [];
    
    for (const ageGroupNum of ageGroupNums) {
        const benefitName = ageGroupNames[ageGroupNum] || `연령대${ageGroupNum}복지`;
        
        console.log('='.repeat(50));
        console.log(`🧪 연령대 ${ageGroupNum} 테스트: ${benefitName}`);
        console.log('='.repeat(50));
        
        const success = await testAgeGroupNotification(ageGroupNum, benefitName);
        results.push({ ageGroup: ageGroupNum, name: benefitName, success });
        
        // 각 테스트 사이에 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
}

// 등록된 사용자들의 연령대 설정 확인
async function checkUserAgeGroups() {
    const API_BASE = 'http://13.239.18.67:8080';
    
    try {
        console.log('👥 등록된 사용자들의 연령대 설정 확인...\n');
        
        const response = await fetch(`${API_BASE}/notification/debug/all`);
        
        if (response.ok) {
            const users = await response.json();
            
            console.log('📋 사용자별 연령대 설정:');
            console.log('='.repeat(50));
            
            users.forEach((user, index) => {
                console.log(`${index + 1}. 사용자: ${user.userId}`);
                console.log(`   토큰: ${user.pushToken.substring(0, 20)}...`);
                console.log(`   연령대: ${user.ageGroups.join(', ')}`);
                console.log(`   활성화: ${user.isActive ? '✅' : '❌'}`);
                console.log('');
            });
            
            return users;
        } else {
            console.log('❌ 사용자 정보 조회 실패');
            return [];
        }
        
    } catch (error) {
        console.error('❌ 사용자 정보 조회 중 오류:', error);
        return [];
    }
}

// 메인 실행 함수
async function main() {
    console.log('🎯 연령대별 알림 테스트 시작\n');
    
    // 1. 등록된 사용자 확인
    await checkUserAgeGroups();
    
    // 2. 명령행 인수 확인
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
        // 특정 연령대만 테스트
        const ageGroupNums = args.map(arg => parseInt(arg)).filter(num => !isNaN(num) && num >= 1 && num <= 7);
        
        if (ageGroupNums.length > 0) {
            console.log(`🎯 지정된 연령대 테스트: ${ageGroupNums.join(', ')}\n`);
            await testSpecificAgeGroups(ageGroupNums);
        } else {
            console.log('❌ 유효하지 않은 연령대 번호입니다. (1-7 사이의 숫자를 입력하세요)');
            console.log('사용법: node test-age-groups.js [연령대번호들]');
            console.log('예시: node test-age-groups.js 1 3 5');
        }
    } else {
        // 모든 연령대 테스트
        console.log('🎯 모든 연령대 테스트를 시작합니다...\n');
        await testAllAgeGroups();
    }
    
    console.log('\n✅ 연령대별 알림 테스트 완료!');
    console.log('📱 APK에서 각 연령대별 알림을 확인해보세요.');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testAgeGroupNotification,
    testAllAgeGroups,
    testSpecificAgeGroups,
    checkUserAgeGroups
};
