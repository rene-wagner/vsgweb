import type { JsonLdResource } from "./json-ld.types.js";

export type EventRecurrence = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;

export interface Event extends JsonLdResource {
  id: number;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  recurrence?: EventRecurrence;
  recurrenceUntil?: string | null;
  picture?: string | null;
}
