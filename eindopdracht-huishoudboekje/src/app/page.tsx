'use client';

import { useAuth } from './lib/context/auth-context';
import LogoutButton from '@/app/components/auth/logout-button';
import Link from 'next/link';
import { Spinner } from './components/spinner';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return ( <Spinner/>);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Welkom bij de Huishoudboekjes App</h1>

      {!user ? (
        <Link href="/auth/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Inloggen
          </button>
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link href="/dashboard">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Naar dashboard
            </button>
          </Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
