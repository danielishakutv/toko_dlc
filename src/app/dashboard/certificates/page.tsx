"use client";

import { useState, useEffect } from "react";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Certificate {
  id: number;
  course: { id: number; title: string; icon: string };
  credentialId: string;
  issuedAt: string;
  fileUrl: string;
}

interface PendingCert {
  course: { id: number; title: string; icon: string };
  progressPercent: number;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pending, setPending] = useState<PendingCert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch("/api/me/certificates", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setCertificates(data.certificates || []);
          setPending(data.pending || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  function handleDownload(id: number) {
    const token = getToken();
    window.open(`/api/certificates/${id}/download?token=${encodeURIComponent(token || "")}`, "_blank");
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Certificates</h1>
      <p className="text-gray-500 mb-8">View and download your earned certificates</p>

      {certificates.length === 0 && pending.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No certificates yet</p>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{cert.course.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">Credential ID: {cert.credentialId}</p>
                </div>
                <button onClick={() => handleDownload(cert.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
          {pending.map((p) => (
            <div key={p.course.id} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{p.course.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">Complete the course to earn this certificate</p>
                  <div className="w-40 bg-gray-200/50 rounded-full h-1.5 mt-2">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full" style={{ width: `${p.progressPercent}%` }} />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 border border-gray-200 rounded-lg px-3 py-2">Pending</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500">
          Certificates are automatically generated when you complete all course modules and pass the final assessment.
        </p>
      </div>
    </div>
  );
}
