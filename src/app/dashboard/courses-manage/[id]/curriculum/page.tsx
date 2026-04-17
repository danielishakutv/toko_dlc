"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Lesson {
  id?: number;
  title: string;
  sortOrder: number;
}

interface Section {
  id?: number;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export default function CurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setError("Not authenticated"); setLoading(false); return; }
      try {
        const res = await fetch(`/api/admin/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setError("Course not found"); setLoading(false); return; }
        const data = await res.json();
        setCourseTitle(data.title);
        const mapped: Section[] = (data.sections || [])
          .sort((a: Section, b: Section) => a.sortOrder - b.sortOrder)
          .map((s: Section & { id: number; lessons: (Lesson & { id: number })[] }) => ({
            id: s.id,
            title: s.title,
            sortOrder: s.sortOrder,
            lessons: (s.lessons || [])
              .sort((a: Lesson, b: Lesson) => a.sortOrder - b.sortOrder)
              .map((l: Lesson & { id: number }) => ({ id: l.id, title: l.title, sortOrder: l.sortOrder })),
          }));
        setSections(mapped);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function addSection() {
    setSections([...sections, { title: "", sortOrder: sections.length + 1, lessons: [] }]);
  }

  function removeSection(idx: number) {
    setSections(sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sortOrder: i + 1 })));
  }

  function updateSectionTitle(idx: number, title: string) {
    const copy = [...sections];
    copy[idx] = { ...copy[idx], title };
    setSections(copy);
  }

  function addLesson(sectionIdx: number) {
    const copy = [...sections];
    copy[sectionIdx] = {
      ...copy[sectionIdx],
      lessons: [...copy[sectionIdx].lessons, { title: "", sortOrder: copy[sectionIdx].lessons.length + 1 }],
    };
    setSections(copy);
  }

  function removeLesson(sectionIdx: number, lessonIdx: number) {
    const copy = [...sections];
    copy[sectionIdx] = {
      ...copy[sectionIdx],
      lessons: copy[sectionIdx].lessons.filter((_, i) => i !== lessonIdx).map((l, i) => ({ ...l, sortOrder: i + 1 })),
    };
    setSections(copy);
  }

  function updateLessonTitle(sectionIdx: number, lessonIdx: number, title: string) {
    const copy = [...sections];
    const lessons = [...copy[sectionIdx].lessons];
    lessons[lessonIdx] = { ...lessons[lessonIdx], title };
    copy[sectionIdx] = { ...copy[sectionIdx], lessons };
    setSections(copy);
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

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setSaving(false); return; }
    const payload = sections.map((s, si) => ({
      title: s.title,
      sortOrder: si + 1,
      lessons: s.lessons.map((l, li) => ({ title: l.title, sortOrder: li + 1 })),
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
        setSaving(false);
        return;
      }
      setSuccess("Curriculum saved successfully");
      // Reload to get fresh IDs
      const res2 = await fetch(`/api/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res2.ok) {
        const data = await res2.json();
        const mapped: Section[] = (data.sections || [])
          .sort((a: Section, b: Section) => a.sortOrder - b.sortOrder)
          .map((s: Section & { id: number; lessons: (Lesson & { id: number })[] }) => ({
            id: s.id, title: s.title, sortOrder: s.sortOrder,
            lessons: (s.lessons || [])
              .sort((a: Lesson, b: Lesson) => a.sortOrder - b.sortOrder)
              .map((l: Lesson & { id: number }) => ({ id: l.id, title: l.title, sortOrder: l.sortOrder })),
          }));
        setSections(mapped);
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{courseTitle} — Curriculum</h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Link href={`/dashboard/courses-manage/${id}`} className="text-sm font-medium text-gray-600 bg-white/70 border border-white/60 px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">Details</Link>
        <span className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 rounded-xl shadow-md shadow-violet-500/25">Curriculum</span>
        <Link href={`/dashboard/courses-manage/${id}/enrollments`} className="text-sm font-medium text-gray-600 bg-white/70 border border-white/60 px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">Enrollments</Link>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-4 sm:p-6">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">{success}</p>}

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
                  <input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(si, e.target.value)}
                    placeholder="Section title"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-violet-400 transition"
                  />
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
                    <div key={li} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 min-w-[1.5rem]">{si + 1}.{li + 1}</span>
                      <input
                        value={lesson.title}
                        onChange={(e) => updateLessonTitle(si, li, e.target.value)}
                        placeholder="Lesson title"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-400 transition"
                      />
                      <button onClick={() => removeLesson(si, li)} className="p-1 text-red-400 hover:text-red-600" title="Remove lesson">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
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
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
            {saving ? "Saving..." : "Save Curriculum"}
          </button>
        </div>
      </div>
    </div>
  );
}
