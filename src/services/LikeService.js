// src/services/LikeService.js
import axios from 'axios';

const BASE_URL = 'null'; // ⚠ 실제 API 주소로 변경 필요

// 좋아요 목록 조회
export async function getFavorites(userId) {
  try {
    const res = await axios.get(`${BASE_URL}/likes/${userId}`);
    return res.data;
  } catch (err) {
    console.error('좋아요 목록 불러오기 실패:', err);
    return [];
  }
}

// 좋아요 추가
export async function addFavorite(userId, benefitCode) {
  try {
    await axios.post(`${BASE_URL}/likes/add`, {
      userId,
      benefitCode,
    });
  } catch (err) {
    console.error('좋아요 등록 실패:', err);
  }
}

// 좋아요 삭제
export async function removeFavorite(userId, benefitCode) {
  try {
    await axios.delete(`${BASE_URL}/likes/delete`, {
      data: { userId, benefitCode },
    });
  } catch (err) {
    console.error('좋아요 삭제 실패:', err);
  }
}
