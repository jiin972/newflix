import {
  BASE_PATH,
  API_KEY,
  type PATH_PARAM,
  type IGenre,
} from "../Api/config";

//Tvshow type part
export interface ITvshow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  original_name: string;
  overview: string;
}

export interface IGetTvshowDetailResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  original_name: string;
  overview: string;
  genres: IGenre[];
  episode_run_time: number[];
  release_date: string;
  vote_average: number;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
}

export type TvshowCategory =
  | "popular"
  | "top_rated"
  | "on_the_air"
  | "trending";

//Tv show Fetcher
export const getTvShow = async (category: TvshowCategory) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/tv/${category}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error! status:,${response.status}`);
    }
    const tvShowData = response.json();
    return tvShowData;
  } catch (err) {
    console.error(`${category} 데이터를 가져오는 중 에러 발생:`, err);
  }
};

//Tv show Tranding Fetcher
export const getTvshowTrand = async (time: PATH_PARAM) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/tv/${time}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error! status: ${response.status}`);
    }
    const tvshowTranding = response.json();
    return tvshowTranding;
  } catch (err) {
    console.error(`TrandingTvshow의 데이터를 가져오는 중 에러발생:`, err);
  }
};

//Tvshow Detail Fetcher
export const getTvShowDetail = async (tvid: number) => {
  try {
    const response = await fetch(`${BASE_PATH}/tv/${tvid}?api_key=${API_KEY}`);
    const tvshowDetailData = await response.json();
    return tvshowDetailData;
  } catch (err) {
    console.error("Tvshow 상세 정보를 가져오는 중 에러 발생", err);
  }
};

//Tvshow Casting Fetcher
export const getTvCast = async (tvId: number) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/tv/${tvId}/credits?api_key=${API_KEY}`
    );
    const tvshowCastData = await response.json();
    return tvshowCastData;
  } catch (err) {
    console.error("Tvshow 캐스팅 정보를 가져오는 중 에러 발생", err);
  }
};
