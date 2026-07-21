import { apiRequest } from "./client";

export type ApplicationStatus = "applied" | "interviewing" | "offer" | "rejected";

export type Application = {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  date_applied: string;
  notes: string | null;
  created_at: string;
};

export type CreateApplicationInput = {
  company: string;
  role: string;
  status: ApplicationStatus;
  date_applied: string;
  notes?: string;
};

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

export const applicationsApi = {
  list: () => apiRequest<Application[]>("/applications/"),
  create: (data: CreateApplicationInput) =>
    apiRequest<Application>("/applications/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: UpdateApplicationInput) =>
    apiRequest<Application>(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiRequest<void>(`/applications/${id}`, { method: "DELETE" }),
};
