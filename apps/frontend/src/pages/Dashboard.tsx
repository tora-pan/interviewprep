import { Link } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import { useLeetcodeProblems } from "../hooks/useLeetcode";
import type { ApplicationStatus } from "../api/applications";
import type { LeetcodeStatus, LeetcodeDifficulty } from "../api/leetcode";

type StatCardProps = {
  label: string;
  value: number | string;
  color: string;
};

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

const appStatusChip: Record<ApplicationStatus, string> = {
  applied: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  interviewing: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  offer: "bg-green-500/20 text-green-300 border border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const lcStatusChip: Record<LeetcodeStatus, string> = {
  completed: "bg-green-500/20 text-green-300 border border-green-500/30",
  practiced: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  needs_review: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  too_hard: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const difficultyBadge: Record<LeetcodeDifficulty, string> = {
  easy: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  hard: "bg-red-500/20 text-red-400",
};

export default function Dashboard() {
  const { userEmail } = useAuthUser();
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: leetcode, isLoading: lcLoading } = useLeetcodeProblems();

  const totalApps = applications?.length ?? 0;
  const activeApps =
    applications?.filter(
      (a) => a.status === "applied" || a.status === "interviewing",
    ).length ?? 0;
  const offersApps =
    applications?.filter((a) => a.status === "offer").length ?? 0;
  const rejectedApps =
    applications?.filter((a) => a.status === "rejected").length ?? 0;

  const totalLC = leetcode?.length ?? 0;
  const completedLC =
    leetcode?.filter((p) => p.status === "completed").length ?? 0;
  const needsReviewLC =
    leetcode?.filter((p) => p.status === "needs_review").length ?? 0;
  const tooHardLC =
    leetcode?.filter((p) => p.status === "too_hard").length ?? 0;

  const recentApps = [...(applications ?? [])]
    .sort((a, b) => b.date_applied.localeCompare(a.date_applied))
    .slice(0, 5);

  const recentLC = [...(leetcode ?? [])]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back <span className="text-cyan-400">{userEmail}</span>
        </h1>
        <p className="text-slate-400 mt-1">
          Here's your interview prep overview.
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">
          Applications
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Applications"
            value={appsLoading ? "—" : totalApps}
            color="text-white"
          />
          <StatCard
            label="Active"
            value={appsLoading ? "—" : activeApps}
            color="text-cyan-400"
          />
          <StatCard
            label="Offers"
            value={appsLoading ? "—" : offersApps}
            color="text-green-400"
          />
          <StatCard
            label="Rejected"
            value={appsLoading ? "—" : rejectedApps}
            color="text-red-400"
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">
          LeetCode
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Problems"
            value={lcLoading ? "—" : totalLC}
            color="text-white"
          />
          <StatCard
            label="Completed"
            value={lcLoading ? "—" : completedLC}
            color="text-green-400"
          />
          <StatCard
            label="Needs Review"
            value={lcLoading ? "—" : needsReviewLC}
            color="text-yellow-400"
          />
          <StatCard
            label="Too Hard"
            value={lcLoading ? "—" : tooHardLC}
            color="text-red-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-white">Recent Applications</h2>
            <Link
              to="/application-tracker"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>
          {appsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No applications yet.{" "}
              <Link
                to="/application-tracker"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Add one →
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-100 font-medium">
                      {app.company}
                    </p>
                    <p className="text-xs text-slate-400">
                      {app.role} · {app.date_applied}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${appStatusChip[app.status]}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-white">Recent LeetCode</h2>
            <Link
              to="/leetcode"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>
          {lcLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : recentLC.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No problems logged yet.{" "}
              <Link
                to="/leetcode"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Add one →
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentLC.map((prob) => (
                <div
                  key={prob.id}
                  className="flex items-center justify-between gap-2"
                >
                  <p className="text-sm text-slate-100 font-medium truncate">
                    {prob.problem_number != null
                      ? `#${prob.problem_number} `
                      : ""}
                    {prob.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${difficultyBadge[prob.difficulty]}`}
                    >
                      {prob.difficulty}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${lcStatusChip[prob.status]}`}
                    >
                      {prob.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
