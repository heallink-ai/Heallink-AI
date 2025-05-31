import { 
  Patient, 
  PatientDetail,
  CreatePatientDto, 
  UpdatePatientDto,
  PatientStatusChangeDto,
  ChangePatientPasswordDto,
  AddAdminNoteDto,
  PatientQueryDto,
  PatientListResponse,
  PatientStatsResponse,
  BulkPatientActionDto,
  BulkPatientImportDto,
  BulkActionResultDto,
  PatientActivityLog,
  ExportOptions,
} from '../types/user.types';
import { fetchWithAuth } from '../../../api/apiClient';

class PatientService {
  private baseUrl = 'users'; // Base API URL (relative to apiClient baseURL)

  // ==================== PATIENT CRUD OPERATIONS ====================

  /**
   * Create a new patient
   */
  async createPatient(data: CreatePatientDto): Promise<Patient> {
    return fetchWithAuth<Patient>(`${this.baseUrl}/patients`, {
      method: 'POST',
      data,
    });
  }

  /**
   * Get a single patient by ID
   */
  async getPatient(id: string): Promise<Patient> {
    return fetchWithAuth<Patient>(`${this.baseUrl}/patients/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Get paginated list of patients with filtering
   */
  async getPatients(params: PatientQueryDto = {}): Promise<PatientListResponse> {
    return fetchWithAuth<PatientListResponse>(`${this.baseUrl}/patients`, {
      method: 'GET',
      params,
    });
  }

  /**
   * Get patient statistics for dashboard
   */
  async getPatientStats(): Promise<PatientStatsResponse> {
    return fetchWithAuth<PatientStatsResponse>(`${this.baseUrl}/patients/stats`);
  }

  /**
   * Get detailed patient information by ID
   */
  async getPatientDetail(id: string): Promise<PatientDetail> {
    return fetchWithAuth<PatientDetail>(`${this.baseUrl}/patients/${id}`);
  }

  /**
   * Update patient information
   */
  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient> {
    return fetchWithAuth<Patient>(`${this.baseUrl}/patients/${id}`, {
      method: 'PATCH',
      data,
    });
  }

  /**
   * Delete patient (soft delete)
   */
  async deletePatient(id: string): Promise<{ success: boolean; message: string }> {
    return fetchWithAuth<{ success: boolean; message: string }>(
      `${this.baseUrl}/${id}`, 
      { method: 'DELETE' }
    );
  }

  // ==================== PATIENT STATUS MANAGEMENT ====================

  /**
   * Change patient account status (suspend, activate, deactivate)
   */
  async changePatientStatus(
    id: string, 
    statusData: PatientStatusChangeDto
  ): Promise<Patient> {
    return fetchWithAuth<Patient>(`${this.baseUrl}/patients/${id}/status`, {
      method: 'PATCH',
      data: statusData,
    });
  }

  /**
   * Reset patient password
   */
  async resetPatientPassword(
    id: string, 
    passwordData: ChangePatientPasswordDto
  ): Promise<{ success: boolean; message: string }> {
    return fetchWithAuth<{ success: boolean; message: string }>(
      `${this.baseUrl}/patients/${id}/password-reset`,
      {
        method: 'POST',
        data: passwordData,
      }
    );
  }

  /**
   * Start admin impersonation session
   */
  async impersonatePatient(id: string): Promise<{ impersonationToken: string; expiresAt: Date }> {
    return fetchWithAuth<{ impersonationToken: string; expiresAt: Date }>(
      `${this.baseUrl}/patients/${id}/impersonate`,
      { method: 'POST' }
    );
  }

  /**
   * Terminate all patient sessions
   */
  async terminatePatientSessions(id: string): Promise<{ success: boolean; terminatedSessions: number }> {
    return fetchWithAuth<{ success: boolean; terminatedSessions: number }>(
      `${this.baseUrl}/patients/${id}/sessions/terminate`,
      { method: 'POST' }
    );
  }

  // ==================== ADMIN FEATURES ====================

  /**
   * Add admin note to patient
   */
  async addAdminNote(
    id: string, 
    noteData: AddAdminNoteDto
  ): Promise<{ success: boolean; noteId: string }> {
    return fetchWithAuth<{ success: boolean; noteId: string }>(
      `${this.baseUrl}/patients/${id}/notes`,
      {
        method: 'POST',
        data: noteData,
      }
    );
  }

  /**
   * Get patient activity log
   */
  async getPatientActivityLog(
    id: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<PatientActivityLog[]> {
    return fetchWithAuth<PatientActivityLog[]>(
      `${this.baseUrl}/patients/${id}/activity-log`, 
      {
        params: { limit, offset }
      }
    );
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Perform bulk action on multiple patients
   */
  async performBulkAction(data: BulkPatientActionDto): Promise<BulkActionResultDto> {
    return fetchWithAuth<BulkActionResultDto>(`${this.baseUrl}/patients/bulk-action`, {
      method: 'POST',
      data,
    });
  }

  /**
   * Import patients from file data
   */
  async importPatients(data: BulkPatientImportDto): Promise<BulkActionResultDto> {
    return fetchWithAuth<BulkActionResultDto>(`${this.baseUrl}/patients/import`, {
      method: 'POST',
      data,
    });
  }

  // ==================== FILE OPERATIONS ====================

  /**
   * Upload patient avatar
   */
  async uploadPatientAvatar(id: string, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${this.baseUrl}/${id}/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Export patients to file
   */
  async exportPatients(options: ExportOptions): Promise<{ downloadUrl: string }> {
    const { patientIds, filters, ...exportData } = options;
    
    const data: BulkPatientActionDto = {
      action: 'export',
      patientIds: patientIds || [],
      exportFormat: exportData.format,
      exportFields: exportData.fields,
      includePII: exportData.includePII,
    };

    // If no specific patients selected, use filters for export
    if (!patientIds?.length && filters) {
      // Convert filters to query params and let backend handle the export
      const result = await this.performBulkAction(data);
      return { downloadUrl: result.downloadUrl || '' };
    }

    const result = await this.performBulkAction(data);
    return { downloadUrl: result.downloadUrl || '' };
  }

  /**
   * Parse import file and return preview data
   */
  async previewImportFile(file: File): Promise<{
    patients: CreatePatientDto[];
    errors: string[];
    warnings: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${this.baseUrl}/patients/import/preview`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Preview failed: ${response.statusText}`);
    }

    return response.json();
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Search patients with advanced options
   */
  async searchPatients(
    searchTerm: string,
    options: {
      fields?: string[];
      limit?: number;
      page?: number;
    } = {}
  ): Promise<PatientListResponse> {
    const params: PatientQueryDto = {
      search: searchTerm,
      searchFields: options.fields,
      limit: options.limit || 50,
      page: options.page || 1,
    };

    return this.getPatients(params);
  }

  /**
   * Get patient suggestions for autocomplete
   */
  async getPatientSuggestions(query: string, limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>> {
    return fetchWithAuth<Array<{
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    }>>(`${this.baseUrl}/patients/suggestions`, {
      params: {
        search: query,
        limit,
        searchFields: ['name', 'email']
      }
    });
  }

  /**
   * Validate patient data before submission
   */
  async validatePatientData(data: CreatePatientDto | UpdatePatientDto): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
  }> {
    return fetchWithAuth<{
      isValid: boolean;
      errors: Record<string, string[]>;
      warnings: Record<string, string[]>;
    }>(`${this.baseUrl}/patients/validate`, {
      method: 'POST',
      data,
    });
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string, excludeId?: string): Promise<{ 
    available: boolean; 
    suggestion?: string 
  }> {
    return fetchWithAuth<{ available: boolean; suggestion?: string }>(
      `${this.baseUrl}/patients/check-email`, {
        params: { email, ...(excludeId && { excludeId }) }
      }
    );
  }

  /**
   * Get available countries and states for address fields
   */
  async getLocationData(): Promise<{
    countries: Array<{ code: string; name: string }>;
    states: Record<string, Array<{ code: string; name: string }>>;
  }> {
    return fetchWithAuth<{
      countries: Array<{ code: string; name: string }>;
      states: Record<string, Array<{ code: string; name: string }>>;
    }>(`${this.baseUrl}/patients/location-data`);
  }
}

// Export singleton instance
export const patientService = new PatientService();
export default patientService;