import { useQuery } from "@tanstack/react-query";
import { searchMulti, type ISearchResult } from "../Api/SearchApi";
import styled from "styled-components";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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
  padding: 50px 50px;
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

const BoxTitle = styled(motion.div)`
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  padding-bottom: 20px;
  h4 {
    color: white;
    opacity: 1;
    text-align: center;
    font-size: 25px;
    text-shadow: 1px 1px 2px black;
  }
`;

//Variants

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
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    $bgPhoto={
                      result.poster_path
                        ? makeImagePath(result.poster_path || "", "w500")
                        : DEFAULT_IMAGE
                    }
                  >
                    <BoxTitle variants={boxTitleVariants}>
                      <h4>{result.title ? result.title : result.name}</h4>
                    </BoxTitle>
                  </Box>
                ))}
              </BoxContainer>
            </MovieSearch>
            <TvSearch>
              <h2>{`Tv 시리즈 검색 결과 ${tvResult?.length}개`} </h2>
              <BoxContainer>
                {tvResult?.map((result) => (
                  <Box
                    onClick={() => onBoxClicked(result.id, result.media_type)}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    key={result.id}
                    $bgPhoto={
                      result.poster_path
                        ? makeImagePath(result.poster_path || "")
                        : DEFAULT_IMAGE
                    }
                  >
                    <BoxTitle variants={boxTitleVariants}>
                      <h4>
                        {result.name ? result.name : result.original_title}
                      </h4>
                    </BoxTitle>
                  </Box>
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
