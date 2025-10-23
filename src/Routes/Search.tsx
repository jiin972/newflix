import { useQuery } from "@tanstack/react-query";
import { searchMulti, type ISearchResult } from "../Api/SearchApi";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import noImage from "../assets/images/noimage.png";
import MovieModal from "../Components/MoviePart/MovieModal";
import TvshowModal from "../Components/TvshowPart/TvshowModal";

const DEFAULT_IMAGE = noImage;
const Wrapper = styled.div``;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchContainer = styled.div`
  padding: 50px 10px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
const SearchResult = styled.div`
  font-size: 50px;
  margin-top: 100px;
`;

const MovieSearch = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const TvSearch = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(prop) => prop.$bgPhoto});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 4px;
  min-height: 200px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

function Search() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/search/movies/:id");
  const tvshowMatch = useMatch("/search/tv/:id");
  const mediaMatch = movieMatch || tvshowMatch;
  //검색어 추출 및 쿼리제어
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const { data, isLoading } = useQuery<ISearchResult>({
    queryKey: ["search", keyword],
    queryFn: () => searchMulti(keyword!),
    enabled: !!keyword, // 키워드가 없을 경우, 검색 쿼리함수 호출 않는 장치
  });
  const movieResult = data?.results.filter(
    (result) => result.media_type === "movie"
  );
  const tvResult = data?.results.filter((result) => result.media_type === "tv");
  // 모달구현을 위한 로직
  // 모달을 닫는 함수
  const onOverlayClicked = () => {
    navigate(`/search?keyword=${keyword}`);
  };
  //모달을 여는 함수
  const onBoxClicked = (
    mediaId: number,
    mediaType: "movie" | "tv" | "person"
  ) => {
    const path =
      mediaType === "movie"
        ? `/search/movies/${mediaId}`
        : `/search/tv/${mediaId}`;
    navigate(`${path}?keyword=${keyword}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <span>Loading...</span>
        </Loader>
      ) : (
        <>
          <SearchContainer>
            <SearchResult>
              <h1>{`"${keyword}"에 대한 검색 결과...`}</h1>
            </SearchResult>
            <MovieSearch>
              <h2>{`영화 검색 결과 ${movieResult?.length}개`} </h2>
              <BoxContainer>
                {movieResult?.map((result) => (
                  <Box
                    onClick={() => onBoxClicked(result.id, result.media_type)}
                    key={result.id}
                    $bgPhoto={
                      result.poster_path
                        ? makeImagePath(result.poster_path || "", "w500")
                        : DEFAULT_IMAGE
                    }
                  />
                ))}
              </BoxContainer>
            </MovieSearch>
            <TvSearch>
              <h2>{`Tv 시리즈 검색 결과 ${tvResult?.length}개`} </h2>
              <BoxContainer>
                {tvResult?.map((result) => (
                  <Box
                    onClick={() => onBoxClicked(result.id, result.media_type)}
                    key={result.id}
                    $bgPhoto={
                      result.poster_path
                        ? makeImagePath(result.poster_path || "")
                        : DEFAULT_IMAGE
                    }
                  />
                ))}
              </BoxContainer>
            </TvSearch>
          </SearchContainer>
          <AnimatePresence>
            {mediaMatch === movieMatch ? (
              <MovieModal
                onClose={onOverlayClicked}
                movieId={Number(movieMatch?.params.id)}
                isVisible={true}
              />
            ) : (
              <TvshowModal
                tvshowId={Number(tvshowMatch?.params.id)}
                onClose={onOverlayClicked}
                isVisible={true}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
