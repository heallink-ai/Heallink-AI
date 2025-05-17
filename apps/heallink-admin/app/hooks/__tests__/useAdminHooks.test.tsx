import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdmins, useAdmin, useCreateAdmin, useUpdateAdmin } from '../useAdminHooks';
import { adminApi, AdminUser, AdminRole, UserStatus } from '../../api/adminApi';
import React from 'react';

// Mock the API module
jest.mock('../../api/adminApi', () => ({
  adminApi: {
    getAllAdmins: jest.fn(),
    getAdminById: jest.fn(),
    createAdmin: jest.fn(),
    updateAdmin: jest.fn(),
    updateAdminRole: jest.fn(),
    deactivateAdmin: jest.fn(),
    activateAdmin: jest.fn(),
    deleteAdmin: jest.fn(),
  },
  AdminRole: {
    SUPER_ADMIN: 'super_admin',
    SYSTEM_ADMIN: 'system_admin',
  },
  UserStatus: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
}));

// Sample data for tests
const mockAdmins: AdminUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    adminRole: AdminRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-05-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    adminRole: AdminRole.SYSTEM_ADMIN,
    status: UserStatus.ACTIVE,
    lastLogin: '2025-05-14T12:00:00Z',
    createdAt: '2025-05-02T00:00:00Z',
    updatedAt: '2025-05-02T00:00:00Z',
  },
];

// Wrapper component with query client for testing hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Admin API Hooks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('useAdmins', () => {
    it('should fetch all admins successfully', async () => {
      (adminApi.getAllAdmins as jest.Mock).mockResolvedValueOnce(mockAdmins);
      
      const { result } = renderHook(() => useAdmins(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      
      // After loading completes
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockAdmins);
      expect(adminApi.getAllAdmins).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch admins');
      (adminApi.getAllAdmins as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useAdmins(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAdmin', () => {
    it('should fetch a specific admin by ID', async () => {
      const admin = mockAdmins[0];
      (adminApi.getAdminById as jest.Mock).mockResolvedValueOnce(admin);
      
      const { result } = renderHook(() => useAdmin(admin.id), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(admin);
      expect(adminApi.getAdminById).toHaveBeenCalledWith(admin.id);
    });
  });

  describe('useCreateAdmin', () => {
    it('should create a new admin successfully', async () => {
      const newAdmin = {
        email: 'new@example.com',
        name: 'New Admin',
        adminRole: AdminRole.SYSTEM_ADMIN,
      };
      
      const createdAdmin = {
        ...newAdmin,
        id: '3',
        status: UserStatus.PENDING,
        createdAt: '2025-05-15T00:00:00Z',
        updatedAt: '2025-05-15T00:00:00Z',
      };
      
      (adminApi.createAdmin as jest.Mock).mockResolvedValueOnce(createdAdmin);
      
      const { result } = renderHook(() => useCreateAdmin(), {
        wrapper: createWrapper(),
      });
      
      // Execute the mutation
      result.current.mutate(newAdmin);
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      expect(result.current.data).toEqual(createdAdmin);
      expect(adminApi.createAdmin).toHaveBeenCalledWith(newAdmin);
    });
  });

  describe('useUpdateAdmin', () => {
    it('should update an admin successfully', async () => {
      const adminId = '1';
      const updateData = {
        name: 'Updated Name',
      };
      
      const updatedAdmin = {
        ...mockAdmins[0],
        name: 'Updated Name',
        updatedAt: '2025-05-15T12:00:00Z',
      };
      
      (adminApi.updateAdmin as jest.Mock).mockResolvedValueOnce(updatedAdmin);
      
      const { result } = renderHook(() => useUpdateAdmin(), {
        wrapper: createWrapper(),
      });
      
      // Execute the mutation
      result.current.mutate({ id: adminId, data: updateData });
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      expect(result.current.data).toEqual(updatedAdmin);
      expect(adminApi.updateAdmin).toHaveBeenCalledWith(adminId, updateData);
    });
  });
});
