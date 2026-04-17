"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

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

interface Enrollment {
  id: number;
  course: { id: number; slug: string; title: string; lectureCount: number };
  enrolledAt: string;
  completedAt: string | null;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const [meRes, enrRes] = await Promise.all([
          fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/me/enrollments", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (meRes.ok) {
          const me = await meRes.json();
          setFirstName(me.firstName || "");
          setLastName(me.lastName || "");
          setEmail(me.email || "");
          setRole(me.role || "student");
          setAvatarUrl(me.avatarUrl || null);
        }
        if (enrRes.ok) {
          const data = await enrRes.json();
          setEnrollments(data.enrollments || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    setMsg(null);
    const token = getToken();
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      if (res.ok) {
        setMsg({ type: "ok", text: "Profile updated" });
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg({ type: "err", text: e.error || "Failed to update profile" });
      }
    } catch { setMsg({ type: "err", text: "Network error" }); }
    setSaving(false);
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) { setMsg({ type: "err", text: "Both password fields are required" }); return; }
    setSaving(true);
    setMsg(null);
    const token = getToken();
    try {
      const res = await fetch("/api/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setMsg({ type: "ok", text: "Password changed" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg({ type: "err", text: e.error || "Failed to change password" });
      }
    } catch { setMsg({ type: "err", text: "Network error" }); }
    setSaving(false);
  }

  async function handleAvatarUpload(file: File) {
    const token = getToken();
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/me/avatar", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.avatarUrl);
        setMsg({ type: "ok", text: "Avatar updated" });
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg({ type: "err", text: e.error || "Failed to upload avatar" });
      }
    } catch { setMsg({ type: "err", text: "Network error" }); }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-14 h-14 text-gray-400" />
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]); }} />
            <button onClick={() => fileRef.current?.click()} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <CameraIcon className="w-3 h-3" />
              Update
            </button>
          </div>

          {/* Form fields */}
          <div className="flex-1 space-y-0 divide-y divide-gray-100">
            <Field label="First Name" value={firstName} onChange={setFirstName} icon={<UserIcon className="w-4 h-4 text-gray-400" />} />
            <Field label="Last Name" value={lastName} onChange={setLastName} icon={<UserIcon className="w-4 h-4 text-gray-400" />} />
            <Field label="Email" value={email} onChange={setEmail} type="email" icon={<MailIcon className="w-4 h-4 text-gray-400" />} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={handleSaveProfile} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25 disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Password change */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-0 divide-y divide-gray-100">
          <Field label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="Enter current password" icon={<LockIcon className="w-4 h-4 text-gray-400" />} />
          <Field label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="Enter new password" icon={<LockIcon className="w-4 h-4 text-gray-400" />} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={handleChangePassword} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25 disabled:opacity-50">
            {saving ? "Saving..." : "Change Password"}
          </button>
        </div>
      </div>

      {/* Account type */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Account Type</h2>
        <p className="text-lg font-semibold text-gray-900 capitalize">{role}</p>
      </div>

      {/* Registrations */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Registrations</h2>
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden mb-6">
        {enrollments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No course registrations yet</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Enrolled</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.map((e) => (
                    <tr key={e.id}>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/course/${e.course.slug}`} className="text-gray-900 hover:underline font-medium">
                          {e.course.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-600">{e.completedLessons} of {e.totalLessons} lessons</td>
                      <td className="px-6 py-4 text-gray-600">{e.completedAt ? new Date(e.completedAt).toLocaleDateString() : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {enrollments.map((e) => (
                <div key={e.id} className="p-4 space-y-2">
                  <Link href={`/dashboard/course/${e.course.slug}`} className="text-gray-900 hover:underline font-medium text-sm">
                    {e.course.title}
                  </Link>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <span>Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</span>
                    <span>Status: {e.completedLessons} of {e.totalLessons} lessons</span>
                    <span>Completed: {e.completedAt ? new Date(e.completedAt).toLocaleDateString() : "--"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
