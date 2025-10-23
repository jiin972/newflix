import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useMemo, useState } from "react";
import { makeImagePath } from "../../utils";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { IGetResult, PATH_PARAM } from "../../Api/config";
import {
  getMovies,
  getTrendMovies,
  type IMovie,
  type MovieCategory,
} from "../../Api/MovieApi";
import noImage from "../../assets/images/noimage.png";

const DEFAULT_IMAGE_URL = noImage;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
`;
const SliderCategory = styled.span`
  font-size: 2vw;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;

const MovieRowWrapper = styled.div`
  position: relative;
  height: 200px;
  width: calc(100% - 30px);
  margin-right: 30px;
`;
const SliderRow = styled(motion.div)`
  position: absolute;
  width: 100%;
  top: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  padding-right: 50px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(prop) => prop.$bgPhoto});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 4px;
  min-height: 200px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const BoxTitle = styled(motion.div)`
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  padding-bottom: 20px;
  h4 {
    color: white;
    opacity: 1;
    text-align: center;
    font-size: 20px;
    text-shadow: 1px 1px 2px black;
  }
`;

const NextBtn = styled.button`
  position: absolute;
  right: 0%;
  top: 0;
  width: 40px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 4px 4px 0;
  z-index: 5;
`;
const PrevBtn = styled.button`
  position: absolute;
  left: -45px;
  top: 0;
  width: 40px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

//Variants

const rowVariants: Variants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
  visible: {
    x: 0,
    transition: { type: "tween", duration: 1, ease: "easeInOut" },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -window.outerWidth - 5 : window.outerWidth + 5,
    transition: { type: "tween", duration: 1, ease: "easeInOut" },
  }),
};

const boxVariants: Variants = {
  normal: { scale: 1, transition: { type: "tween" } },
  hover: {
    scale: 1,
    y: -10,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
      ease: "easeInOut",
    },
  },
};

const boxTitleVariants: Variants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.1, type: "tween", ease: "easeInOut" },
  },
};
//interface

interface SliderProps {
  category?: MovieCategory;
  title: string;
  isTrend: boolean;
  time?: PATH_PARAM;
  bannerIdToExclude: number | null;
}

const offset = 6;

function MovieSlider({
  category,
  title,
  time,
  bannerIdToExclude,
  isTrend = false,
}: SliderProps) {
  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const myQueryKey = isTrend
    ? ["movie", "trending", time]
    : ["movie", category];
  const myQueryFn = isTrend // 트랜드 항목 적용을 위한 별도의 query조건문 생성
    ? () => getTrendMovies(time!)
    : () => getMovies(category!);
  const { data, isLoading } = useQuery<IGetResult<IMovie>>({
    queryKey: myQueryKey,
    queryFn: myQueryFn,
  });
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(1);
  // banner에 사용된 영화를 총 영화목록에서 제외하기 위한 로직
  const movieList = useMemo(() => {
    return data?.results || [];
  }, [data]);
  const filteredMovies = useMemo(() => {
    if (bannerIdToExclude === null) {
      return movieList;
    }
    return movieList.filter((movie) => movie.id !== bannerIdToExclude);
  }, [movieList, bannerIdToExclude]);
  // 슬라이더 영화 갯수 정의
  const totalMovies = filteredMovies.length || 0;
  const maxSliderIndex = Math.floor(totalMovies / offset) - 1;
  // 슬라이더 증감을 위한 로직
  const increaseIndex = () => {
    if (!data || leaving) return;
    if (index >= maxSliderIndex) return; // 인덱스 순환을 막는 장치(애니메이션 꼬임으로 등록)
    setDirection(1);
    setLeaving(true);
    setIndex((prev) => (prev === maxSliderIndex ? prev : prev + 1));
  };
  const decreaseIndex = () => {
    if (!data || leaving) return;
    if (index <= 0) return;
    setDirection(-1);
    setLeaving(true);
    setIndex((prev) => (prev === 0 ? prev : prev - 1));
  };
  const onExitComplete = () => setLeaving(false);

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SliderContainer>
          <SliderCategory>{title}</SliderCategory>
          <MovieRowWrapper>
            <AnimatePresence
              initial={false}
              custom={direction}
              onExitComplete={onExitComplete}
            >
              <SliderRow
                variants={rowVariants}
                custom={direction}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={`${index}-${direction}`}
              >
                {filteredMovies
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      initial="normal"
                      whileHover={"hover"}
                      $bgPhoto={
                        filteredMovies
                          ? makeImagePath(movie.backdrop_path, "w500")
                          : DEFAULT_IMAGE_URL
                      }
                      key={movie.id}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <BoxTitle variants={boxTitleVariants}>
                        <h4>{movie.title}</h4>
                      </BoxTitle>
                    </Box>
                  ))}
              </SliderRow>
            </AnimatePresence>
            {index !== 0 && <PrevBtn onClick={decreaseIndex}>◀︎</PrevBtn>}
            {index !== maxSliderIndex && (
              <NextBtn onClick={increaseIndex}>▶︎</NextBtn>
            )}
          </MovieRowWrapper>
        </SliderContainer>
      )}
    </>
  );
}
export default MovieSlider;
