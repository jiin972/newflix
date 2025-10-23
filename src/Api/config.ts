//기본 설정
export const API_KEY = "a0853dac7be056950373836b6fa3350c";
export const BASE_PATH = "https://api.themoviedb.org/3";

//공통 타입

export interface IGetResult<T> {
  // fetcher 응답 컨테이너 구조
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: T[]; // t는 타입을 뜻함
  total_pages: number;
  total_results: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface ICast {
  id: number;
  cast: [
    {
      id: number;
      name: string;
      original_name: string;
      character: string;
    }
  ];
  crew: [
    {
      id: number;
      name: string;
      known_for_department: string;
    }
  ];
}

export type PATH_PARAM = "day" | "week";
