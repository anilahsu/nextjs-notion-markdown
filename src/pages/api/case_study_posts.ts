import { getCaseStudyPosts } from "@/lib/getCaseStudyPosts";
import { IPost } from "@/lib/caseStudyType";
import { NextApiRequest, NextApiResponse } from "next";
import { FilterOrderCaseStudies } from "@/utils/filterSortCaseStudies";

export interface PostsQuery {}
export interface PostsRes {
  publishedPosts?: IPost[];
  error?: unknown;
}

const handle = async (_: NextApiRequest, res: NextApiResponse<PostsRes>) => {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  try {
    const posts = await getCaseStudyPosts();
    const publishedPosts = FilterOrderCaseStudies(posts);
    console.log(publishedPosts)

    res.status(200).json({ publishedPosts });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handle;
