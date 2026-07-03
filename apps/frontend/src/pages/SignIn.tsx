import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useAuth";

export default function SignIn() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate("/");
    } catch {
      // Error message is surfaced from the mutation state.
    }
  };

  return (
    <section className="min-h-[calc(100vh-132px)] flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 py-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
            Welcome back
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
            Sign in to continue your interview prep
          </h2>
          <p className="mt-5 text-slate-300 text-lg">
            Pick up where you left off with coding challenges, interview
            tracking, and AI-powered practice.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold">Sign In</h3>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your password"
              />
            </label>

            {loginMutation.error ? (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                {loginMutation.error.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full px-5 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 space-y-3">
            <p className="text-sm text-slate-400">Need an account?</p>
            <Link
              to="/signup"
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 text-slate-100 font-medium hover:border-cyan-400 hover:text-cyan-300"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
