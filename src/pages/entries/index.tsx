import { GetStaticProps } from "next";
import { IPost } from "@/lib/entryType";
import { getEntryPosts } from "@/lib/getEntryPosts";
import Link from "next/link";
import styled from "@emotion/styled";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getEntryPosts();
  const publishedPosts = posts.filter((post) => post.published);
  publishedPosts
    .sort(
      (a, b) =>
        new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime()
    )
    .reverse();
  return {
    props: {
      posts: publishedPosts,
    },
    revalidate: 1,
  };
};

interface Props {
  posts: IPost[];
}

const EntryList = ({ posts }: Props) => {
  return (
    <Container>
      <h1>Entry Post</h1>
      {posts.map((post) => {
        return (
          <Link key={post.path} href={"/entries/" + post.path}>
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
              <Description>{post.description}</Description>
              {/* <p>{post.modifiedDate}</p>
              <p>{post.path}</p>
              <p>{post.id}</p>
              <p>{post.url}</p> */}

              <span>
                {post.categories.map((category, index) => (
                  <Category key={index}>{category}</Category>
                ))}
              </span>
            </Card>
          </Link>
        );
      })}
    </Container>
  );
};

export default EntryList;

const Container = styled.div`
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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

const Description = styled.h5`
  font-size: 20px;
  text-align: center;
`;

const Category = styled.span`
  padding: 6px;
  background: #dedede;
  border-radius: 10px;
  margin: 0 5px;
`;
