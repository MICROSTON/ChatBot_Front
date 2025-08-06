import React, { createContext, useContext, useState } from 'react';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedBenefits, setLikedBenefits] = useState([]);

  const toggleLike = (benefit) => {
    const exists = likedBenefits.some(b => b.Benefit_Code === benefit.Benefit_Code);
    if (exists) {
      setLikedBenefits(likedBenefits.filter(b => b.Benefit_Code !== benefit.Benefit_Code));
    } else {
      setLikedBenefits([...likedBenefits, benefit]);
    }
  };

  return (
    <LikeContext.Provider value={{ likedBenefits, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
