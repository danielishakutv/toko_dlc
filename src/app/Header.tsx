"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "My Profile", href: "/profile" },
  { label: "My Learning", href: "#" },
  { label: "Certificates", href: "#" },
  { label: "Settings", href: "#" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          TOKO ACADEMY
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/courses" className="hover:text-gray-900 transition-colors">
            Courses
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="w-8 h-8 rounded-full bg-gray-300 hover:ring-2 hover:ring-gray-400 transition"
              aria-label="User menu"
            />
            {dropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <a
                    href="#"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    href="/login"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden p-2 -mr-2 text-gray-600"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-72 bg-white/95 backdrop-blur-md shadow-xl flex flex-col">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-500"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Profile */}
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="px-6 pb-6 border-b border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Toko Learner</p>
                <p className="text-xs text-gray-500">learner@tokoacademy.com</p>
              </div>
            </Link>

            {/* Menu items */}
            <nav className="flex-1 px-4 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Sign out */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
