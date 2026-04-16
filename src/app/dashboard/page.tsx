import { BookOpen, CircleCheck, Clock, Trophy } from "lucide-react";
import { courses } from "../data";
import CourseIcon from "../CourseIcon";
import type { ReactNode } from "react";

const registeredCourses = courses.filter((c) => c.status === "Registered");

const stats: { label: string; value: number; icon: ReactNode }[] = [
  { label: "Enrolled Courses", value: registeredCourses.length, icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} /> },
  { label: "Completed", value: 1, icon: <CircleCheck className="w-5 h-5" strokeWidth={1.5} /> },
  { label: "In Progress", value: 2, icon: <Clock className="w-5 h-5" strokeWidth={1.5} /> },
  { label: "Certificates", value: 1, icon: <Trophy className="w-5 h-5" strokeWidth={1.5} /> },
];

const upcomingDeadlines = [
  { course: "Web Development Fundamentals", task: "Module 3 Quiz", due: "Mar 20, 2026" },
  { course: "UI/UX Design Principles", task: "Wireframe Assignment", due: "Mar 23, 2026" },
  { course: "Cybersecurity Awareness", task: "Final Assessment", due: "Mar 28, 2026" },
];

const recentActivity = [
  { action: "Completed lesson", detail: "DOM Manipulation — Web Development Fundamentals", time: "2 hours ago" },
  { action: "Submitted quiz", detail: "CSS Selectors Quiz — Score: 90%", time: "Yesterday" },
  { action: "Enrolled in course", detail: "Cybersecurity Awareness", time: "3 days ago" },
  { action: "Earned certificate", detail: "Web Development Fundamentals", time: "1 week ago" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, Toko Learner</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{d.task}</p>
                  <p className="text-xs text-gray-500">{d.course}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{d.due}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.action}</p>
                  <p className="text-xs text-gray-500">{a.detail}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Progress</h2>
        <div className="space-y-4">
          {registeredCourses.map((course) => {
            const progress = course.slug === "web-development-fundamentals" ? 75 : course.slug === "ui-ux-design-principles" ? 40 : 15;
            return (
              <div key={course.slug}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <CourseIcon name={course.icon} className="w-4 h-4 text-gray-500" />
                    {course.title}
                  </p>
                  <span className="text-xs font-medium text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
