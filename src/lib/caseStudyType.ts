import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export type PostResultProperties = Extract<
  QueryDatabaseResponse["results"][number],
  { properties: Record<string, unknown> }
>;

type PropertyValueMap = PostResultProperties["properties"];
type PropertyValue = PropertyValueMap[string];

type PropertyValueType = PropertyValue["type"];

type ExtractedPropertyValue<TType extends PropertyValueType> = Extract<
  PropertyValue,
  { type: TType }
>;
export type PropertyValueTitle = ExtractedPropertyValue<"title">;
export type PropertyValueRichText = ExtractedPropertyValue<"rich_text">;
export type PropertyValueMultiSelect = ExtractedPropertyValue<"multi_select">;
export type PropertyValueUrl = ExtractedPropertyValue<"url">;
export type PropertyValueDate = ExtractedPropertyValue<"date">;
export type PropertyValueEditedTime =
  ExtractedPropertyValue<"last_edited_time">;
export type PropertyValueCreatedTime = ExtractedPropertyValue<"created_time">;

export interface IPost {
  id: string;
  title: string;
  industry: string[];
  area: string[];
  topic: string[];
  scale: string[];
  refLink: string | null;
  modifiedDate: string;
  companyName: string;
  industryCategory: string;
  moneyName: string;
  path: string;
  cover: string | null;
  url: string;
}

export type DatabaseItem = PostResultProperties & {
  cover: string | null;
  url: string;
  properties: {
    Title: PropertyValueTitle;
    Industry: PropertyValueMultiSelect;
    Area: PropertyValueMultiSelect;
    Topic: PropertyValueMultiSelect;
    Scale: PropertyValueMultiSelect;
    RefLink: PropertyValueUrl;
    LastEditedTime: PropertyValueEditedTime;
    CompanyName: PropertyValueRichText;
    IndustryCategory: PropertyValueRichText;
    MoneyName: PropertyValueRichText;
    Path: PropertyValueRichText;
  };
};
