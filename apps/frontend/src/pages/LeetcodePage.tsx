import { useState } from "react";
import type { LeetcodeStatus, LeetcodeDifficulty } from "../api/leetcode";
import type { CreateLeetcodeInput } from "../api/leetcode";
import {
  useLeetcodeProblems,
  useCreateLeetcode,
  useUpdateLeetcode,
  useDeleteLeetcode,
} from "../hooks/useLeetcode";

type DifficultyFilter = "all" | LeetcodeDifficulty;
type StatusFilter = "all" | LeetcodeStatus;
type ModalMode = "url" | "manual";

const statusChip: Record<LeetcodeStatus, string> = {
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

const statusCycleOrder: LeetcodeStatus[] = [
  "practiced",
  "needs_review",
  "too_hard",
  "completed",
];

function cycleStatus(current: LeetcodeStatus): LeetcodeStatus {
  const idx = statusCycleOrder.indexOf(current);
  return statusCycleOrder[(idx + 1) % statusCycleOrder.length];
}

function formatDate(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseLeetcodeUrl(url: string): { title: string } | null {
  const match = url.match(/leetcode\.com\/problems\/([\w-]+)/);
  if (!match) return null;
  const slug = match[1];
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title };
}

type FormState = {
  problem_number: number | undefined;
  title: string;
  url: string;
  difficulty: LeetcodeDifficulty;
  status: LeetcodeStatus;
};

const defaultForm: FormState = {
  problem_number: undefined,
  title: "",
  url: "",
  difficulty: "medium",
  status: "practiced",
};

const diffFilterOptions: { label: string; value: DifficultyFilter }[] = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const statusFilterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Practiced", value: "practiced" },
  { label: "Needs Review", value: "needs_review" },
  { label: "Too Hard", value: "too_hard" },
];

export default function LeetcodePage() {
  const { data: problems, isLoading } = useLeetcodeProblems();
  const createLeetcode = useCreateLeetcode();
  const updateLeetcode = useUpdateLeetcode();
  const deleteLeetcode = useDeleteLeetcode();

  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [form, setForm] = useState<FormState>(defaultForm);

  const total = problems?.length ?? 0;
  const completed =
    problems?.filter((p) => p.status === "completed").length ?? 0;
  const practiced =
    problems?.filter((p) => p.status === "practiced").length ?? 0;
  const needsReview =
    problems?.filter((p) => p.status === "needs_review").length ?? 0;
  const tooHard = problems?.filter((p) => p.status === "too_hard").length ?? 0;
  const pct = Math.round((completed / Math.max(total, 1)) * 100);

  const filtered = (problems ?? []).filter((p) => {
    if (diffFilter !== "all" && p.difficulty !== diffFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(defaultForm);
    setUrlInput("");
    setModalMode("url");
    createLeetcode.reset();
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    const parsed = parseLeetcodeUrl(url);
    if (parsed) {
      setForm((f) => ({ ...f, title: parsed.title, url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateLeetcodeInput = {
      title: form.title,
      difficulty: form.difficulty,
      status: form.status,
      ...(form.problem_number != null
        ? { problem_number: form.problem_number }
        : {}),
      ...(form.url ? { url: form.url } : {}),
    };
    createLeetcode.mutate(payload, { onSuccess: handleCloseModal });
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="px-6 py-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          LeetCode <span className="text-cyan-400">Tracker</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          + Add Problem
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>
              {completed} / {total} completed
            </span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span>
              <span className="text-cyan-400">●</span> Practiced: {practiced}
            </span>
            <span>
              <span className="text-yellow-400">●</span> Needs Review:{" "}
              {needsReview}
            </span>
            <span>
              <span className="text-red-400">●</span> Too Hard: {tooHard}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 space-y-2">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
            Difficulty:
          </span>
          {diffFilterOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setDiffFilter(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                diffFilter === f.value
                  ? "bg-cyan-500 text-black border-cyan-500"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
            Status:
          </span>
          {statusFilterOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === f.value
                  ? "bg-cyan-500 text-black border-cyan-500"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 overflow-x-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="pb-3 px-4 pt-4">#</th>
                <th className="pb-3 px-4 pt-4">Title</th>
                <th className="pb-3 px-4 pt-4">Difficulty</th>
                <th className="pb-3 px-4 pt-4">Status</th>
                <th className="pb-3 px-4 pt-4">Last Attempted</th>
                <th className="pb-3 px-4 pt-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-slate-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-4 text-center text-slate-400"
                  >
                    No problems logged yet. Click + Add Problem to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((prob) => (
                  <tr
                    key={prob.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-500">
                      {prob.problem_number != null ? prob.problem_number : "—"}
                    </td>
                    <td className="py-3 px-4">
                      {prob.url ? (
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          {prob.problem_number != null
                            ? `#${prob.problem_number} `
                            : ""}
                          {prob.title}
                        </a>
                      ) : (
                        <span className="text-slate-100">
                          {prob.problem_number != null
                            ? `#${prob.problem_number} `
                            : ""}
                          {prob.title}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${difficultyBadge[prob.difficulty]}`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          updateLeetcode.mutate({
                            id: prob.id,
                            data: {
                              status: cycleStatus(prob.status),
                              last_attempted: today,
                            },
                          })
                        }
                        className={`text-xs px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${statusChip[prob.status]}`}
                      >
                        {prob.status.replace("_", " ")}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(prob.last_attempted)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteLeetcode.mutate(prob.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors text-lg leading-none"
                        title="Delete"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Add Problem
            </h2>

            <div className="flex gap-1 mb-4 bg-slate-800 p-1 rounded-lg">
              {(["url", "manual"] as ModalMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModalMode(m)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    modalMode === m
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {m === "url" ? "Paste URL" : "Manual"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalMode === "url" ? (
                <>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      LeetCode URL
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://leetcode.com/problems/two-sum/"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Problem #
                    </label>
                    <input
                      type="number"
                      value={form.problem_number ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          problem_number: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Problem # (optional)
                    </label>
                    <input
                      type="number"
                      value={form.problem_number ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          problem_number: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      URL (optional)
                    </label>
                    <input
                      type="text"
                      value={form.url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, url: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      difficulty: e.target.value as LeetcodeDifficulty,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as LeetcodeStatus,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="practiced">Practiced</option>
                  <option value="completed">Completed</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="too_hard">Too Hard</option>
                </select>
              </div>
              {createLeetcode.error && (
                <p className="text-red-400 text-xs">
                  {createLeetcode.error.message}
                </p>
              )}
              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLeetcode.isPending}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  {createLeetcode.isPending ? "Saving…" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
