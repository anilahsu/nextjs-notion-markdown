import { getEntryPosts } from "@/lib/getEntryPosts";
import { MdStringObject } from "notion-to-md/build/types";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "@/styles/post.module.css";
import { isDev } from "@/lib/config";
import { IPost } from "@/lib/entryType";
import { getPost } from "@/utils/getPost";
import { InferGetStaticPropsType } from "next";
import { useEntryPost } from "@/hooks/useEntryPost";

export async function getStaticPaths() {
  const allPosts = await getEntryPosts();
  const published = allPosts.filter((post)=> post.published)
  const allPaths = published.map((post) => {
    return post.path;
  });
  if (isDev) {
    return {
      paths: [],
      fallback: "blocking",
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
  const { imageSizes, blocks } = await getPost(id);

  return {
    props: {
      id,
      property,
      fallbackData: {
        blocks,
        imageSizes,
      },
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

const NotionDomainDynamicPage = ({ id, property, fallbackData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data, isLoading } = useEntryPost({
    id,
    fallbackData,
    revalidateOnMount: false,
  });

  const post = !isLoading && data?.post ? data?.post : fallbackData;

  
  return (
    <div className={styles.container}>
      <h1>{property && property.title}</h1>
      <p>{property && property.categories}</p>
      {post &&
        post.blocks &&
        post.blocks.map((block, index) => {
          switch (block.kind) {
            case "markdown":
              return (
                <ReactMarkdown
                  key={index}
                  remarkPlugins={[]}
                  className={styles.reactMarkDown}
                  components={{
                    img: (props) => {
                      if (props.src && post.imageSizes[props.src]) {
                        if (!props.src.startsWith("data:")) {
                          const { src, alt } = props;
                          const { width, height } = post.imageSizes[props.src];
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
               <></>
              );
            default:
              return null;
          }
        })}
    </div>
  );
};

export default NotionDomainDynamicPage;
