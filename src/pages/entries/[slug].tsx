import { getEntryPosts } from "@/lib/entry";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { notion } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "@/styles/post.module.css";
import { isDev } from "@/lib/config";
import { IPost } from "@/lib/entryType";
import { getImageDimensions } from "@/utils/getImageDimensions";
import { addZeroWidthSpace } from "@/utils/addZeroWidthSpace";

export async function getStaticPaths() {
  const allPosts = await getEntryPosts();
  const allPaths = allPosts.map((post) => {
    return post.path;
  });
  if (isDev) {
    return {
      paths: [],
      fallback: true,
    };
  }
  const staticPaths = {
    paths: allPaths.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: "blocking",
  };
  return staticPaths;
}
const n2m = new NotionToMarkdown({ notionClient: notion });

type Params = {
  params: {
    slug: string;
  };
};

export const getStaticProps = async ({ params: { slug } }: Params) => {
  const allPosts = await getEntryPosts();
  const currentPost = allPosts.filter((post) => {
    return post.path === slug;
  });

  const property = currentPost[0];
  const id = property.id;
  const mdBlocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const markdown = mdString.parent ? mdString.parent : "";

  const newMarkdown = addZeroWidthSpace(markdown);
  const imageSizes = await getImageDimensions(markdown);
  return {
    props: {
      mdString,
      property,
      markdown: newMarkdown,
      imageSizes,
    },
    revalidate: 1,
  };
};

type Props = {
  mdString: MdStringObject;
  property: IPost;
  markdown: string;
  imageSizes: Record<string, { width: number; height: number }>;
};

const NotionDomainDynamicPage = ({ property, markdown, imageSizes }: Props) => {
  return (
    <div className={styles.container}>
      <h1>{property && property.title}</h1>
      <p>{property && property.categories}</p>
      <ReactMarkdown
        remarkPlugins={[]}
        className={styles.reactMarkDown}
        components={{
          img: (props) => {
            if (props.src && imageSizes[props.src]) {
              if (!props.src.startsWith("data:")) {
                const { src, alt } = props;
                const { width, height } = imageSizes[props.src];
                return (
                  <Image
                    src={src}
                    alt={alt || ""}
                    width={width}
                    height={height}
                  />
                );
              }
            } else {
              return <img {...props} />;
            }
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default NotionDomainDynamicPage;

