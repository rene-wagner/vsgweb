export interface PostAuthor {
  id: number;
  username: string;
  email: string;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
}

export interface PostTag {
  id: number;
  name: string;
  slug: string;
}

export interface PostThumbnail {
  filename: string;
  originalName: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  published: boolean;
  authorId: number;
  author: PostAuthor;
  categories: PostCategory[];
  tags: PostTag[];
  thumbnail: PostThumbnail | null;
  createdAt: string;
  updatedAt: string;
}
