import { useState, useEffect } from 'react';
import { getProfile, updateProfile, deleteUser } from '../services/UserService';

export default function useProfile(userNum) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = await getProfile(userNum);
        setProfile(data);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    }
    if (userNum) fetchProfile();
  }, [userNum]);

  const saveProfile = async (data) => {
    await updateProfile(userNum, data);
    setProfile(data);
  };

  const removeUser = async () => {
    await deleteUser(userNum);
    setProfile(null);
  };

  return { profile, loading, saveProfile, removeUser };
}