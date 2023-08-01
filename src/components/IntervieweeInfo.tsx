import { IPost } from "@/lib/caseStudyType";
import styled from "@emotion/styled";
import Image from "next/image";

const IntervieweeInfo = ({ context }: { context: IPost }) => {
  const avatar = context.intervieweeAvatar.map((image) => image.name)[0];
  return (
    <>
      <DecisiveFactor>ポケペイ導入の決め手</DecisiveFactor>
      <QuestionHeader>
        <AvatarContainer>
          {context.intervieweeAvatar ? (
            <Avatar width={200} height={200} src={avatar} alt="" />
          ) : (
            ""
          )}
        </AvatarContainer>
        {context.intervieweePosition && <p>{context.intervieweePosition}</p>}
        {context.intervieweeName && (
          <h2 className={!context.intervieweePosition ? "no-position" : ""}>
            {context.intervieweeName}
          </h2>
        )}
      </QuestionHeader>
      {context.intervieweeCareer && (
        <div className="career">{context.intervieweeCareer}</div>
      )}
    </>
  );
};

export default IntervieweeInfo;

const DecisiveFactor = styled.p`
  background-color: #0ca53d;
  font-size: 20px;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  color: white;
  display: block;
  width: 270px;
  margin: 50px auto 40px auto;
  text-align: center;
`
const QuestionHeader = styled.div`
  text-align: center;
  p {
    font-size: 18px;
    line-height: 60px;
    font-weight: bold;
  }
  h2 {
    font-size: 34px;
    font-weight: bold;
  }
  h2.no-position {
    margin-top: 20px;
  }
`;

const AvatarContainer = styled.div`
  display: inline-block;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background-color: #cacaca;
  border-radius: 100px;
  overflow: hidden;
  img.default {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    margin-top: 30px;
    }
  }
`;
const Avatar = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;
