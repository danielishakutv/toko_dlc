"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

/* ── Types ───────────────────────────────────────────── */

interface Lesson {
  id?: number;
  title: string;
  videoUrl: string;
  duration: string;
  body: string;
  quizUrl: string;
  sortOrder: number;
  expanded?: boolean;
}

interface Section {
  id?: number;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
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

/* ── Main Page ───────────────────────────────────────── */

export default function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (["details", "curriculum", "enrollments"] as const).includes(searchParams.get("tab") as "details" | "curriculum" | "enrollments")
    ? (searchParams.get("tab") as "details" | "curriculum" | "enrollments")
    : "details";

  const [tab, setTab] = useState<"details" | "curriculum" | "enrollments">(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Details state */
  const [saving, setSaving] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", icon: "book", thumbnailUrl: "",
    description: "", about: "", price: "0", hours: "0",
    quizzes: "0", hasCertificate: false, published: false,
  });

  /* Curriculum state */
  const [sections, setSections] = useState<Section[]>([]);
  const [currSaving, setCurrSaving] = useState(false);
  const [currSuccess, setCurrSuccess] = useState("");

  /* Enrollments state */
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSearch, setEnrollSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  /* Counts for tabs */
  const sectionCount = sections.length;
  const enrolledCount = enrollments.length;

  /* ── Load all data once ─────────────────────────────── */

  async function loadAll() {
    const token = getToken();
    if (!token) { setError("Not authenticated"); setLoading(false); return; }
    try {
      const [courseRes, enrollRes, availRes] = await Promise.all([
        fetch(`/api/admin/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/courses/${id}/enrollments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/courses/${id}/available-students`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!courseRes.ok) { setError("Course not found"); setLoading(false); return; }
      const data = await courseRes.json();
      setCourseTitle(data.title);
      setForm({
        title: data.title, slug: data.slug, icon: data.icon,
        thumbnailUrl: data.thumbnailUrl || "",
        description: data.description || "", about: data.about || "",
        price: String(data.price), hours: String(data.hours),
        quizzes: String(data.quizzes),
        hasCertificate: data.hasCertificate, published: data.published,
      });
      const mapped: Section[] = (data.sections || [])
        .sort((a: Section, b: Section) => a.sortOrder - b.sortOrder)
        .map((s: { id: number; title: string; sortOrder: number; lessons: { id: number; title: string; videoUrl: string; duration: string; body: string; quizUrl: string; sortOrder: number }[] }) => ({
          id: s.id, title: s.title, sortOrder: s.sortOrder,
          lessons: (s.lessons || [])
            .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
            .map((l) => ({
              id: l.id, title: l.title, videoUrl: l.videoUrl || "", duration: l.duration || "",
              body: l.body || "", quizUrl: l.quizUrl || "", sortOrder: l.sortOrder, expanded: false,
            })),
        }));
      setSections(mapped);

      if (enrollRes.ok) {
        const eData = await enrollRes.json();
        setEnrollments(eData.enrollments || []);
      }
      if (availRes.ok) {
        const aData = await availRes.json();
        setAvailableStudents(aData.students || []);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [id]);

  /* ── Details handlers ───────────────────────────────── */

  async function handleSaveDetails() {
    setSaving(true);
    setError("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setSaving(false); return; }
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title, slug: form.slug, icon: form.icon,
          thumbnailUrl: form.thumbnailUrl || null,
          description: form.description, about: form.about,
          price: parseFloat(form.price) || 0, hours: parseFloat(form.hours) || 0,
          quizzes: parseInt(form.quizzes) || 0,
          hasCertificate: form.hasCertificate, published: form.published,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Update failed");
        setSaving(false);
        return;
      }
      setCourseTitle(form.title);
      router.push("/dashboard/courses-manage");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  /* ── Curriculum handlers ────────────────────────────── */

  function addSection() {
    setSections([...sections, { title: "", sortOrder: sections.length + 1, lessons: [] }]);
  }
  function removeSection(idx: number) {
    setSections(sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sortOrder: i + 1 })));
  }
  function updateSectionTitle(idx: number, title: string) {
    const copy = [...sections]; copy[idx] = { ...copy[idx], title }; setSections(copy);
  }
  function moveSectionUp(idx: number) {
    if (idx === 0) return;
    const copy = [...sections];
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    setSections(copy.map((s, i) => ({ ...s, sortOrder: i + 1 })));
  }
  function moveSectionDown(idx: number) {
    if (idx === sections.length - 1) return;
    const copy = [...sections];
    [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
    setSections(copy.map((s, i) => ({ ...s, sortOrder: i + 1 })));
  }
  function addLesson(si: number) {
    const copy = [...sections];
    copy[si] = {
      ...copy[si],
      lessons: [...copy[si].lessons, { title: "", videoUrl: "", duration: "", body: "", quizUrl: "", sortOrder: copy[si].lessons.length + 1, expanded: true }],
    };
    setSections(copy);
  }
  function removeLesson(si: number, li: number) {
    const copy = [...sections];
    copy[si] = { ...copy[si], lessons: copy[si].lessons.filter((_, i) => i !== li).map((l, i) => ({ ...l, sortOrder: i + 1 })) };
    setSections(copy);
  }
  function updateLesson(si: number, li: number, field: keyof Lesson, value: string | boolean) {
    const copy = [...sections];
    const lessons = [...copy[si].lessons];
    lessons[li] = { ...lessons[li], [field]: value };
    copy[si] = { ...copy[si], lessons };
    setSections(copy);
  }
  function toggleLessonExpand(si: number, li: number) {
    updateLesson(si, li, "expanded", !sections[si].lessons[li].expanded);
  }

  async function handleSaveCurriculum() {
    setCurrSaving(true);
    setError("");
    setCurrSuccess("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setCurrSaving(false); return; }
    const payload = sections.map((s, si) => ({
      title: s.title, sortOrder: si + 1,
      lessons: s.lessons.map((l, li) => ({
        title: l.title, videoUrl: l.videoUrl || null, duration: l.duration || null,
        body: l.body || null, quizUrl: l.quizUrl || null, sortOrder: li + 1,
      })),
    }));
    try {
      const res = await fetch(`/api/admin/courses/${id}/curriculum`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sections: payload }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        setCurrSaving(false);
        return;
      }
      setCurrSuccess("Curriculum saved successfully");
      // Reload to get fresh IDs
      const res2 = await fetch(`/api/admin/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res2.ok) {
        const data = await res2.json();
        const mapped: Section[] = (data.sections || [])
          .sort((a: Section, b: Section) => a.sortOrder - b.sortOrder)
          .map((s: { id: number; title: string; sortOrder: number; lessons: { id: number; title: string; videoUrl: string; duration: string; body: string; quizUrl: string; sortOrder: number }[] }) => ({
            id: s.id, title: s.title, sortOrder: s.sortOrder,
            lessons: (s.lessons || [])
              .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
              .map((l) => ({
                id: l.id, title: l.title, videoUrl: l.videoUrl || "", duration: l.duration || "",
                body: l.body || "", quizUrl: l.quizUrl || "", sortOrder: l.sortOrder, expanded: false,
              })),
          }));
        setSections(mapped);
      }
    } catch {
      setError("Network error");
    } finally {
      setCurrSaving(false);
    }
  }

  /* ── Enrollment handlers ────────────────────────────── */

  async function reloadEnrollments() {
    const token = getToken();
    if (!token) return;
    const [enrollRes, availRes] = await Promise.all([
      fetch(`/api/admin/courses/${id}/enrollments`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/admin/courses/${id}/available-students`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    if (enrollRes.ok) { const d = await enrollRes.json(); setEnrollments(d.enrollments || []); }
    if (availRes.ok) { const d = await availRes.json(); setAvailableStudents(d.students || []); }
  }

  async function handleEnroll() {
    if (selectedIds.length === 0) return;
    setEnrolling(true); setError("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setEnrolling(false); return; }
    try {
      const res = await fetch(`/api/admin/courses/${id}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userIds: selectedIds }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Enroll failed"); setEnrolling(false); return; }
      setSelectedIds([]); setShowPicker(false); setEnrollSearch("");
      await reloadEnrollments();
    } catch { setError("Network error"); } finally { setEnrolling(false); }
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
      if (!res.ok) { const d = await res.json(); setError(d.error || "Unenroll failed"); return; }
      await reloadEnrollments();
    } catch { setError("Network error"); }
  }

  function toggleStudent(sid: number) {
    setSelectedIds((p) => p.includes(sid) ? p.filter((x) => x !== sid) : [...p, sid]);
  }

  const filteredAvailable = availableStudents.filter(
    (s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(enrollSearch.toLowerCase()) || s.email.toLowerCase().includes(enrollSearch.toLowerCase())
  );

  /* ── Render ─────────────────────────────────────────── */

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const tabBtn = (t: typeof tab, label: string, count?: number) => (
    <button
      key={t}
      onClick={() => { setError(""); setCurrSuccess(""); setTab(t); }}
      className={t === tab
        ? "text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 rounded-xl shadow-md shadow-violet-500/25"
        : "text-sm font-medium text-gray-600 bg-white/70 border border-white/60 px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
      }
    >
      {label}{count !== undefined ? ` (${count})` : ""}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/courses-manage" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back to Courses
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{courseTitle || "Edit Course"}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabBtn("details", "Details")}
        {tabBtn("curriculum", "Curriculum", sectionCount)}
        {tabBtn("enrollments", "Enrollments", enrolledCount)}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

      {/* ═══ DETAILS TAB ═══ */}
      {tab === "details" && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Thumbnail URL</label>
              <input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Short Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">About (Detailed)</label>
              <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price ($)</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hours</label>
                <input type="number" min="0" step="0.5" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Quizzes</label>
                <input type="number" min="0" value={form.quizzes} onChange={(e) => setForm({ ...form, quizzes: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.hasCertificate} onChange={(e) => setForm({ ...form, hasCertificate: e.target.checked })} className="rounded accent-violet-600" />
                Certificate
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded accent-violet-600" />
                Published
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Link href="/dashboard/courses-manage" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancel</Link>
            <button onClick={handleSaveDetails} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ═══ CURRICULUM TAB ═══ */}
      {tab === "curriculum" && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-4 sm:p-6">
          {currSuccess && <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">{currSuccess}</p>}

          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-3">No sections yet</p>
              <button onClick={addSection} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25">
                Add First Section
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, si) => (
                <div key={si} className="border border-gray-200 rounded-xl p-4 bg-white/50">
                  {/* Section header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-gray-400 min-w-[1.5rem]">{si + 1}</span>
                    <input value={section.title} onChange={(e) => updateSectionTitle(si, e.target.value)} placeholder="Section title" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-violet-400 transition" />
                    <button onClick={() => moveSectionUp(si)} disabled={si === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move up">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                    </button>
                    <button onClick={() => moveSectionDown(si)} disabled={si === sections.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move down">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    <button onClick={() => removeSection(si)} className="p-1 text-red-400 hover:text-red-600" title="Remove section">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="ml-6 space-y-2">
                    {section.lessons.map((lesson, li) => (
                      <div key={li} className="border border-gray-100 rounded-lg bg-white/60">
                        {/* Lesson header row */}
                        <div className="flex items-center gap-2 px-3 py-2">
                          <span className="text-xs text-gray-400 min-w-[2rem]">{si + 1}.{li + 1}</span>
                          <input value={lesson.title} onChange={(e) => updateLesson(si, li, "title", e.target.value)} placeholder="Lesson title" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-400 transition" />
                          <button onClick={() => toggleLessonExpand(si, li)} className="p-1 text-gray-400 hover:text-gray-700" title={lesson.expanded ? "Collapse" : "Expand"}>
                            <svg className={`w-4 h-4 transition-transform ${lesson.expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                          </button>
                          <button onClick={() => removeLesson(si, li)} className="p-1 text-red-400 hover:text-red-600" title="Remove lesson">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        {/* Expanded lesson details */}
                        {lesson.expanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-gray-100 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-0.5">Video URL</label>
                                <input value={lesson.videoUrl} onChange={(e) => updateLesson(si, li, "videoUrl", e.target.value)} placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400 transition" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-0.5">Duration</label>
                                <input value={lesson.duration} onChange={(e) => updateLesson(si, li, "duration", e.target.value)} placeholder="e.g. 45 min" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400 transition" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-0.5">Quiz URL</label>
                              <input value={lesson.quizUrl} onChange={(e) => updateLesson(si, li, "quizUrl", e.target.value)} placeholder="https://... (link to quiz)" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400 transition" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-0.5">Content</label>
                              <textarea value={lesson.body} onChange={(e) => updateLesson(si, li, "body", e.target.value)} rows={3} placeholder="Lesson content / notes..." className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400 transition resize-none" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addLesson(si)} className="text-xs text-violet-600 hover:text-violet-800 font-medium mt-1">
                      + Add Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={addSection} className="text-sm text-violet-600 hover:text-violet-800 font-medium">
              + Add Section
            </button>
            <button onClick={handleSaveCurriculum} disabled={currSaving} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
              {currSaving ? "Saving..." : "Save Curriculum"}
            </button>
          </div>
        </div>
      )}

      {/* ═══ ENROLLMENTS TAB ═══ */}
      {tab === "enrollments" && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{enrolledCount} enrolled student{enrolledCount !== 1 ? "s" : ""}</p>
            <button onClick={() => setShowPicker(!showPicker)} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25">
              {showPicker ? "Cancel" : "Enroll Students"}
            </button>
          </div>

          {showPicker && (
            <div className="border border-violet-200 rounded-xl p-4 mb-4 bg-violet-50/30">
              <input value={enrollSearch} onChange={(e) => setEnrollSearch(e.target.value)} placeholder="Search available students..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition mb-3" />
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
      )}
    </div>
  );
}
