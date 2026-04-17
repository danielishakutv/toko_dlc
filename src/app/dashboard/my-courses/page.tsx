"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Enrollment {
  id: number;
  course: { id: number; slug: string; title: string; icon: string; description: string; hours: number; lectureCount: number };
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

interface Course {
  id: number;
  slug: string;
  title: string;
  icon: string;
  description: string;
  hours: number;
  lectureCount: number;
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [available, setAvailable] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const [enrRes, courseRes] = await Promise.all([
          fetch("/api/me/enrollments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/courses"),
        ]);
        let enrolledSlugs = new Set<string>();
        if (enrRes.ok) {
          const data = await enrRes.json();
          const enrs: Enrollment[] = data.enrollments || [];
          setEnrollments(enrs);
          enrolledSlugs = new Set(enrs.map((e) => e.course.slug));
        }
        if (courseRes.ok) {
          const allCourses: Course[] = await courseRes.json();
          setAvailable(allCourses.filter((c) => !enrolledSlugs.has(c.slug)));
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">My Courses</h1>
      <p className="text-gray-500 mb-8">Track your enrolled courses and explore new ones</p>

      {/* Enrolled */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Enrolled Courses</h2>
      {enrollments.length === 0 ? (
        <p className="text-sm text-gray-400 mb-10">You haven&apos;t enrolled in any courses yet</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {enrollments.map((e) => (
            <Link key={e.id} href={`/dashboard/course/${e.course.slug}`} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 hover:shadow-lg hover:border-violet-200/60 transition-all duration-200">
              <h3 className="text-sm font-bold text-gray-900 mt-1 mb-1">{e.course.title}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{e.course.description}</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{e.progress}% complete</span>
                <span className="text-xs text-gray-500">{e.completedLessons}/{e.totalLessons} lessons</span>
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full" style={{ width: `${e.progress}%` }} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Available */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Available Courses</h2>
      {available.length === 0 ? (
        <p className="text-sm text-gray-400">No additional courses available</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {available.map((course) => (
            <Link key={course.slug} href={`/course/${course.slug}`} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 hover:shadow-lg hover:border-violet-200/60 transition-all duration-200">
              <h3 className="text-sm font-bold text-gray-900 mt-1 mb-1">{course.title}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{course.hours} hrs &middot; {course.lectureCount} lectures</span>
                <span className="text-xs font-medium text-violet-600 border border-violet-200 rounded-full px-3 py-1">View</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
