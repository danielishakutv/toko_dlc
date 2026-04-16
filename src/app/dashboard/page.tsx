import type { ReactNode } from "react";
import { courses } from "../data";
import CourseIcon from "../CourseIcon";

const registeredCourses = courses.filter((c) => c.status === "Registered");

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
);
const CircleCheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" /></svg>
);
const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18h-9M8 2h8l-1 7h-6L8 2ZM12 9v5m-4 4h8m-8 0a2 2 0 0 1-2-2h12a2 2 0 0 1-2 2M6 2H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4m12-7h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4" /></svg>
);

const stats: { label: string; value: number; icon: ReactNode }[] = [
  { label: "Enrolled Courses", value: registeredCourses.length, icon: <BookOpenIcon /> },
  { label: "Completed", value: 1, icon: <CircleCheckIcon /> },
  { label: "In Progress", value: 2, icon: <ClockIcon /> },
  { label: "Certificates", value: 1, icon: <TrophyIcon /> },
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
