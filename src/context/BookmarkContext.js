import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CONFIG } from '../../config/config';
import { fetchBookmarks, addBookmarkToServer, removeBookmarkFromServer } from '../services/BookmarkService';

export const BookmarkContext = createContext();

// 북마크 저장용 스토리지 키
const BOOKMARK_STORAGE_KEY = STORAGE_KEYS.BOOKMARKS || 'user_bookmarks';

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);


  // 북마크 목록 불러오기 - 서버에서 먼저 시도하고, 실패하면 로컬에서 가져옴
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isConnected && !CONFIG.useDummyData) {
          // 서버에서 북마크 데이터 가져오기
          const response = await fetchBookmarks();
          if (response && response.data) {
            setBookmarks(response.data);
            // 로컬 저장소에도 저장
            await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(response.data));
          }
        } else {
          // 오프라인 또는 더미 데이터 모드: 로컬에서 불러오기
          const savedBookmarks = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
          if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
          }
        }
      } catch (error) {
        console.error('북마크 불러오기 오류:', error);
        setError('북마크를 불러오는 중 오류가 발생했습니다.');
        
        // 오류 발생 시 로컬 데이터로 폴백
        try {
          const savedBookmarks = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
          if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
          }
        } catch (localError) {
          console.error('로컬 북마크 불러오기 오류:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [isConnected]);

  // 북마크 저장 - 로컬 저장소에 저장
  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('북마크 저장 오류:', error);
      throw error;
    }
  };

  // 북마크 추가 - 서버 API 호출 및 로컬 저장
  const addBookmark = async (welfare) => {
    // welfare 객체에 필요한 정보가 모두 있는지 확인
    if (!welfare || !welfare.id) {
      console.error('유효하지 않은 복지 정보입니다');
      return false;
    }

    // 중복 체크
    const exists = bookmarks.some(item => item.id === welfare.id);
    
    if (!exists) {
      try {
        // 서버에 북마크 추가 요청
        if (isConnected && !CONFIG.useDummyData) {
          await addBookmarkToServer(welfare.id);
        }
        
        // 로컬 상태 및 저장소 업데이트
        const timestamp = new Date().toISOString();
        const newWelfare = {
          ...welfare,
          bookmarkId: `bm_${timestamp}_${welfare.id}`,
          addedAt: timestamp
        };
        
        const newBookmarks = [...bookmarks, newWelfare];
        setBookmarks(newBookmarks);
        await saveBookmarks(newBookmarks);
        return true;
      } catch (error) {
        console.error('북마크 추가 오류:', error);
        setError('북마크 추가 중 오류가 발생했습니다.');
        return false;
      }
    }
    return false;
  };

  // 북마크 제거 - 서버 API 호출 및 로컬 저장
  const removeBookmark = async (id) => {
    try {
      // 서버에 북마크 제거 요청
      if (isConnected && !CONFIG.useDummyData) {
        await removeBookmarkFromServer(id);
      }
      
      // 로컬 상태 및 저장소 업데이트
      const newBookmarks = bookmarks.filter(item => item.id !== id);
      setBookmarks(newBookmarks);
      await saveBookmarks(newBookmarks);
      return true;
    } catch (error) {
      console.error('북마크 제거 오류:', error);
      setError('북마크 제거 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 북마크 여부 확인
  const isBookmarked = (id) => {
    return bookmarks.some(item => item.id === id);
  };

  // 오류 초기화
  const clearError = () => {
    setError(null);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading,
        error,
        addBookmark,
        removeBookmark,
        isBookmarked,
        clearError,
        isConnected
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};