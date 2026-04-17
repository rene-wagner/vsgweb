export type JsonLdContext = string | Record<string, unknown>;

export interface JsonLdResource {
  "@context"?: JsonLdContext;
  "@id"?: string;
  "@type"?: string;
}
