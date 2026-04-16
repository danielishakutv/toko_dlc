import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "../../Header";
import Footer from "../../Footer";
import { courses } from "../../data";
import CourseIcon from "../../CourseIcon";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Toko Academy
          </Link>{" "}
          /{" "}
          <Link href="/courses" className="hover:text-gray-700">
            Courses
          </Link>{" "}
          / <span className="text-gray-700">{course.title}</span>
        </nav>

        {/* Hero */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Left — Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button className="bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Enroll in Course
              </button>
              <span className="text-sm font-semibold border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700">
                {course.price}
              </span>
            </div>

            {course.status && (
              <p className="text-sm text-gray-500">
                Already registered?{" "}
                <span className="font-semibold text-gray-900">Sign In</span>
              </p>
            )}
          </div>

          {/* Right — Thumbnail / Video placeholder */}
          <div className="lg:w-[420px] shrink-0">
            <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <CourseIcon name={course.icon} className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-12 border-t border-gray-200 pt-4">
          <span>
            <strong className="text-gray-900">{course.lectures}</strong>{" "}
            lectures
          </span>
          <span>
            <strong className="text-gray-900">{course.hours}</strong> hours of
            video
          </span>
          <span>
            <strong className="text-gray-900">{course.quizzes}</strong>{" "}
            {course.quizzes === 1 ? "quiz" : "quizzes"}
          </span>
          {course.certificate && (
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Certificate of completion
            </span>
          )}
        </div>

        {/* About */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About this course
          </h2>
          <p className="text-gray-600 leading-relaxed">{course.about}</p>
        </section>

        {/* Course Sections */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Course Sections
          </h2>
          <div className="divide-y divide-gray-100">
            {course.sections.map((section, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {i + 1}. {section.title}
                </h3>
                <ul className="ml-5 space-y-1">
                  {section.lessons.map((lesson, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
                        />
                      </svg>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-gray-100">
            {course.faqs.map((faq, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Instructor */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Instructor</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Toko Academy Team</p>
              <p className="text-sm text-gray-500">
                Expert instructors passionate about digital education.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
