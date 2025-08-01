import axios from 'axios';
import { CONFIG } from '../../config/config';
import { DUMMY_USERS } from '../../config/dummyData';

export const getProfile = async (user_num) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서 user_num에 해당하는 유저 반환
    return DUMMY_USERS.find(u => u.user_num === user_num);
  }
  const res = await axios.get(`/user/me/${user_num}`);
  return res.data;
};

export const updateProfile = async (user_num, profileData) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서는 실제로 수정하지 않고, 수정된 데이터 반환
    return { ...profileData, user_num };
  }
  const res = await axios.put(`/user/update/${user_num}`, profileData);
  return res.data;
};

export const deleteUser = async (user_num) => {
  if (CONFIG.useDummyData) {
    // 더미데이터에서는 삭제 성공만 반환
    return { success: true };
  }
  const res = await axios.delete(`/user/delete/${user_num}`);
  return res.data;
};