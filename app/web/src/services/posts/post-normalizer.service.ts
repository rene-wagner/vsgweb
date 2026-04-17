import type { ApiPost, Post } from "@vsg/types";

export function normalizePost(post: ApiPost): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content ?? null,
    published: post.published ?? false,
    authorId: post.author?.id ?? 0,
    author: {
      id: post.author?.id ?? 0,
      username: [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" "),
      email: post.author?.email ?? "",
    },
    categories: (post.categories ?? []).map((category, index) => ({
      id: index,
      name: category.name,
      slug: category.slug,
    })),
    tags: [],
    thumbnail: null,
    createdAt: post.createdAt ?? "",
    updatedAt: post.updatedAt ?? "",
  };
}
