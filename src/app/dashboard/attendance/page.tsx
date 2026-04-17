"use client";

import { useState, useEffect } from "react";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Session {
  id: string;
  date: string;
  topic: string;
  status: string;
}

interface CourseAttendance {
  courseId: string;
  courseTitle: string;
  sessions: Session[];
}

interface AttendanceData {
  summary: { present: number; absent: number; late: number };
  courses: CourseAttendance[];
}

const statusStyle: Record<string, string> = {
  present: "bg-green-50 text-green-700",
  absent: "bg-red-50 text-red-700",
  late: "bg-yellow-50 text-yellow-700",
};

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch("/api/me/attendance", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setData(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const summary = data?.summary || { present: 0, absent: 0, late: 0 };
  const courses = data?.courses || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Attendance</h1>
      <p className="text-gray-500 mb-8">Track your attendance across all enrolled courses</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-green-600">{summary.present}</p>
          <p className="text-xs text-gray-500">Present</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
          <p className="text-xs text-gray-500">Absent</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
          <p className="text-xs text-gray-500">Late</p>
        </div>
      </div>

      {/* Course attendance */}
      {courses.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No attendance records yet</p>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.courseId} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">{course.courseTitle}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {course.sessions.map((s) => (
                  <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-900">{s.topic}</p>
                      <p className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium rounded-full px-2.5 py-1 capitalize ${statusStyle[s.status] || "bg-gray-100 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
