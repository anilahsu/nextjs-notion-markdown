import { getEntryPosts } from '@/lib/getEntryPosts';
import { IPost } from "@/lib/entryType";
import { NextApiRequest, NextApiResponse } from "next";
import { filterOrderEntries } from '@/utils/filterSortEntries';

export interface PostsQuery {}
export interface PostsRes {
  publishedPosts?: IPost[];
  error?: unknown;
}

const handle = async (_: NextApiRequest, res: NextApiResponse<PostsRes>) => {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  try {
    const posts = await getEntryPosts();
    const publishedPosts = filterOrderEntries(posts);

    res.status(200).json({ publishedPosts });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handle;
