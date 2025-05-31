import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { patientService } from "../services/patient.service";
import {
  Patient,
  PatientDetail,
  CreatePatientDto,
  UpdatePatientDto,
  PatientStatusChangeDto,
  ChangePatientPasswordDto,
  AccountStatus,
  AddAdminNoteDto,
  PatientQueryDto,
  PatientListResponse,
  PatientStatsResponse,
  BulkPatientActionDto,
  BulkPatientImportDto,
  BulkActionResultDto,
  PatientActivityLog,
  ExportOptions,
} from "../types/user.types";

// Query keys for cache management
export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...patientKeys.lists(), filters] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  stats: () => [...patientKeys.all, "stats"] as const,
  activityLog: (id: string) => [...patientKeys.detail(id), "activity"] as const,
  suggestions: (query: string) => [...patientKeys.all, "suggestions", query] as const,
  locationData: () => [...patientKeys.all, "location-data"] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Hook to fetch a single patient by ID
 */
export function useGetPatient(
  patientId: string
): UseQueryResult<Patient, Error> {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => patientService.getPatient(patientId),
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patients with pagination and filtering
 */
export function usePatients(
  params: PatientQueryDto = {}
): UseQueryResult<PatientListResponse, Error> {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientService.getPatients(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch patient statistics
 */
export function usePatientStats(): UseQueryResult<PatientStatsResponse, Error> {
  return useQuery({
    queryKey: patientKeys.stats(),
    queryFn: () => patientService.getPatientStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch a specific patient by ID
 */
export function usePatient(id: string): UseQueryResult<PatientDetail, Error> {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientService.getPatientDetail(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch patient activity log
 */
export function usePatientActivityLog(
  id: string,
  limit: number = 50,
  offset: number = 0
): UseQueryResult<PatientActivityLog[], Error> {
  return useQuery({
    queryKey: [...patientKeys.activityLog(id), limit, offset],
    queryFn: () => patientService.getPatientActivityLog(id, limit, offset),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get patient suggestions for autocomplete
 */
export function usePatientSuggestions(
  query: string,
  limit: number = 10
): UseQueryResult<Array<{
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}>, Error> {
  return useQuery({
    queryKey: patientKeys.suggestions(query),
    queryFn: () => patientService.getPatientSuggestions(query, limit),
    enabled: query.length >= 2, // Only search when query is at least 2 characters
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get location data for forms
 */
export function useLocationData(): UseQueryResult<{
  countries: Array<{ code: string; name: string }>;
  states: Record<string, Array<{ code: string; name: string }>>;
}, Error> {
  return useQuery({
    queryKey: patientKeys.locationData(),
    queryFn: () => patientService.getLocationData(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create a new patient
 */
export function useCreatePatient(): UseMutationResult<
  Patient,
  Error,
  CreatePatientDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientDto) => patientService.createPatient(data),
    onSuccess: (newPatient) => {
      // Invalidate all patient list queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() });

      // Set the new patient in cache
      queryClient.setQueryData(patientKeys.detail(newPatient.id), newPatient);
    },
  });
}

/**
 * Hook to update a patient
 */
export function useUpdatePatient(): UseMutationResult<
  Patient,
  Error,
  { id: string; data: UpdatePatientDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
    onSuccess: (updatedPatient) => {
      // Invalidate all patient list queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      
      // Update the specific patient's cache
      queryClient.setQueryData(patientKeys.detail(updatedPatient.id), updatedPatient);
      
      // Invalidate stats if status changed
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() });
    },
  });
}

/**
 * Hook to change patient status
 */
export function useChangePatientStatus(): UseMutationResult<
  Patient,
  Error,
  { id: string; statusData: PatientStatusChangeDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statusData }) => patientService.changePatientStatus(id, statusData),
    onSuccess: (updatedPatient) => {
      // Invalidate all patient list queries since status changed
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      
      // Update the specific patient's cache
      queryClient.setQueryData(patientKeys.detail(updatedPatient.id), updatedPatient);
      
      // Invalidate stats since status distribution changed
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() });
    },
  });
}

/**
 * Hook to reset patient password
 */
export function useResetPatientPassword(): UseMutationResult<
  { success: boolean; message: string },
  Error,
  { id: string; passwordData: ChangePatientPasswordDto }
> {
  return useMutation({
    mutationFn: ({ id, passwordData }) => patientService.resetPatientPassword(id, passwordData),
    // No cache updates needed for password reset
  });
}

/**
 * Hook to impersonate patient
 */
export function useImpersonatePatient(): UseMutationResult<
  { impersonationToken: string; expiresAt: Date },
  Error,
  string
> {
  return useMutation({
    mutationFn: (id: string) => patientService.impersonatePatient(id),
    // No cache updates needed for impersonation
  });
}

/**
 * Hook to terminate patient sessions
 */
export function useTerminatePatientSessions(): UseMutationResult<
  { success: boolean; terminatedSessions: number },
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.terminatePatientSessions(id),
    onSuccess: (_, id) => {
      // Invalidate the patient detail to refresh session info
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
    },
  });
}

/**
 * Hook to add admin note
 */
export function useAddAdminNote(): UseMutationResult<
  { success: boolean; noteId: string },
  Error,
  { id: string; noteData: AddAdminNoteDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, noteData }) => patientService.addAdminNote(id, noteData),
    onSuccess: (_, { id }) => {
      // Invalidate the patient detail to refresh notes
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
      
      // Invalidate activity log
      queryClient.invalidateQueries({ queryKey: patientKeys.activityLog(id) });
    },
  });
}

/**
 * Hook to delete patient
 */
export function useDeletePatient(): UseMutationResult<
  { success: boolean; message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all patient list queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      
      // Remove the deleted patient from cache
      queryClient.removeQueries({ queryKey: patientKeys.detail(deletedId) });
      
      // Invalidate stats since total count changed
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() });
    },
  });
}

// ==================== BULK OPERATION HOOKS ====================

/**
 * Hook for bulk patient actions
 */
export function useBulkPatientAction(): UseMutationResult<
  BulkActionResultDto,
  Error,
  BulkPatientActionDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkPatientActionDto) => patientService.performBulkAction(data),
    onSuccess: (result, variables) => {
      // Invalidate all patient queries since multiple patients might be affected
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() });
      
      // If action affects specific patients, invalidate their details
      if (variables.patientIds?.length) {
        variables.patientIds.forEach(id => {
          queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
        });
      }
    },
  });
}

/**
 * Hook for importing patients
 */
export function useImportPatients(): UseMutationResult<
  BulkActionResultDto,
  Error,
  BulkPatientImportDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkPatientImportDto) => patientService.importPatients(data),
    onSuccess: () => {
      // Invalidate all patient queries since new patients were added
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() });
    },
  });
}

/**
 * Hook for exporting patients
 */
export function useExportPatients(): UseMutationResult<
  { downloadUrl: string },
  Error,
  ExportOptions
> {
  return useMutation({
    mutationFn: (options: ExportOptions) => patientService.exportPatients(options),
    // No cache updates needed for export
  });
}

// ==================== FILE OPERATION HOOKS ====================

/**
 * Hook to upload patient avatar
 */
export function useUploadPatientAvatar(): UseMutationResult<
  { avatarUrl: string },
  Error,
  { id: string; file: File }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }) => patientService.uploadPatientAvatar(id, file),
    onSuccess: (_, { id }) => {
      // Invalidate the specific patient's cache
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
      
      // Invalidate list queries to update avatar in lists
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

/**
 * Hook to preview import file
 */
export function usePreviewImportFile(): UseMutationResult<
  {
    patients: CreatePatientDto[];
    errors: string[];
    warnings: string[];
  },
  Error,
  File
> {
  return useMutation({
    mutationFn: (file: File) => patientService.previewImportFile(file),
    // No cache updates needed for preview
  });
}

// ==================== UTILITY HOOKS ====================

/**
 * Hook to validate patient data
 */
export function useValidatePatientData(): UseMutationResult<
  {
    isValid: boolean;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
  },
  Error,
  CreatePatientDto | UpdatePatientDto
> {
  return useMutation({
    mutationFn: (data: CreatePatientDto | UpdatePatientDto) => patientService.validatePatientData(data),
    // No cache updates needed for validation
  });
}

/**
 * Hook to check email availability
 */
export function useCheckEmailAvailability(): UseMutationResult<
  { available: boolean; suggestion?: string },
  Error,
  { email: string; excludeId?: string }
> {
  return useMutation({
    mutationFn: ({ email, excludeId }) => patientService.checkEmailAvailability(email, excludeId),
    // No cache updates needed for email check
  });
}

/**
 * Hook to search patients
 */
export function useSearchPatients(): UseMutationResult<
  PatientListResponse,
  Error,
  { searchTerm: string; options?: { fields?: string[]; limit?: number; page?: number } }
> {
  return useMutation({
    mutationFn: ({ searchTerm, options = {} }) => patientService.searchPatients(searchTerm, options),
    // No cache updates needed for search (results are temporary)
  });
}

// ==================== CONVENIENCE HOOKS ====================

/**
 * Convenience hook for suspending a patient
 */
export function useSuspendPatient() {
  const changeStatus = useChangePatientStatus();
  
  return {
    ...changeStatus,
    mutate: (id: string, reason?: string) => 
      changeStatus.mutate({ 
        id, 
        statusData: { 
          accountStatus: AccountStatus.SUSPENDED, 
          reason,
          notifyUser: true,
          sendEmail: true,
        } 
      }),
    mutateAsync: (id: string, reason?: string) => 
      changeStatus.mutateAsync({ 
        id, 
        statusData: { 
          accountStatus: AccountStatus.SUSPENDED, 
          reason,
          notifyUser: true,
          sendEmail: true,
        } 
      }),
  };
}

/**
 * Convenience hook for activating a patient
 */
export function useActivatePatient() {
  const changeStatus = useChangePatientStatus();
  
  return {
    ...changeStatus,
    mutate: (id: string, reason?: string) => 
      changeStatus.mutate({ 
        id, 
        statusData: { 
          accountStatus: AccountStatus.ACTIVE, 
          reason,
          notifyUser: true,
          sendEmail: true,
        } 
      }),
    mutateAsync: (id: string, reason?: string) => 
      changeStatus.mutateAsync({ 
        id, 
        statusData: { 
          accountStatus: AccountStatus.ACTIVE, 
          reason,
          notifyUser: true,
          sendEmail: true,
        } 
      }),
  };
}

/**
 * Convenience hook for deactivating a patient
 */
export function useDeactivatePatient() {
  const changeStatus = useChangePatientStatus();
  
  return {
    ...changeStatus,
    mutate: (id: string, reason?: string) => 
      changeStatus.mutate({ 
        id, 
        statusData: { 
          accountStatus: AccountStatus.DEACTIVATED, 
          reason,
          notifyUser: true,
          sendEmail: true,
        } 
      }),
    mutateAsync: (id: string, reason?: string) => 
      changeStatus.mutateAsync({ 
        id, 
        statusData: { 
          accountStatus: AccountStatus.DEACTIVATED, 
          reason,
          notifyUser: true,
          sendEmail: true,
        } 
      }),
  };
}