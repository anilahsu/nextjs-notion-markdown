import { BlockWithChildren } from "@/lib/blockType";
import NotSupportedBlock from "./NotSupportedBlock";
import { Paragraph } from "./Paragraph";
import { Heading1 } from "./Heading1";
import { Heading2 } from "./Heading2";
import { Heading3 } from "./Heading3";

export type PostContentProps = {
  blocks: Array<BlockWithChildren>;
};

const renderBlock = (block: BlockWithChildren): React.ReactNode => {
  const childBlocks: BlockWithChildren[] = block.has_children
    ? block.childBlocks
    : [];
  const content: React.ReactNode = childBlocks.map(
    (block: BlockWithChildren) => {
      return renderBlock(block);
    }
  );
  switch (block.type) {
    case "paragraph":
      return <Paragraph key={block.id} {...block} />;
    case "heading_1":
      return <Heading1 key={block.id} {...block} />;
    case "heading_2":
      return <Heading2 key={block.id} {...block} />;
    case "heading_3":
      return <Heading3 key={block.id} {...block} />;
    /* Truncated code for readability */
    default:
      // to handle unsupported block by our integration
      return <NotSupportedBlock key={block.id} reason={block.type} />;
  }
};

export const PostContent: React.FC<PostContentProps> = ({
  blocks,
}: PostContentProps) => {
  return (
    <article>
      {blocks.map((block: BlockWithChildren) => {
        return renderBlock(block);
      })}
    </article>
  );
};
