import React, { createContext, useContext, useState } from 'react';
import WelfareService from '../services/WelfareService';

const WelfareContext = createContext();

export const WelfareProvider = ({ children }) => {
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 🔥 null로 초기화

  const searchWelfareByAge = async (ageGroupNum) => {
    try {
      setLoading(true);
      setError(null); // 🔥 오류 초기화
      
      const result = await WelfareService.searchWelfareByAge(ageGroupNum);
      
      if (result.success) {
        setFilteredList(result.data);
      } else {
        setError(result.error || '연령대별 검색 실패'); // 🔥 문자열로 설정
        setFilteredList([]);
      }
    } catch (error) {
      console.error('WelfareContext.searchWelfareByAge error:', error);
      setError(error.message || '연령대별 검색 중 오류 발생'); // 🔥 문자열로 설정
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  const searchWelfareList = async (searchParams) => {
    try {
      setLoading(true);
      setError(null); // 🔥 오류 초기화
      
      const result = await WelfareService.searchWelfareList(searchParams);
      
      if (result.success) {
        setFilteredList(result.data);
      } else {
        setError(result.error || '검색 실패'); // 🔥 문자열로 설정
        setFilteredList([]);
      }
    } catch (error) {
      console.error('WelfareContext.searchWelfareList error:', error);
      setError(error.message || '검색 중 오류 발생'); // 🔥 문자열로 설정
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    filteredList,
    loading,
    error, // 🔥 항상 문자열 또는 null
    searchWelfareList,
    searchWelfareByAge,
    clearError,
  };

  return (
    <WelfareContext.Provider value={value}>
      {children}
    </WelfareContext.Provider>
  );
};

export const useWelfare = () => {
  const context = useContext(WelfareContext);
  if (!context) {
    throw new Error('useWelfare must be used within a WelfareProvider');
  }
  return context;
};