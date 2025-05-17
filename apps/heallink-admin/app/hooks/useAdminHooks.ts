import { 
  useMutation, 
  useQuery, 
  useQueryClient,
  UseMutationResult,
  UseQueryResult
} from '@tanstack/react-query';
import { 
  adminApi, 
  AdminUser, 
  CreateAdminDto, 
  UpdateAdminDto, 
  UpdateAdminRoleDto 
} from '../api/adminApi';

// Query keys for cache management
export const adminKeys = {
  all: ['admins'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
  list: (filters: string) => [...adminKeys.lists(), { filters }] as const,
  details: () => [...adminKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
};

/**
 * Hook to fetch all admin users
 */
export function useAdmins(): UseQueryResult<AdminUser[], Error> {
  return useQuery({
    queryKey: adminKeys.lists(),
    queryFn: adminApi.getAllAdmins,
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
      // Invalidate the list query to refetch
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      
      // Optionally, update the cache directly
      queryClient.setQueryData(
        adminKeys.detail(newAdmin.id),
        newAdmin
      );
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
      // Invalidate both the list and the specific admin's data
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(updatedAdmin.id) });
    },
  });
}

/**
 * Hook to update an admin's role
 */
export function useUpdateAdminRole(): UseMutationResult<
  AdminUser, 
  Error, 
  { id: string; role: UpdateAdminRoleDto }
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }) => adminApi.updateAdminRole(id, role),
    onSuccess: (updatedAdmin) => {
      // Invalidate both the list and the specific admin's data
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(updatedAdmin.id) });
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
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(updatedAdmin.id) });
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
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(updatedAdmin.id) });
    },
  });
}

/**
 * Hook to delete an admin user
 */
export function useDeleteAdmin(): UseMutationResult<
  void, 
  Error, 
  string
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.deleteAdmin,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.removeQueries({ queryKey: adminKeys.detail(deletedId) });
    },
  });
}
