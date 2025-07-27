'use client';

import LogoutButton from '@/app/components/auth/logout-button';
import AuthGuard from '../components/auth/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-100 shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Huishoudboekjes Dashboard</h1>
          <LogoutButton />
        </header>
        <main className="flex-grow p-6">{children}</main>
      </div>
    </AuthGuard>
    </>  
  );
}
