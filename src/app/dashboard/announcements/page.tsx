"use client";

import { useState, useEffect } from "react";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v5m-3-8.5L5 10l7-7 7 7-4 3.5M9 13.5 7.5 21h9L15 13.5" />
  </svg>
);

interface Announcement {
  id: number;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  createdAt: string;
}

const categoryColor: Record<string, string> = {
  System: "bg-red-50 text-red-700",
  Courses: "bg-blue-50 text-blue-700",
  "Course Update": "bg-purple-50 text-purple-700",
  General: "bg-gray-100 text-gray-600",
  Event: "bg-green-50 text-green-700",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getToken();
      try {
        const res = await fetch("/api/announcements", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Announcements</h1>
      <p className="text-gray-500 mb-8">Stay updated with the latest news and updates</p>

      {announcements.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No announcements yet</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  {a.pinned && <PinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                  <h2 className="text-sm font-bold text-gray-900">{a.title}</h2>
                </div>
                <span className={`text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap ${categoryColor[a.category] || "bg-gray-100 text-gray-600"}`}>
                  {a.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{a.body}</p>
              <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
