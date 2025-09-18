import { CONFIG } from '../../config/config';
import { welfareData } from '../../config/dummyWelfareData';

class WelfareService {
  constructor() {
    this.baseURL = CONFIG.apiUrl;
    this.timeout = CONFIG.timeout;
  }

  //간단한 API 응답 변환 
  transformApiResponse(rawData) {
    if (!rawData) return [];
    
    if (!Array.isArray(rawData)) {
      rawData = [rawData];
    }

    //백엔드가 DB 스키마와 동일하게 응답한다고 가정
    return rawData.map(item => ({
      benefitCode: item.benefitCode,
      benefitName: item.benefitName,
      benefitContext: item.benefitContext,
      benefitStartDate: item.benefitStartDate,
      benefitEndDate: item.benefitEndDate,
      benefitUrl: item.benefitUrl,
      benefitCondition: item.benefitCondition,
      ageGroupNum: item.ageGroupNum,
      benefitCategoryNum: item.benefitCategoryNum,
      localNum: item.localNum,
    }));
  }

  // 복지 목록 검색 - /shinhan/bokji/search
  async searchWelfareList(searchParams = {}) {
    try {
      if (CONFIG && CONFIG.useDummyData === true) {
        console.log('더미 데이터로 복지 검색');
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          success: true,
          data: [
            {
              benefitCode: 'B001',
              benefitName: '청년 구직활동지원금',
              benefitCategory: '취업지원',
              description: '청년들의 구직활동을 지원하는 프로그램입니다.',
              eligibility: '만 18-34세 청년',
              applicationMethod: '온라인 신청',
              contactInfo: '02-1234-5678'
            },
            {
              benefitCode: 'B002',
              benefitName: '저소득층 의료비 지원',
              benefitCategory: '의료지원',
              description: '저소득층의 의료비를 지원하는 프로그램입니다.',
              eligibility: '기초생활수급자',
              applicationMethod: '구청 방문 신청',
              contactInfo: '02-2345-6789'
            }
          ]
        };
      } else {
        // 백엔드 API 구조에 맞게 파라미터 변환
        const params = new URLSearchParams();
        if (searchParams.ageGroupNum) {
          params.append('ageGroupNum', searchParams.ageGroupNum);
        }
        if (searchParams.benefitCategoryNum) {
          params.append('categoryNum', searchParams.benefitCategoryNum);
        }
        // 페이지네이션 파라미터 추가
        if (searchParams.page !== undefined) {
          params.append('page', searchParams.page);
        }
        if (searchParams.size !== undefined) {
          params.append('size', searchParams.size);
        }

        const url = `${this.baseURL}/shinhan/bokji/search${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('복지 검색 요청 URL:', url);

        // React Native에서 지원하는 방식으로 타임아웃 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log('복지 검색 응답:', rawData);
        
        const transformedData = this.transformApiResponse(rawData);

        return {
          success: true,
          data: transformedData,
          total: transformedData.length
        };
      }
    } catch (error) {
      console.error('WelfareService.searchWelfareList error:', error);
      return {
        success: false,
        error: error.message || '복지 검색 중 오류가 발생했습니다.',
        data: []
      };
    }
  }

  // 복지 연령 검색 - /shinhan/bokji/age-search
  async searchWelfareByAge(ageGroupNum) {
    try {
      if (CONFIG && CONFIG.useDummyData === true) {
        console.log('더미 데이터로 연령대별 검색');
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          success: true,
          data: [
            {
              benefitCode: 'B001',
              benefitName: '청년 구직활동지원금',
              benefitCategory: '취업지원',
              description: '청년들의 구직활동을 지원하는 프로그램입니다.',
              eligibility: '만 18-34세 청년',
              applicationMethod: '온라인 신청',
              contactInfo: '02-1234-5678'
            }
          ]
        };
      } else {
        const url = `${this.baseURL}/shinhan/bokji/age-search?ageGroupNum=${ageGroupNum}`;
        console.log('연령대별 검색 요청 URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('연령대별 검색 응답:', rawData);
        
        const transformedData = this.transformApiResponse(rawData);
        
        return {
          success: true,
          data: transformedData
        };
      }
    } catch (error) {
      console.error('WelfareService.searchWelfareByAge error:', error);
      return {
        success: false,
        error: error.message || '연령대별 검색 중 오류가 발생했습니다.',
        data: []
      };
    }
  }

  // 복지 혜택 상세 정보
  async getWelfareDetail(benefitCode) {
    try {
      if (CONFIG && CONFIG.useDummyData === true) {
        console.log('더미 데이터로 복지 상세 조회');
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          success: true,
          data: {
            benefitCode: benefitCode,
            benefitName: '청년 구직활동지원금',
            benefitCategory: '취업지원',
            description: '청년들의 구직활동을 지원하는 프로그램입니다.',
            eligibility: '만 18-34세 청년',
            applicationMethod: '온라인 신청',
            contactInfo: '02-1234-5678',
            supportAmount: '월 50만원',
            applicationPeriod: '상시 신청',
            requiredDocuments: ['신분증', '소득증빙서류', '구직활동증명서']
          }
        };
      } else {
        const url = `${this.baseURL}/shinhan/bokji/detail/${benefitCode}`;
        console.log('복지 상세 조회 요청 URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('복지 상세 응답:', rawData);
        
        return {
          success: true,
          data: rawData
        };
      }
    } catch (error) {
      console.error('WelfareService.getWelfareDetail error:', error);
      return {
        success: false,
        error: error.message || '복지 상세 조회 중 오류가 발생했습니다.',
        data: null
      };
    }
  }

  // 더미 데이터 필터링 (목록 검색)
  filterDummyData(searchParams) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredData = [...welfareData];

        if (searchParams.ageGroupNum) {
          filteredData = filteredData.filter(item => 
            item.ageGroupNum === parseInt(searchParams.ageGroupNum)
          );
        }

        if (searchParams.benefitCategoryNum) {
          filteredData = filteredData.filter(item => 
            item.benefitCategoryNum === parseInt(searchParams.benefitCategoryNum)
          );
        }

        if (searchParams.keyword) {
          const keyword = searchParams.keyword.toLowerCase();
          filteredData = filteredData.filter(item => 
            item.benefitName.toLowerCase().includes(keyword) ||
            item.benefitContext.toLowerCase().includes(keyword)
          );
        }

        resolve({
          success: true,
          data: filteredData,
          total: filteredData.length
        });
      }, 500);
    });
  }

  // 더미 데이터 연령별 필터링
  filterByAge(ageGroupNum) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredData = welfareData.filter(item => 
          item.ageGroupNum === parseInt(ageGroupNum)
        );

        resolve({
          success: true,
          data: filteredData,
          total: filteredData.length
        });
      }, 500);
    });
  }
}

export default new WelfareService();