import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import TvshowModal from "./TvshowModal";
import { makeImagePath } from "../../utils.ts";
import type { ITvshow } from "../../Api/TvshowApi.ts";
import type { IGetResult } from "../../Api/config.ts";

//Framer motion, Variants
const bannerInfoVariants: Variants = {
  normal: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 0,
  },
  hover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: {
      duration: 0.2,
    },
    borderWidth: 2,
    borderColor: "rgba(255,255,255,1)",
  },
};

const bannerPlayBtnVariants: Variants = {
  normal: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "black",
  },
  hover: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "#50FA7C",
    transition: {
      duration: 0.3,
    },
  },
};
const BannerContainer = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 20%,
      rgba(0, 0, 0, 0.5) 70%,
      rgba(0, 0, 0, 1) 80%
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: 50% 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 25px;
  padding: 20px 50px;
  color: ${(props) => props.theme.white.lighter};
`;

const Tilte = styled.div`
  width: 50%;
  font-size: 3vw;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;

const Overview = styled.div`
  width: 50%;
  font-size: 1vw;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
`;
const BannerControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

//Framer motion components
const BannerPlayBtn = styled(motion.button)`
  width: 150px;
  height: 50px;
  font-size: 25px;
  border-radius: 5px;
  border: none;
  color: ${(props) => props.theme.black.darker};
`;

const BannerInfo = styled(motion.button)`
  cursor: pointer;
  width: 210px;
  height: 50px;
  font-size: 25px;
  border-radius: 5px;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-style: solid;
`;

const InfoBtnLayer = styled(motion.div)`
  width: 210px;
  height: 50px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

//interface
interface ITvBannerData {
  data: IGetResult<ITvshow>;
  onFixedSelected: (thshowId: number) => void;
}

type TvshowParams = {
  tvId: string;
};

function TvBanner({ data, onFixedSelected }: ITvBannerData) {
  const navigate = useNavigate();

  const bigTvshowMatch = useMatch("/tv/:tvId") as {
    params: TvshowParams;
  } | null;
  // Banner part
  const [fixedRandomTvshow, setFixedRandomTvshow] = useState<ITvshow | null>(
    null
  );
  const tvshowList = data.results;
  useEffect(() => {
    if (tvshowList && tvshowList.length > 0 && !fixedRandomTvshow) {
      const randomIndex = Math.floor(Math.random() * tvshowList.length);
      const selectTvshowId = tvshowList[randomIndex];
      setFixedRandomTvshow(tvshowList[randomIndex]);
      onFixedSelected(selectTvshowId.id);
    }
  }, [tvshowList, fixedRandomTvshow, onFixedSelected]);
  console.log(fixedRandomTvshow?.id);
  if (!fixedRandomTvshow) {
    return null;
  }

  //modal part
  const onInfoClicked = () => {
    if (fixedRandomTvshow?.id) {
      navigate(`/tv/${fixedRandomTvshow.id}`);
    }
  };
  const onClose = () => navigate("/tv");
  return (
    <BannerContainer $bgPhoto={makeImagePath(fixedRandomTvshow.backdrop_path)}>
      <Tilte>{fixedRandomTvshow?.name}</Tilte>
      <Overview>{fixedRandomTvshow?.overview}</Overview>
      <BannerControl>
        <BannerPlayBtn
          variants={bannerPlayBtnVariants}
          initial="normal"
          whileHover="hover"
        >
          ▶︎ Play
        </BannerPlayBtn>
        <BannerInfo
          variants={bannerInfoVariants}
          initial="normal"
          whileHover="hover"
          onClick={onInfoClicked}
        >
          <InfoBtnLayer
            key={`box-${fixedRandomTvshow.id}`}
            layoutId={`banner-info-box-${fixedRandomTvshow.id}`}
          />
          <span style={{ position: "absolute" }}>ⓘ Information</span>
        </BannerInfo>
        <AnimatePresence>
          {bigTvshowMatch ? (
            <TvshowModal
              isVisible={true}
              tvshowId={Number(bigTvshowMatch?.params.tvId)}
              onClose={onClose}
            />
          ) : null}
        </AnimatePresence>
      </BannerControl>
    </BannerContainer>
  );
}

export default TvBanner;
