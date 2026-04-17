import type { DepartmentTrainingSession } from "@/types/departments/department-training-session.types";

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
