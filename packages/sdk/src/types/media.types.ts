import type { JsonLdResource } from "./json-ld.types.js";

export interface MediaFolder extends JsonLdResource {
  id: number;
  parent?: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem extends JsonLdResource {
  id: number;
  name: string;
  original_filename: string;
  mime_type: string;
  extension: string;
  type: string;
  size_bytes: number;
  description?: string | null;
  crop_x?: number | null;
  crop_y?: number | null;
  crop_width?: number | null;
  crop_height?: number | null;
  created_at: string;
  updated_at: string;
  original_url?: string | null;
  thumbnail_url?: string | null;
  cropped_url?: string | null;
  cropped_thumbnail_url?: string | null;
  display_url?: string | null;
  url?: string | null;
  size_human?: string | null;
  folder_id?: number | null;
  category_id?: number | null;
}
