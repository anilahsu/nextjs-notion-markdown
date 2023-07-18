import { GetStaticProps } from "next";
import { IPost } from "@/lib/caseStudyType";
import { getPosts } from "@/lib/caseStudy";
import Link from "next/link";
import styled from '@emotion/styled'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
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
    <>
      {posts.map((post) => {
        return (
          <Link key={post.path} href={"/case_studies/" + post.path}>
            <Card>
              <p>{post.id}</p>
              <h2>{post.title}</h2>
              <span>
                {post.tags.map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </span>
              <p>{post.modifiedDate}</p>
              <p>{post.refLink}</p>
              <p>{post.companyName}</p>
              <p>{post.moneyName}</p>
              <p>{post.path}</p>
              <p>{post.industryCategory}</p>
              <p>{post.url}</p>
            </Card>
          </Link>
        );
      })}
    </>
  );
};

export default CaseStudyList;

const Card = styled.div`
  padding: 20px;
  border: 1px solid #2d2d2d;
  margin: 10px;
  border-radius: 20px;
`