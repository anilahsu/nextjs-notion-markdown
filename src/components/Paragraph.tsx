import { ParagraphBlock, RichText } from "@/lib/blockType";
import { PropsWithRef } from "react";


export const renderText = (
  id: string,
  textBlocks?: Array<RichText>,
): React.ReactNode => {
  if (!textBlocks) {
      return <></>;
  }
  let count = 0;
  return textBlocks.map(({ annotations, plain_text, href }) => {
      const { bold, code, color, italic, strikethrough, underline } =
          annotations;
      count = count + 1;
      return (
          <span
              key={`text-${id}-${count}`}
              className={[
                  bold ? "bold" : "",
                  code ? "mono" : "",
                  italic ? "italic" : "",
                  strikethrough ? "strikethrough" : "",
                  underline ? "underline" : "",
              ].join(" ")}
              style={color !== "default" ? { color } : {}}
          >
              {href ? (
                  <a className="default-link not-prose" href={href}>
                      {plain_text}
                  </a>
              ) : (
                  plain_text
              )}
          </span>
      );
  });
};

type ParagraphBlockProps = PropsWithRef<ParagraphBlock>;

export const Paragraph: React.FC<ParagraphBlockProps> = ({
    id,
    paragraph,
}: ParagraphBlockProps) => {
    return <p>{renderText(id, paragraph.rich_text)}</p>;
};