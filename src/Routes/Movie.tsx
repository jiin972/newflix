import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import MovieBanner from "../Components/MoviePart/MovieBanner";
import MovieSlider from "../Components/MoviePart/MovieSlider";
import { useMatch, useNavigate } from "react-router-dom";
import MovieModal from "../Components/MoviePart/MovieModal";
import { useState } from "react";
import type { IGetResult } from "../Api/config";
import { getMovies, type IMovie } from "../Api/MovieApi";

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

function Movie() {
  const { data, isLoading } = useQuery<IGetResult<IMovie>>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: () => getMovies("now_playing"),
  });
  const [bannerMovieId, setBannerMovieId] = useState<number | null>(null);
  const handleBannerMovieId = (movieId: number) => {
    setBannerMovieId(movieId);
  };
  const bigMovieMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/");
  };
  const clickedMovieId = bigMovieMatch?.params.movieId;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <span>Now🐢Loading...</span>
        </Loader>
      ) : (
        data && (
          <>
            <MainContent>
              <MovieBanner
                data={data}
                onFixedIdSelected={handleBannerMovieId}
              />
              <SliderContainer>
                <MovieSlider
                  key="popular"
                  isTrend={false}
                  category="popular"
                  title="인기영화"
                  bannerIdToExclude={bannerMovieId}
                />
                <MovieSlider
                  key="top_rated"
                  isTrend={false}
                  category="top_rated"
                  title="또 봐도 좋은 명작"
                  bannerIdToExclude={bannerMovieId}
                />
                <MovieSlider
                  key="isTrend"
                  isTrend={true}
                  time="week"
                  category="trending"
                  title="지금뜨는 콘텐츠🔥"
                  bannerIdToExclude={bannerMovieId}
                />
              </SliderContainer>
            </MainContent>
            <MovieModal
              movieId={Number(clickedMovieId)}
              onClose={onOverlayClick}
              isVisible={!!bigMovieMatch && !!clickedMovieId}
            />
          </>
        )
      )}
    </Wrapper>
  );
}

export default Movie;
