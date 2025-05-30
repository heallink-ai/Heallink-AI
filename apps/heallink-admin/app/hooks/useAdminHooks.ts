import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  adminApi,
  AdminUser,
  CreateAdminDto,
  UpdateAdminDto,
  UpdateAdminRoleDto,
  AdminListResponse,
  AdminStatsResponse,
  UserRole,
} from "../api/adminApi";

// Query keys for cache management
export const adminKeys = {
  all: ["admins"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...adminKeys.lists(), filters] as const,
  details: () => [...adminKeys.all, "detail"] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook to fetch admin users with pagination and filtering
 */
export function useAdmins(
  params: AdminQueryParams = {}
): UseQueryResult<AdminListResponse, Error> {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => adminApi.getAllAdmins(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch admin statistics
 */
export function useAdminStats(): UseQueryResult<AdminStatsResponse, Error> {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: adminApi.getAdminStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a specific admin by ID
 */
export function useAdmin(id: string): UseQueryResult<AdminUser, Error> {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => adminApi.getAdminById(id),
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
    mutationFn: adminApi.createAdmin,
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
    mutationFn: ({ id, data }) => adminApi.updateAdmin(id, data),
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
    mutationFn: ({ id, roleData }) => adminApi.updateAdminRole(id, roleData),
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
 * Hook to deactivate an admin user
 */
export function useDeactivateAdmin(): UseMutationResult<
  AdminUser,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deactivateAdmin,
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
 * Hook to activate an admin user
 */
export function useActivateAdmin(): UseMutationResult<
  AdminUser,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.activateAdmin,
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
    mutationFn: adminApi.deleteAdmin,
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
