import type { MediaItem } from "../media-items/media-item.types.js";

export interface DepartmentLocationAmenity {
  icon?: string;
  text: string;
}

export interface DepartmentLocation {
  id: number;
  name: string;
  badge: string;
  badgeVariant: string;
  street: string;
  city: string;
  mapsUrl: string | null;
  amenities: DepartmentLocationAmenity[];
  imageId: number | null;
  image: MediaItem | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
}
