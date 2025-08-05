import Link from "next/link";
import LogoutButton from "./auth/logout-button";

export default function Header() {
  return (
    <header className="bg-gray-100 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-blue-800">Huishoudboekjes</h1>
      <div className="flex justify-between items-center">
          <div className="pr-4">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium underline">
                Dashboard
            </Link>
          </div>
          <div className="pr-4">
            <Link
              href="/archive"
              className="text-blue-600 hover:text-blue-800 font-medium underline">
                Archief
            </Link>
          </div>
      </div>
      <div className="flex gap-6 items-center">
        <LogoutButton />
      </div>
    </header>
  );
}
