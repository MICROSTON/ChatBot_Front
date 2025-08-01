import { useState, useEffect } from 'react';
import { getProfile, updateProfile, deleteUser } from '../services/UserService';

export default function useProfile(user_num) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = await getProfile(user_num);
        setProfile(data);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    }
    if (user_num) fetchProfile();
  }, [user_num]);

  const saveProfile = async (data) => {
    await updateProfile(user_num, data);
    setProfile(data);
  };

  const removeUser = async () => {
    await deleteUser(user_num);
    setProfile(null);
  };

  return { profile, loading, saveProfile, removeUser };
}