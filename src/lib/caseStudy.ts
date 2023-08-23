import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { DatabaseItem, IPost } from "./caseStudyType";
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
      const industry =
        postInDB.properties.Industry.multi_select instanceof Array &&
        postInDB.properties.Industry.multi_select
          ? postInDB.properties.Industry.multi_select
          : [];
      const area =
        postInDB.properties.Area.multi_select instanceof Array &&
        postInDB.properties.Area.multi_select
          ? postInDB.properties.Area.multi_select
          : [];
      const topic =
        postInDB.properties.Topic.multi_select instanceof Array &&
        postInDB.properties.Topic.multi_select
          ? postInDB.properties.Topic.multi_select
          : [];
      const scale =
        postInDB.properties.Scale.multi_select instanceof Array &&
        postInDB.properties.Scale.multi_select
          ? postInDB.properties.Scale.multi_select
          : [];
      const refLink =
        typeof postInDB.properties.RefLink.url === "string"
          ? postInDB.properties.RefLink.url
          : "";
      const createdTime =
        typeof postInDB.properties.CreatedTime.created_time === "string"
          ? postInDB.properties.CreatedTime.created_time
          : "";
      const lastEditedTime =
        typeof postInDB.properties.LastEditedTime.last_edited_time === "string"
          ? postInDB.properties.LastEditedTime.last_edited_time
          : "";
      const companyName =
        postInDB.properties.CompanyName.rich_text instanceof Array &&
        postInDB.properties.CompanyName.rich_text[0]
          ? postInDB.properties.CompanyName.rich_text[0].plain_text
          : "";
      const industryCategory =
        postInDB.properties.IndustryCategory.rich_text instanceof Array &&
        postInDB.properties.IndustryCategory.rich_text[0]
          ? postInDB.properties.IndustryCategory.rich_text[0].plain_text
          : "";
      const moneyName =
        postInDB.properties.MoneyName.rich_text instanceof Array &&
        postInDB.properties.MoneyName.rich_text[0]
          ? postInDB.properties.MoneyName.rich_text[0].plain_text
          : "";
      const path =
        postInDB.properties.Path.rich_text instanceof Array &&
        postInDB.properties.Path.rich_text[0]
          ? postInDB.properties.Path.rich_text[0].plain_text
          : "";
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
      const priority =
        typeof postInDB.properties.Priority.number === "number"
          ? postInDB.properties.Priority.number
          : null;
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
      const intervieweeAvatar =
        postInDB.properties.IntervieweeAvatar.files instanceof Array
          ? postInDB.properties.IntervieweeAvatar.files
          : [];
      const intervieweeName =
        postInDB.properties.IntervieweeName.rich_text instanceof Array &&
        postInDB.properties.IntervieweeName.rich_text[0]
          ? postInDB.properties.IntervieweeName.rich_text[0].plain_text
          : "";
      const intervieweeCareer =
        postInDB.properties.IntervieweeCareer.rich_text instanceof Array &&
        postInDB.properties.IntervieweeCareer.rich_text[0]
          ? postInDB.properties.IntervieweeCareer.rich_text[0].plain_text
          : "";
      const intervieweePosition =
        postInDB.properties.IntervieweePosition.rich_text instanceof Array &&
        postInDB.properties.IntervieweePosition.rich_text[0]
          ? postInDB.properties.IntervieweePosition.rich_text[0].plain_text
          : "";
      const imageSlider =
        postInDB.properties.ImageSlider.files instanceof Array
          ? postInDB.properties.ImageSlider.files
          : [];

      const post: IPost = {
        id: postInDB.id,
        title,
        industry: industry.map((item) => item.name),
        area: area.map((item) => item.name),
        topic: topic.map((item) => item.name),
        scale: scale.map((item) => item.name),
        refLink,
        createdTime: createdTime,
        modifiedDate: lastEditedTime,
        companyName,
        industryCategory,
        moneyName,
        path,
        cover,
        url,
        available,
        published,
        priority,
        metaTitle,
        metaDescription,
        intervieweeAvatar,
        intervieweeName,
        intervieweeCareer,
        intervieweePosition,
        imageSlider,
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
