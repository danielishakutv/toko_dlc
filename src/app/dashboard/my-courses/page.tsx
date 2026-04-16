import Link from "next/link";
import { courses } from "../../data";
import CourseIcon from "../../CourseIcon";

const registeredCourses = courses.filter((c) => c.status === "Registered");
const availableCourses = courses.filter((c) => c.status !== "Registered");

export default function MyCoursesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">My Courses</h1>
      <p className="text-gray-500 mb-8">Track your enrolled courses and explore new ones</p>

      {/* Enrolled */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Enrolled Courses</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {registeredCourses.map((course) => {
          const progress = course.slug === "web-development-fundamentals" ? 75 : course.slug === "ui-ux-design-principles" ? 40 : 15;
          return (
            <Link key={course.slug} href={`/dashboard/course/${course.slug}`} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 hover:shadow-lg hover:border-violet-200/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                <CourseIcon name={course.icon} className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mt-3 mb-1">{course.title}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{progress}% complete</span>
                <span className="text-xs text-gray-500">{course.lectures} lectures</span>
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Available */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Available Courses</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCourses.map((course) => (
          <Link key={course.slug} href={`/dashboard/course/${course.slug}`} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 hover:shadow-lg hover:border-violet-200/60 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
              <CourseIcon name={course.icon} className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mt-3 mb-1">{course.title}</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">{course.hours} hrs &middot; {course.lectures} lectures</span>
              <span className="text-xs font-medium text-violet-600 border border-violet-200 rounded-full px-3 py-1">Enroll</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
