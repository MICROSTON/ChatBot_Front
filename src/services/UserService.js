import axios from 'axios';
import { CONFIG } from '../../config/config';
import { DUMMY_USERS } from '../../config/dummyData';

const api = axios.create({
  baseURL: CONFIG.apiUrl,
  timeout: CONFIG.timeout,
});

//프로필 조회
export const getProfile = async (userNum) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서 user_num에 해당하는 유저 반환
    return DUMMY_USERS.find(u => u.userNum === userNum);
  }
  try {
    const res = await api.get(`/user/me/${userNum}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '프로필 조회에 실패했습니다.');
  }
};

// 프로필 수정
export const updateProfile = async (userNum, profileData) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서는 실제로 수정하지 않고, 수정된 데이터 반환
    return { ...profileData, userNum };
  }
  try {
    const res = await api.put(`/user/update/${userNum}`, profileData); 
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '프로필 수정에 실패했습니다.'); 
  }
};

// 회원 탈퇴
export const deleteUser = async (userNum) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서는 삭제 성공만 반환
    return { success: true };
  }
  try {
    const res = await api.delete(`/user/delete/${userNum}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '회원탈퇴에 실패했습니다.');
  }
};