"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", icon: "book", thumbnailUrl: "",
    description: "", about: "", price: "0", hours: "0",
    quizzes: "0", hasCertificate: false, published: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  async function handleSave() {
    setSaving(true);
    setError("");
    const token = getToken();
    if (!token) { setError("Not authenticated"); setSaving(false); return; }

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
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
        setError(data.error || "Create failed");
        setSaving(false);
        return;
      }
      const data = await res.json();
      router.push(`/dashboard/courses-manage/${data.id}`);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/courses-manage" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back to Courses
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">New Course</h1>
      </div>

      {/* Form */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-4 sm:p-6">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm({ ...form, title, ...(autoSlug ? { slug: slugify(title) } : {}) });
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
              placeholder="e.g. Web Development Fundamentals"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => { setForm({ ...form, slug: e.target.value }); setAutoSlug(false); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition font-mono"
              placeholder="web-development-fundamentals"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Thumbnail URL</label>
            <input
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Short Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition resize-none"
              placeholder="Brief summary of the course"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">About (Detailed)</label>
            <textarea
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition resize-none"
              placeholder="Detailed description of what students will learn"
            />
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
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25">
            {saving ? "Creating..." : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
