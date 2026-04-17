"use client";

import { useState, useEffect, useCallback } from "react";

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

interface Section {
  id?: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  title: string;
  videoUrl: string;
  duration: string;
  body: string;
  sortOrder: number;
}

interface Enrollment {
  enrollmentId: string;
  enrolledAt: string;
  completedAt: string | null;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AvailableStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CoursesManagePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search/filter
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Course modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "", slug: "", icon: "book", thumbnailUrl: "",
    description: "", about: "", price: "0", hours: "0",
    quizzes: "0", hasCertificate: false, published: false,
  });
  const [courseFormError, setCourseFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // Delete
  const [deleting, setDeleting] = useState<Course | null>(null);

  // Curriculum modal
  const [curriculumCourse, setCurriculumCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [curriculumSaving, setCurriculumSaving] = useState(false);

  // Enrollment modal
  const [enrollmentCourse, setEnrollmentCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [enrollSaving, setEnrollSaving] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const perPage = 20;
  const role = getUserRole();

  // ──── Fetch courses ────
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

  // ──── Course CRUD ────
  function openCreateCourse() {
    setEditingCourse(null);
    setCourseForm({ title: "", slug: "", icon: "book", thumbnailUrl: "", description: "", about: "", price: "0", hours: "0", quizzes: "0", hasCertificate: false, published: false });
    setCourseFormError("");
    setAutoSlug(true);
    setShowCourseModal(true);
  }

  function openEditCourse(c: Course) {
    setEditingCourse(c);
    setCourseForm({
      title: c.title, slug: c.slug, icon: c.icon, thumbnailUrl: c.thumbnailUrl || "",
      description: c.description, about: c.about, price: String(c.price),
      hours: String(c.hours), quizzes: String(c.quizzes),
      hasCertificate: c.hasCertificate, published: c.published,
    });
    setCourseFormError("");
    setAutoSlug(false);
    setShowCourseModal(true);
  }

  async function handleSaveCourse() {
    setSaving(true);
    setCourseFormError("");
    const token = getToken();
    if (!token) { setCourseFormError("Not authenticated"); setSaving(false); return; }

    const payload = {
      title: courseForm.title,
      slug: courseForm.slug,
      icon: courseForm.icon,
      thumbnailUrl: courseForm.thumbnailUrl || null,
      description: courseForm.description,
      about: courseForm.about,
      price: parseFloat(courseForm.price) || 0,
      hours: parseFloat(courseForm.hours) || 0,
      quizzes: parseInt(courseForm.quizzes) || 0,
      hasCertificate: courseForm.hasCertificate,
      published: courseForm.published,
    };

    try {
      const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : "/api/admin/courses";
      const method = editingCourse ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setCourseFormError(data.error || "Save failed");
        setSaving(false);
        return;
      }
      setShowCourseModal(false);
      fetchCourses();
    } catch {
      setCourseFormError("Network error");
    } finally {
      setSaving(false);
    }
  }

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

  // ──── Curriculum ────
  async function openCurriculum(c: Course) {
    setCurriculumCourse(c);
    setCurriculumLoading(true);
    const token = getToken();
    try {
      const res = await fetch(`/api/admin/courses/${c.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch { /* ignore */ }
    setCurriculumLoading(false);
  }

  function addSection() {
    setSections([...sections, { title: "", sortOrder: sections.length + 1, lessons: [] }]);
  }

  function removeSection(idx: number) {
    setSections(sections.filter((_, i) => i !== idx));
  }

  function updateSection(idx: number, field: string, value: string) {
    const updated = [...sections];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[idx] as any)[field] = value;
    setSections(updated);
  }

  function addLesson(secIdx: number) {
    const updated = [...sections];
    updated[secIdx].lessons.push({ title: "", videoUrl: "", duration: "", body: "", sortOrder: updated[secIdx].lessons.length + 1 });
    setSections(updated);
  }

  function removeLesson(secIdx: number, lesIdx: number) {
    const updated = [...sections];
    updated[secIdx].lessons = updated[secIdx].lessons.filter((_, i) => i !== lesIdx);
    setSections(updated);
  }

  function updateLesson(secIdx: number, lesIdx: number, field: string, value: string) {
    const updated = [...sections];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[secIdx].lessons[lesIdx] as any)[field] = value;
    setSections(updated);
  }

  async function saveCurriculum() {
    if (!curriculumCourse) return;
    setCurriculumSaving(true);
    const token = getToken();
    try {
      const res = await fetch(`/api/admin/courses/${curriculumCourse.id}/curriculum`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sections: sections.map((s, i) => ({ ...s, sortOrder: i + 1, lessons: s.lessons.map((l, j) => ({ ...l, sortOrder: j + 1 })) })) }),
      });
      if (res.ok) {
        setCurriculumCourse(null);
        fetchCourses();
      }
    } catch { /* ignore */ }
    setCurriculumSaving(false);
  }

  // ──── Enrollments ────
  async function openEnrollments(c: Course) {
    setEnrollmentCourse(c);
    setEnrollmentLoading(true);
    setShowStudentPicker(false);
    setSelectedStudents([]);
    setStudentSearch("");
    const token = getToken();
    try {
      const res = await fetch(`/api/admin/courses/${c.id}/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments);
      }
    } catch { /* ignore */ }
    setEnrollmentLoading(false);
  }

  async function searchAvailableStudents() {
    if (!enrollmentCourse) return;
    const token = getToken();
    const params = new URLSearchParams();
    if (studentSearch) params.set("search", studentSearch);
    try {
      const res = await fetch(`/api/admin/courses/${enrollmentCourse.id}/available-students?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableStudents(data.students);
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (showStudentPicker && enrollmentCourse) {
      searchAvailableStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStudentPicker, studentSearch]);

  async function enrollSelected() {
    if (!enrollmentCourse || selectedStudents.length === 0) return;
    setEnrollSaving(true);
    const token = getToken();
    try {
      await fetch(`/api/admin/courses/${enrollmentCourse.id}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userIds: selectedStudents }),
      });
      setSelectedStudents([]);
      setShowStudentPicker(false);
      await openEnrollments(enrollmentCourse);
      fetchCourses();
    } catch { /* ignore */ }
    setEnrollSaving(false);
  }

  async function unenrollStudent(userId: string) {
    if (!enrollmentCourse) return;
    const token = getToken();
    try {
      await fetch(`/api/admin/courses/${enrollmentCourse.id}/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId }),
      });
      setEnrollments(enrollments.filter((e) => e.userId !== userId));
      fetchCourses();
    } catch { /* ignore */ }
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
        <button
          onClick={openCreateCourse}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Course
        </button>
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
                          <button onClick={() => openEditCourse(c)} className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100">Edit</button>
                          <button onClick={() => openCurriculum(c)} className="text-xs text-violet-600 hover:text-violet-900 transition-colors px-2 py-1 rounded hover:bg-violet-50">Curriculum</button>
                          <button onClick={() => openEnrollments(c)} className="text-xs text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded hover:bg-blue-50">Enrollments</button>
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
                    <button onClick={() => openEditCourse(c)} className="text-xs font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => openCurriculum(c)} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Curriculum</button>
                    <button onClick={() => openEnrollments(c)} className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Enrollments</button>
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

      {/* ──── Course Create/Edit Modal ──── */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCourseModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingCourse ? "Edit Course" : "Add Course"}</h2>
            {courseFormError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{courseFormError}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input
                  value={courseForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setCourseForm({ ...courseForm, title, ...(autoSlug && !editingCourse ? { slug: slugify(title) } : {}) });
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                <input
                  value={courseForm.slug}
                  onChange={(e) => { setCourseForm({ ...courseForm, slug: e.target.value }); setAutoSlug(false); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition font-mono"
                  placeholder="course-url-slug"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Thumbnail URL</label>
                <input
                  value={courseForm.thumbnailUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Short Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">About (Detailed)</label>
                <textarea
                  value={courseForm.about}
                  onChange={(e) => setCourseForm({ ...courseForm, about: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price ($)</label>
                  <input type="number" min="0" step="0.01" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Hours</label>
                  <input type="number" min="0" step="0.5" value={courseForm.hours} onChange={(e) => setCourseForm({ ...courseForm, hours: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quizzes</label>
                  <input type="number" min="0" value={courseForm.quizzes} onChange={(e) => setCourseForm({ ...courseForm, quizzes: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={courseForm.hasCertificate} onChange={(e) => setCourseForm({ ...courseForm, hasCertificate: e.target.checked })} className="rounded accent-violet-600" />
                  Certificate
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={courseForm.published} onChange={(e) => setCourseForm({ ...courseForm, published: e.target.checked })} className="rounded accent-violet-600" />
                  Published
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleSaveCourse} disabled={saving} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
                {saving ? "Saving..." : editingCourse ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──── Curriculum Modal ──── */}
      {curriculumCourse && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCurriculumCourse(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Curriculum</h2>
            <p className="text-sm text-gray-500 mb-4">{curriculumCourse.title}</p>

            {curriculumLoading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-4">
                {sections.map((sec, si) => (
                  <div key={si} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-gray-400 shrink-0">Section {si + 1}</span>
                      <input
                        value={sec.title}
                        onChange={(e) => updateSection(si, "title", e.target.value)}
                        placeholder="Section title"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-400 transition"
                      />
                      <button onClick={() => removeSection(si)} className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0">Remove</button>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-2 ml-4">
                      {sec.lessons.map((les, li) => (
                        <div key={li} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 shrink-0">{si + 1}.{li + 1}</span>
                            <input
                              value={les.title}
                              onChange={(e) => updateLesson(si, li, "title", e.target.value)}
                              placeholder="Lesson title"
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-violet-400 transition bg-white"
                            />
                            <button onClick={() => removeLesson(si, li)} className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input value={les.duration} onChange={(e) => updateLesson(si, li, "duration", e.target.value)} placeholder="Duration (e.g. 15:00)" className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-violet-400 transition bg-white" />
                            <input value={les.videoUrl} onChange={(e) => updateLesson(si, li, "videoUrl", e.target.value)} placeholder="Video URL" className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-violet-400 transition bg-white" />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addLesson(si)}
                        className="text-xs text-violet-600 hover:text-violet-900 transition-colors flex items-center gap-1 py-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Add Lesson
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSection}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:text-violet-600 hover:border-violet-300 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Add Section
                </button>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setCurriculumCourse(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={saveCurriculum} disabled={curriculumSaving} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
                {curriculumSaving ? "Saving..." : "Save Curriculum"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──── Enrollments Modal ──── */}
      {enrollmentCourse && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEnrollmentCourse(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Enrollments</h2>
            <p className="text-sm text-gray-500 mb-4">{enrollmentCourse.title}</p>

            {enrollmentLoading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : (
              <>
                {/* Enroll button */}
                {!showStudentPicker && (
                  <button
                    onClick={() => { setShowStudentPicker(true); setStudentSearch(""); }}
                    className="w-full mb-4 border-2 border-dashed border-gray-300 rounded-xl py-2.5 text-sm text-gray-500 hover:text-violet-600 hover:border-violet-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Enroll Students
                  </button>
                )}

                {/* Student picker */}
                {showStudentPicker && (
                  <div className="mb-4 border border-violet-200 rounded-xl p-3 bg-violet-50/30">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search students to enroll..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition bg-white"
                      />
                      <button onClick={() => searchAvailableStudents()} className="text-xs font-medium text-white bg-violet-600 px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors">Search</button>
                    </div>
                    {availableStudents.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-2">No students available</p>
                    ) : (
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {availableStudents.map((s) => (
                          <label key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/60 transition-colors text-sm">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(s.id)}
                              onChange={(e) => {
                                setSelectedStudents(e.target.checked
                                  ? [...selectedStudents, s.id]
                                  : selectedStudents.filter((id) => id !== s.id)
                                );
                              }}
                              className="accent-violet-600"
                            />
                            <span className="text-gray-700">{s.firstName} {s.lastName}</span>
                            <span className="text-xs text-gray-400 ml-auto">{s.email}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => { setShowStudentPicker(false); setSelectedStudents([]); }} className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5">Cancel</button>
                      <button
                        onClick={enrollSelected}
                        disabled={selectedStudents.length === 0 || enrollSaving}
                        className="text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-40"
                      >
                        {enrollSaving ? "Enrolling..." : `Enroll (${selectedStudents.length})`}
                      </button>
                    </div>
                  </div>
                )}

                {/* Enrolled students list */}
                {enrollments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No students enrolled yet</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {enrollments.map((e) => (
                      <div key={e.enrollmentId} className="flex items-center justify-between px-3 py-2 border border-gray-100 rounded-lg">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{e.firstName} {e.lastName}</p>
                          <p className="text-xs text-gray-400 truncate">{e.email}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="text-xs text-gray-400">{new Date(e.enrolledAt).toLocaleDateString()}</span>
                          <button onClick={() => unenrollStudent(e.userId)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end mt-6">
              <button onClick={() => setEnrollmentCourse(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ──── Delete Confirmation ──── */}
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
