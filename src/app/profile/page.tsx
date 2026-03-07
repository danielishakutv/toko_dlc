"use client";

import { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Link from "next/link";
import { courses } from "../data";

const registeredCourses = courses.filter((c) => c.status === "Registered");

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("Toko");
  const [lastName, setLastName] = useState("Learner");
  const [email, setEmail] = useState("learner@tokoacademy.com");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          My Profile
        </h1>

        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
                Update
              </button>
            </div>

            {/* Form fields */}
            <div className="flex-1 space-y-0 divide-y divide-gray-100">
              <Field
                label="First Name"
                value={firstName}
                onChange={setFirstName}
              />
              <Field
                label="Last Name"
                value={lastName}
                onChange={setLastName}
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
              />
              <Field
                label="New Password"
                value={password}
                onChange={setPassword}
                type="password"
                placeholder="Change your password"
              />
            </div>
          </div>
        </div>

        {/* Registrations */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Registrations
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Enrolled</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Completed</th>
                  <th className="px-6 py-3 font-medium">Certificate</th>
                  <th className="px-6 py-3 font-medium">Notifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registeredCourses.map((c) => (
                  <tr key={c.slug}>
                    <td className="px-6 py-4">
                      <Link
                        href={`/course/${c.slug}`}
                        className="text-amber-700 hover:underline font-medium"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">2026-Mar-03</td>
                    <td className="px-6 py-4 text-gray-600">
                      2 of {c.lectures} lessons
                    </td>
                    <td className="px-6 py-4 text-gray-400">--</td>
                    <td className="px-6 py-4 text-gray-400">--</td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 accent-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {registeredCourses.map((c) => (
              <div key={c.slug} className="p-4 space-y-2">
                <Link
                  href={`/course/${c.slug}`}
                  className="text-amber-700 hover:underline font-medium text-sm"
                >
                  {c.title}
                </Link>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <span>Enrolled: 2026-Mar-03</span>
                  <span>
                    Status: 2 of {c.lectures} lessons
                  </span>
                  <span>Completed: --</span>
                  <span>Certificate: --</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mb-12">
          <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
            Update
          </button>
        </div>

        {/* Data and Privacy */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Data and Privacy
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Your privacy matters to us. You can request a copy of your personal
            data or request deletion of your account and associated data at any
            time.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Download my data
            </button>
            <button className="px-4 py-2 text-sm font-medium border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
              Delete my account
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
      <label className="text-sm font-medium text-gray-500 sm:w-32 sm:text-right shrink-0">
        {label}
      </label>
      <div className="flex-1 flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
        />
        <svg
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
          />
        </svg>
      </div>
    </div>
  );
}
