import { getPosts } from "@/lib/caseStudy";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { CaseStudyPosts, notion } from "@/lib/notion";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

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
  const source = mdString.parent;

  const mdxSource = await serialize(source);
  console.log(mdxSource)
  return {
    props: {
      mdString,
      source: mdxSource,
    },
    revalidate: 10,
  };
};

const NotionDomainDynamicPage = (props: {mdString: MdStringObject, source:  MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>}) => {
  if (props.mdString) {
    console.log(props.mdString);
  console.log(Object.values(props.mdString));
  }
  console.log(props.source)
  return (
    <>
      <MDXRemote {...props.source} />
    </>
  );
};

export default NotionDomainDynamicPage;
