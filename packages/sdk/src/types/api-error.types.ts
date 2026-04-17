import type { JsonLdContext } from "./json-ld.types.js";

export interface ApiConstraintViolation {
  propertyPath?: string;
  message?: string;
  code?: string;
}

export interface ApiErrorBody {
  "@context"?: JsonLdContext;
  "@type"?: string;
  title?: string;
  detail?: string;
  message?: string;
  description?: string;
  status?: number;
  violations?: ApiConstraintViolation[];
}
