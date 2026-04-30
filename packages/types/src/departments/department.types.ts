import type { MediaItem } from "../media-items/media-item.types.js";
import type { Statistic } from "../statistic.types.js";
import type { DepartmentLocation } from "./department-location.types.js";
import type { DepartmentTrainer } from "./department-trainer.types.js";
import type { DepartmentTrainingGroup } from "./department-training-group.types.js";

export type DepartmentColor = "purple" | "green" | "red" | "blue";

export interface Department {
  id: number;
  name: string;
  slug: string;
  color: DepartmentColor;
  shortDescription: string;
  welcomeText: string | null;
  iconId: number | null;
  icon: MediaItem | null;
  stats: Statistic[];
  trainingGroups: DepartmentTrainingGroup[];
  locations: DepartmentLocation[];
  trainers: DepartmentTrainer[];
  createdAt: string;
  updatedAt: string;
}
