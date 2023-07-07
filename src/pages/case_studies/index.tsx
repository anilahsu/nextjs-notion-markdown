import { GetStaticProps } from "next";
import { IPost } from "@/lib/postsType";
import { BlockWithChildren } from "@/lib/blockType";
import { getPosts } from "@/lib/posts";
import CaseStudyList from "@/feature/CaseStudyList";
import { useRouter } from "next/router";

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: {
      posts,
    },
  };
};

interface Props {
  posts: IPost[];
  blocks: BlockWithChildren[]
}
const CaseStudies = ({ posts }: Props) => {
  const router = useRouter();
  console.log(router);
  console.log(router.query.slug);

  return (
    <>
      <h1>All post</h1>
      <CaseStudyList posts={posts} />
    </>
  );
};

export default CaseStudies;
