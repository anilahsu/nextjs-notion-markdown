import useSWR, { SWRConfiguration } from "swr";
import { PostsQuery, PostsRes } from "@/pages/api/case_ study_posts";
import { fetcher } from "@/utils/fetcher";

export interface UseAllPostsProps
  extends SWRConfiguration,
    Partial<PostsQuery> {}

export const useAllPosts = (config?: UseAllPostsProps) => {
  const swr = useSWR<PostsRes>("/api/case_study_posts/", fetcher, config);

  const isLoading = !swr.error && !swr.data;

  return {
    ...swr,
    isLoading,
  };
};