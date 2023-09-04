import { IPost } from "@/lib/entryType";

export const filterOrderEntries = (posts: IPost[]) => {
  const publishedPosts = posts.filter((post) => post.published);
  publishedPosts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reverse();
  return publishedPosts;
};
