import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import {
  AdminUser,
  CreateAdminDto,
  UpdateAdminDto,
  UpdateAdminRoleDto,
  AdminQueryParams,
  AdminListResponse,
  AdminStatsResponse,
  BulkActionRequest,
  BulkActionResponse,
  AvatarUploadResponse,
} from "../types/admin.types";

// Query keys for cache management
export const adminKeys = {
  all: ["admins"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...adminKeys.lists(), filters] as const,
  details: () => [...adminKeys.all, "detail"] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

/**
 * Hook to fetch admin users with pagination and filtering
 */
export function useAdmins(
  params: AdminQueryParams = {}
): UseQueryResult<AdminListResponse, Error> {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => adminService.getAllAdmins(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch admin statistics
 */
export function useAdminStats(): UseQueryResult<AdminStatsResponse, Error> {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getAdminStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a specific admin by ID
 */
export function useAdmin(id: string): UseQueryResult<AdminUser, Error> {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => adminService.getAdminById(id),
    enabled: !!id, // Only run if ID is provided
  });
}

/**
 * Hook to create a new admin user
 */
export function useCreateAdmin(): UseMutationResult<
  AdminUser,
  Error,
  CreateAdminDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminDto) => adminService.createAdmin(data),
    onSuccess: (newAdmin) => {
      // Invalidate all admin list queries
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });

      // Set the new admin in cache
      queryClient.setQueryData(adminKeys.detail(newAdmin.id), newAdmin);
    },
  });
}

/**
 * Hook to update an admin user
 */
export function useUpdateAdmin(): UseMutationResult<
  AdminUser,
  Error,
  { id: string; data: UpdateAdminDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateAdmin(id, data),
    onSuccess: (updatedAdmin) => {
      // Invalidate all admin list queries
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      // Update the specific admin's cache
      queryClient.setQueryData(adminKeys.detail(updatedAdmin.id), updatedAdmin);
      
      // Invalidate stats if role changed
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to update an admin's role
 */
export function useUpdateAdminRole(): UseMutationResult<
  AdminUser,
  Error,
  { id: string; roleData: UpdateAdminRoleDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleData }) => adminService.updateAdminRole(id, roleData),
    onSuccess: (updatedAdmin) => {
      // Invalidate all admin list queries since role changed
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      // Update the specific admin's cache
      queryClient.setQueryData(adminKeys.detail(updatedAdmin.id), updatedAdmin);
      
      // Invalidate stats since role distribution changed
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to toggle admin status (activate/deactivate)
 */
export function useToggleAdminStatus(): UseMutationResult<
  AdminUser,
  Error,
  { id: string; status: boolean }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => adminService.toggleAdminStatus(id, status),
    onSuccess: (updatedAdmin) => {
      // Invalidate all admin list queries
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      // Update the specific admin's cache
      queryClient.setQueryData(adminKeys.detail(updatedAdmin.id), updatedAdmin);
      
      // Invalidate stats since active count changed
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to delete an admin user
 */
export function useDeleteAdmin(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteAdmin(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all admin list queries
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      // Remove the deleted admin from cache
      queryClient.removeQueries({ queryKey: adminKeys.detail(deletedId) });
      
      // Invalidate stats since total count changed
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to upload admin avatar
 */
export function useUploadAdminAvatar(): UseMutationResult<
  AvatarUploadResponse,
  Error,
  { id: string; file: File }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }) => adminService.uploadAdminAvatar(id, file),
    onSuccess: (_, { id }) => {
      // Invalidate the specific admin's cache
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
      
      // Invalidate list queries to update avatar in lists
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });
}

/**
 * Hook for bulk admin actions
 */
export function useBulkAdminAction(): UseMutationResult<
  BulkActionResponse,
  Error,
  BulkActionRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkActionRequest) => adminService.bulkAction(data),
    onSuccess: () => {
      // Invalidate all admin queries since multiple admins might be affected
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

// Legacy hooks for backward compatibility - these can be removed once pages are updated
export const useDeactivateAdmin = () => {
  const toggleStatus = useToggleAdminStatus();
  return {
    ...toggleStatus,
    mutate: (id: string) => toggleStatus.mutate({ id, status: false }),
  };
};

export const useActivateAdmin = () => {
  const toggleStatus = useToggleAdminStatus();
  return {
    ...toggleStatus,
    mutate: (id: string) => toggleStatus.mutate({ id, status: true }),
  };
};

/**
 * Hook to reset admin password
 */
export function useResetAdminPassword(): UseMutationResult<{ message: string }, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.resetAdminPassword(id),
    onSuccess: () => {
      // No need to invalidate cache for password reset, just show success message
    },
  });
}
