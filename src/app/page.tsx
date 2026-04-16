"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Learn at Your Own Pace",
    description: "Access courses anytime, anywhere. Our flexible learning platform adapts to your schedule.",
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience in web development, design, and more.",
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    title: "Earn Certificates",
    description: "Complete courses and earn certificates to showcase your skills and advance your career.",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    title: "Join a Community",
    description: "Connect with fellow learners, participate in discussions, and grow together.",
    gradient: "from-fuchsia-600 to-rose-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("learner@tokoacademy.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === "learner@tokoacademy.com" && password === "demo1234") {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Use the pre-filled demo data.");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex flex-col items-center justify-center px-12 text-white transition-opacity duration-700 ease-in-out ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Decorative shapes */}
            <div className="absolute top-12 left-12 w-24 h-24 rounded-full border border-white/20" />
            <div className="absolute bottom-20 right-16 w-32 h-32 rounded-full border border-white/10" />
            <div className="absolute top-1/4 right-24 w-16 h-16 rounded-lg border border-white/15 rotate-12" />

            <div className="relative z-10 max-w-md text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg text-white/80 leading-relaxed">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right: Sign in */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 bg-gradient-to-br from-slate-100 via-purple-50 to-indigo-50">
        <div className="w-full max-w-sm">
          <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent mb-8">
            TOKO ACADEMY
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-sm text-gray-500 mb-6">
              Welcome back to your learning dashboard
            </p>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white/60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white/60"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-violet-500/25"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
