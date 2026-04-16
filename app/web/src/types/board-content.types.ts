export interface BoardMember {
  id: number;
  contactPersonId: number;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  phone: string;
  profileImage?: {
    id: number;
    filename: string;
    path: string;
    thumbnails: unknown;
  } | null;
  sort: number;
}

export interface BoardContent {
  id: number;
  headline: string;
  description: string;
  sectionHeadline: string;
  sectionDescription: string;
  note: string;
  boardMembers: BoardMember[];
  createdAt: string;
  updatedAt: string;
}
