import type { JsonLdResource } from "./json-ld.types.js";

export interface LocationSummary extends JsonLdResource {
  id: number;
  name: string;
  street?: string | null;
  city?: string | null;
  mapsUrl?: string | null;
}

export interface Location extends LocationSummary {
  picture?: string | null;
}
