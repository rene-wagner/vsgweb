import type { DepartmentLocation } from "./department-location.types.js";

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
