import type { JsonLdResource } from "./json-ld.types.js";

export interface CategorySummary extends JsonLdResource {
  name: string;
  slug: string;
}
