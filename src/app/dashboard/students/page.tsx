"use client";

import { useState, useEffect, useCallback } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "student" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleting, setDeleting] = useState<Student | null>(null);

  // Reset password confirm
  const [resetting, setResetting] = useState<Student | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Search and filter
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // CSV upload
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ created: number; skipped: number; failed: number; total: number; results: { email: string; status: string; error?: string }[] } | null>(null);

  const perPage = 20;
  const role = getUserRole();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setLoading(false); return; }
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { setError("Session expired. Please log in again."); setLoading(false); return; }
      if (res.status === 403) { setError("Access denied. Superadmin only."); setLoading(false); return; }
      if (!res.ok) { setError("Failed to load students"); setLoading(false); return; }
      const data = await res.json();
      setStudents(data.users);
      setTotal(data.total);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  function openCreate() {
    setEditing(null);
    setForm({ firstName: "", lastName: "", email: "", password: "", role: "student" });
    setFormError("");
    setShowModal(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({ firstName: s.firstName, lastName: s.lastName, email: s.email, password: "", role: s.role });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError("");
    const token = getToken();
    if (!token) { setFormError("Not authenticated"); setSaving(false); return; }

    try {
      if (editing) {
        // Update
        const body: Record<string, string> = {};
        if (form.firstName !== editing.firstName) body.firstName = form.firstName;
        if (form.lastName !== editing.lastName) body.lastName = form.lastName;
        if (form.email !== editing.email) body.email = form.email;
        if (form.role !== editing.role) body.role = form.role;
        if (!Object.keys(body).length) { setShowModal(false); setSaving(false); return; }

        const res = await fetch(`/api/admin/users/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setFormError(data.error || "Update failed");
          setSaving(false);
          return;
        }
      } else {
        // Create
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
          setFormError("All fields are required");
          setSaving(false);
          return;
        }
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          setFormError(data.error || "Create failed");
          setSaving(false);
          return;
        }
      }
      setShowModal(false);
      fetchStudents();
    } catch {
      setFormError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`/api/admin/users/${deleting.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleting(null);
      fetchStudents();
    } catch {
      setDeleting(null);
    }
  }

  async function handleResetPassword() {
    if (!resetting) return;
    const token = getToken();
    if (!token) return;
    setResetLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${resetting.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setResetLoading(false);
      setResetting(null);
    }
  }

  async function handleCsvUpload(file: File) {
    setUploading(true);
    setUploadResult(null);
    const token = getToken();
    if (!token) { setUploading(false); return; }
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); setUploading(false); return; }
      setUploadResult(data);
      fetchStudents();
    } catch {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  }

  if (role !== "superadmin") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Management</h1>
        <p className="text-gray-500">Access denied. This page is for superadmins only.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Student Management</h1>
          <p className="text-sm text-gray-500">{total} user{total !== 1 ? "s" : ""} total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setShowUpload(!showUpload); setUploadResult(null); }}
            className="inline-flex items-center justify-center gap-2 border border-violet-200 text-violet-700 bg-violet-50 text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-violet-100 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            CSV Upload
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

      {/* CSV Upload Panel */}
      {showUpload && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Bulk Upload Students</h3>
            <a href="/sample-students.csv" download className="text-xs text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Sample CSV
            </a>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Upload a CSV file with columns: <span className="font-mono text-gray-700">first_name, last_name, email, role</span>.
            Role is optional (defaults to <span className="font-medium">student</span>). All users get password <span className="font-mono text-gray-700">Newuser1234</span> and must change it on first login.
          </p>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-all">
            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm text-gray-500">{uploading ? "Uploading..." : "Click to select CSV file"}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCsvUpload(f);
                e.target.value = "";
              }}
            />
          </label>

          {uploadResult && (
            <div className="mt-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">{uploadResult.created} created</span>
                {uploadResult.skipped > 0 && <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">{uploadResult.skipped} skipped</span>}
                {uploadResult.failed > 0 && <span className="text-xs font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-full">{uploadResult.failed} failed</span>}
              </div>
              {uploadResult.results.filter((r) => r.status !== "created").length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {uploadResult.results.filter((r) => r.status !== "created").map((r, i) => (
                    <p key={i} className="text-xs text-gray-500">
                      <span className="font-mono">{r.email}</span> — <span className={r.status === "skipped" ? "text-amber-600" : "text-red-600"}>{r.error}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") { setSearch(searchInput); setPage(1); }
              }}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-gray-400"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {/* Role Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="w-full sm:w-40 appearance-none pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() => { setSearch(searchInput); setPage(1); }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(search || roleFilter) && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full">
                &ldquo;{search}&rdquo;
                <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} className="hover:text-violet-900 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {roleFilter && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full capitalize">
                {roleFilter}
                <button onClick={() => { setRoleFilter(""); setPage(1); }} className="hover:text-indigo-900 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={() => { setSearchInput(""); setSearch(""); setRoleFilter(""); setPage(1); }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No users found</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{s.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                          s.role === "superadmin" ? "bg-purple-50 text-purple-700"
                          : s.role === "admin" ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                        }`}>
                          {s.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => openEdit(s)} className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100">
                            Edit
                          </button>
                          {s.role !== "superadmin" && (
                            <button onClick={() => setResetting(s)} className="text-xs text-amber-600 hover:text-amber-800 transition-colors px-2 py-1 rounded hover:bg-amber-50">
                              Reset Password
                            </button>
                          )}
                          {s.role !== "superadmin" && (
                            <button onClick={() => setDeleting(s)} className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {students.map((s) => (
                <div key={s.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{s.firstName} {s.lastName}</p>
                    <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                      s.role === "superadmin" ? "bg-purple-50 text-purple-700"
                      : s.role === "admin" ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {s.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{s.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => openEdit(s)} className="text-xs font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                    {s.role !== "superadmin" && (
                      <button onClick={() => setResetting(s)} className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">Reset Password</button>
                    )}
                    {s.role !== "superadmin" && (
                      <button onClick={() => setDeleting(s)} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                    )}
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
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? "Edit User" : "Add User"}</h2>

            {formError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{formError}</p>}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                />
              </div>
              {!editing && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25"
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Confirmation */}
      {resetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setResetting(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-sm text-gray-600 mb-2">
              Reset password for <span className="font-medium">{resetting.firstName} {resetting.lastName}</span>?
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Password will be set to the default (<span className="font-mono">Newuser1234</span>). The user will be prompted to change it on next login.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setResetting(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleting(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete User</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{deleting.firstName} {deleting.lastName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
