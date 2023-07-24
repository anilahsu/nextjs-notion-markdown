import { getCaseStudyPosts } from "@/lib/caseStudy";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { notion } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import sizeOf from "image-size";
import url from "url";
import https from "https";
import styles from "@/styles/post.module.css";
import { isDev } from "@/lib/config";
import { IPost } from "@/lib/caseStudyType";

export async function getStaticPaths() {
  const allPosts = await getCaseStudyPosts();
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
  console.log("staticPaths", staticPaths)
  return staticPaths;
}

const n2m = new NotionToMarkdown({ notionClient: notion });

type Params = {
  params: {
    slug: string;
  };
};

export const getStaticProps = async ({ params: { slug } }: Params) => {
  const allPosts = await getCaseStudyPosts();
  const currentPost = allPosts.filter((post) => {
    return post.path === slug;
  });
  console.log("currentPost", currentPost);

  const property = currentPost[0];
  const id = property.id;
  const mdblocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdblocks);
  const markdown = mdString.parent;

  const newMarkdown = addZeroWidthSpace(markdown);
  const imageSizes = await getImageDimensions(markdown);
  return {
    props: {
      mdString,
      property,
      markdown: newMarkdown,
      imageSizes,
    },
    revalidate: 10,
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
      <p>{property && property.companyName}</p>
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

const getImageDimensions = async (markdown: string) => {
  const imageSizes: Props["imageSizes"] = {};
  const iterator = markdown.matchAll(/\!\[.*]\((.*)\)/g);

  let match: IteratorResult<RegExpMatchArray, any>;
  while (!(match = iterator.next()).done) {
    const [, src] = match.value;
    try {
      if (src.startsWith("data:")) {
        const base64Data = src.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        const { width, height } = sizeOf(buffer);
        if (width && height) {
          imageSizes[src] = { width, height };
        }
      } else {
        const options = url.format(src);
        const response = await getUrlImageSize(options);
        const { width, height } = response;
        if (width && height) {
          imageSizes[src] = { width, height };
        }
      }
    } catch (err) {
      console.error(`Can’t get dimensions for ${src}:`, err);
    }
  }
  return imageSizes;
};

const getUrlImageSize = (
  options: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      const chunks: Buffer[] = [];
      response
        .on("data", (chunk) => {
          chunks.push(chunk);
        })
        .on("end", () => {
          const buffer = Buffer.concat(chunks);
          const { width, height } = sizeOf(buffer);
          if (width && height) {
            resolve({ width, height });
          }
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  });
};

const addZeroWidthSpace = (text: string) => {
  const punctuationRegex = /[“”「」『』【】〖〗〈〉《》）)。，]/g;
  const boldItalicRegex = /(\*\*|__|\*|_)(.*?)\1/g;

  const replacedText = text.replace(boldItalicRegex, (_, marker, content) => {
    const updatedContent = content.replaceAll(
      punctuationRegex,
      (match: string) => "\u200B" + match + "\u200B"
    );
    return `${marker}${updatedContent}${marker}`;
  });
  return replacedText;
};
