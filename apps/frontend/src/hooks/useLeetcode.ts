import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leetcodeApi, type CreateLeetcodeInput, type UpdateLeetcodeInput } from "../api/leetcode";

export function useLeetcodeProblems() {
  return useQuery({ queryKey: ["leetcode"], queryFn: leetcodeApi.list });
}

export function useCreateLeetcode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeetcodeInput) => leetcodeApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leetcode"] }),
  });
}

export function useUpdateLeetcode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeetcodeInput }) =>
      leetcodeApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leetcode"] }),
  });
}

export function useDeleteLeetcode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leetcodeApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leetcode"] }),
  });
}
