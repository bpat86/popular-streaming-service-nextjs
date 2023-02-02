export interface IMediaItem {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: string | object;
  budget: number;
  credits?: Array<{
    credit_type: string;
    department: string;
    job: string;
    media: {
      id: number;
      name: string;
      original_name: string;
      characer: string;
      episodes: Array<{
        air_date: string;
        poster_path: string;
        season_number: number;
        episode_number: number;
      }>;
      seasons: Array<{
        air_date: string;
        poster_path: string;
        season_number: number;
      }>;
    };
    media_type: string;
    id: number;
    person: {
      name: string;
      id: number;
    };
  }>;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  id: number;
  imdb_id: string;
  is_billboard: boolean;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMediaItemWithUserPreferences extends IMediaItem {
  media_type: string | null;
  in_media_list: boolean;
  media_list_id: number | null;
  is_liked: boolean;
  liked_media_id: number | null;
  is_disliked: boolean;
  disliked_media_id: number | null;
}

export interface IProfileMediaList {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  profile: {
    id: number;
    user_id: number;
    profile_name: string;
    profile_image: string;
    created_at: string;
    updated_at: string;
  };
  media_lists: Array<{
    id: number;
    user_id: number;
    media_list_name: string;
    created_at: string;
    updated_at: string;
  }>;
  liked_media: Array<{
    id: number;
    user_id: number;
    media_id: number;
    media_type: string;
    created_at: string;
    updated_at: string;
  }>;
  disliked_media: Array<{
    id: number;
    user_id: number;
    media_id: number;
    media_type: string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface IBillboard {
  data: IMediaItemWithUserPreferences;
  listContext: string;
}

export interface ISlider {
  id: number;
  type: string;
  name: string;
  listContext: string;
  data: Array<IMediaItemWithUserPreferences>;
  isMyListRow: boolean;
}

export interface IPageResponse {
  data: {
    billboard: IBillboard;
    profileMediaList: IProfileMediaList;
    profileLikedMedia: Array<IMediaItemWithUserPreferences>;
    profileDislikedMedia: Array<IMediaItemWithUserPreferences>;
    sliders: Array<ISlider>;
  };
}
