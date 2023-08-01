import { IPost } from "@/lib/caseStudyType";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const ServiceIntroduction = ({ context }: { context: IPost }) => {
  return (
    <DocumentRequestContainer>
      <h4>Pokepayサービス資料</h4>
      <DocumentRequestButton href="https://pay.pocket-change.jp/document_request">
        資料ダウンロード
      </DocumentRequestButton>
      <Image
        src="/images/whitepaper_image.png"
        alt=""
        width={400}
        height={300}
      />
    </DocumentRequestContainer>
  );
};

export default ServiceIntroduction;

const DocumentRequestContainer = styled.div`
  width: 700px;
  background: #f6f6f6;
  margin: 0 auto;
  border-radius: 40px;
  h4 {
    text-align: center;
    font-size: 45px;
    padding-top: 65px;
  }
  img {
    width: 75%;
    display: block;
    margin: 0 auto 0 auto;
    padding-bottom: 30px;
  }
`;

const DocumentRequestButton = styled(Link)`
  text-align: center;
  font-size: 18px;
  height: 58px;
  line-height: 58px;
  border-radius: 29px;
  margin: 50px auto 30px auto;
  display: block;
  width: 250px;
  padding: 0px;
  background: #21bf25;
      linear-gradient(
        90deg,
        rgba(0, 162, 63, 1) 0%,
        rgba(19, 185, 34, 1) 60%,
        rgba(23, 224, 42, 1) 100%
      );
    color: white;
    border: none;
`;
