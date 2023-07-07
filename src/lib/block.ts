import { Block, BlockWithChildren } from "./blockType";
import { notion } from "./constant";

export const getBlocks = async (blockId: string): Promise<Block[]> => {
  const blocks: Block[] = [];
  let response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 25,
  });

  response.results.map((block) => {
    blocks.push(block as Block);
  });

  while (response.has_more && response.next_cursor) {
    response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 25,
      start_cursor: response.next_cursor,
    });
    response.results.map((block) => {
      blocks.push(block as Block);
    });
  }
  return blocks;
};

const getChildren = async (block: Block): Promise<BlockWithChildren> => {
  const children: BlockWithChildren[] = [];
  if (block.has_children) {
    const childBlocks = await getBlocks(block.id);
    const childBlocksWithChildren = await Promise.all(
      childBlocks.map(async (block: Block) => await getChildren(block))
    );
    childBlocksWithChildren.map((block: BlockWithChildren) => {
      children.push(block);
    });
  }
  const aBlock: BlockWithChildren = {
    ...block,
    childBlocks: children,
  };
  return aBlock;
};

export const getPostBlocks = async (
  pageId: string
): Promise<BlockWithChildren[]> => {
  const blocks: Block[] = await getBlocks(pageId);
  const blocksWithChildren: BlockWithChildren[] = await Promise.all(
    blocks.map(async (block: Block) => {
      const blockWithChildren = await getChildren(block);
      return blockWithChildren;
    })
  );
  return blocksWithChildren;
};
