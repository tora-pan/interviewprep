import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuth";

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, logout } = useAuthUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* TOP NAV */}
      <header className="w-full border-b border-slate-800">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">InterviewPrep</h1>

          <nav className="hidden md:flex gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </nav>

          {isAuthenticated && userEmail ? (
            <div className="flex items-center gap-3">
              <p
                title={userEmail}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-sm font-medium max-w-56 truncate"
              >
                {userEmail}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:text-white hover:border-slate-500"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-8xl mx-auto px-6 flex flex-col md:flex-row justify-between text-sm text-slate-400">
          <p>© {new Date().getFullYear()} InterviewPrep</p>
          <p>Built with React + FastAPI + ❤️</p>
        </div>
      </footer>
    </div>
  );
}
