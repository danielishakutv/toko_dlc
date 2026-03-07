"use client";

import { useState } from "react";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-gray-900 rounded-xl p-6 sm:p-8 text-white mb-2">
      <h2 className="text-xl font-bold mb-1">Get the AI Fluency newsletter</h2>
      <p className="text-sm text-gray-400 mb-5">
        Stay up to date with the latest AI courses, tips, and learning resources.
      </p>

      {submitted ? (
        <p className="text-sm text-emerald-400">
          Thanks for subscribing! Check your inbox.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && email.trim()) setSubmitted(true);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-gray-500"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
