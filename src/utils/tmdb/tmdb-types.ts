export interface BaseMovie {
  id: number;
  title: string;
  adult: boolean;
  backdropPath?: string;
  posterPath?: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  originalTitle: string;
  originalLanguage: string;
}

export interface Images {
  baseUrl: string;
  secureBaseUrl: string;
  backdropSizes: string[];
  logoSizes: string[];
  posterSizes: string[];
  profileSizes: string[];
  stillSizes: string[];
}

export interface Configurations {
  images: Images;
  changekeys: string[];
}

export interface PagedResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

export interface MovieSearchResult extends BaseMovie {
  adult: boolean;
  overview: string;
  popularity: number;
  video: boolean;
  genreIds: number[];
}

export interface MovieDetails extends BaseMovie {
  adult: boolean;
  belongsToCollection: Collection;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdbId: string;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionContry[];
  revenue: number;
  runtime: number;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  video: boolean;
}

export interface Collection {
  id: number;
  name: string;
  posterPath: string;
  backdropPath: string;
}

export interface Genres {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
}

export interface ProductionContry {
  iso31661: string;
  name: string;
}

export interface SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;
}

export interface MovieCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  character: string;
  name: string;
  profilePath?: string;
  popularity: number;
}

export interface Crew {
  id: number;
  job: string;
  name: string;
  profilePath?: string;
}
