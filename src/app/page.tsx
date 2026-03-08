import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import Newsletter from "./Newsletter";
import { courses } from "./data";

const featuredCourses = [
  { name: "Web Development Fundamentals", slug: "web-development-fundamentals" },
  { name: "Data Science with Python", slug: "data-science-with-python" },
];

const courseCategories = [
  {
    title: "AI Fluency Courses",
    description:
      "Build your AI literacy with courses on frameworks, prompt engineering, and responsible AI use.",
    bg: "bg-[#c8d8d4]",
    cardBg: "bg-[#b3c7c2]",
    items: [
      { name: "AI Fluency: Framework & Foundations", icon: "🤖", slug: null },
      { name: "Teaching AI Fluency", icon: "🎓", slug: null },
      { name: "Prompt Engineering Essentials", icon: "💬", slug: null },
    ],
  },
  {
    title: "Professional Courses",
    description:
      "Advance your career with industry-relevant skills in marketing, cloud, and cybersecurity.",
    bg: "bg-[#d4cfe0]",
    cardBg: "bg-[#c3bbd3]",
    items: [
      { name: "Digital Marketing Essentials", icon: "📱", slug: "digital-marketing-essentials" },
      { name: "Cloud Computing Basics", icon: "☁️", slug: "cloud-computing-basics" },
      { name: "Cybersecurity Awareness", icon: "🔒", slug: "cybersecurity-awareness" },
    ],
  },
  {
    title: "Corporate Programs",
    description:
      "Upskill your teams with tailored programs on leadership, collaboration, and data-driven strategy.",
    bg: "bg-[#7eaac4]",
    cardBg: "bg-[#6a9ab8]",
    items: [
      { name: "Leadership in the AI Age", icon: "🏢", slug: null },
      { name: "Team Collaboration Tools", icon: "🤝", slug: null },
      { name: "Data-Driven Decision Making", icon: "📈", slug: null },
    ],
  },
  {
    title: "Kids Coding Lessons",
    description:
      "Fun, project-based coding lessons for young learners ages 8–16.",
    bg: "bg-[#f0dcc8]",
    cardBg: "bg-[#e3ccb2]",
    items: [
      { name: "Scratch for Beginners", icon: "🧩", slug: null },
      { name: "Build Your First Game", icon: "🎮", slug: null },
      { name: "Web Design for Kids", icon: "🖍️", slug: null },
    ],
  },
  {
    title: "Workshops",
    description:
      "Hands-on, focused sessions to sharpen practical skills in a single sitting.",
    bg: "bg-[#c4d4c0]",
    cardBg: "bg-[#b2c5ad]",
    items: [
      { name: "Resume Building with AI", icon: "📝", slug: null },
      { name: "Public Speaking Mastery", icon: "🎤", slug: null },
      { name: "Design Thinking Sprint", icon: "💡", slug: null },
    ],
  },
  {
    title: "Bootcamps",
    description:
      "Intensive, immersive programs to go from beginner to job-ready in weeks.",
    bg: "bg-[#d4c4c4]",
    cardBg: "bg-[#c5b2b2]",
    items: [
      { name: "Full-Stack Developer Bootcamp", icon: "⚡", slug: null },
      { name: "Data Analytics Bootcamp", icon: "🔬", slug: null },
      { name: "Product Management Bootcamp", icon: "🚀", slug: null },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Toko Academy
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Get in the know with Toko Academy resources. From web development
              guides to AI fluency courses and professional certifications, the
              academy has you covered.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/courses"
                className="inline-block text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full px-6 py-3 transition-colors"
              >
                Browse courses
              </Link>
              <Link
                href="/signup"
                className="inline-block text-sm font-medium text-gray-900 border border-gray-300 hover:border-gray-900 rounded-full px-6 py-3 transition-colors"
              >
                Create free account
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Featured Courses */}
          <section className="bg-[#d9cfc4] rounded-2xl p-6 sm:p-8 mb-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Featured courses
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-5 max-w-md">
                  New courses available on Toko Academy. Learn more in-depth about
                  AI Fluency, web development, data science and more. Earn
                  certificates upon completion.
                </p>
                <Link
                  href="/courses"
                  className="inline-block text-sm font-medium text-gray-900 border border-gray-900 rounded-full px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  See all courses
                </Link>
              </div>
              <div className="flex gap-4 lg:shrink-0">
                {featuredCourses.map((fc) => (
                  <Link
                    key={fc.slug}
                    href={`/course/${fc.slug}`}
                    className="bg-[#c4b9ad] rounded-xl p-5 flex flex-col justify-between w-40 sm:w-48 hover:bg-[#b8ac9f] transition-colors"
                  >
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Featured Course</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {fc.name}
                      </p>
                    </div>
                    <span className="mt-4 text-gray-900 self-end text-lg">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* All Courses List */}
          <section className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              All courses
            </h2>
            <div className="flex flex-col gap-4">
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/course/${course.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 hover:shadow-md transition-shadow"
                >
                  <span className="text-4xl shrink-0">{course.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{course.lectures} lectures</span>
                      <span>{course.hours} hours</span>
                      <span>{course.price}</span>
                    </div>
                  </div>
                  <span className="self-start sm:self-center shrink-0 text-gray-400 text-lg">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Course category sections */}
          {courseCategories.map((cat) => (
            <section
              key={cat.title}
              className={`${cat.bg} rounded-2xl p-6 sm:p-8 mb-6`}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-5 max-w-md">
                    {cat.description}
                  </p>
                  <span className="inline-block text-sm font-medium text-gray-900 border border-gray-900 rounded-full px-5 py-2 cursor-pointer hover:bg-gray-900 hover:text-white transition-colors">
                    Learn more
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
                  {cat.items.map((item) => {
                    const card = (
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <span className="text-2xl">{item.icon}</span>
                          <p className="text-sm font-semibold text-gray-900 mt-2 leading-snug">
                            {item.name}
                          </p>
                        </div>
                        <span className="mt-4 text-gray-900 self-end text-lg">
                          &rarr;
                        </span>
                      </div>
                    );
                    return item.slug ? (
                      <Link
                        key={item.name}
                        href={`/course/${item.slug}`}
                        className={`${cat.cardBg} rounded-xl p-5 w-full sm:w-40 hover:brightness-95 transition`}
                      >
                        {card}
                      </Link>
                    ) : (
                      <div
                        key={item.name}
                        className={`${cat.cardBg} rounded-xl p-5 w-full sm:w-40`}
                      >
                        {card}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}

          {/* Newsletter */}
          <Newsletter />
        </div>
      </main>

      <Footer />
    </div>
  );
}
