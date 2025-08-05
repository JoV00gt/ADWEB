// hooks/useParticipants.ts
'use client';

import { useEffect, useState } from 'react';
import { listenToUsers } from '@/app/lib/listeners/user-listener';
import { getUserId } from '@/app/lib/actions/auth-actions';
import type { User } from '@/app/lib/definitions';

export function useParticipants() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const id = await getUserId();
      setCurrentUserId(id);
    };
    fetch();

    const unsubscribe = listenToUsers(setUsers);
    return () => unsubscribe();
  }, []);

  const filteredUsers = currentUserId ? users.filter(u => u.id !== currentUserId) : users;

  return {
    currentUserId,
    filteredUsers,
    selectedUserIds,
    setSelectedUserIds,
  };
}
