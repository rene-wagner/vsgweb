import { ref } from "vue";
import { defineStore } from "pinia";
import { VsgApiError, type ApiCollection, type Department as ApiDepartment } from "@vsg/sdk";
import type { Department } from "@vsg/types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";
import { normalizeDepartment } from "@/services/departments/department-normalizer.service";

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
      const department = await vsg.get<ApiDepartment>(
        `/api/departments/${encodeURIComponent(slug)}`,
      );
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
