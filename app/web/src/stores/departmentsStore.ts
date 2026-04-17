import { ref } from "vue";
import { defineStore } from "pinia";
import {
  VsgApiError,
  type ApiCollection,
  type Department as ApiDepartment,
  type DepartmentTrainingSession as ApiDepartmentTrainingSession,
  type LocationSummary,
} from "@vsg/vsg-sdk";
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

function normalizeLocation(location: LocationSummary): DepartmentLocation {
  return {
    id: location.id,
    name: location.name,
    badge: "",
    badgeVariant: "primary",
    street: location.street ?? "",
    city: location.city ?? "",
    mapsUrl: location.mapsUrl ?? null,
    amenities: [],
    imageId: null,
    image: null,
    sort: 0,
    createdAt: "",
    updatedAt: "",
  };
}

function normalizeDepartmentSession(
  session: ApiDepartmentTrainingSession,
): DepartmentTrainingSession {
  return {
    id: session.id,
    day: session.day,
    time: session.time,
    locationId: session.location?.id ?? null,
    location: session.location ? normalizeLocation(session.location) : null,
    sort: 0,
    createdAt: "",
    updatedAt: "",
  };
}

function normalizeDepartment(department: ApiDepartment): Department {
  const locations = new Map<number, DepartmentLocation>();

  for (const group of department.trainingGroups ?? []) {
    for (const session of group.departmentTrainingSessions ?? []) {
      if (session.location) {
        locations.set(session.location.id, normalizeLocation(session.location));
      }
    }
  }

  return {
    id: department.id,
    name: department.name,
    slug: department.slug,
    shortDescription: department.description ?? "",
    welcomeText: null,
    iconId: null,
    icon: null,
    stats: (department.departmentStats ?? []).map((stat, index) => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      sort: index,
      createdAt: "",
      updatedAt: "",
    })),
    trainingGroups: (department.trainingGroups ?? []).map((group, index) => ({
      id: group.id,
      name: group.name,
      ageRange: group.ageRange ?? null,
      icon: group.ageRange ? "youth" : "adults",
      variant: index % 2 === 0 ? "primary" : "secondary",
      sort: index,
      sessions: (group.departmentTrainingSessions ?? []).map(normalizeDepartmentSession),
      createdAt: "",
      updatedAt: "",
    })),
    locations: Array.from(locations.values()),
    trainers: [],
    createdAt: "",
    updatedAt: "",
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
      const result = await vsg.get<ApiCollection<ApiDepartment>>("/api/departments?limit=10");
      departments.value = (result.member ?? []).map(normalizeDepartment);
    } catch (e) {
      error.value = getApiErrorMessage(e);
      throw e;
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
      const department = await vsg.get<ApiDepartment>(`/api/departments/${encodeURIComponent(slug)}`);
      currentDepartment.value = normalizeDepartment(department);
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
  };
});
