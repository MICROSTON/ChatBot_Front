import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      console.log('AuthContext 초기화 시작');
      setIsBootstrapping(true);
      try {
        const token = await authService.getAuthToken();
        const userData = await authService.getUserInfo();

        console.log('저장된 토큰:', token ? '있음' : '없음');
        console.log('저장된 사용자 정보:', userData ? '있음' : '없음');

        if (token && userData) {
          // 토큰 유효성 검사 및 갱신 시도
          try {
            // 여기서 토큰 만료 여부를 확인하고 필요시 갱신
            // 실제로는 JWT 디코딩하여 만료 시간 확인
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (payload.exp && payload.exp > currentTime) {
                console.log('토큰이 유효함 - 자동로그인 성공');
                setUserToken(token);
                setUserInfo(userData);
              } else {
                console.log('토큰이 만료됨 - 갱신 시도');
                // 토큰 갱신 로직은 별도로 구현 필요
                setUserToken(null);
                setUserInfo(null);
              }
            } else {
              console.log('토큰 형식이 올바르지 않음');
              setUserToken(null);
              setUserInfo(null);
            }
          } catch (tokenError) {
            console.error('토큰 검증 오류:', tokenError);
            setUserToken(null);
            setUserInfo(null);
          }
        } else {
          console.log('인증 정보 없음 - 로그인 화면으로 이동');
          setUserToken(null);
          setUserInfo(null);
        }
        
      } catch (e) {
        console.error('인증 정보 불러오기 오류:', e);
        setError('인증 정보를 불러오는 데 실패했습니다.');
        console.log('오류 발생 - 로그인 화면으로 이동');
        setUserToken(null);
        setUserInfo(null);
      } finally {
        console.log('AuthContext 초기화 완료');
        setIsBootstrapping(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    isLoading,
    isBootstrapping,
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
    },

    // JWT 토큰 갱신
    reissueToken: async (refreshToken) => {
      setIsLoading(true);
      try {
        const response = await authService.reissueToken(refreshToken);
        
        if (response.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          await authService.saveAuthToken(accessToken);
          setUserToken(accessToken);
          setRefreshToken(newRefreshToken);
          setError(null);
          return { success: true };
        } else {
          setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (err) {
        setError(err.message || '토큰 갱신 중 오류가 발생했습니다.');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};