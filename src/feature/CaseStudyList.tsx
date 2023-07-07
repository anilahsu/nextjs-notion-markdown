import styles from "@/styles/notion.module.css";
import { IPost } from "@/lib/postsType";
import Link from "next/link";

interface Props {
  posts: IPost[];
}

const CaseStudyList = ({ posts }: Props) => {
  return (
    <>
      {posts.map((post) => {
        return (
          <Link key={post.path} href={"/case_studies/" + post.path}>
            <div className={styles.postCard}>
              <p>{post.id}</p>
              <p>{post.title}</p>
              <p>
                {post.tags.map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </p>
              <p>{post.modifiedDate}</p>
              <p>{post.refLink}</p>
              <p>{post.companyName}</p>
              <p>{post.moneyName}</p>
              <p>{post.path}</p>
              <p>{post.industryCategory}</p>
              <p>{post.url}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default CaseStudyList;
