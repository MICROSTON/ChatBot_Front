import axios from 'axios';
import { CONFIG } from '../../config/config';
import { DUMMY_USERS } from '../../config/dummyData';

//프로필 조회
export const getProfile = async (userNum) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서 user_num에 해당하는 유저 반환
    return DUMMY_USERS.find(u => u.userNum === userNum);
  }
  const res = await axios.get(`/user/me/${userNum}`);
  return res.data;
};

// 프로필 수정
export const updateProfile = async (userNum, profileData) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서는 실제로 수정하지 않고, 수정된 데이터 반환
    return { ...profileData, userNum };
  }
  const res = await axios.put(`/user/update/${userNum}`, profileData);
  return res.data;
};

// 회원 탈퇴
export const deleteUser = async (userNum) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서는 삭제 성공만 반환
    return { success: true };
  }
  const res = await axios.delete(`/user/delete/${userNum}`);
  return res.data;
};