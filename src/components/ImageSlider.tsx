import { IPost } from "@/lib/caseStudyType";
import styled from "@emotion/styled";
import Carousel from "@/components/Carousel";

const ImageSlider = ({ context }: { context: IPost }) => {
  console.log(context.imageSlider)
  const images =
    context.imageSlider &&
    context.imageSlider.map((image) => {
      if (image.type === "file") {
        return image.file.url;
      } else if (image.type === "external") {
        return image.external.url;
      } else {
        return null;
      }
    });
  console.log(images);
  return (
    <>
      {images && images.length > 0 && (
        <Carousel>
          {images.map((image, index) => (
            <Item key={index} image={image ? image : ""} />
          ))}
        </Carousel>
      )}
    </>
  );
};

export default ImageSlider;

type ItemProps = {
  image: string;
};
export const Item = styled.div<ItemProps>`
  width: 100%;
  height: 100%;
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
`;
