import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuth";

export default function AppLayout() {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuthUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="w-full border-b border-slate-800">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-cyan-400">InterviewPrep</h1>

            <nav className="hidden md:flex gap-6 text-sm text-slate-300">
              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <Link to="/data-structures" className="hover:text-white">
                Data Structures
              </Link>
              <Link to="/algorithm-lab" className="hover:text-white">
                Algorithms
              </Link>
              <Link to="/application-tracker" className="hover:text-white">
                Application Tracker
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <p
              title={userEmail ?? "Signed in"}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-sm font-medium max-w-56 truncate"
            >
              {userEmail ?? "Signed in"}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:text-white hover:border-slate-500"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
