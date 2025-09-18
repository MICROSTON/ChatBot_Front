export const welfareData = [
  // 임산부(1) + 경제(10) - 3개
  {
    benefitCode: 1,
    benefitName: "임산부 출산지원금",
    benefitContext: "임산부에게 출산 준비를 위한 경제적 지원금을 제공합니다. 첫째아 100만원, 둘째아 이상 200만원을 지원합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/pregnancy-money",
    benefitCondition: "임신 확인서 제출 필요",
    ageGroupNum: 1,
    benefitCategoryNum: 10,
    localNum: 1
  },
  {
    benefitCode: 2,
    benefitName: "여성 창업 지원금",
    benefitContext: "여성 창업자를 위한 초기 자금 지원 프로그램입니다. 최대 3000만원까지 저금리로 대출 가능합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/women-startup",
    benefitCondition: "사업계획서 제출 필요",
    ageGroupNum: 1,
    benefitCategoryNum: 10,
    localNum: 1
  },
  {
    benefitCode: 3,
    benefitName: "임산부 생활비 지원",
    benefitContext: "저소득 임산부의 생활 안정을 위한 월 생활비를 지원합니다. 임신기간 중 월 50만원씩 지원됩니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/pregnancy-living",
    benefitCondition: "소득 기준 충족 필요",
    ageGroupNum: 1,
    benefitCategoryNum: 10,
    localNum: 1
  },

  // 임산부(1) + 의료(20) - 3개
  {
    benefitCode: 4,
    benefitName: "임산부 건강관리 지원",
    benefitContext: "임산부의 건강한 출산을 위한 정기검진 및 영양제 지원 서비스입니다. 산전검사비와 영양제를 무료로 제공합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/pregnancy-health",
    benefitCondition: "임신 확인서 제출 필요",
    ageGroupNum: 1,
    benefitCategoryNum: 20,
    localNum: 1
  },
  {
    benefitCode: 5,
    benefitName: "임산부 산전검사비 지원",
    benefitContext: "임신 중 필요한 각종 산전검사비를 지원합니다. 초음파, 혈액검사, 정밀검사 등 최대 100만원까지 지원 가능합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/pregnancy-checkup",
    benefitCondition: "임신 14주 이후부터 신청 가능",
    ageGroupNum: 1,
    benefitCategoryNum: 20,
    localNum: 1
  },
  {
    benefitCode: 6,
    benefitName: "고위험 임산부 의료비 지원",
    benefitContext: "조산, 유산 위험이 있는 고위험 임산부의 입원치료비를 지원합니다. 본인부담금의 90%까지 지원 가능합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/high-risk-pregnancy",
    benefitCondition: "의사 진단서 필요",
    ageGroupNum: 1,
    benefitCategoryNum: 20,
    localNum: 1
  },

  // 영유아(2) + 교육(40) - 3개
  {
    benefitCode: 7,
    benefitName: "영유아 보육료 지원",
    benefitContext: "만 0~5세 영유아의 어린이집 이용료를 지원하는 프로그램입니다. 소득 수준에 따라 차등 지원됩니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/childcare",
    benefitCondition: "주민등록상 거주지 확인",
    ageGroupNum: 2,
    benefitCategoryNum: 40,
    localNum: 1
  },
  {
    benefitCode: 8,
    benefitName: "유치원 교육비 지원",
    benefitContext: "만 3~5세 유아의 유치원 교육비를 지원합니다. 공립유치원은 무료, 사립유치원은 월 최대 30만원까지 지원됩니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/kindergarten",
    benefitCondition: "유치원 재원생 대상",
    ageGroupNum: 2,
    benefitCategoryNum: 40,
    localNum: 1
  },
  {
    benefitCode: 9,
    benefitName: "아이돌봄 서비스",
    benefitContext: "생후 3개월~만 12세 아동을 위한 아이돌봄 서비스입니다. 시간제 돌봄, 종일제 돌봄 등 다양한 서비스를 제공합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/childcare-service",
    benefitCondition: "맞벌이 가정 우선 지원",
    ageGroupNum: 2,
    benefitCategoryNum: 3,
    localNum: 1
  },

  // 청년(4) + 경제(10) - 3개
  {
    benefitCode: 10,
    benefitName: "청년 취업성공패키지",
    benefitContext: "만 18~34세 청년의 취업을 위한 종합 지원 프로그램입니다. 직업훈련비, 취업알선, 취업 후 정착금까지 지원합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/youth-job",
    benefitCondition: "구직등록 및 상담 필수",
    ageGroupNum: 4,
    benefitCategoryNum: 10,
    localNum: 1
  },
  {
    benefitCode: 11,
    benefitName: "청년 주거지원금",
    benefitContext: "무주택 청년을 위한 전세자금 대출 지원 프로그램입니다. 최대 2억원까지 저금리로 대출 가능합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/youth-housing",
    benefitCondition: "만 19~39세, 무주택자",
    ageGroupNum: 4,
    benefitCategoryNum: 10,
    localNum: 1
  },
  {
    benefitCode: 12,
    benefitName: "청년 내일채움공제",
    benefitContext: "중소기업 취업 청년을 위한 장기재직 장려금입니다. 2년 근무 시 최대 1800만원의 취업지원금을 받을 수 있습니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/youth-savings",
    benefitCondition: "중소기업 취업자, 만 15~34세",
    ageGroupNum: 4,
    benefitCategoryNum: 10,
    localNum: 1
  },
  // 청년(4) + 교육(40) - 3개
  {
    benefitCode: 13,
    benefitName: "청년 직업훈련 지원",
    benefitContext: "청년들의 취업 역량 강화를 위한 직업훈련 프로그램입니다. 다양한 분야의 전문 기술을 습득할 수 있습니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/youth-training",
    benefitCondition: "만 18~34세, 미취업자",
    ageGroupNum: 4,
    benefitCategoryNum: 40,
    localNum: 1
  },
  {
    benefitCode: 14,
    benefitName: "청년 해외연수 지원",
    benefitContext: "글로벌 역량 강화를 위한 청년 해외연수 프로그램입니다. 어학연수, 인턴십, 취업연수 등을 지원합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/youth-overseas",
    benefitCondition: "대학생 또는 졸업 후 2년 이내",
    ageGroupNum: 4,
    benefitCategoryNum: 40,
    localNum: 1
  },
  {
    benefitCode: 15,
    benefitName: "청년 창업교육 지원",
    benefitContext: "예비 창업자를 위한 창업교육 프로그램입니다. 사업계획 수립, 마케팅, 재무관리 등을 무료로 교육받을 수 있습니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/youth-startup-edu",
    benefitCondition: "만 18~39세, 예비창업자",
    ageGroupNum: 4,
    benefitCategoryNum: 40,
    localNum: 1
  },

  // 어르신(6) + 경제(10) - 3개
  {
    benefitCode: 16,
    benefitName: "기초연금 지급",
    benefitContext: "만 65세 이상 어르신 중 소득 하위 70%에게 매월 지급하는 연금입니다. 최대 월 32만원까지 지급됩니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/basic-pension",
    benefitCondition: "만 65세 이상, 소득·재산 기준 충족",
    ageGroupNum: 6,
    benefitCategoryNum: 10,
    localNum: 1
  },
  {
    benefitCode: 17,
    benefitName: "어르신 일자리 사업",
    benefitContext: "만 65세 이상 어르신을 위한 다양한 일자리 제공 프로그램입니다. 공익활동, 시장형 사업단 등 참여 가능합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/senior-job",
    benefitCondition: "만 65세 이상",
    ageGroupNum: 6,
    benefitCategoryNum: 10,
    localNum: 1
  },
  {
    benefitCode: 18,
    benefitName: "생계급여 지원",
    benefitContext: "기초생활보장 수급자를 위한 생계급여입니다. 최저생계비를 보장하여 기본적인 생활을 유지할 수 있도록 지원합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/basic-living",
    benefitCondition: "소득·재산 조사 후 선정",
    ageGroupNum: 6,
    benefitCategoryNum: 10,
    localNum: 1
  },

  // 어르신(6) + 의료(20) - 3개
  {
    benefitCode: 19,
    benefitName: "어르신 의료비 지원",
    benefitContext: "만 65세 이상 어르신의 의료비 부담을 덜어주는 지원 프로그램입니다. 건강검진, 치료비, 약값 등을 지원합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/senior-medical",
    benefitCondition: "만 65세 이상",
    ageGroupNum: 6,
    benefitCategoryNum: 20,
    localNum: 1
  },
  {
    benefitCode: 20,
    benefitName: "노인장기요양보험",
    benefitContext: "일상생활이 어려운 노인분들을 위한 장기요양 서비스입니다. 방문요양, 주야간보호, 시설급여 등을 제공합니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/long-term-care",
    benefitCondition: "장기요양등급 인정자",
    ageGroupNum: 6,
    benefitCategoryNum: 20,
    localNum: 1
  },
  {
    benefitCode: 21,
    benefitName: "치매검진 지원",
    benefitContext: "만 60세 이상을 대상으로 치매 조기발견을 위한 검진비를 지원합니다. 정밀검진까지 무료로 받을 수 있습니다.",
    benefitStartDate: "2024-01-01",
    benefitEndDate: "2024-12-31",
    benefitUrl: "https://example.com/dementia-checkup",
    benefitCondition: "만 60세 이상",
    ageGroupNum: 6,
    benefitCategoryNum: 20,
    localNum: 1
  }
];