import { CONFIG } from '../../config/config';

class LikeService {
  constructor() {
    this.baseURL = CONFIG.apiUrl;
    this.timeout = CONFIG.timeout;
  }

  //사용자 좋아요 목록 조회 - GET /likes/{userId}
  async getUserLikes(userId) {
    try {
      if (CONFIG.useDummyData) {
        return this.getDummyLikes(userId);
      }

      const response = await fetch(`${this.baseURL}/likes/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // 인증 필요시
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      
      //API 응답 데이터 변환
      const likesList = (rawData.data || rawData.likes || rawData).map(item => ({
        benefitCode: item.benefitCode || item.benefit_code,
        benefitName: item.benefitName || item.benefit_name,
        benefitContext: item.benefitContext || item.benefit_context,
        ageGroupNum: item.ageGroupNum || item.age_group_num,
        benefitCategoryNum: item.benefitCategoryNum || item.benefit_category_num,
        // 좋아요 관련 정보
        likedAt: item.likedAt || item.liked_at,
        userNum: item.userNum || item.user_num,
      }));

      return {
        success: true,
        data: likesList
      };
    } catch (error) {
      console.error('사용자 좋아요 목록 조회 실패:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  //좋아요 추가 - POST /likes/add
  async addLike(userId, benefitCode) {
    try {
      if (CONFIG.useDummyData) {
        return this.addDummyLike(userId, benefitCode);
      }

      const response = await fetch(`${this.baseURL}/likes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userNum: userId,
          benefitCode: benefitCode
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: result.message || '좋아요가 추가되었습니다.'
      };
    } catch (error) {
      console.error('좋아요 추가 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  //좋아요 삭제 - DELETE /likes/delete  
  async removeLike(userId, benefitCode) {
    try {
      if (CONFIG.useDummyData) {
        return this.removeDummyLike(userId, benefitCode);
      }

      const response = await fetch(`${this.baseURL}/likes/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userNum: userId,
          benefitCode: benefitCode
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: result.message || '좋아요가 취소되었습니다.'
      };
    } catch (error) {
      console.error('좋아요 삭제 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 더미 데이터 함수들 (개발/테스트용)
  getDummyLikes(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 임시로 빈 배열 반환 (실제로는 더미 데이터 사용)
        resolve({
          success: true,
          data: []
        });
      }, 300);
    });
  }

  addDummyLike(userId, benefitCode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`더미: 사용자 ${userId}가 복지 ${benefitCode}를 좋아요함`);
        resolve({
          success: true,
          message: '좋아요가 추가되었습니다.'
        });
      }, 300);
    });
  }

  removeDummyLike(userId, benefitCode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`더미: 사용자 ${userId}가 복지 ${benefitCode} 좋아요 취소함`);
        resolve({
          success: true,
          message: '좋아요가 취소되었습니다.'
        });
      }, 300);
    });
  }
}

export default new LikeService();