import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CONFIG } from '../../config/config';
import { fetchBookmarks, addBookmarkToServer, removeBookmarkFromServer } from '../services/BookmarkService';
import { AuthContext } from './AuthContext';

export const BookmarkContext = createContext();

const BOOKMARK_STORAGE_KEY = STORAGE_KEYS.BOOKMARKS || 'user_bookmarks';

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isConnected && !(CONFIG && CONFIG.useDummyData)) {
          // 로그인된 사용자 ID 사용 (테스트용으로 usertester 사용)
          const userId = userInfo?.id || "usertester";
          console.log('북마크 조회 사용자 ID:', userId);
          
          // userInfo가 없으면 테스트 사용자로 진행
          if (!userInfo?.id) {
            console.log('사용자 정보가 없어서 테스트 사용자(usertester)로 진행합니다.');
          }
          
          const response = await fetchBookmarks(userId);
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
  }, [isConnected, userInfo?.id]); // userInfo.id가 변경될 때마다 다시 로드

  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('북마크 저장 오류:', error);
      throw error;
    }
  };

  // 토글 상태 업데이트 함수
  const updateToggleState = async (bookmarks) => {
    try {
      const CATEGORIES = [
        { ageGroupNum: 1, label: '임산부/여자' },
        { ageGroupNum: 2, label: '영유아' },
        { ageGroupNum: 3, label: '청소년' },
        { ageGroupNum: 4, label: '청년' },
        { ageGroupNum: 5, label: '중장년' },
        { ageGroupNum: 6, label: '어르신' },
        { ageGroupNum: 7, label: '장애인' },
      ];

      const toggleState = {};
      CATEGORIES.forEach(category => {
        toggleState[category.ageGroupNum] = bookmarks.some(
          bookmark => bookmark.ageGroupNum === category.ageGroupNum
        );
      });

      await AsyncStorage.setItem('notification_categories', JSON.stringify(toggleState));
      console.log('토글 상태 업데이트:', toggleState);
    } catch (error) {
      console.error('토글 상태 업데이트 오류:', error);
    }
  };

  // 북마크 추가 - userNum, ageGroupNum 기반으로 추가
  const addBookmark = async ({ userNum, ageGroupNum }) => {
    // userNum이 없으면 로그인된 사용자 ID 사용
    const actualUserNum = userNum || userInfo?.id;
    
    if (!actualUserNum || !ageGroupNum) {
      console.error('userNum 또는 ageGroupNum이 누락되었습니다');
      console.error('userNum:', actualUserNum, 'ageGroupNum:', ageGroupNum);
      return false;
    }
    
    console.log('북마크 추가 요청:', { userNum: actualUserNum, ageGroupNum });

    const exists = bookmarks.some(item => item.userNum === actualUserNum && item.ageGroupNum === ageGroupNum);

    if (!exists) {
      try {
        if (isConnected && !(CONFIG && CONFIG.useDummyData)) {
          // 서버에 북마크 추가
          await addBookmarkToServer({ userNum: actualUserNum, ageGroupNum });
          console.log('서버에 북마크 추가 성공');
          
          // 서버에서 다시 조회하여 최신 데이터 가져오기
          const response = await fetchBookmarks(actualUserNum);
          if (response && response.data) {
            console.log('서버에서 북마크 재조회 성공:', response.data);
            setBookmarks(response.data);
            await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(response.data));
            
            // 토글 상태도 업데이트
            await updateToggleState(response.data);
          }
        } else {
          // 더미 데이터 모드일 때는 로컬 상태만 업데이트
          const timestamp = new Date().toISOString();
          const newBookmark = {
            userNum: actualUserNum,
            ageGroupNum,
            bookmarkId: `bm_${timestamp}_${actualUserNum}_${ageGroupNum}`,
            addedAt: timestamp
          };

          const newBookmarks = [...bookmarks, newBookmark];
          setBookmarks(newBookmarks);
          await saveBookmarks(newBookmarks);
          
          // 토글 상태도 업데이트
          await updateToggleState(newBookmarks);
        }
        return true;
      } catch (error) {
        console.error('북마크 추가 오류:', error);
        setError('북마크 추가 중 오류가 발생했습니다.');
        return false;
      }
    } else {
      console.log('이미 존재하는 북마크입니다:', { userNum: actualUserNum, ageGroupNum });
      return false;
    }
  };

  // 북마크 제거 - userNum, ageGroupNum 기반으로 제거
  const removeBookmark = async ({ userNum, ageGroupNum }) => {
    try {
      if (isConnected && !(CONFIG && CONFIG.useDummyData)) {
        // 서버에서 북마크 삭제
        await removeBookmarkFromServer({ userNum, ageGroupNum });
        console.log('서버에서 북마크 삭제 성공');
        
        // 서버에서 다시 조회하여 최신 데이터 가져오기
        const response = await fetchBookmarks(userNum);
        if (response && response.data) {
          console.log('서버에서 북마크 재조회 성공:', response.data);
          setBookmarks(response.data);
          await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(response.data));
          
          // 토글 상태도 업데이트
          await updateToggleState(response.data);
        }
      } else {
        // 더미 데이터 모드일 때는 로컬 상태만 업데이트
        const newBookmarks = bookmarks.filter(item => !(item.userNum === userNum && item.ageGroupNum === ageGroupNum));
        setBookmarks(newBookmarks);
        await saveBookmarks(newBookmarks);
        
        // 토글 상태도 업데이트
        await updateToggleState(newBookmarks);
      }
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

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks는 BookmarkProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};