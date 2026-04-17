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
import type { Department } from "@/types/departments/department.types";
import type { DepartmentLocation } from "@/types/departments/department-location.types";
import type { DepartmentTrainingSession } from "@/types/departments/department-training-session.types";
import type { MediaItem } from "@/types/media-items/media-item.types";

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
