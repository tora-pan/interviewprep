import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* HERO */}
      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Master coding interviews with{" "}
              <span className="text-cyan-400">AI + visualization</span>
            </h2>

            <p className="mt-6 text-slate-300 text-lg">
              Practice coding challenges, visualize algorithms step-by-step,
              track interviews, and prepare for behavioral questions—all in one
              place.
            </p>

            <div className="mt-8 flex gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 w-full md:w-auto"
              />
              <button className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400">
                Get early access
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              No spam. Just updates on progress.
            </p>
          </div>

          {/* HERO VISUAL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="space-y-3">
              <div className="h-4 w-2/3 bg-slate-700 rounded" />
              <div className="h-4 w-1/2 bg-slate-700 rounded" />
              <div className="h-4 w-3/4 bg-slate-700 rounded" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="h-20 bg-slate-800 rounded-lg" />
              <div className="h-20 bg-slate-800 rounded-lg" />
              <div className="h-20 bg-slate-800 rounded-lg" />
            </div>

            <div className="mt-6 h-32 bg-linear-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-slate-400">
              Algorithm Visualization Preview
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center">
            Everything you need to pass interviews
          </h3>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl bg-slate-900 border border-slate-800"
              >
                <h4 className="text-lg font-semibold text-cyan-400">
                  {f.title}
                </h4>
                <p className="mt-2 text-slate-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold">
            Start your interview prep journey
          </h3>
          <p className="mt-4 text-slate-300">
            Build confidence through practice, visualization, and feedback.
          </p>

          <button className="mt-8 px-8 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400">
            Join early access
          </button>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Coding Challenges",
    desc: "Solve curated problems with test cases and performance tracking.",
  },
  {
    title: "Algorithm Visualizer",
    desc: "Watch sorting and graph algorithms step-by-step in real time.",
  },
  {
    title: "AI Interview Coach",
    desc: "Get explanations, hints, and feedback powered by AI.",
  },
  {
    title: "Interview Tracker",
    desc: "Track applications, stages, and outcomes in one dashboard.",
  },
  {
    title: "Behavioral Prep",
    desc: "Practice STAR responses and common interview questions.",
  },
  {
    title: "Resume Tools",
    desc: "Manage versions and optimize resumes per role.",
  },
];
