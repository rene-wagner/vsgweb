import type { DepartmentLocation } from "@/types/departments/department-location.types";

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
