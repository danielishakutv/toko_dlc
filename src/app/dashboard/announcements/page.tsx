const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v5m-3-8.5L5 10l7-7 7 7-4 3.5M9 13.5 7.5 21h9L15 13.5" />
  </svg>
);

const announcements = [
  {
    title: "Platform Maintenance Scheduled",
    body: "Toko Academy will undergo scheduled maintenance on March 22, 2026, from 2:00 AM to 6:00 AM UTC. During this time, the platform may be temporarily unavailable. Please save your progress beforehand.",
    date: "Mar 16, 2026",
    category: "System",
    pinned: true,
  },
  {
    title: "New Course: AI Fluency Framework & Foundations",
    body: "We're excited to announce a brand-new course on AI Fluency! Learn about AI frameworks, responsible usage, and how to integrate AI into your daily workflow. Enrollment opens March 25.",
    date: "Mar 15, 2026",
    category: "Courses",
    pinned: true,
  },
  {
    title: "Web Development Fundamentals — Module 3 Released",
    body: "Module 3: JavaScript Essentials is now available. Dive into variables, functions, DOM manipulation, and event handling. Complete the module quiz by March 20.",
    date: "Mar 12, 2026",
    category: "Course Update",
    pinned: false,
  },
  {
    title: "Certificate Design Updated",
    body: "We've refreshed the design of our completion certificates with a modern look. Previously issued certificates remain valid. Download your updated certificate from the Certificates page.",
    date: "Mar 8, 2026",
    category: "General",
    pinned: false,
  },
  {
    title: "Cybersecurity Awareness — Live Q&A Session",
    body: "Join instructor David Lee for a live Q&A session on March 19 at 3:00 PM UTC. Bring your questions about threat landscape, phishing, and organizational security best practices.",
    date: "Mar 5, 2026",
    category: "Event",
    pinned: false,
  },
  {
    title: "Welcome to Toko Academy!",
    body: "Thank you for joining Toko Academy. Explore our catalog of courses, track your progress, and earn certificates. If you need help, visit the Support page or email support@tokoacademy.org.",
    date: "Mar 1, 2026",
    category: "General",
    pinned: false,
  },
];

const categoryColor: Record<string, string> = {
  System: "bg-red-50 text-red-700",
  Courses: "bg-blue-50 text-blue-700",
  "Course Update": "bg-purple-50 text-purple-700",
  General: "bg-gray-100 text-gray-600",
  Event: "bg-green-50 text-green-700",
};

export default function AnnouncementsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Announcements</h1>
      <p className="text-gray-500 mb-8">Stay updated with the latest news and updates</p>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                {a.pinned && (
                  <PinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <h2 className="text-sm font-bold text-gray-900">{a.title}</h2>
              </div>
              <span className={`text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap ${categoryColor[a.category]}`}>
                {a.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{a.body}</p>
            <p className="text-xs text-gray-400">{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
