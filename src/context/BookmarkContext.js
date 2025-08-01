import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CONFIG } from '../../config/config';
import { fetchBookmarks, addBookmarkToServer, removeBookmarkFromServer } from '../services/BookmarkService';

export const BookmarkContext = createContext();

const BOOKMARK_STORAGE_KEY = STORAGE_KEYS.BOOKMARKS || 'user_bookmarks';

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isConnected && !CONFIG.useDummyData) {
          const response = await fetchBookmarks();
          if (response && response.data) {
            setBookmarks(response.data);
            await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(response.data));
          }
        } else {
          const savedBookmarks = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
          if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
          }
        }
      } catch (error) {
        console.error('북마크 불러오기 오류:', error);
        setError('북마크를 불러오는 중 오류가 발생했습니다.');
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

  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('북마크 저장 오류:', error);
      throw error;
    }
  };

  // 북마크 추가 - userNum, ageGroupNum 기반으로 추가
  const addBookmark = async ({ userNum, ageGroupNum }) => {
    if (!userNum || !ageGroupNum) {
      console.error('userNum 또는 ageGroupNum이 누락되었습니다');
      return false;
    }

    const exists = bookmarks.some(item => item.userNum === userNum && item.ageGroupNum === ageGroupNum);

    if (!exists) {
      try {
        if (isConnected && !CONFIG.useDummyData) {
          await addBookmarkToServer({ userNum, ageGroupNum });
        }

        const timestamp = new Date().toISOString();
        const newBookmark = {
          userNum,
          ageGroupNum,
          bookmarkId: `bm_${timestamp}_${userNum}_${ageGroupNum}`,
          addedAt: timestamp
        };

        const newBookmarks = [...bookmarks, newBookmark];
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

  // 북마크 제거 - userNum, ageGroupNum 기반으로 제거
  const removeBookmark = async ({ userNum, ageGroupNum }) => {
    try {
      if (isConnected && !CONFIG.useDummyData) {
        await removeBookmarkFromServer({ userNum, ageGroupNum });
      }

      const newBookmarks = bookmarks.filter(item => !(item.userNum === userNum && item.ageGroupNum === ageGroupNum));
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
  const isBookmarked = (userNum, ageGroupNum) => {
    return bookmarks.some(item => item.userNum === userNum && item.ageGroupNum === ageGroupNum);
  };

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