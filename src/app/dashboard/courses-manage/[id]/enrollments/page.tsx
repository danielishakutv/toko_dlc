"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Enrollment {
  enrollmentId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  enrolledAt: string;
}

export default function EnrollmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  async function loadData() {
    const token = getToken();
    if (!token) { setError("Not authenticated"); setLoading(false); return; }
    try {
      const [courseRes, enrollRes, availRes] = await Promise.all([
        fetch(`/api/admin/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/courses/${id}/enrollments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/courses/${id}/available-students`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourseTitle(data.title);
      }
      if (enrollRes.ok) {
        const data = await enrollRes.json();
        setEnrollments(data.enrollments || []);
      }
      if (availRes.ok) {
        const data = await availRes.json();
        setAvailableStudents(data.students || []);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [id]);

  async function handleEnroll() {
    if (selectedIds.length === 0) return;
    setEnrolling(true);
    setError("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setEnrolling(false); return; }
    try {
      const res = await fetch(`/api/admin/courses/${id}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userIds: selectedIds }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Enroll failed");
        setEnrolling(false);
        return;
      }
      setSelectedIds([]);
      setShowPicker(false);
      setSearchTerm("");
      await loadData();
    } catch {
      setError("Network error");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleUnenroll(userId: number) {
    if (!confirm("Remove this student from the course?")) return;
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Unenroll failed");
        return;
      }
      await loadData();
    } catch {
      setError("Network error");
    }
  }

  function toggleStudent(sid: number) {
    setSelectedIds((prev) => prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]);
  }

  const filteredAvailable = availableStudents.filter(
    (s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href={`/dashboard/courses-manage/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back to Course Details
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{courseTitle} — Enrollments</h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Link href={`/dashboard/courses-manage/${id}`} className="text-sm font-medium text-gray-600 bg-white/70 border border-white/60 px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">Details</Link>
        <Link href={`/dashboard/courses-manage/${id}/curriculum`} className="text-sm font-medium text-gray-600 bg-white/70 border border-white/60 px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">Curriculum</Link>
        <span className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 rounded-xl shadow-md shadow-violet-500/25">Enrollments</span>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-4 sm:p-6">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        {/* Action bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{enrollments.length} enrolled student{enrollments.length !== 1 ? "s" : ""}</p>
          <button onClick={() => setShowPicker(!showPicker)} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25">
            {showPicker ? "Cancel" : "Enroll Students"}
          </button>
        </div>

        {/* Student picker */}
        {showPicker && (
          <div className="border border-violet-200 rounded-xl p-4 mb-4 bg-violet-50/30">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search available students..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition mb-3"
            />
            {filteredAvailable.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No available students found</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredAvailable.map((s) => (
                  <label key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/60 cursor-pointer text-sm">
                    <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleStudent(s.id)} className="rounded accent-violet-600" />
                    <span className="font-medium text-gray-900">{s.firstName} {s.lastName}</span>
                    <span className="text-gray-400">{s.email}</span>
                  </label>
                ))}
              </div>
            )}
            {selectedIds.length > 0 && (
              <div className="mt-3 pt-3 border-t border-violet-200 flex items-center justify-between">
                <span className="text-xs text-gray-500">{selectedIds.length} selected</span>
                <button onClick={handleEnroll} disabled={enrolling} className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm">
                  {enrolling ? "Enrolling..." : `Enroll ${selectedIds.length}`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enrolled list */}
        {enrollments.length === 0 ? (
          <p className="text-center py-8 text-gray-400">No students enrolled yet</p>
        ) : (
          <div className="space-y-2">
            {enrollments.map((e) => (
              <div key={e.enrollmentId} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                <div>
                  <span className="text-sm font-medium text-gray-900">{e.firstName} {e.lastName}</span>
                  <span className="text-sm text-gray-400 ml-2">{e.email}</span>
                  <span className="text-xs text-gray-400 ml-3">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handleUnenroll(e.userId)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
