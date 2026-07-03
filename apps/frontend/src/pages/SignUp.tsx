import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../hooks/useAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signupMutation.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      navigate("/dashboard");
    } catch {
      // Error message is surfaced from the mutation state.
    }
  };

  return (
    <section className="min-h-[calc(100vh-132px)] flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 py-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
            New here?
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
            Create your InterviewPrep account
          </h2>
          <p className="mt-5 text-slate-300 text-lg">
            Start tracking interviews, practicing challenges, and leveling up
            with AI feedback.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold">Create Account</h3>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-slate-300">First name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Jane"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Doe"
                />
              </label>
            </div>

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
                minLength={8}
                autoComplete="new-password"
                className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="At least 8 characters"
              />
            </label>

            {signupMutation.error ? (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                {signupMutation.error.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full px-5 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signupMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
