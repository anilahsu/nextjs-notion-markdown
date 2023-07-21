import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { DatabaseItem, IPost } from "./entryType";
import { notion } from "./notion";

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
      const lastEditedTime = postInDB.properties.LastEditedTime
        ? postInDB.properties.LastEditedTime.last_edited_time
        : "";
      const createdTime = postInDB.properties.CreatedTime
        ? postInDB.properties.CreatedTime.created_time
        : "";
      const description = postInDB.properties.Description
        ? postInDB.properties.Description.rich_text[0].plain_text
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
        modifiedDate: lastEditedTime,
        createdTime: createdTime,
        description: description,
        path: path,
        cover: cover,
        url: url,
      };
      return post;
    })
  );
  return posts;
};

export async function getEntryPosts(): Promise<IPost[]> {
  const databaseId = process.env.NOTION_ENTRY_DATABASE_ID || "";
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
  });
  const posts = await extractPosts(response);
  return posts;
}
