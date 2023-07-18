import { getPosts } from "@/lib/caseStudy";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { CaseStudyPosts, notion } from "@/lib/notion";
import { useRouter } from "next/router";
import { remark } from "remark";
import html from "remark-html";
import matter from 'gray-matter';

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

export const getPostsData = async (id: string) => {
  const mdBlocks = await n2m.pageToMarkdown(id);
  console.log(mdBlocks);
  const mdString = n2m.toMarkdownString(mdBlocks);
  console.log(mdString);

  const matterResult = matter(mdString.parent);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();
  return {
    contentHtml,
    id,
    mdString,
  };
};

export const getStaticProps = async ({ params: { slug } }: Params) => {
  const { id } = CaseStudyPosts[slug];
  console.log("id", id);
  const postData = await getPostsData(id);
  console.log("postData", postData);
  return {
    props: {
      contentHtml: postData.contentHtml,
      id: postData.id,
      mdString: postData.mdString,
    },
    revalidate: 10,
  };
};

const NotionDomainDynamicPage = (props: {
  mdString: MdStringObject;
  contentHtml: string;
  id: string;
}) => {
  const router = useRouter();
  // console.log(router);
  // const slug = router.query.slug;
  // console.log(router.query.slug);
  console.log(props.mdString);
  console.log(props.contentHtml);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: props.contentHtml }} />
      {/* {props.mdString ? Object.values(props.mdString) : "no Data"} */}
    </>
  );
};

export default NotionDomainDynamicPage;
