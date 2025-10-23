import {
  BASE_PATH,
  API_KEY,
  type IGenre,
  type PATH_PARAM,
} from "../Api/config.ts";

//Movie type part
export interface IMovie {
  // data의 단일구조
  id: number;
  original_title: string;
  title: string;
  poster_path: string;
  overview: string;
  backdrop_path: string;
}

export interface IGetMovieDetailResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genres: IGenre[];
  runtime: number;
  release_date: string;
  vote_average: number;
  original_title: string;
}

export type MovieCategory =
  | "now_playing"
  | "popular"
  | "top_rated"
  | "upcoming"
  | "trending";

//Movie fetcher
export const getMovies = async (category: MovieCategory) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/movie/${category}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error! status:,${response.status}`);
    }
    const movieData = await response.json();
    return movieData;
  } catch (err) {
    console.error(`[${category}] 영화 데이터를 가져오는 중 에러발생:`, err);
    return null;
  }
};

//Trend Movie fetcher
export const getTrendMovies = async (time: PATH_PARAM) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/trending/movie/${time}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error! status: , ${response.status}`);
    }
    const trendMovieData = await response.json();
    return trendMovieData;
  } catch (err) {
    console.error("TrandingMovies 호출 중 에러발생:", err);
    return null;
  }
};

//Movie Casting Fetcher
export const getMovieCast = async (movieId: number) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error! status:,${response.status}`);
    }
    const movieCreditData = await response.json();
    return movieCreditData;
  } catch (err) {
    console.error("영화 캐스팅 정보를 가져오는 중 에러 발생", err);
    return null;
  }
};
//Movie Detail Fetcher
export const getMovieDetail = async (movieId: number) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error! status:,${response.status}`);
    }
    const movieDetailData = await response.json();
    return movieDetailData;
  } catch (err) {
    console.error("영화 상세 정보를 가져오는 중 에러 발생", err);
    return null;
  }
};
