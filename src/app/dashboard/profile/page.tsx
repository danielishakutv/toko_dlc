"use client";

import { useState } from "react";
import Link from "next/link";
import { courses } from "@/app/data";

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z" />
  </svg>
);
const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);
const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);
const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
  </svg>
);

const registeredCourses = courses.filter((c) => c.status === "Registered");

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("Toko");
  const [lastName, setLastName] = useState("Learner");
  const [email, setEmail] = useState("learner@tokoacademy.com");
  const [password, setPassword] = useState("");

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-14 h-14 text-gray-400" />
            </div>
            <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <CameraIcon className="w-3 h-3" />
              Update
            </button>
          </div>

          {/* Form fields */}
          <div className="flex-1 space-y-0 divide-y divide-gray-100">
            <Field label="First Name" value={firstName} onChange={setFirstName} icon={<UserIcon className="w-4 h-4 text-gray-400" />} />
            <Field label="Last Name" value={lastName} onChange={setLastName} icon={<UserIcon className="w-4 h-4 text-gray-400" />} />
            <Field label="Email" value={email} onChange={setEmail} type="email" icon={<MailIcon className="w-4 h-4 text-gray-400" />} />
            <Field label="New Password" value={password} onChange={setPassword} type="password" placeholder="Change your password" icon={<LockIcon className="w-4 h-4 text-gray-400" />} />
          </div>
        </div>
      </div>

      {/* Account type */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Account Type</h2>
        <p className="text-lg font-semibold text-gray-900">Student</p>
      </div>

      {/* Registrations */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Registrations</h2>
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden mb-6">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registeredCourses.map((c) => (
                <tr key={c.slug}>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/course/${c.slug}`} className="text-gray-900 hover:underline font-medium">
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">2026-Mar-03</td>
                  <td className="px-6 py-4 text-gray-600">2 of {c.lectures} lessons</td>
                  <td className="px-6 py-4 text-gray-400">--</td>
                  <td className="px-6 py-4 text-gray-400">--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {registeredCourses.map((c) => (
            <div key={c.slug} className="p-4 space-y-2">
              <Link href={`/dashboard/course/${c.slug}`} className="text-gray-900 hover:underline font-medium text-sm">
                {c.title}
              </Link>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                <span>Enrolled: 2026-Mar-03</span>
                <span>Status: 2 of {c.lectures} lessons</span>
                <span>Completed: --</span>
                <span>Certificate: --</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save / Cancel */}
      <div className="flex justify-end gap-3 mb-10">
        <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Cancel
        </button>
        <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
          Update
        </button>
      </div>

      {/* Data and Privacy */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Data and Privacy</h2>
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 sm:p-8">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Your privacy matters to us. You can request a copy of your personal data or request deletion of your
          account and associated data at any time.
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
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
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
        {icon}
      </div>
    </div>
  );
}
