"use client";

import { useState, useEffect } from "react";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Assessment {
  id: number;
  title: string;
  course: { id: number; title: string };
  type: string;
  questionCount: number;
  durationMinutes: number;
  dueDate: string | null;
  status: string;
  score: number | null;
  submittedAt: string | null;
}

const statusLabel: Record<string, string> = {
  not_started: "Upcoming",
  in_progress: "In Progress",
  submitted: "Completed",
  graded: "Completed",
};
const statusColor: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-yellow-50 text-yellow-700",
  submitted: "bg-green-50 text-green-700",
  graded: "bg-green-50 text-green-700",
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch("/api/me/assessments", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setAssessments(data.assessments || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Assessments</h1>
      <p className="text-gray-500 mb-8">View your quizzes, assignments, and exams</p>

      {assessments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No assessments yet</p>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Assessment</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Due Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.course.title}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{a.type}</td>
                    <td className="px-5 py-4 text-gray-600">{a.durationMinutes} min</td>
                    <td className="px-5 py-4 text-gray-600">{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabel[a.status] || a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">{a.score != null ? `${a.score}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {assessments.map((a) => (
              <div key={a.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.course.title}</p>
                  </div>
                  <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabel[a.status] || a.status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{a.type}</span>
                  <span>{a.durationMinutes} min</span>
                  <span>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—"}</span>
                  {a.score != null && <span className="font-medium text-gray-900">{a.score}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
