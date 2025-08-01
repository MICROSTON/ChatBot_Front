import { useContext } from 'react';
import { BookmarkContext } from '../context/BookmarkContext';

const useBookmarks = () => {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error('useBookmarks는 BookmarkProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};

export default useBookmarks;