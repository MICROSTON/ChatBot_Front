// src/services/chatService.js
import axios from 'axios';

const BASE_URL = 'null'; // 실제 API 주소로 교체

/**
 * 선택된 연령대와 복지 카테고리에 맞는 복지 항목 리스트를 서버에서 조회
 * @param {number} ageGroupNum - 연령대 코드
 * @param {number} categoryNum - 카테고리 코드
 * @returns {Promise<Array>} - 복지 항목 리스트
 */
export async function getBenefitsByAgeAndCategory(ageGroupNum, categoryNum) {
  try {
    const response = await axios.get(`${BASE_URL}/benefits`, {
      params: {
        ageGroup: ageGroupNum,
        category: categoryNum,
      },
    });
    return response.data; // ← 서버에서 JSON 배열 형태로 응답 온다고 가정
  } catch (error) {
    console.error('복지 항목 조회 실패:', error);
    return [];
  }
}
