import Link from "next/link";
import Header from "../Header";
import Footer from "../Footer";
import { courses } from "../data";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <nav className="text-sm text-gray-500 mb-4">
          Toko Academy / <span className="text-gray-700">Courses</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
          Toko Academy courses
        </h1>

        <div className="flex flex-col gap-6">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/course/${course.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl shrink-0">{course.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {course.description}
                </p>
              </div>
              {course.status && (
                <span className="self-start sm:self-center shrink-0 text-xs font-medium border border-gray-300 rounded-full px-3 py-1 text-gray-600">
                  {course.status}
                </span>
              )}
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
