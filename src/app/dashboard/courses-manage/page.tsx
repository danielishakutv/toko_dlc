"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Course {
  id: string;
  slug: string;
  title: string;
  icon: string;
  thumbnailUrl: string | null;
  description: string;
  about: string;
  price: number;
  hours: number;
  quizzes: number;
  hasCertificate: boolean;
  published: boolean;
  createdAt: string;
  enrolledCount: number;
  sectionCount: number;
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

function getUserRole(): string {
  if (typeof window === "undefined") return "";
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u).role : "";
  } catch {
    return "";
  }
}

export default function CoursesManagePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);

  const perPage = 20;
  const role = getUserRole();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setLoading(false); return; }
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/courses?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { setError("Session expired. Please log in again."); setLoading(false); return; }
      if (res.status === 403) { setError("Access denied. Superadmin only."); setLoading(false); return; }
      if (!res.ok) { setError("Failed to load courses"); setLoading(false); return; }
      const data = await res.json();
      setCourses(data.courses);
      setTotal(data.total);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  async function handleDeleteCourse() {
    if (!deleting) return;
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`/api/admin/courses/${deleting.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleting(null);
      setExpandedId(null);
      fetchCourses();
    } catch {
      setDeleting(null);
    }
  }

  if (role !== "superadmin") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Management</h1>
        <p className="text-gray-500">Access denied. This page is for superadmins only.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Course Management</h1>
          <p className="text-sm text-gray-500">{total} course{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/courses-manage/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          <span className="hidden sm:inline">Add Course</span>
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            placeholder="Search courses..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-all placeholder:text-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-36 px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-all bg-white"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          onClick={() => { setSearch(searchInput); setPage(1); }}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          Search
        </button>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No courses found</div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => {
            const isOpen = expandedId === c.id;
            return (
              <div key={c.id} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
                {/* Row header — always visible, click to expand */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  {c.thumbnailUrl ? (
                    <img src={c.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.472.89 6.042 2.346m0-14.304a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.346" /></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${c.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {c.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-400">{c.enrolledCount} students</span>
                      <span className="text-xs text-gray-400">{c.sectionCount} sections</span>
                      <span className="text-xs text-gray-400">{c.price > 0 ? `$${c.price.toLocaleString()}` : "Free"}</span>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-3">
                    {c.description && (
                      <p className="text-sm text-gray-600">{c.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                      <span>Slug: <span className="text-gray-700">{c.slug}</span></span>
                      <span>Hours: <span className="text-gray-700">{c.hours}</span></span>
                      <span>Quizzes: <span className="text-gray-700">{c.quizzes}</span></span>
                      <span>Certificate: <span className="text-gray-700">{c.hasCertificate ? "Yes" : "No"}</span></span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link href={`/dashboard/courses-manage/${c.id}`} className="text-xs font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all">
                        Edit Details
                      </Link>
                      <Link href={`/dashboard/courses-manage/${c.id}?tab=curriculum`} className="text-xs font-medium text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                        Curriculum ({c.sectionCount})
                      </Link>
                      <Link href={`/dashboard/courses-manage/${c.id}?tab=enrollments`} className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        Enrollments ({c.enrolledCount})
                      </Link>
                      <button onClick={(e) => { e.stopPropagation(); setDeleting(c); }} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">Next</button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleting(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Course</h2>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete <span className="font-medium">{deleting.title}</span>?
            </p>
            <p className="text-xs text-gray-400 mb-6">
              This will also remove all sections, lessons, and enrollments. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleting(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleDeleteCourse} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
