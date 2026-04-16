import { ref } from "vue";
import { defineStore } from "pinia";
import { VsgApiError } from "@vsg/vsg-sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";
import { getUploadUrl } from "@/utils/media";

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStat {
  id: number;
  label: string;
  value: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentTrainingSession {
  id: number;
  day: string;
  time: string;
  locationId: number | null;
  location: DepartmentLocation | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentTrainingGroup {
  id: number;
  name: string;
  ageRange: string | null;
  icon: string;
  variant: string;
  sort: number;
  sessions: DepartmentTrainingSession[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentLocation {
  id: number;
  name: string;
  badge: string;
  badgeVariant: string;
  street: string;
  city: string;
  mapsUrl: string | null;
  amenities: Array<{ icon?: string; text: string }>;
  imageId: number | null;
  image: MediaItem | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerLicense {
  name: string;
  variant: string;
}

export interface DepartmentTrainer {
  id: number;
  contactPersonId: number;
  role: string;
  licenses: Array<{ name: string; variant: string }> | string | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
  contactPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: MediaItem | null;
  };
}

export interface Department {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  welcomeText: string | null;
  iconId: number | null;
  icon: MediaItem | null;
  stats: DepartmentStat[];
  trainingGroups: DepartmentTrainingGroup[];
  locations: DepartmentLocation[];
  trainers: DepartmentTrainer[];
  createdAt: string;
  updatedAt: string;
}

export function getMediaUrl(item: MediaItem): string {
  return getUploadUrl(item.filename) ?? "";
}

interface PaginatedResponse {
  data: Department[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useDepartmentsStore = defineStore("departments", () => {
  // List state
  const departments = ref<Department[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Single department state
  const currentDepartment = ref<Department | null>(null);
  const currentDepartmentLoading = ref(false);
  const currentDepartmentError = ref<string | null>(null);
  const currentDepartmentNotFound = ref(false);

  async function fetchDepartments(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.get<PaginatedResponse>("/api/departments?limit=100");
      departments.value = result.data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchDepartmentBySlug(slug: string): Promise<void> {
    currentDepartmentLoading.value = true;
    currentDepartmentError.value = null;
    currentDepartmentNotFound.value = false;
    currentDepartment.value = null;

    try {
      currentDepartment.value = await vsg.get<Department>(
        `/api/departments/${encodeURIComponent(slug)}`,
      );
    } catch (e) {
      if (e instanceof VsgApiError && e.status === 404) {
        currentDepartmentNotFound.value = true;
      } else {
        currentDepartmentError.value = getApiErrorMessage(e);
      }
    } finally {
      currentDepartmentLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (departments.value.length > 0) {
      return;
    }

    await fetchDepartments();
  }

  function clearCurrentDepartment(): void {
    currentDepartment.value = null;
    currentDepartmentError.value = null;
    currentDepartmentNotFound.value = false;
  }

  return {
    // List state
    departments,
    isLoading,
    error,
    fetchDepartments,
    // Single department state
    currentDepartment,
    currentDepartmentLoading,
    currentDepartmentError,
    currentDepartmentNotFound,
    fetchDepartmentBySlug,
    clearCurrentDepartment,
    ensureLoaded,
  };
});
