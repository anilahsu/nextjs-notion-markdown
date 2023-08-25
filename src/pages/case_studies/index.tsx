import { GetStaticProps, InferGetStaticPropsType } from "next";
import { IPost } from "@/lib/caseStudyType";
import { getCaseStudyPosts } from "@/lib/caseStudy";
import Link from "next/link";
import styled from "@emotion/styled";
import Image from "next/image";
import { useAllPosts } from "@/hooks/use-all-posts";
import { FilterOrder } from "@/utils/filterOrderPosts";

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getCaseStudyPosts();
  const publishedPosts = FilterOrder(posts);

  return {
    props: {
      fallbackData: publishedPosts ,
    },
    revalidate: 1,
  };
};

interface Props {
  fallbackData: IPost[];
}

const CaseStudyList = ({fallbackData}: Props) => {
  const { data, isLoading } = useAllPosts({
    fallbackData,
    revalidateOnMount: false,
  });

  const posts = !isLoading && data?.publishedPosts ? data.publishedPosts: fallbackData;

  return (
    <Container>
      <h1>Case Study Post</h1>
      {posts.map((post) => {
        return (
          <Link key={post.path} href={"/case_studies/" + post.path}>
            <Card>
              {post.cover && (
                <CoverImage
                  src={post.cover}
                  alt={""}
                  width={700}
                  height={300}
                />
              )}
              <Title>{post.title}</Title>
              <p>{post.companyName}</p>
              <p>{post.moneyName}</p>
              <p>{post.industryCategory}</p>
              {/* <p>{post.refLink}</p>
              <p>{post.modifiedDate}</p>

              <p>{post.url}</p>
              <p>{post.path}</p>
              <p>{post.id}</p> */}

              <span>
                {post.industry.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
                {post.area.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
                {post.topic.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
                {post.scale.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </span>
            </Card>
          </Link>
        );
      })}
    </Container>
  );
};

export default CaseStudyList;

const Container = styled.div`
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;
const Card = styled.div`
  padding: 20px;
  border: 1px solid #2d2d2d;
  margin: 10px;
  border-radius: 20px;
  box-shadow: 0 0 15px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  max-width: 700px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CoverImage = styled(Image)`
  width: 100%;
  height: auto;
`;
const Title = styled.h2`
  font-size: 24px;
  line-height: 30px;
  text-align: center;
`;

const Tag = styled.span`
  padding: 6px;
  background: #dedede;
  border-radius: 10px;
  margin: 0 5px;
`;
