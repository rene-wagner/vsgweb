import type { JsonLdResource } from "./json-ld.types.js";
import type { UserSummary } from "./user.types.js";
import type { CategorySummary } from "./category.types.js";

export interface ApiPost extends JsonLdResource {
  id: number;
  title: string;
  slug: string;
  content: string;
  published?: boolean;
  hits?: number;
  oldPost?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: UserSummary;
  categories?: CategorySummary[];
  picture?: string | null;
}

export type PostAPI = ApiPost;
