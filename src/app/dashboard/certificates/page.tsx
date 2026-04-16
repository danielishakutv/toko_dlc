import CourseIcon from "../../CourseIcon";

const certificates = [
  {
    title: "Web Development Fundamentals",
    issueDate: "Mar 14, 2026",
    credentialId: "TOKO-WDF-2026-001",
    status: "Issued",
    icon: "globe",
  },
  {
    title: "UI/UX Design Principles",
    issueDate: null,
    credentialId: null,
    status: "In Progress",
    icon: "palette",
  },
  {
    title: "Cybersecurity Awareness",
    issueDate: null,
    credentialId: null,
    status: "In Progress",
    icon: "shield",
  },
];

export default function CertificatesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Certificates</h1>
      <p className="text-gray-500 mb-8">View and download your earned certificates</p>

      <div className="space-y-4">
        {certificates.map((cert, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
                  <CourseIcon name={cert.icon} className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{cert.title}</h2>
                  {cert.status === "Issued" ? (
                    <>
                      <p className="text-xs text-gray-500 mt-1">Issued: {cert.issueDate}</p>
                      <p className="text-xs text-gray-400">Credential ID: {cert.credentialId}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Complete the course to earn this certificate</p>
                  )}
                </div>
              </div>
              <div>
                {cert.status === "Issued" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-400 border border-gray-200 rounded-lg px-3 py-2">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state info */}
      <div className="mt-8 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500">
          Certificates are automatically generated when you complete all course modules and pass the final assessment.
        </p>
      </div>
    </div>
  );
}
