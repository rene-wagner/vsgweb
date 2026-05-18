import type { JsonLdResource } from "./json-ld.types.js";

export interface ClubHistoryMilestone extends JsonLdResource {
  id: number;
  year: number;
  title: string;
  description: string;
}

export interface ClubHistoryMembershipStat extends JsonLdResource {
  id: number;
  year: number;
  memberCount: number;
}

export interface ClubHistorySpecialEvent extends JsonLdResource {
  id: number;
  title: string;
  date: string;
  description: string;
}

export interface ClubHistoryHallOfFameEntry extends JsonLdResource {
  id: number;
  year: number;
  title: string;
  description: string;
}

export interface ApiClubHistory extends JsonLdResource {
  id: number;
  foundingDate: string;
  milestones: ClubHistoryMilestone[];
  membershipStats: ClubHistoryMembershipStat[];
  specialEvents: ClubHistorySpecialEvent[];
  hallOfFameEntries: ClubHistoryHallOfFameEntry[];
}

export type ClubHistoryAPI = ApiClubHistory;
