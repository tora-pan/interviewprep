import { apiRequest } from "./client";

export type LeetcodeStatus = "completed" | "practiced" | "needs_review" | "too_hard";
export type LeetcodeDifficulty = "easy" | "medium" | "hard";

export type LeetcodeProblem = {
  id: number;
  problem_number: number | null;
  title: string;
  url: string | null;
  difficulty: LeetcodeDifficulty;
  status: LeetcodeStatus;
  last_attempted: string | null;
  notes: string | null;
  created_at: string;
};

export type CreateLeetcodeInput = {
  problem_number?: number;
  title: string;
  url?: string;
  difficulty: LeetcodeDifficulty;
  status?: LeetcodeStatus;
  last_attempted?: string;
  notes?: string;
};

export type UpdateLeetcodeInput = Partial<CreateLeetcodeInput>;

export const leetcodeApi = {
  list: () => apiRequest<LeetcodeProblem[]>("/leetcode/"),
  create: (data: CreateLeetcodeInput) =>
    apiRequest<LeetcodeProblem>("/leetcode/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: UpdateLeetcodeInput) =>
    apiRequest<LeetcodeProblem>(`/leetcode/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiRequest<void>(`/leetcode/${id}`, { method: "DELETE" }),
};
