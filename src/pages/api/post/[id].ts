import { NextApiRequest, NextApiResponse } from "next";
import { getPost } from "@/lib/getPost";

type Post = {
  imageSizes: Record<string, { width: number; height: number }>;
  blocks: {
    kind: string;
    data: string;
  }[];
};

export interface PostQuery extends Post {
  id: string;
}

export interface PostRes {
  post?: Post;
  error?: unknown;
}

const handle = async (req: NextApiRequest, res: NextApiResponse<PostRes>) => {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  try {
    const { id } = req.query as unknown as PostQuery;
    const post = await getPost(id);

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error });
  }
};
export default handle;
