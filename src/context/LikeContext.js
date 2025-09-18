import React, { createContext, useContext, useState, useEffect } from 'react';
import LikeService from '../services/LikeService';
import { AuthContext } from './AuthContext';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedBenefits, setLikedBenefits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 🔥 항상 null 또는 문자열
  const { userInfo } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기

  // 🔥 안전한 에러 설정 헬퍼 함수
  const setSafeError = (errorValue) => {
    if (!errorValue) {
      setError(null);
      return;
    }
    
    // 문자열이면 그대로 사용
    if (typeof errorValue === 'string') {
      setError(errorValue);
      return;
    }
    
    // 객체면 message 속성 추출
    if (typeof errorValue === 'object') {
      setError(errorValue.message || errorValue.error || '알 수 없는 오류가 발생했습니다.');
      return;
    }
    
    // 기타 타입이면 문자열로 변환
    setError(String(errorValue));
  };

  // 좋아요 추가
  const addLike = async (benefit) => {
    const currentUserId = userInfo?.id; // 백엔드에서는 사용자 ID를 사용해야 함
    
    if (!currentUserId) {
      setSafeError('사용자 정보가 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setSafeError(null); // 🔥 오류 초기화
      
      const result = await LikeService.addLike(currentUserId, benefit.benefitCode);
      
      if (result.success) {
        setLikedBenefits(prev => {
          const isAlreadyLiked = prev.some(item => item.benefitCode === benefit.benefitCode);
          if (!isAlreadyLiked) {
            return [...prev, benefit];
          }
          return prev;
        });
      } else {
        setSafeError(result.error || '좋아요 추가 실패'); // 🔥 안전한 에러 설정
      }
    } catch (error) {
      console.error('LikeContext.addLike error:', error);
      setSafeError(error.message || '네트워크 오류가 발생했습니다.'); // 🔥 안전한 에러 설정
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 제거 - LikeService.removeLike와 통일
  const removeLike = async (benefit) => {
    const currentUserId = userInfo?.id; // 백엔드에서는 사용자 ID를 사용해야 함
    
    if (!currentUserId) {
      setSafeError('사용자 정보가 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setSafeError(null); // 🔥 오류 초기화
      
      const result = await LikeService.removeLike(currentUserId, benefit.benefitCode);
      
      if (result.success) {
        setLikedBenefits(prev => 
          prev.filter(item => item.benefitCode !== benefit.benefitCode)
        );
      } else {
        setSafeError(result.error || '좋아요 취소 실패'); // 🔥 안전한 에러 설정
      }
    } catch (error) {
      console.error('LikeContext.removeLike error:', error);
      setSafeError(error.message || '네트워크 오류가 발생했습니다.'); // 🔥 안전한 에러 설정
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 상태 확인
  const isLiked = (benefitCode) => {
    return likedBenefits.some(item => item.benefitCode === benefitCode);
  };

  // 좋아요 토글 (기존 유지)
  const toggleLike = async (benefit) => {
    if (isLiked(benefit.benefitCode)) {
      await removeLike(benefit);
    } else {
      await addLike(benefit);
    }
  };

  // 사용자 좋아요 목록 로드
  const loadUserLikes = async () => {
    const currentUserId = userInfo?.id; // 백엔드에서는 사용자 ID를 사용해야 함
    
    if (!currentUserId) return;

    try {
      setLoading(true);
      setSafeError(null); // 🔥 오류 초기화
      
      const result = await LikeService.getUserLikes(currentUserId);
      
      if (result.success) {
        setLikedBenefits(result.data || []);
      } else {
        setSafeError(result.error || '좋아요 목록 로드 실패'); // 🔥 안전한 에러 설정
      }
    } catch (error) {
      console.error('LikeContext.loadUserLikes error:', error);
      setSafeError(error.message || '네트워크 오류가 발생했습니다.'); // 🔥 안전한 에러 설정
    } finally {
      setLoading(false);
    }
  };

  // 사용자 정보가 변경될 때 좋아요 목록 다시 로드
  useEffect(() => {
    if (userInfo?.id) {
      loadUserLikes();
    }
  }, [userInfo?.id]);

  const clearError = () => {
    setSafeError(null); // 🔥 안전한 에러 초기화
  };

  const value = {
    // 상태
    likedBenefits,
    loading,
    error, // 🔥 항상 null 또는 string
    
    // 액션
    addLike,
    removeLike, // LikeService와 동일한 이름
    toggleLike,
    isLiked,
    loadUserLikes,
    clearError,
  };

  return (
    <LikeContext.Provider value={value}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLike는 LikeProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};