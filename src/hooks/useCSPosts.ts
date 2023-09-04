import useSWR, { SWRConfiguration } from "swr";
import { PostsQuery, PostsRes } from "@/pages/api/case_study_posts";
import { fetcher } from "@/utils/fetcher";

export interface UseAllPostsProps
  extends SWRConfiguration,
    Partial<PostsQuery> {}

export const useAllCSPosts = (config?: UseAllPostsProps) => {
  const swr = useSWR<PostsRes>("/api/case_study_posts/", fetcher, config);

  const isLoading = !swr.error && !swr.data;

  return {
    ...swr,
    isLoading,
  };
};