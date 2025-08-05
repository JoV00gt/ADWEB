'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/lib/context/auth-context';
import { Spinner } from '../spinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) return (<Spinner/>);

  return <>{children}</>;
}
