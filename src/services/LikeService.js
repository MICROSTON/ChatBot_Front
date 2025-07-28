import axios from 'axios';

export const saveLike = async (message) => {
  try {
    const res = await axios.post('http://localhost:8080/likes', {
      messageId: message.id,
      content: message.text,
    });
    return { success: true };
  } catch (error) {
    console.error('좋아요 저장 오류:', error);
    return { success: false };
  }
};

export const isMessageLiked = async (messageId) => {
  try {
    const res = await axios.get(`http://localhost:8080/likes/${messageId}`);
    return res.data.liked;
  } catch (error) {
    return false;
  }
};
