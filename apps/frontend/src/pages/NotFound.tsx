import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-slate-950">
      <h1 className="text-5xl font-bold text-red-400">404</h1>
      <p className="mt-4 text-slate-300">Page not found</p>

      <Link to="/" className="mt-6 px-4 py-2 bg-cyan-500 text-black rounded-lg">
        Go home
      </Link>
    </div>
  );
}
