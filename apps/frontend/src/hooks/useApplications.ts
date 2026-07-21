import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi, type CreateApplicationInput, type UpdateApplicationInput } from "../api/applications";

export function useApplications() {
  return useQuery({ queryKey: ["applications"], queryFn: applicationsApi.list });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateApplicationInput) => applicationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateApplicationInput }) =>
      applicationsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => applicationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
