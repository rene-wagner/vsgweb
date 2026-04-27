import type { JsonLdResource } from "./json-ld.types.js";

export interface ContentBlock extends JsonLdResource {
  id: string;
  url: string;
  content: string;
}

export interface SaveContentBlockInput {
  id: string;
  url: string;
  content: string;
}

export interface ContentBlockCsrfTokenResponse {
  token: string;
}
