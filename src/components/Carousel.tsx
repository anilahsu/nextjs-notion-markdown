import { useEffect, useReducer, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const NEXT = "NEXT";
const PREV = "PREV";

type ItemProps = {
  image: string;
};
export const Item = styled.div<ItemProps>`
  width: 100%;
  height: 100%;
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
`;

type CarouselProps = {
  sliding: boolean;
};

const CarouselContainer = styled.div<CarouselProps>`
  display: flex;
  flex-wrap: nowrap;
  gap: 25px;
  transition: ${(props) => (props.sliding ? "none" : "transform 1s ease")};
  transform: ${(props) => {
    if (props.dir && !props.sliding) return "translateX(calc(-320px - 25px))";
    if (props.dir === PREV) return "translateX(calc(2 * (-320px - 25px)))";
    return "translateX(0%)";
  }};
`;

const Wrapper = styled.div`
  width: inherit;
  overflow: hidden;
`;

type CarouselSlotProps = {
  order: number;
};

const CarouselSlot = styled.div<CarouselSlotProps>`
  flex: 0 0 320px;
  height: 240px;
  order: ${(props) => props.order};
`;

const Arrow = styled.a`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
  outline: none;
  width: 20px;
  height: 40px;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &.left {
    left: -35px;
    background: url(${"/images/icon_arrow_round_gray.svg"}) center no-repeat;
    background-size: contain;
  }
  &.right {
    right: -35px;
    :before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: url(${"/images/icon_arrow_round_gray.svg"}) center no-repeat;
      background-size: contain;
      transform: rotate(180deg);
    }
  }
`;

const initialState = { pos: 0, sliding: false, dir: "", initial: true };

const getOrder = (index: number, pos: number, count: number) => {
  return index - pos < 0 ? count - Math.abs(index - pos) : index - pos;
};

const slideReducer = (
  state: { pos: number; sliding: boolean; dir: string; initial: boolean },
  action: { type: any; count: number }
) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case PREV:
      return {
        ...state,
        dir: PREV,
        sliding: true,
        initial: false,
        pos: state.pos === 0 ? action.count - 1 : state.pos - 1,
      };
    case NEXT:
      return {
        ...state,
        dir: NEXT,
        sliding: true,
        initial: false,
        pos:
          state.pos === action.count - 1 || state.initial ? 0 : state.pos + 1,
      };
    case "stopSliding":
      return { ...state, sliding: false };
    default:
      return state;
  }
};

const Carousel = ({ children }: { children: React.ReactNode[] }) => {
  const count = children.length;
  const [state, dispatch] = useReducer(slideReducer, initialState);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reset = () => {
      dispatch({
        type: "reset",
        count: 0,
      });
    };
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);

  const slide = (dir: string) => {
    if (dir === PREV && state.initial) return;
    const { innerWidth } = window;
    const slideSize = innerWidth < 768 ? 196 : 320;
    if (
      wrapperRef.current &&
      count * slideSize <= wrapperRef.current.offsetWidth
    )
      return;
    dispatch({ type: dir, count });
    setTimeout(() => {
      dispatch({
        type: "stopSliding",
        count: 0,
      });
    }, 50);
  };


  const handlers = useSwipeable({
    onSwipedLeft: () => slide(NEXT),
    onSwipedRight: () => slide(PREV),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} style={{ position: "relative" }}>
      <Arrow
        className={`left ${state.initial && "disabled"}`}
        onClick={() => slide(PREV)}
      />
      <Arrow className="right" onClick={() => slide(NEXT)} />
      <Wrapper ref={wrapperRef}>
        <CarouselContainer dir={state.dir} sliding={state.sliding}>
          {children.map((child, index) => (
            <CarouselSlot key={index} order={getOrder(index, state.pos, count)}>
              {child}
            </CarouselSlot>
          ))}
        </CarouselContainer>
      </Wrapper>
    </div>
  );
};

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Carousel;
