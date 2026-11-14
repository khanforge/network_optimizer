
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Network } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isHistoryActive = pathname === "/history";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo / Brand */}
        <Link href="/history" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Network size={20} />
          </div>

          <span className="text-lg font-bold text-gray-900">
            NetMonitor
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">
            <Link
               href="/"
               className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  !isHistoryActive
                     ? "bg-blue-50 text-blue-700"
                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
               }`}
            >
            Home
          </Link>
          <Link
            href="/history"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isHistoryActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <History size={18} />
            Route History
            </Link>
        </div>
      </nav>
    </header>
  );
}
