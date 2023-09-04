import useSWR, { SWRConfiguration } from "swr";
import { PostsQuery, PostsRes } from "@/pages/api/entry_posts";
import { fetcher } from "@/utils/fetcher";

export interface UseAllPostsProps
  extends SWRConfiguration,
    Partial<PostsQuery> {}

export const useAllEntryPosts = (config?: UseAllPostsProps) => {
  const swr = useSWR<PostsRes>("/api/entry_posts/", fetcher, config);
  const isLoading = !swr.error && !swr.data;

  return {
    ...swr,
    isLoading,
  };
};