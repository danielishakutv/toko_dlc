"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
);
const CircleCheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" /></svg>
);
const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18h-9M8 2h8l-1 7h-6L8 2ZM12 9v5m-4 4h8m-8 0a2 2 0 0 1-2-2h12a2 2 0 0 1-2 2M6 2H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4m12-7h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4" /></svg>
);

interface DashboardData {
  stats: { enrolledCourses: number; completedCourses: number; inProgressCourses: number; certificatesEarned: number };
  upcomingDeadlines: { courseTitle: string; task: string; dueDate: string }[];
  recentActivity: { action: string; detail: string; timestamp: string }[];
  courseProgress: { courseSlug: string; courseTitle: string; courseIcon: string; progressPercent: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const [dashRes, meRes] = await Promise.all([
          fetch("/api/me/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (dashRes.ok) setData(await dashRes.json());
        if (meRes.ok) {
          const me = await meRes.json();
          setUserName(`${me.firstName || ""} ${me.lastName || ""}`.trim());
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const s = data?.stats || { enrolledCourses: 0, completedCourses: 0, inProgressCourses: 0, certificatesEarned: 0 };
  const statCards: { label: string; value: number; icon: ReactNode }[] = [
    { label: "Enrolled Courses", value: s.enrolledCourses, icon: <BookOpenIcon /> },
    { label: "Completed", value: s.completedCourses, icon: <CircleCheckIcon /> },
    { label: "In Progress", value: s.inProgressCourses, icon: <ClockIcon /> },
    { label: "Certificates", value: s.certificatesEarned, icon: <TrophyIcon /> },
  ];

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back{userName ? `, ${userName}` : ""}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((sc) => (
          <div key={sc.label} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 mb-2">{sc.icon}</div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{sc.value}</p>
            <p className="text-sm text-gray-500">{sc.label}</p>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
          {(data?.upcomingDeadlines || []).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No upcoming deadlines</p>
          ) : (
            <div className="space-y-4">
              {(data?.upcomingDeadlines || []).map((d, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.task}</p>
                    <p className="text-xs text-gray-500">{d.courseTitle}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(d.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          {(data?.recentActivity || []).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {(data?.recentActivity || []).map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.action}</p>
                    <p className="text-xs text-gray-500">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(a.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Progress</h2>
        {(data?.courseProgress || []).length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No courses enrolled yet</p>
        ) : (
          <div className="space-y-4">
            {(data?.courseProgress || []).map((cp) => (
              <div key={cp.courseSlug}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{cp.courseTitle}</p>
                  <span className="text-xs font-medium text-gray-500">{cp.progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2 rounded-full transition-all" style={{ width: `${cp.progressPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
