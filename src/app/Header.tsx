"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "https://tokoacademy.org/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "https://tokoacademy.org/about/" },
  { label: "Newsroom", href: "https://tokoacademy.org/news/" },
  { label: "Contact", href: "https://tokoacademy.org/contact/" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          TOKO ACADEMY
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) =>
            link.href.startsWith("http") ? (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="flex items-center gap-3 ml-2">
            <Link
              href="/"
              className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full px-4 py-2 transition-colors"
            >
              Log in
            </Link>
          </div>
        </nav>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 -mr-2 text-gray-600"
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
        <div className="fixed inset-0 z-50 md:hidden">
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

            {/* Menu items */}
            <nav className="flex-1 px-4 py-4">
              {navLinks.map((link) =>
                link.href.startsWith("http") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Auth buttons */}
            <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block text-center px-3 py-3 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
