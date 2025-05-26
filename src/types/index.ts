
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  imdb_id?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  external_ids?: {
    imdb_id: string;
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface PlayerLink {
  player: string;
  link: string;
  is_hd: boolean;
}

export interface MoviePlayerResponse {
  player_links: PlayerLink[];
  version: string;
}

export interface Episode {
  number: string;
  versions: {
    vf: {
      title: string;
      players: Array<{
        name: string;
        link: string;
      }>;
    };
  };
}

export interface Season {
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Series {
  title: string;
  audio_type: string;
  episode_count: number;
  release_date: string;
  summary: string;
  tmdb_data: {
    id: number;
    name: string;
    overview: string;
    first_air_date: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    match_score: number;
  };
  seasons: Season[];
}

export interface TVPlayerResponse {
  type: string;
  series: Series[];
}
