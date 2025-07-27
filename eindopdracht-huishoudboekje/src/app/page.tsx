'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Welkom bij het Huishoudboekje</h1>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
