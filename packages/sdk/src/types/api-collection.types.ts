import type { JsonLdResource } from "./json-ld.types.js";

export interface ApiCollectionView {
  "@id"?: string;
  "@type"?: string;
  first?: string;
  last?: string;
  previous?: string;
  next?: string;
}

export interface ApiCollectionSearchMapping {
  "@type"?: string;
  variable: string;
  property?: string | null;
  required?: boolean;
}

export interface ApiCollectionSearch {
  "@type"?: string;
  template?: string;
  variableRepresentation?: string;
  mapping?: ApiCollectionSearchMapping[];
}

export interface ApiCollection<TItem> extends JsonLdResource {
  member: TItem[];
  totalItems?: number;
  view?: ApiCollectionView;
  search?: ApiCollectionSearch;
}
