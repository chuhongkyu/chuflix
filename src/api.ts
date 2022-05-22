const API_KEY = "26cb645f6c566526c5c888f00d431e35";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMovie {
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

interface ISearch {
  backdrop_path: string;
  poster_path: string;
  id: number;
  original_title: string;
  overview: string;
  media_type: string;
}

export interface ISearchResult {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedM() {
  return fetch(`${BASE_PATH}movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpComingM() {
  return fetch(`${BASE_PATH}movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSearch(result: string | null) {
  return fetch(
    `${BASE_PATH}search/multi?api_key=${API_KEY}&query=${result}`
  ).then((response) => response.json());
}

export function getTv() {
  return fetch(`${BASE_PATH}tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getAirTv() {
  return fetch(`${BASE_PATH}tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTv() {
  return fetch(`${BASE_PATH}tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedTv() {
  return fetch(`${BASE_PATH}tv/top_rated?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
