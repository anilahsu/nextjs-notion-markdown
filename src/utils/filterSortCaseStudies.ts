import { IPost } from "@/lib/caseStudyType";

export const FilterOrderCaseStudies = (posts: IPost[]) => {
  const publishedPosts = posts.filter((post) => post.published);

  publishedPosts.sort((a, b) => {
    // sort by priority in ascending order
    if (a.priority && b.priority && a.priority > b.priority) {
      return 1;
    }
    if (a.priority && b.priority && a.priority < b.priority) {
      return -1;
    }
    // If priority is equal, sort by modifiedDate in descending order
    if (new Date(a.modifiedDate) > new Date(b.modifiedDate)) {
      return -1;
    }
    if (new Date(a.modifiedDate) < new Date(b.modifiedDate)) {
      return 1;
    }
    return 0; // Objects are equal
  });
  return publishedPosts;
};
