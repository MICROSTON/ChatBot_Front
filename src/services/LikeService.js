import { CONFIG } from '../../config/config';

class LikeService {
  constructor() {
    this.baseURL = CONFIG?.apiUrl || 'http://localhost:8080';
    this.timeout = CONFIG?.timeout || 10000;
  }

  //사용자 좋아요 목록 조회 - GET /likes/{userId}
  async getUserLikes(userId) {
    try {
      // 더미데이터 모드 완전 비활성화
      if (!this.baseURL) {
        console.log('API URL이 설정되지 않았습니다.');
        return {
          success: false,
          data: [],
          error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
        };
      }

      // React Native에서 지원하는 방식으로 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/likes/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // 인증 필요시
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      console.log('좋아요 목록 응답:', rawData);
      
      //API 응답 데이터 변환 (새로운 형식에 맞게)
      const likesList = (rawData.data || []).map(item => ({
        benefitCode: item.benefitCode || item.benefit_code,
        benefitName: item.benefitName || item.benefit_name,
        benefitContext: item.benefitContext || item.benefit_context,
        benefitStartDate: item.benefitStartDate || item.benefit_start_date,
        benefitEndDate: item.benefitEndDate || item.benefit_end_date,
        benefitUrl: item.benefitUrl || item.benefit_url,
        benefitCondition: item.benefitCondition || item.benefit_condition,
        ageGroupNum: item.ageGroupNum || item.age_group_num,
        benefitCategoryNum: item.benefitCategoryNum || item.benefit_category_num,
        localNum: item.localNum || item.local_num,
        // 좋아요 관련 정보
        likedAt: item.likedAt || item.liked_at,
        userNum: item.userNum || item.user_num,
      }));

      return {
        success: rawData.success,
        data: likesList
      };
    } catch (error) {
      console.error('사용자 좋아요 목록 조회 실패:', error);
      
      // AbortError인 경우 오류 반환
      if (error.name === 'AbortError') {
        console.log('타임아웃으로 인해 오류 반환');
        return {
          success: false,
          data: [],
          error: '요청 시간이 초과되었습니다.'
        };
      }
      
      return {
        success: false,
        data: [],
        error: error.message || '좋아요 목록 조회 중 오류가 발생했습니다.'
      };
    }
  }

  //좋아요 추가 - POST /likes/add
  async addLike(userId, benefitCode) {
    try {
      console.log('좋아요 추가 요청:', { userId, benefitCode, baseURL: this.baseURL });
      
      // 더미데이터 모드 완전 비활성화
      if (!this.baseURL) {
        console.log('API URL이 설정되지 않았습니다.');
        return {
          success: false,
          error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
        };
      }

      // React Native에서 지원하는 방식으로 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const requestBody = {
        id: userId,  // 백엔드 DTO에서 기대하는 필드명 (사용자 ID)
        benefitCode: parseInt(benefitCode) || benefitCode  // Long 타입으로 변환
      };
      
      console.log('요청 본문:', requestBody);

      const response = await fetch(`${this.baseURL}/likes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('에러 응답 본문:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json(); // 백엔드에서 JSON 반환
      console.log('좋아요 추가 응답:', result);
      
      return {
        success: result.success,
        message: result.message || '좋아요가 추가되었습니다.'
      };
    } catch (error) {
      console.error('좋아요 추가 실패:', error);
      
      // AbortError인 경우 오류로 처리
      if (error.name === 'AbortError') {
        console.log('타임아웃으로 인해 오류 반환');
        return {
          success: false,
          error: '요청 시간이 초과되었습니다.'
        };
      }
      
      return {
        success: false,
        error: error.message || '좋아요 추가 중 오류가 발생했습니다.'
      };
    }
  }

  //좋아요 삭제 - DELETE /likes/remove  
  async removeLike(userId, benefitCode) {
    try {
      // 더미데이터 모드 완전 비활성화
      if (!this.baseURL) {
        console.log('API URL이 설정되지 않았습니다.');
        return {
          success: false,
          error: '서버 연결에 실패했습니다. 네트워크를 확인해주세요.'
        };
      }

      // React Native에서 지원하는 방식으로 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/likes/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,  // 백엔드 DTO에서 기대하는 필드명
          benefitCode: parseInt(benefitCode) || benefitCode  // Long 타입으로 변환
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // 백엔드에서 JSON 반환
      console.log('좋아요 삭제 응답:', result);
      
      return {
        success: result.success,
        message: result.message || '좋아요가 취소되었습니다.'
      };
    } catch (error) {
      console.error('좋아요 삭제 실패:', error);
      
      // AbortError인 경우 오류로 처리
      if (error.name === 'AbortError') {
        console.log('타임아웃으로 인해 오류 반환');
        return {
          success: false,
          error: '요청 시간이 초과되었습니다.'
        };
      }
      
      return {
        success: false,
        error: error.message || '좋아요 삭제 중 오류가 발생했습니다.'
      };
    }
  }
}

export default new LikeService();