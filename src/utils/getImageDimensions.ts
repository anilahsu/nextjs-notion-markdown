import { IPost } from "@/lib/caseStudyType";
import { MdStringObject } from "notion-to-md/build/types";
import sizeOf from "image-size";
import url from "url";
import https from "https";

type Props = {
  mdString: MdStringObject;
  property: IPost;
  markdown: string;
  imageSizes: Record<string, { width: number; height: number }>;
};

export const getImageDimensions = async (markdown: string) => {
  const imageSizes: Props["imageSizes"] = {};
  const iterator = markdown.matchAll(/\!\[.*]\((.*)\)/g);

  let match: IteratorResult<RegExpMatchArray, any>;
  while (!(match = iterator.next()).done) {
    const [, src] = match.value;
    try {
      if (src.startsWith("data:")) {
        const base64Data = src.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        const { width, height } = sizeOf(buffer);
        if (width && height) {
          imageSizes[src] = { width, height };
        }
      } else {
        const options = url.format(src);
        const response = await getUrlImageSize(options);
        const { width, height } = response;
        if (width && height) {
          imageSizes[src] = { width, height };
        }
      }
    } catch (err) {
      console.error(`Can’t get dimensions for ${src}:`, err);
    }
  }
  return imageSizes;
};

export const getUrlImageSize = (
  options: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      const chunks: Buffer[] = [];
      response
        .on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        })
        .on("end", () => {
          const buffer = Buffer.concat(chunks);
          const { width, height } = sizeOf(buffer);
          if (width && height) {
            resolve({ width, height });
          }
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  });
};