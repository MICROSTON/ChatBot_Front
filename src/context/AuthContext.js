import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(true);
      try {
        const token = await authService.getAuthToken();
        const userData = await authService.getUserInfo();

        if (token && userData) {
          setUserToken(token);
          setUserInfo(userData);
        }
      } catch (e) {
        setError('인증 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    isLoading,
    userToken,
    userInfo,
    error,

    login: async (id, pw) => {
      setIsLoading(true);
      try {
        const response = await authService.login(id, pw);

        if (response.success) {
          const { token, user } = response.data;
          await authService.saveAuthToken(token);
          await authService.saveUserInfo(user);

          setUserToken(token);
          setUserInfo(user);
          setError(null);

          return { success: true };
        } else {
          setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (err) {
        setError(err.message || '로그인 중 오류가 발생했습니다.');
        return { success: false, message: err.message };
      } finally {
        setIsLoading(false);
      }
    },

    findId: async (name, phone) => {
      setIsLoading(true);
      try {
        const response = await authService.findId(name, phone);
        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message || '아이디 찾기 중 오류가 발생했습니다.'
        };
      } finally {
        setIsLoading(false);
      }
    },

    findPassword: async (id, phone) => {
      setIsLoading(true);
      try {
        const response = await authService.findPassword(id, phone);
        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message || '비밀번호 찾기 중 오류가 발생했습니다.'
        };
      } finally {
        setIsLoading(false);
      }
    },

    checkIdDuplicate: async (id) => {
      setIsLoading(true);
      try {
        const response = await authService.checkIdDuplicate(id);
        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message || '아이디 중복 확인 중 오류가 발생했습니다.'
        };
      } finally {
        setIsLoading(false);
      }
    },

    signup: async (userData) => {
      setIsLoading(true);
      try {
        const response = await authService.signup(userData);
        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message || '회원가입 중 오류가 발생했습니다.'
        };
      } finally {
        setIsLoading(false);
      }
    },

    logout: async () => {
      setIsLoading(true);
      try {
        await authService.logout();
        setUserToken(null);
        setUserInfo(null);
        setError(null);
        return { success: true };
      } catch (err) {
        setError(err.message || '로그아웃 중 오류가 발생했습니다.');
        return { success: false, message: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};