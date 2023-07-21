import { GetStaticProps } from "next";
import { IPost } from "@/lib/caseStudyType";
import { getCaseStudyPosts } from "@/lib/caseStudy";
import Link from "next/link";
import styled from "@emotion/styled";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getCaseStudyPosts();
  return {
    props: {
      posts,
    },
  };
};

interface Props {
  posts: IPost[];
}

const CaseStudyList = ({ posts }: Props) => {
  return (
    <Container>
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
              <p>{post.refLink}</p>

              <p>{post.url}</p>
              <p>{post.modifiedDate}</p>
              <p>{post.path}</p>
              <p>{post.id}</p>

              <span>
                {post.tags.map((tag, index) => (
                  <span key={index}>{tag}</span>
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`
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
`;

const CoverImage = styled(Image)`
  width: 100%;
  height: auto;
`;
const Title = styled.h2`
  font-size: 20px;
  line-height: 30px;
  text-align: center;
`;
