import { PostContent } from "@/components/PageContent";
import { getPostBlocks } from "@/lib/block";
import { BlockWithChildren } from "@/lib/blockType";
import { getPosts } from "@/lib/posts";
import { IPost } from "@/lib/postsType";
import { GetStaticProps } from "next";

export async function getStaticPaths() {
  const posts = await getPosts();
  console.log(posts);
  console.log(posts.map((post) => post.path));
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
  const AllBlocks: BlockWithChildren[][] = (
    await Promise.all(
      posts.map((post) => {
        return getPostBlocks(post.id);
      })
    )
  );
  return {
    props: {
      posts,
      AllBlocks,
    },
  };
};

interface Props {
  posts: IPost[];
  AllBlocks: BlockWithChildren[][];
}
const NotionDomainDynamicPage = (props: Props) => {
  return (
    <>
     {props.AllBlocks && props.AllBlocks.map((blocks, index) => {
       return <PostContent key={index} blocks={blocks} />
     })}
    </>
  );
};

export default NotionDomainDynamicPage;
