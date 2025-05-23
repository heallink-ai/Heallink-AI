import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import {
  AdminQueryParams,
  CreateAdminRequest,
  UpdateAdminRequest,
  BulkActionRequest,
} from "../types/admin.types";

export const ADMIN_QUERY_KEYS = {
  all: ["admin"] as const,
  lists: () => [...ADMIN_QUERY_KEYS.all, "list"] as const,
  list: (params: AdminQueryParams) =>
    [...ADMIN_QUERY_KEYS.lists(), params] as const,
  details: () => [...ADMIN_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ADMIN_QUERY_KEYS.details(), id] as const,
  stats: () => [...ADMIN_QUERY_KEYS.all, "stats"] as const,
};

export function useAdmins(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.list(params),
    queryFn: () => adminService.getAdmins(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdmin(id: string, enabled = true) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.detail(id),
    queryFn: () => adminService.getAdminById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats(),
    queryFn: () => adminService.getAdminStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => adminService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats() });
    },
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminRequest }) =>
      adminService.updateAdmin(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats() });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats() });
    },
  });
}

export function useToggleAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      adminService.toggleAdminStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.detail(variables.id),
      });
    },
  });
}

export function useUploadAdminAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      adminService.uploadAdminAvatar(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.lists() });
    },
  });
}

export function useBulkAdminAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkActionRequest) => adminService.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats() });
    },
  });
}
