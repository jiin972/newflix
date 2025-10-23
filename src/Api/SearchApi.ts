import { BASE_PATH, API_KEY } from "./config";

//인터페이스 수정이 필요함
interface ISearch {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie" | "tv" | "person";
}

export interface ISearchResult {
  results: ISearch[];
  page: number;
  total_pages: number;
}
//멀티 fetcher (키워드가 없을 때 작동하지 않기 위해 search.tsx에 useQuery부분에 장치를 달아야함)
export const searchMulti = async (keyword: string) => {
  try {
    const response = await fetch(
      `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        keyword
      )}`
    );
    if (!response.ok) {
      throw new Error(`Loading Error status:,${response.status}`);
    }
    const movieSearchResult = await response.json();
    return movieSearchResult;
  } catch (err) {
    console.error("영화 데이터를 찾는 중 에러발생:", err);
    throw err;
  }
};
