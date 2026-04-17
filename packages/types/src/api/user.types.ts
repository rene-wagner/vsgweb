import type { JsonLdResource } from "./json-ld.types.js";

export interface UserSummary extends JsonLdResource {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
