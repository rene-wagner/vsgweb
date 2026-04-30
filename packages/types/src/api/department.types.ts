import type { JsonLdResource } from "./json-ld.types.js";
import type { LocationSummary } from "./location.types.js";
import type { DepartmentColor } from "../departments/department.types.js";
import type { MediaItem } from "../media-items/media-item.types.js";

export interface ApiDepartmentStatistic extends JsonLdResource {
  id: number;
  label: string;
  value: string;
}

export interface ApiDepartmentTrainingSession extends JsonLdResource {
  id: number;
  day: string;
  time: string;
  location?: LocationSummary | null;
}

export interface ApiDepartmentTrainingGroup extends JsonLdResource {
  id: number;
  name: string;
  ageRange?: string | null;
  departmentTrainingSessions: ApiDepartmentTrainingSession[];
}

export interface ApiDepartment extends JsonLdResource {
  id: number;
  name: string;
  slug: string;
  color: DepartmentColor;
  description?: string | null;
  icon?: string | MediaItem | null;
  departmentStats: ApiDepartmentStatistic[];
  trainingGroups: ApiDepartmentTrainingGroup[];
}

export type DepartmentAPI = ApiDepartment;
