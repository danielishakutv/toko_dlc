"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { courses } from "@/app/data";
import { courseContentMap } from "@/app/data-content";
import CourseIcon from "@/app/CourseIcon";
import { MessageCircle, CalendarDays, MessagesSquare, Mail, Download, Flag, FileText, ExternalLink, Play, ChevronLeft, ChevronRight } from "lucide-react";

// Demo completion data per course
const completionMap: Record<string, Record<string, boolean>> = {
  "web-development-fundamentals": {
    "What is HTML?": true,
    "Document structure": true,
    "Tags & elements": true,
    "Forms & inputs": false,
    "CSS selectors": true,
    "Box model": true,
    "Flexbox & Grid": true,
    "Responsive design": false,
    "Variables & types": true,
    "Functions": false,
    "DOM manipulation": false,
    "Events & listeners": false,
  },
  "ui-ux-design-principles": {
    "User interviews": true,
    "Personas & journeys": true,
    "Information architecture": false,
    "Design principles": true,
    "Typography & color": false,
    "Component systems": false,
    "Responsive layouts": false,
    "Wireframing tools": false,
    "Interactive prototypes": false,
    "Usability testing": false,
    "Iterating on feedback": false,
  },
  "cybersecurity-awareness": {
    "Common attack types": true,
    "Phishing & social engineering": false,
    "Malware overview": false,
    "Password management": false,
    "Multi-factor authentication": false,
    "Encryption basics": false,
    "Secure browsing": false,
    "Security policies": false,
    "Incident response": false,
    "Compliance basics": false,
  },
};

function getCompletion(slug: string, lesson: string) {
  return completionMap[slug]?.[lesson] ?? false;
}

function lessonId(lesson: string) {
  return lesson.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const quickActions = [
  { label: "Join WhatsApp Group", icon: <MessageCircle className="w-4 h-4" strokeWidth={1.5} />, color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Course Schedule", icon: <CalendarDays className="w-4 h-4" strokeWidth={1.5} />, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Discussion Forum", icon: <MessagesSquare className="w-4 h-4" strokeWidth={1.5} />, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Contact Instructor", icon: <Mail className="w-4 h-4" strokeWidth={1.5} />, color: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "Download Resources", icon: <Download className="w-4 h-4" strokeWidth={1.5} />, color: "bg-gray-50 text-gray-700 border-gray-200" },
  { label: "Report an Issue", icon: <Flag className="w-4 h-4" strokeWidth={1.5} />, color: "bg-red-50 text-red-700 border-red-200" },
];

export default function EnrolledCoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const course = courses.find((c) => c.slug === slug);
  const content = slug ? courseContentMap[slug] : undefined;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Build flat list of all lessons
  const allLessons = course?.sections.flatMap((s) => s.lessons) ?? [];

  // Track which lesson is currently in view
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const container = contentRef.current;
    const sections = container.querySelectorAll<HTMLElement>("[data-lesson]");
    let current = "";
    for (const el of sections) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 200) current = el.dataset.lesson ?? "";
    }
    if (current) setActiveLesson(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!course) return <p className="text-gray-500 py-10">Course not found.</p>;

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => getCompletion(slug, l)).length;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  function scrollToLesson(lesson: string) {
    const el = document.getElementById(lessonId(lesson));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      {/* Course header */}
      <div className="border-b border-white/40 bg-white/70 backdrop-blur-sm px-4 sm:px-6 py-4">
        <Link href="/dashboard/my-courses" className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back to My Courses
        </Link>

        <div className="flex items-start gap-4 mt-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
            <CourseIcon name={course.icon} className="w-6 h-6 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>{course.hours} hrs</span>
              <span>{totalLessons} lessons</span>
              <span>{course.quizzes} quizzes</span>
              <span className="font-medium text-gray-700">{progress}% complete</span>
            </div>
            <div className="mt-2 max-w-md bg-gray-200/50 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickActions.map((a) => (
            <button key={a.label} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:brightness-95 ${a.color}`}>
              {a.icon}
              <span className="hidden sm:inline">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex min-h-[calc(100vh-13rem)]">
        {/* Lesson sidebar */}
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} shrink-0 transition-all duration-200 overflow-hidden border-r border-white/40 bg-white/60 backdrop-blur-sm hidden lg:block sticky top-0 self-start h-screen`}>
          <div className="w-72 h-full overflow-y-auto py-4">
            {course.sections.map((section, si) => {
              const sectionCompleted = section.lessons.filter((l) => getCompletion(slug, l)).length;
              return (
                <div key={si} className="mb-2">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <span className="text-xs text-gray-400">{sectionCompleted}/{section.lessons.length}</span>
                  </div>
                  {section.lessons.map((lesson, li) => {
                    const done = getCompletion(slug, lesson);
                    const active = activeLesson === lessonId(lesson);
                    return (
                      <button
                        key={li}
                        onClick={() => scrollToLesson(lesson)}
                        className={`w-full text-left px-4 py-2 flex items-center gap-2.5 text-sm transition-all duration-200 ${
                          active ? "bg-violet-50/80 text-violet-900 font-medium" : "text-gray-600 hover:bg-white/60"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${done ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "border border-gray-300"}`}>
                          {done && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                        <span className={done ? "line-through text-gray-400" : ""}>{lesson}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Resources link in sidebar */}
            <button
              onClick={() => document.getElementById("resources")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-sm text-gray-600 hover:bg-gray-50 mt-2 border-t border-gray-100 pt-3"
            >
              <Download className="w-4 h-4 text-gray-400" />
              Resources
            </button>
          </div>
        </aside>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center w-5 shrink-0 bg-white/40 hover:bg-white/60 border-r border-white/40 transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
        </button>

        {/* Main content */}
        <div ref={contentRef} className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            {/* Lesson content */}
            {course.sections.map((section, si) => (
              <div key={si}>
                <h2 className="text-lg font-bold text-gray-900 mb-6 mt-2">
                  Section {si + 1}: {section.title}
                </h2>

                {section.lessons.map((lesson, li) => {
                  const done = getCompletion(slug, lesson);
                  const lessonContent = content?.lessons[lesson];
                  const globalIndex = course.sections.slice(0, si).reduce((a, s) => a + s.lessons.length, 0) + li + 1;

                  return (
                    <article
                      key={li}
                      id={lessonId(lesson)}
                      data-lesson={lessonId(lesson)}
                      className="mb-12 scroll-mt-24"
                    >
                      {/* Lesson header */}
                      <div className="flex items-start gap-3 mb-4">
                          <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${done ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "bg-white/70 text-gray-500"}`}>
                          {done ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : globalIndex}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{lesson}</h3>
                          {lessonContent && <span className="text-xs text-gray-400">{lessonContent.duration}</span>}
                        </div>
                      </div>

                      {/* Video placeholder */}
                      {lessonContent && (
                        <div className="aspect-video bg-gray-900 rounded-xl mb-5 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                          </div>
                          <span className="absolute bottom-3 right-3 text-xs text-white/80 bg-black/40 rounded px-2 py-0.5">{lessonContent.duration}</span>
                        </div>
                      )}

                      {/* Text content */}
                      {lessonContent && (
                        <div className="prose-sm">
                          <p className="text-sm text-gray-700 leading-relaxed mb-4">{lessonContent.body}</p>

                          {/* Subtopics */}
                          {lessonContent.subtopics.length > 0 && (
                            <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topics covered</h4>
                              <ul className="space-y-1.5">
                                {lessonContent.subtopics.map((topic, ti) => (
                                  <li key={ti} className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* No content fallback */}
                      {!lessonContent && (
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center">
                          <p className="text-sm text-gray-400">Content coming soon</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ))}

            {/* ─── Resources Section ─── */}
            {content?.resources && content.resources.length > 0 && (
              <section id="resources" className="scroll-mt-24 mt-8 mb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Resources</h2>

                {/* PDFs */}
                {content.resources.filter((r) => r.type === "pdf").length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Downloadable Files</h3>
                    <div className="space-y-2">
                      {content.resources.filter((r) => r.type === "pdf").map((r, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-xl px-4 py-3 hover:shadow-md transition-all duration-200 group cursor-pointer">
                          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{r.title}</p>
                            <p className="text-xs text-gray-500">{r.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-400">{r.size}</span>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {content.resources.filter((r) => r.type === "link").length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Further Study</h3>
                    <div className="space-y-2">
                      {content.resources.filter((r) => r.type === "link").map((r, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-xl px-4 py-3 hover:shadow-md transition-all duration-200 group cursor-pointer">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <ExternalLink className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{r.title}</p>
                            <p className="text-xs text-gray-500">{r.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
