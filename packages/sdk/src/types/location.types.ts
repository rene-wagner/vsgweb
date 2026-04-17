import type { JsonLdResource } from "./json-ld.types.js";
import type { MediaItem } from "./media.types.js";

export interface LocationSummary extends JsonLdResource {
  id: number;
  name: string;
  street?: string | null;
  city?: string | null;
  mapsUrl?: string | null;
  picture?: MediaItem | null;
}

export interface Location extends LocationSummary {}
