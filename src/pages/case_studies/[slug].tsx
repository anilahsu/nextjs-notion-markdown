import { getCaseStudyPosts } from "@/lib/getCaseStudyPosts";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "@/styles/post.module.css";
import { isDev } from "@/lib/config";
import { IPost } from "@/lib/caseStudyType";

import ServiceIntroduction from "@/components/ServiceIntroduction";
import IntervieweeInfo from "@/components/IntervieweeInfo";
import ImageSlider from "@/components/ImageSlider";
import { getPost } from "@/utils/getPost";
import { InferGetStaticPropsType } from "next/types";
import { usePost } from "@/hooks/use-case_study-post";

export async function getStaticPaths() {
  const allPosts = await getCaseStudyPosts();
  const allPaths = allPosts.map((post) => {
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
  const allPosts = await getCaseStudyPosts();
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

type CaseStudyPostProps = {
  id: string;
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
      return <ServiceIntroduction />;
    case "image_slider":
      return <ImageSlider context={context} />;
    case "interviewee_info":
      return <IntervieweeInfo context={context} />;
    default:
      return null;
  }
};

const NotionDomainDynamicPage = ({
  id,
  property,
  fallbackData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data, isLoading } = usePost({
    id,
    fallbackData,
    revalidateOnMount: false,
  });

  const post = !isLoading && data?.post ? data.post : fallbackData;

  return (
    <div className={styles.container}>
      <h1>{property && property.title}</h1>
      <p>{property && property.companyName}</p>
      {post.blocks &&
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
