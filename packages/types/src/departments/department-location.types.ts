import type { MediaItem } from "../media-items/media-item.types.js";

export interface DepartmentLocation {
  id: number;
  name: string;
  street: string;
  city: string;
  mapsUrl: string | null;
  picture: MediaItem | null;
}
