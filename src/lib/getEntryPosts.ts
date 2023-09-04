import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { DatabaseItem, IPost } from "./entryType";
import { notion } from "./notion";
import { TextRequest } from "notion-to-md/build/types";

type Props =
  | {
      type: "external";
      external: {
        url: TextRequest;
      };
    }
  | null
  | {
      type: "file";
      file: {
        url: string;
        expiry_time: string;
      };
    }
  | null
  | string;

const getCover = (props: Props) => {
  if (typeof props === "string") {
    return props;
  } else if (props && props.type === "file") {
    return props.file.url;
  } else if (props && props.type === "external") {
    return props.external.url;
  } else {
    return null;
  }
};

export const extractPosts = async (
  response: QueryDatabaseResponse
): Promise<IPost[]> => {
  const databaseItems: DatabaseItem[] = response.results.map(
    (databaseItem) => databaseItem as DatabaseItem
  );
  const posts: IPost[] = await Promise.all(
    databaseItems.map(async (postInDB: DatabaseItem) => {
      const title =
        postInDB.properties.Title.title instanceof Array &&
        postInDB.properties.Title.title[0]
          ? postInDB.properties.Title.title[0].plain_text
          : "";
      const categories =
        postInDB.properties.Categories.multi_select instanceof Array
          ? postInDB.properties.Categories.multi_select
          : [];
      const lastEditedTime =
        typeof postInDB.properties.LastEditedTime.last_edited_time === "string"
          ? postInDB.properties.LastEditedTime.last_edited_time
          : "";
      const createdTime =
        typeof postInDB.properties.CreatedTime.created_time === "string"
          ? postInDB.properties.CreatedTime.created_time
          : "";
      const description =
        postInDB.properties.Description.rich_text instanceof Array &&
        postInDB.properties.Description.rich_text[0]
          ? postInDB.properties.Description.rich_text[0].plain_text
          : "";
      const path =
        postInDB.properties.Path.rich_text instanceof Array &&
        postInDB.properties.Path.rich_text[0]
          ? postInDB.properties.Path.rich_text[0].plain_text
          : null;
      const cover = postInDB.cover && getCover(postInDB.cover);
      const url = postInDB.url;
      const available =
        typeof postInDB.properties.Available.checkbox === "boolean"
          ? postInDB.properties.Available.checkbox
          : false;
      const published =
        typeof postInDB.properties.PublishedProduction.checkbox === "boolean"
          ? postInDB.properties.PublishedProduction.checkbox
          : false;
      const date = postInDB.properties.Date.date
        ? Object.values(postInDB.properties.Date.date)
        : [];
      const metaTitle =
        postInDB.properties.MetaTitle.rich_text instanceof Array &&
        postInDB.properties.MetaTitle.rich_text[0]
          ? postInDB.properties.MetaTitle.rich_text[0].plain_text
          : "";
      const metaDescription =
        postInDB.properties.MetaDescription.rich_text instanceof Array &&
        postInDB.properties.MetaDescription.rich_text[0]
          ? postInDB.properties.MetaDescription.rich_text[0].plain_text
          : "";

      const post: IPost = {
        id: postInDB.id,
        title,
        categories: categories.map((item) => item.name),
        modifiedDate: lastEditedTime,
        createdTime,
        description,
        path,
        cover,
        url,
        published,
        available,
        date: date.join(),
        metaTitle,
        metaDescription,
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
