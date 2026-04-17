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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Course Management</h1>
          <p className="text-sm text-gray-500">{total} course{total !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/dashboard/courses-manage/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Course
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

      {/* Search & Filter */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
              placeholder="Search courses..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-gray-400"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full sm:w-40 appearance-none pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </div>
            <button
              onClick={() => { setSearch(searchInput); setPage(1); }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No courses found</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-6 py-3 font-medium">Course</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Students</th>
                    <th className="px-6 py-3 font-medium">Sections</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {c.thumbnailUrl ? (
                            <img src={c.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.472.89 6.042 2.346m0-14.304a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.346" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{c.title}</p>
                            <p className="text-xs text-gray-400 truncate">{c.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${c.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {c.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.enrolledCount}</td>
                      <td className="px-6 py-4 text-gray-600">{c.sectionCount}</td>
                      <td className="px-6 py-4 text-gray-600">{c.price > 0 ? `$${c.price}` : "Free"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link href={`/dashboard/courses-manage/${c.id}`} className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100">Edit</Link>
                          <Link href={`/dashboard/courses-manage/${c.id}/curriculum`} className="text-xs text-violet-600 hover:text-violet-900 transition-colors px-2 py-1 rounded hover:bg-violet-50">Curriculum</Link>
                          <Link href={`/dashboard/courses-manage/${c.id}/enrollments`} className="text-xs text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded hover:bg-blue-50">Enrollments</Link>
                          <button onClick={() => setDeleting(c)} className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {courses.map((c) => (
                <div key={c.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {c.thumbnailUrl ? (
                      <img src={c.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.472.89 6.042 2.346m0-14.304a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.346" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 truncate">{c.slug}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${c.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {c.published ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-gray-400">{c.enrolledCount} students</span>
                        <span className="text-xs text-gray-400">{c.sectionCount} sections</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/courses-manage/${c.id}`} className="text-xs font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg transition-colors">Edit</Link>
                    <Link href={`/dashboard/courses-manage/${c.id}/curriculum`} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Curriculum</Link>
                    <Link href={`/dashboard/courses-manage/${c.id}/enrollments`} className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Enrollments</Link>
                    <button onClick={() => setDeleting(c)} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

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
