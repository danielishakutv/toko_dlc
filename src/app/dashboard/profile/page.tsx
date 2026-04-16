"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Camera } from "lucide-react";
import { courses } from "@/app/data";

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
              <User className="w-14 h-14 text-gray-400" />
            </div>
            <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              Update
            </button>
          </div>

          {/* Form fields */}
          <div className="flex-1 space-y-0 divide-y divide-gray-100">
            <Field label="First Name" value={firstName} onChange={setFirstName} icon={<User className="w-4 h-4 text-gray-400" />} />
            <Field label="Last Name" value={lastName} onChange={setLastName} icon={<User className="w-4 h-4 text-gray-400" />} />
            <Field label="Email" value={email} onChange={setEmail} type="email" icon={<Mail className="w-4 h-4 text-gray-400" />} />
            <Field label="New Password" value={password} onChange={setPassword} type="password" placeholder="Change your password" icon={<Lock className="w-4 h-4 text-gray-400" />} />
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
