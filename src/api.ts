const API_KEY = "26cb645f6c566526c5c888f00d431e35";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovie {
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  id: number;
  title: string;
  overview: string;
  release_date: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ITv {
  backdrop_path: string;
  poster_path: string;
  id: number;
  name: string;
  overview: string;
}

export interface ITvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTv() {
  return fetch(`${BASE_PATH}tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
