import { getPosts } from "@/lib/caseStudy";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { CaseStudyPosts, notion } from "@/lib/notion";

export async function getStaticPaths() {
  const posts = await getPosts();
  // console.log(posts);
  // console.log(posts.map((post) => post.path));
  return {
    paths: [],
    fallback: true,
  };
}
const n2m = new NotionToMarkdown({ notionClient: notion });

type Params = {
  params: {
    slug: keyof typeof CaseStudyPosts;
  };
};

export const getStaticProps = async ({ params: { slug } }: Params) => {
  const { id } = CaseStudyPosts[slug];
  const mdblocks = await n2m.pageToMarkdown(id);
  console.log(mdblocks);
  const mdString = n2m.toMarkdownString(mdblocks);
  console.log(mdString.parent);
  return {
    props: {
      mdString,
    },
    revalidate: 10,
  };
};

const NotionDomainDynamicPage = (props: { mdString: MdStringObject }) => {
  console.log(props.mdString);
  console.log(Object.values(props.mdString));
  return <>{Object.values(props.mdString)}</>;
};

export default NotionDomainDynamicPage;
