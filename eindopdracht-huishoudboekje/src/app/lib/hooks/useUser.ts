'use client';

import { useEffect, useState } from 'react';
import { getUserId } from '../actions/auth-actions';

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      const uid = await getUserId(); 
      setUserId(uid);
    }
    fetchUserId();
  }, []);

  return userId;
}
