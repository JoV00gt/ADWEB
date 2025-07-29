'use client';

import Header from '../components/header';
import AuthGuard from '../components/auth/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow p-6">{children}</main>
      </div>
    </AuthGuard>
    </>  
  );
}
