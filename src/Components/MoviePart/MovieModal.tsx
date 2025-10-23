import { AnimatePresence, motion, type Variants } from "framer-motion";
import { styled } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { makeImagePath } from "../../utils";
import {
  getMovieCast,
  getMovieDetail,
  type IGetMovieDetailResult,
} from "../../Api/MovieApi";
import type { ICast } from "../../Api/config";
import noImage from "../../assets/images/noimage.png";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  top: -35px;
  width: 50vw;
  height: 90vh;
  background-color: ${(props) =>
    props.theme.black.darker}; /* 팝업 확인을 위한 색상 */
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  gap: 15px;
`;

const Poster = styled.div<{ $bgPhoto: string }>`
  width: 100%;
  height: 50%;
  background-image: linear-gradient(
      to top,
      ${(props) => props.theme.black.darker} 2%,
      transparent 60%
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
`;

const Title = styled.div`
  position: absolute;
  top: 45%;
  margin-left: 20px;
  font-size: 2vw;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;
const CloseBtn = styled(motion.button)`
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 25px;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
`;
const MovieInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
`;
const MovieReleaseDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  font-size: 13px;
  border: 2px solid white;
  border-radius: 5%;
  width: 13%;
  color: #50fa7c;
  padding: 3px 10px;
`;
const MovieGenre = styled.div`
  font-size: 16px;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;
const MovieRating = styled.div`
  font-size: 16px;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;

const MovieMoreInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
`;

const Credits = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
  margin-right: 20px;
  font-size: 18px;
`;
const Cast = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
`;
const InfoCast = styled.span`
  color: ${(props) => props.theme.white.darker};
`;
const InfoCastText = styled.span``;
const Crew = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
`;
const InfoCrew = styled.span`
  color: ${(props) => props.theme.white.darker};
`;
const InfoCrewText = styled.span``;

const OverView = styled.p`
  margin-left: 20px;
  width: 50%;
  font-size: 18px;
`;

//Variants

const closeBtnVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    color: "#BCC3C7",
    transition: { type: "tween", duration: 0.05 },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, type: "tween", ease: "easeInOut" },
  },
};

const modalVariants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, type: "tween", ease: "easeInOut" },
  },
};

interface IMovieModalProps {
  movieId: number;
  onClose: () => void;
  isVisible: boolean;
}

function MovieModal({ movieId, onClose, isVisible }: IMovieModalProps) {
  //Data가공
  const { data: detailData, isLoading: isDetailLoading } =
    useQuery<IGetMovieDetailResult>({
      queryKey: ["movie", "detail", movieId],
      queryFn: () => getMovieDetail(Number(movieId)),
    });

  const { data: catstingData, isLoading: isCastingLoading } = useQuery<ICast>({
    queryKey: ["movie", "casting", movieId],
    queryFn: () => getMovieCast(Number(movieId)),
  });
  if (isCastingLoading || !catstingData || isDetailLoading || !detailData) {
    return null;
  }
  //기타
  const MAX_LENGTH = 250;
  const overviewText = detailData.overview ?? "정보없음";
  let displayOverview = overviewText;
  if (overviewText.length > MAX_LENGTH) {
    displayOverview = overviewText.slice(0, MAX_LENGTH) + "...";
  }
  const DEFAULT_IMAGE = noImage;
  const imagePath = detailData.backdrop_path || detailData.poster_path;
  return (
    <AnimatePresence>
      {isVisible ? (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          key={`overlay-${movieId}`}
        >
          <ModalContainer
            variants={modalVariants}
            initial={false}
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <Poster
              $bgPhoto={
                detailData ? makeImagePath(imagePath || "") : DEFAULT_IMAGE
              }
            />
            <Title>{detailData?.title}</Title>
            <CloseBtn
              variants={closeBtnVariants}
              initial="normal"
              whileHover="hover"
              onClick={onClose}
            >
              ⓧ
            </CloseBtn>
            <MovieInfo>
              <MovieReleaseDate>
                {detailData.release_date.slice(0, 4) || "정보없음"}
              </MovieReleaseDate>
              <MovieGenre>
                {detailData.genres.map((gener) => gener.name).join(" ") ??
                  "정보없음"}
              </MovieGenre>
              <MovieRating>
                ⭐️{" "}
                {Math.round(detailData.vote_average).toFixed(1) ?? "정보없음"}
              </MovieRating>
            </MovieInfo>
            <MovieMoreInfo>
              <OverView>{displayOverview}</OverView>
              <Credits>
                <Cast>
                  <InfoCast>Casting:</InfoCast>
                  <InfoCastText>
                    {catstingData.cast.length
                      ? catstingData.cast
                          .map((acting) => acting.name)
                          .slice(0, 4)
                          .join(", ")
                      : "정보없음"}
                  </InfoCastText>
                </Cast>
                <Crew>
                  <InfoCrew>Director:</InfoCrew>
                  <InfoCrewText>
                    {" "}
                    {`  ${
                      catstingData.crew.find(
                        (director) =>
                          director.known_for_department === "Directing"
                      )?.name ?? "정보없음"
                    }`}
                  </InfoCrewText>
                </Crew>
              </Credits>
            </MovieMoreInfo>
          </ModalContainer>
        </Overlay>
      ) : null}
    </AnimatePresence>
  );
}

export default MovieModal;
