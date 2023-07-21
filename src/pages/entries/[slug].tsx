import { getEntryPosts } from "@/lib/entry";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { EntryPosts, notion } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import sizeOf from "image-size";
import url from "url";
import https from "https";
import styles from "@/styles/post.module.css";
import { isDev } from "@/lib/config";

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true,
    };
  }
  const staticPaths = {
    path: Object.keys(getEntryPosts).map((slug) => ({
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
    slug: keyof typeof EntryPosts;
  };
};

export const getStaticProps = async ({ params: { slug } }: Params) => {
  const { id } = EntryPosts[slug];
  const mdblocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdblocks);
  const markdown = mdString.parent;

  const newMarkdown = addZeroWidthSpace(markdown);
  const imageSizes = await getImageDimensions(markdown);
  return {
    props: {
      mdString,
      markdown: newMarkdown,
      imageSizes,
    },
    revalidate: 10,
  };
};

type Props = {
  mdString: MdStringObject;
  markdown: string;
  imageSizes: Record<string, { width: number; height: number }>;
};

const NotionDomainDynamicPage = ({ markdown, imageSizes }: Props) => {
  return (
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
