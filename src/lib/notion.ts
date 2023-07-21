import { Client } from "@notionhq/client";

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const CaseStudyPosts = {
  'hachipay': {
    id: '50bba6a865b54bbf8a1a4e27d2c4cfac',
  },
  'menopay': {
    id: 'd74587a5604f43cab0377ede534062fb',
  },
};

export const EntryPosts = {
  62: {
    id: '0bdc221b5e044b518594428b0b57536f',
  },
  60: {
    id: '6a801e6e6f49440398515d31e8d835dd',
  },
};