import { getCaseStudyPosts } from "@/lib/caseStudy";
import { MdStringObject } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { notion } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "@/styles/post.module.css";
import { isDev } from "@/lib/config";
import { IPost } from "@/lib/caseStudyType";
import { getImageDimensions } from "@/utils/getImageDimensions";
import { addZeroWidthSpace } from "@/utils/addZeroWidthSpace";
import { parseMarkdown } from "@/utils/parseMarkdown";
import ServiceIntroduction from "@/components/ServiceIntroduction";
import IntervieweeImages from "@/components/IntervieweeImages";

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

  const property = currentPost[0];
  const id = property.id;
  const mdBlocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const markdown = mdString.parent;

  const imageSizes = await getImageDimensions(markdown);

  const blocks = parseMarkdown(markdown);
  const newBlocks = blocks.map((block) => {
    if (block.kind === "markdown") {
      block.data = addZeroWidthSpace(block.data);
    }
    return block;
  });
  return {
    props: {
      mdString,
      property,
      blocks: newBlocks,
      imageSizes,
    },
    revalidate: 10,
  };
};

type Props = {
  mdString: MdStringObject;
  property: IPost;
  blocks: {
    kind: string;
    data: string;
  }[];
  imageSizes: Record<string, { width: number; height: number }>;
};

const StaticComponent = ({
  name,
  context,
}: {
  name: string;
  context: IPost;
}) => {
  switch (name) {
    case "service_intro_component":
      return <ServiceIntroduction context={context} />;
    case "interviewee_images":
      return <IntervieweeImages context={context} />;
    default:
      return null;
  }
};

const NotionDomainDynamicPage = ({ property, blocks, imageSizes }: Props) => {
  // console.log(property && property.images.map((image) => image.name))
  return (
    <div className={styles.container}>
      <h1>{property && property.title}</h1>
      <p>{property && property.companyName}</p>
      {blocks &&
        blocks.map((block, index) => {
          switch (block.kind) {
            case "markdown":
              return (
                <ReactMarkdown
                  key={index}
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
                  {block.data}
                </ReactMarkdown>
              );
            case "static":
              return (
                <StaticComponent
                  name={block.data}
                  context={property}
                  key={index}
                />
              );
            default:
              return null;
          }
        })}
    </div>
  );
};

export default NotionDomainDynamicPage;

