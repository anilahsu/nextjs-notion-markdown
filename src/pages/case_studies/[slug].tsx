import { getPosts } from "@/lib/caseStudy";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { CaseStudyPosts, notion } from "@/lib/notion";
import ReactMarkdown from "react-markdown";

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

function addZeroWidthSpace(text: string) {
  const punctuationRegex =
    /[“”「」『』【】〖〗〈〉《》）)。，]/g;
  const boldItalicRegex = /(\*\*|__|\*|_)(.*?)\1/g;

  const replacedText = text.replace(boldItalicRegex, (_, marker, content) => {

    const updatedContent = content.replaceAll(
      punctuationRegex,
      (match: string) => "\u200B" + match + "\u200B"
    );
    return `${marker}${updatedContent}${marker}`;
  });
  return replacedText;
}

export const getStaticProps = async ({ params: { slug } }: Params) => {
  const { id } = CaseStudyPosts[slug];
  const mdblocks = await n2m.pageToMarkdown(id);

  const mdString = n2m.toMarkdownString(mdblocks);
  const markdown = addZeroWidthSpace(mdString.parent);
  console.log("markdown", markdown);
  return {
    props: {
      mdString,
      markdown,
    },
    revalidate: 10,
  };
};

const NotionDomainDynamicPage = (props: {
  mdString: MdStringObject;
  markdown: string;
}) => {
  return (
    <ReactMarkdown remarkPlugins={[]} components={{}}>
      {props.markdown}
    </ReactMarkdown>
  );
};

export default NotionDomainDynamicPage;
