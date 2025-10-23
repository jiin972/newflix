import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import TvBanner from "../Components/TvshowPart/TvshowBanner";
import TvSlider from "../Components/TvshowPart/TvSlider";
import type { IGetResult } from "../Api/config";
import { getTvShow, type ITvshow } from "../Api/TvshowApi";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import TvshowModal from "../Components/TvshowPart/TvshowModal";

const Wrapper = styled.div``;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainContent = styled.div`
  width: 100%;
  position: relative;
`;

const SliderContainer = styled.div`
  position: absolute;
  top: 65vh;
  left: 0;
  padding-bottom: 20px;
  width: 100%;
  padding-left: 50px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

function TvShow() {
  const { data, isLoading } = useQuery<IGetResult<ITvshow>>({
    queryKey: ["tvshow", "popular"],
    queryFn: () => getTvShow("popular"),
  });
  const [bannerTvshowId, setBannerTvshowId] = useState<number | null>(null);
  const handleBannerTvshowId = (tvshowId: number) => {
    setBannerTvshowId(tvshowId);
  };
  const bigTvshowMatch = useMatch("/tv/:tvshowId");
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/tv");
  };
  const clickedBigTvshowId = bigTvshowMatch?.params.tvshowId;
  return (
    <Wrapper>
      {isLoading || !data ? (
        <Loader>
          <span>Now Loading...</span>
        </Loader>
      ) : (
        <>
          <MainContent>
            <TvBanner data={data} onFixedSelected={handleBannerTvshowId} />
            <SliderContainer>
              <TvSlider
                key="popular"
                isTrend={false}
                category="popular"
                title="인기 Tv시리즈"
                bannerIdToExclude={bannerTvshowId}
              />
              <TvSlider
                key="top_rated"
                isTrend={false}
                category="top_rated"
                title="최고 평점 시리즈"
                bannerIdToExclude={bannerTvshowId}
              />
              <TvSlider
                key="trending"
                isTrend={true}
                category="trending"
                title="지금뜨는 시리즈🔥"
                bannerIdToExclude={bannerTvshowId}
                time="week"
              />
            </SliderContainer>
          </MainContent>
          <TvshowModal
            tvshowId={Number(clickedBigTvshowId)}
            onClose={onOverlayClick}
            isVisible={!!bigTvshowMatch && !!clickedBigTvshowId}
          />
        </>
      )}
    </Wrapper>
  );
}

export default TvShow;
