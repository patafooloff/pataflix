export interface PlayerLink {
  player: string;
  link: string;
  is_hd?: boolean;
}

export interface MoviePlayerResponse {
  player_links: PlayerLink[];
  version: string;
}

export interface Player {
  name: string;
  link: string;
}

export interface EpisodeVersion {
  title: string;
  players: Player[];
}

export interface Episode {
  number: string;
  versions: {
    vf?: EpisodeVersion;
    vostfr?: EpisodeVersion;
    [key: string]: EpisodeVersion | undefined;
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

export interface TvShowPlayerResponse {
  type: string;
  series: Series[];
}