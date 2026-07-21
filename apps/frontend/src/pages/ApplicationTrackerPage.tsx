import { useState } from "react";
import type { ApplicationStatus } from "../api/applications";
import type { CreateApplicationInput } from "../api/applications";
import {
  useApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "../hooks/useApplications";

type StatusFilter = "all" | ApplicationStatus;

const statusSelectColor: Record<ApplicationStatus, string> = {
  applied: "text-blue-300",
  interviewing: "text-yellow-300",
  offer: "text-green-300",
  rejected: "text-red-300",
};

type FormState = {
  company: string;
  role: string;
  status: ApplicationStatus;
  date_applied: string;
  notes: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const defaultForm: FormState = {
  company: "",
  role: "",
  status: "applied",
  date_applied: todayIso(),
  notes: "",
};

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Interviewing", value: "interviewing" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

export default function ApplicationTrackerPage() {
  const { data: applications, isLoading } = useApplications();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);

  const filtered = (applications ?? []).filter(
    (a) => filter === "all" || a.status === filter,
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(defaultForm);
    createApplication.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateApplicationInput = {
      company: form.company,
      role: form.role,
      status: form.status,
      date_applied: form.date_applied,
      ...(form.notes ? { notes: form.notes } : {}),
    };
    createApplication.mutate(payload, { onSuccess: handleCloseModal });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="px-6 py-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Application <span className="text-cyan-400">Tracker</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          + Add Application
        </button>
      </div>

      <div className="px-6 py-4 flex gap-2 flex-wrap">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f.value
                ? "bg-cyan-500 text-black border-cyan-500"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-6 pb-8 overflow-x-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="pb-3 px-4 pt-4">Company</th>
                <th className="pb-3 px-4 pt-4">Role</th>
                <th className="pb-3 px-4 pt-4">Status</th>
                <th className="pb-3 px-4 pt-4">Date Applied</th>
                <th className="pb-3 px-4 pt-4">Notes</th>
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
                    No applications yet. Click + Add Application to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-100 font-medium">
                      {app.company}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{app.role}</td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplication.mutate({
                            id: app.id,
                            data: {
                              status: e.target.value as ApplicationStatus,
                            },
                          })
                        }
                        className={`bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer ${statusSelectColor[app.status]}`}
                      >
                        <option
                          value="applied"
                          className="bg-slate-900 text-white"
                        >
                          applied
                        </option>
                        <option
                          value="interviewing"
                          className="bg-slate-900 text-white"
                        >
                          interviewing
                        </option>
                        <option
                          value="offer"
                          className="bg-slate-900 text-white"
                        >
                          offer
                        </option>
                        <option
                          value="rejected"
                          className="bg-slate-900 text-white"
                        >
                          rejected
                        </option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {app.date_applied}
                    </td>
                    <td
                      className="py-3 px-4 text-slate-400"
                      title={app.notes ?? ""}
                    >
                      {app.notes
                        ? app.notes.length > 40
                          ? `${app.notes.slice(0, 40)}…`
                          : app.notes
                        : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteApplication.mutate(app.id)}
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
              Add Application
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Role
                </label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
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
                      status: e.target.value as ApplicationStatus,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Date Applied
                </label>
                <input
                  type="date"
                  required
                  value={form.date_applied}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date_applied: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              {createApplication.error && (
                <p className="text-red-400 text-xs">
                  {createApplication.error.message}
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
                  disabled={createApplication.isPending}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  {createApplication.isPending ? "Saving…" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
