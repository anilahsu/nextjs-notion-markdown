import { HeadingOneBlock, HeadingThreeBlock, RichText } from "@/lib/blockType";
import Link from "next/link";
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
                  <Link className="default-link not-prose" href={href}>
                      {plain_text}
                  </Link>
              ) : (
                  plain_text
              )}
          </span>
      );
  });
};

type Heading3BlockProps = PropsWithRef<HeadingThreeBlock>;

export const Heading3: React.FC<Heading3BlockProps> = ({
  id,
  heading_3,
}: Heading3BlockProps) => {
  return <h3>{renderText(id, heading_3.rich_text)}</h3>;
};