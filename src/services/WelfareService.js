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

  // 복지 목록 검색 - /shinhan/bokji/list-search
  async searchWelfareList(searchParams = {}) {
    try {
      if (CONFIG.useDummyData) {
        return this.filterDummyData(searchParams);
      }

      const queryParams = new URLSearchParams(searchParams).toString();
      const url = `${this.baseURL}/shinhan/bokji/list-search${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = this.transformApiResponse(rawData.data || rawData);

      return {
        success: true,
        data: transformedData,
        total: transformedData.length
      };
    } catch (error) {
      console.error('WelfareService.searchWelfareList error:', error);
      throw {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // 복지 연령 검색 - /shinhan/bokji/age-search
  async searchWelfareByAge(ageGroupNum) {
    try {
      if (CONFIG.useDummyData) {
        return this.filterByAge(ageGroupNum);
      }

      const response = await fetch(`${this.baseURL}/shinhan/bokji/age-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ageGroupNum: ageGroupNum
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = this.transformApiResponse(rawData.data || rawData);

      return {
        success: true,
        data: transformedData,
        total: transformedData.length
      };
    } catch (error) {
      console.error('WelfareService.searchWelfareByAge error:', error);
      throw {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // 복지 혜택 상세 정보
  async getWelfareDetail(benefitCode) {
    try {
      if (CONFIG.useDummyData) {
        const item = welfareData.find(w => w.benefitCode === benefitCode);
        return item ? { 
          success: true, 
          data: item 
        } : { 
          success: false, 
          data: null,
          error: '해당 복지 혜택을 찾을 수 없습니다.'
        };
      }

      const response = await fetch(`${this.baseURL}/shinhan/bokji/detail/${benefitCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = this.transformApiResponse([rawData.data || rawData]);

      return {
        success: true,
        data: transformedData[0] || null
      };
    } catch (error) {
      console.error('WelfareService.getWelfareDetail error:', error);
      throw {
        success: false,
        error: error.message,
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