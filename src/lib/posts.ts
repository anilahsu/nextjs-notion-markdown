import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { DatabaseItem, IPost } from "./postsType";
import { notion } from "./constant";

export const extractPosts = async (
  response: QueryDatabaseResponse
): Promise<IPost[]> => {
  const databaseItems: DatabaseItem[] = response.results.map(
    (databaseItem) => databaseItem as DatabaseItem
  );
  const posts: IPost[] = await Promise.all(
    databaseItems.map(async (postInDB: DatabaseItem) => {
      const title = postInDB.properties.Title.title[0].plain_text;
      const tags = postInDB.properties.Tags.multi_select;
      const refLink = postInDB.properties.RefLink
        ? postInDB.properties.RefLink.url
        : null;
      const lastEditedTime = postInDB.properties.LastEditedTime
        ? postInDB.properties.LastEditedTime.last_edited_time
        : "";
      const companyName = postInDB.properties.CompanyName
        ? postInDB.properties.CompanyName.rich_text[0].plain_text
        : "";
      const industryCategory = postInDB.properties.IndustryCategory
        ? postInDB.properties.IndustryCategory.rich_text[0].plain_text
        : "";
      const moneyName = postInDB.properties.MoneyName
        ? postInDB.properties.MoneyName.rich_text[0].plain_text
        : "";
        const path = postInDB.properties.Path
        ? postInDB.properties.Path.rich_text[0].plain_text
        : "";
      const cover =
        postInDB.cover?.type === "external"
          ? postInDB.cover.external.url
          : null;
      const url = postInDB.url;

      const post: IPost = {
        id: postInDB.id,
        title: title,
        tags: tags.map((item) => item.name),
        refLink: refLink,
        modifiedDate: lastEditedTime,
        companyName: companyName,
        industryCategory: industryCategory,
        moneyName: moneyName,
        path: path,
        cover: cover,
        url: url,
      };
      return post;
    })
  );
  return posts;
};

export async function getPosts(): Promise<IPost[]> {
  const databaseId = process.env.NOTION_CASE_STUDIES_DATABASE_ID || "";
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
  });
  const posts = await extractPosts(response);
  return posts;
}
