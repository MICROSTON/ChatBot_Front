// src/services/chatService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // 👉 실제 배포 주소로 교체해야 함

/**
 * 선택된 연령대와 복지 카테고리에 맞는 복지 항목 리스트를 서버에서 조회
 * @param {number} ageGroupNum - 연령대 코드
 * @param {number} categoryNum - 복지 카테고리 코드
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
    return response.data;
  } catch (error) {
    console.error('복지 항목 조회 실패:', error);
    return [];
  }
}

/**
 * 검색어(예: "임산부")로 복지 항목을 검색
 * @param {string} keyword - 검색어
 * @returns {Promise<Array>} - 연관 복지 항목 리스트
 */
export async function searchBenefits(keyword) {
  try {
    const response = await axios.get(`${BASE_URL}/benefits/search`, {
      params: { keyword },
    });
    return response.data; // 서버에서 JSON 배열로 응답
  } catch (error) {
    console.error('복지 검색 실패:', error);
    return [];
  }
}