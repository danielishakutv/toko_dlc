const assessments = [
  {
    title: "HTML & CSS Fundamentals Quiz",
    course: "Web Development Fundamentals",
    type: "Quiz",
    questions: 15,
    duration: "20 min",
    status: "Completed",
    score: "90%",
    date: "Mar 10, 2026",
  },
  {
    title: "JavaScript Basics Quiz",
    course: "Web Development Fundamentals",
    type: "Quiz",
    questions: 20,
    duration: "30 min",
    status: "Upcoming",
    score: null,
    date: "Mar 20, 2026",
  },
  {
    title: "Wireframe Design Assignment",
    course: "UI/UX Design Principles",
    type: "Assignment",
    questions: 1,
    duration: "2 hrs",
    status: "In Progress",
    score: null,
    date: "Mar 23, 2026",
  },
  {
    title: "UX Research Report",
    course: "UI/UX Design Principles",
    type: "Assignment",
    questions: 1,
    duration: "3 hrs",
    status: "Upcoming",
    score: null,
    date: "Apr 1, 2026",
  },
  {
    title: "Cybersecurity Threat Identification",
    course: "Cybersecurity Awareness",
    type: "Quiz",
    questions: 10,
    duration: "15 min",
    status: "Upcoming",
    score: null,
    date: "Mar 28, 2026",
  },
  {
    title: "Final Assessment - Web Dev",
    course: "Web Development Fundamentals",
    type: "Exam",
    questions: 30,
    duration: "45 min",
    status: "Upcoming",
    score: null,
    date: "Apr 5, 2026",
  },
];

const statusColor: Record<string, string> = {
  Completed: "bg-green-50 text-green-700",
  "In Progress": "bg-yellow-50 text-yellow-700",
  Upcoming: "bg-gray-100 text-gray-600",
};

export default function AssessmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Assessments</h1>
      <p className="text-gray-500 mb-8">View your quizzes, assignments, and exams</p>

      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Assessment</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.course}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{a.type}</td>
                  <td className="px-5 py-4 text-gray-600">{a.duration}</td>
                  <td className="px-5 py-4 text-gray-600">{a.date}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusColor[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">{a.score ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {assessments.map((a, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.course}</p>
                </div>
                <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusColor[a.status]}`}>
                  {a.status}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{a.type}</span>
                <span>{a.duration}</span>
                <span>{a.date}</span>
                {a.score && <span className="font-medium text-gray-900">{a.score}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
