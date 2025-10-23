import { AnimatePresence, motion, type Variants } from "framer-motion";
import { styled } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { makeImagePath } from "../../utils";
import {
  getTvCast,
  getTvShowDetail,
  type IGetTvshowDetailResult,
} from "../../Api/TvshowApi";
import type { ICast } from "../../Api/config";
import noImage from "../assets/images/noimage.png";

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
const TvshowInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
`;
const TvshowReleaseDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  font-size: 15px;
  border: 2px solid white;
  border-radius: 5%;
  width: 9%;
  color: #50fa7c;
  padding: 3px 10px;
`;

const TvshowRating = styled.div`
  font-size: 16px;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;

const TvshowMoreInfo = styled.div`
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
const GenresContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TvshowGenre = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  font-size: 16px;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;
const TvshowGenersText = styled.span`
  color: ${(props) => props.theme.white.darker};
`;

const OverView = styled.p`
  margin-left: 20px;
  width: 50%;
  font-size: 18px;
`;

const TvshowSeason = styled.div``;

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
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
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

//interface
interface ITvshowModalProps {
  tvshowId: number;
  onClose: () => void;
  isVisible: boolean;
}

function TvshowModal({ tvshowId, onClose, isVisible }: ITvshowModalProps) {
  console.log("TV모달성공:", tvshowId);
  //Data 가공
  const { data: tvDetailData, isLoading: isTvDetailLoading } =
    useQuery<IGetTvshowDetailResult>({
      queryKey: ["tvshow", "detail", tvshowId],
      queryFn: () => getTvShowDetail(Number(tvshowId)),
    });

  const { data: tvCastingData, isLoading: isTvCastingLoading } =
    useQuery<ICast>({
      queryKey: ["tvshow", "catsting", tvshowId],
      queryFn: () => getTvCast(Number(tvshowId)),
    });
  if (
    isTvDetailLoading ||
    !tvDetailData ||
    isTvCastingLoading ||
    !tvCastingData
  ) {
    return null;
  }
  //기타
  const MAX_LENGTH = 250;
  const overviewText = tvDetailData.overview ?? "정보없음";
  let displayOverview = overviewText;
  if (overviewText.length > MAX_LENGTH) {
    displayOverview = overviewText.slice(0, MAX_LENGTH);
  }
  const imagePath = tvDetailData.backdrop_path || tvDetailData.poster_path;
  const DEFAULT_IMAGE = noImage;
  return (
    <AnimatePresence>
      {isVisible ? (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <ModalContainer
            variants={modalVariants}
            initial={false}
            animate="visible"
            exit="exit"
            layoutId={`banner-info-box-${tvshowId + ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Poster
              $bgPhoto={
                tvDetailData ? makeImagePath(imagePath || "") : DEFAULT_IMAGE
              }
            ></Poster>
            <Title>{tvDetailData?.name}</Title>
            <CloseBtn
              variants={closeBtnVariants}
              initial="normal"
              whileHover="hover"
              onClick={onClose}
            >
              ⓧ
            </CloseBtn>
            <TvshowInfo>
              <TvshowReleaseDate>
                {tvDetailData.first_air_date.slice(0, 4) || "정보없음"}
              </TvshowReleaseDate>
              <TvshowSeason>{`시즌 ${tvDetailData.number_of_seasons}개`}</TvshowSeason>
              <TvshowRating>
                ⭐️{" "}
                {Math.round(tvDetailData.vote_average).toFixed(1) ?? "정보없음"}
              </TvshowRating>
            </TvshowInfo>
            <TvshowMoreInfo>
              <OverView>{displayOverview}</OverView>
              <Credits>
                <Cast>
                  <InfoCast>Casting:</InfoCast>
                  <InfoCastText>
                    {tvCastingData.cast.length
                      ? tvCastingData.cast
                          .map((acting) => acting.name)
                          .slice(0, 4)
                          .join(", ")
                      : "정보없음"}
                  </InfoCastText>
                </Cast>
                <GenresContainer>
                  <TvshowGenersText>Geners: </TvshowGenersText>
                  <TvshowGenre>
                    {tvDetailData.genres.map((geners) => geners.name).join(" ")}
                  </TvshowGenre>
                </GenresContainer>
              </Credits>
            </TvshowMoreInfo>
          </ModalContainer>
        </Overlay>
      ) : null}
    </AnimatePresence>
  );
}

export default TvshowModal;
