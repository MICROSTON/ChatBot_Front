// src/config/dummyData.js

export const welfareData = [
  {
    Benefit_Code: 'prego-econ-1',
    AgeGroup_num: 1, // 임산부 복지
    BenefitCategory_num: 1, // 경제
    Benefit_name: '임산부 교통비 지원',
    Benefit_content: '임신부를 대상으로 대중교통 요금을 전액 또는 일부 면제해 드립니다. 신청방법: ○○○ 기관 방문',
    Benefit_condition: '임신부 대상',
    Benefit_url: 'http://example.com/transport',
    Benefit_start_date: '2025-01-01',
    Benefit_end_date: '2025-12-31'
  },
  {
    Benefit_Code: 'prego-econ-2',
    AgeGroup_num: 1,
    BenefitCategory_num: 1,
    Benefit_name: '산후조리비 지원',
    Benefit_content: '출산 직후 ~ 6개월 이내에 발생한 산후조리비용을 최대 100만원까지 지원해 드립니다.',
    Benefit_condition: '출산 후 여성',
    Benefit_url: 'http://example.com/care',
    Benefit_start_date: '2025-01-01',
    Benefit_end_date: '2025-12-31'
  },
  {
    Benefit_Code: 'prego-med-1',
    AgeGroup_num: 1,
    BenefitCategory_num: 2, // 의료
    Benefit_name: '임산부 건강검진 지원',
    Benefit_content: '국가에서 지원하는 임신 주기별 4회의 건강검진 비용을 전액 지원해 드립니다.',
    Benefit_condition: '임신 중 여성',
    Benefit_url: 'http://example.com/checkup',
    Benefit_start_date: '2025-01-01',
    Benefit_end_date: '2025-12-31'
  }
];

// 추가: 연령대 및 카테고리 선택 시 label 기반 출력용 매핑 배열도 함께 구성

export const ageGroups = [
  { AgeGroup_num: 1, label: '임산부 복지' },
  { AgeGroup_num: 2, label: '영유아 복지' },
  { AgeGroup_num: 3, label: '청소년 복지' },
  { AgeGroup_num: 4, label: '청년 복지' },
  { AgeGroup_num: 5, label: '중장년 복지' },
  { AgeGroup_num: 6, label: '어르신 복지' },
  { AgeGroup_num: 7, label: '장애인 복지' },
];

export const benefitCategories = [
  { BenefitCategory_num: 1, label: '경제' },
  { BenefitCategory_num: 2, label: '의료' },
  { BenefitCategory_num: 3, label: '교육' },
  { BenefitCategory_num: 4, label: '문화 시설' },
  { BenefitCategory_num: 5, label: '기타' },
];
