import type { JsonLdResource } from "./json-ld.types.js";

export interface ContactPerson extends JsonLdResource {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  position: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  picture?: string | null;
}
