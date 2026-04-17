import type { DepartmentTrainingSession } from "./department-training-session.types.js";

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
