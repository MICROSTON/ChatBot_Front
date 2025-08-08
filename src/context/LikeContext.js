// src/context/LikeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from '../services/LikeService';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedBenefits, setLikedBenefits] = useState([]);
  const userId = 1; // ⚠️ 추후 실제 로그인한 사용자 ID로 교체

  useEffect(() => {
    const fetchLikes = async () => {
      const favorites = await getFavorites(userId);
      setLikedBenefits(favorites);
    };
    fetchLikes();
  }, []);

  const toggleLike = async (benefit) => {
    const exists = likedBenefits.some(b => b.Benefit_Code === benefit.Benefit_Code);
    if (exists) {
      await removeFavorite(userId, benefit.Benefit_Code);
      setLikedBenefits(prev =>
        prev.filter(b => b.Benefit_Code !== benefit.Benefit_Code)
      );
    } else {
      await addFavorite(userId, benefit.Benefit_Code);
      setLikedBenefits(prev => [...prev, benefit]);
    }
  };

  return (
    <LikeContext.Provider value={{ likedBenefits, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
