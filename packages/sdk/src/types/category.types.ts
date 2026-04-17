import type { JsonLdResource } from "./json-ld.types.js";
import type { ApiPost as Post } from "@vsg/types";

export interface CategorySummary extends JsonLdResource {
  name: string;
  slug: string;
}

export interface Category extends CategorySummary {
  id: number;
  posts?: Post[];
}
