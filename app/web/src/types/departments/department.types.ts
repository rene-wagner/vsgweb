import type { MediaItem } from "@/types/media-items/media-item.types";
import type { DepartmentLocation } from "@/types/departments/department-location.types";
import type { DepartmentStat } from "@/types/departments/department-stat.types";
import type { DepartmentTrainer } from "@/types/departments/department-trainer.types";
import type { DepartmentTrainingGroup } from "@/types/departments/department-training-group.types";

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
