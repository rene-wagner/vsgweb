import type { MediaItem } from "@/types/media-items/media-item.types";

export interface TrainerLicense {
  name: string;
  variant: string;
}

export interface DepartmentTrainerContactPerson {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: MediaItem | null;
}

export interface DepartmentTrainer {
  id: number;
  contactPersonId: number;
  role: string;
  licenses: TrainerLicense[] | string | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
  contactPerson: DepartmentTrainerContactPerson;
}
