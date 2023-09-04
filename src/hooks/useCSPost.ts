import useSWR, { SWRConfiguration } from "swr";
import { PostQuery, PostRes } from "@/pages/api/case_study_post/[id]";
import { fetcher } from "@/utils/fetcher";

export interface UsePostProps extends SWRConfiguration, Partial<PostQuery> {}

export const useCSPost = ({ id, ...config }: UsePostProps) => {
  const swr = useSWR<PostRes>(!id ? null : "/api/case_study_post/" + id, fetcher, config);

  const isLoading = !swr.error && !swr.data;

  return {
    ...swr,
    isLoading,
  };
};
