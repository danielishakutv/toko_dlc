import CourseIcon from "../../CourseIcon";

const attendanceData = [
  {
    course: "Web Development Fundamentals",
    icon: "globe",
    sessions: [
      { date: "Mar 3, 2026", topic: "Getting Started with HTML", status: "Present" },
      { date: "Mar 5, 2026", topic: "Styling with CSS", status: "Present" },
      { date: "Mar 7, 2026", topic: "CSS Box Model & Layout", status: "Absent" },
      { date: "Mar 10, 2026", topic: "JavaScript Essentials", status: "Present" },
      { date: "Mar 12, 2026", topic: "DOM Manipulation", status: "Present" },
      { date: "Mar 14, 2026", topic: "Events & Listeners", status: "Present" },
    ],
  },
  {
    course: "UI/UX Design Principles",
    icon: "palette",
    sessions: [
      { date: "Mar 4, 2026", topic: "UX Research Fundamentals", status: "Present" },
      { date: "Mar 6, 2026", topic: "User Personas", status: "Present" },
      { date: "Mar 11, 2026", topic: "UI Design Principles", status: "Late" },
      { date: "Mar 13, 2026", topic: "Typography & Color", status: "Present" },
    ],
  },
  {
    course: "Cybersecurity Awareness",
    icon: "shield",
    sessions: [
      { date: "Mar 5, 2026", topic: "Threat Landscape", status: "Present" },
      { date: "Mar 12, 2026", topic: "Phishing & Social Engineering", status: "Absent" },
    ],
  },
];

const statusStyle: Record<string, string> = {
  Present: "bg-green-50 text-green-700",
  Absent: "bg-red-50 text-red-700",
  Late: "bg-yellow-50 text-yellow-700",
};

export default function AttendancePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Attendance</h1>
      <p className="text-gray-500 mb-8">Track your attendance across all enrolled courses</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-green-600">10</p>
          <p className="text-xs text-gray-500">Present</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-xs text-gray-500">Absent</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-yellow-600">1</p>
          <p className="text-xs text-gray-500">Late</p>
        </div>
      </div>

      {/* Course attendance */}
      <div className="space-y-6">
        {attendanceData.map((course) => (
          <div key={course.course} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CourseIcon name={course.icon} className="w-4 h-4 text-gray-500" />
                {course.course}
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {course.sessions.map((s, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">{s.topic}</p>
                    <p className="text-xs text-gray-500">{s.date}</p>
                  </div>
                  <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusStyle[s.status]}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
