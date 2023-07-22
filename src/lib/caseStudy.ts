import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { DatabaseItem, IPost } from "./caseStudyType";
import { notion } from "./notion";

export const extractPosts = async (
  response: QueryDatabaseResponse
): Promise<IPost[]> => {
  const databaseItems: DatabaseItem[] = response.results.map(
    (databaseItem) => databaseItem as DatabaseItem
  );
  const posts: IPost[] = await Promise.all(
    databaseItems.map(async (postInDB: DatabaseItem) => {
      const title = postInDB.properties.Title.title[0]
        ? postInDB.properties.Title.title[0].plain_text
        : "";
      const industry = postInDB.properties.Industry.multi_select;
      const area = postInDB.properties.Area.multi_select;
      const topic = postInDB.properties.Topic.multi_select;
      const scale = postInDB.properties.Scale.multi_select;
      const refLink = postInDB.properties.RefLink
        ? postInDB.properties.RefLink.url
        : null;
      const lastEditedTime = postInDB.properties.LastEditedTime
        ? postInDB.properties.LastEditedTime.last_edited_time
        : "";
      const companyName = postInDB.properties.CompanyName.rich_text[0]
        ? postInDB.properties.CompanyName.rich_text[0].plain_text
        : "";
      const industryCategory = postInDB.properties.IndustryCategory.rich_text[0]
        ? postInDB.properties.IndustryCategory.rich_text[0].plain_text
        : "";
      const moneyName = postInDB.properties.MoneyName.rich_text[0]
        ? postInDB.properties.MoneyName.rich_text[0].plain_text
        : "";
      const path = postInDB.properties.Path.rich_text[0]
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
        industry: industry.map((item) => item.name),
        area: area.map((item) => item.name),
        topic: topic.map((item) => item.name),
        scale: scale.map((item) => item.name),
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

export async function getCaseStudyPosts(): Promise<IPost[]> {
  const databaseId = process.env.NOTION_CASE_STUDIES_DATABASE_ID || "";
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
  });
  const posts = await extractPosts(response);
  return posts;
}
