import React, { createContext, useContext, useState } from 'react';
import WelfareService from '../services/WelfareService';

const WelfareContext = createContext();

export const WelfareProvider = ({ children }) => {
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 🔥 null로 초기화
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(5);

  const searchWelfareByAge = async (ageGroupNum) => {
    try {
      setLoading(true);
      setError(null); // 🔥 오류 초기화
      
      const result = await WelfareService.searchWelfareByAge(ageGroupNum);
      
      if (result.success) {
        setFilteredList(result.data);
        setCurrentPage(0); // 페이지 초기화
        setHasMore(true);
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

  const searchWelfareList = async (searchParams, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null); // 🔥 오류 초기화
      
      // 페이지네이션 파라미터 추가
      const params = {
        ...searchParams,
        page: isLoadMore ? currentPage + 1 : 0,
        size: pageSize
      };
      
      const result = await WelfareService.searchWelfareList(params);
      
      if (result.success) {
        if (isLoadMore) {
          // 추가 로드인 경우 기존 데이터에 추가
          setFilteredList(prev => [...prev, ...result.data]);
          setCurrentPage(prev => prev + 1);
        } else {
          // 새로운 검색인 경우 데이터 교체
          setFilteredList(result.data);
          setCurrentPage(0);
        }
        
        // 더 로드할 데이터가 있는지 확인
        setHasMore(result.data.length === pageSize);
      } else {
        setError(result.error || '검색 실패'); // 🔥 문자열로 설정
        if (!isLoadMore) {
          setFilteredList([]);
        }
      }
    } catch (error) {
      console.error('WelfareContext.searchWelfareList error:', error);
      setError(error.message || '검색 중 오류 발생'); // 🔥 문자열로 설정
      if (!isLoadMore) {
        setFilteredList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreWelfare = async (searchParams) => {
    if (!hasMore || loading) return;
    await searchWelfareList(searchParams, true);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    filteredList,
    loading,
    error, // 🔥 항상 문자열 또는 null
    currentPage,
    hasMore,
    pageSize,
    searchWelfareList,
    searchWelfareByAge,
    loadMoreWelfare,
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
    throw new Error('useWelfare는 WelfareProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};