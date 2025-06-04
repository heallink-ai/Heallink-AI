import { ApiResponse } from "../api-types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Knowledge base entry data structure
export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  category: "procedure" | "diagnosis" | "treatment" | "medication" | "general";
  tags: string[];
  specialization?: string;
  isPublic: boolean;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  created: string;
  updated: string;
  version: number;
}

// Specialization data structure
export interface SpecializationData {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  isActive: boolean;
  created: string;
}

/**
 * Fetch knowledge base entries for the provider
 */
export async function fetchKnowledgeBaseEntries(
  page = 1,
  limit = 10,
  category?: string,
  searchQuery?: string
): Promise<ApiResponse<{ entries: KnowledgeBaseEntry[]; total: number }>> {
  try {
    let url = `${API_URL}/providers/knowledge-base?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch knowledge base entries",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching knowledge base entries:", error);
    return {
      error: "An unexpected error occurred while fetching knowledge base entries",
    };
  }
}

/**
 * Create a new knowledge base entry
 */
export async function createKnowledgeBaseEntry(
  entryData: Omit<KnowledgeBaseEntry, "id" | "createdBy" | "created" | "updated" | "version">
): Promise<ApiResponse<KnowledgeBaseEntry>> {
  try {
    const response = await fetch(`${API_URL}/providers/knowledge-base`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to create knowledge base entry",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error creating knowledge base entry:", error);
    return {
      error: "An unexpected error occurred while creating knowledge base entry",
    };
  }
}

/**
 * Update a knowledge base entry
 */
export async function updateKnowledgeBaseEntry(
  entryId: string,
  entryData: Partial<KnowledgeBaseEntry>
): Promise<ApiResponse<KnowledgeBaseEntry>> {
  try {
    const response = await fetch(`${API_URL}/providers/knowledge-base/${entryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update knowledge base entry",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating knowledge base entry:", error);
    return {
      error: "An unexpected error occurred while updating knowledge base entry",
    };
  }
}

/**
 * Delete a knowledge base entry
 */
export async function deleteKnowledgeBaseEntry(
  entryId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const response = await fetch(`${API_URL}/providers/knowledge-base/${entryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to delete knowledge base entry",
        statusCode: response.status,
      };
    }