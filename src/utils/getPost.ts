import { getImageDimensions } from "@/utils/getImageDimensions";
import { addZeroWidthSpace } from "@/utils/addZeroWidthSpace";
import { parseMarkdown } from "@/utils/parseMarkdown";
import { NotionToMarkdown } from "notion-to-md";
import { notion } from "../lib/notion";

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getPost = async (id: string) => {
  const mdBlocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const markdown = mdString.parent ? mdString.parent : "";
  const imageSizes = await getImageDimensions(markdown);
  const blocksData = parseMarkdown(markdown);
  const blocks = blocksData.map((block) => {
    if (block.kind === "markdown") {
      block.data = addZeroWidthSpace(block.data);
    }
    return block;
  });
  return {
    imageSizes,
    blocks,
  };
};
