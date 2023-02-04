import { IVideoModel } from "@/store/types";

export interface IMediaItem {
  key?: string | undefined;
  adult?: boolean;
  backdrop_path?: string | null;
  belongs_to_collection?: string | object;
  budget?: number;
  cast?: Array<{
    adult?: boolean;
    gender?: number | null;
    id?: number;
    known_for_department?: string;
    name?: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string | null;
    cast_id?: number;
    character: string;
    credit_id: string;
    order: number;
  }>;
  crew?: Array<{
    adult?: boolean;
    gender?: number | null;
    id?: number;
    known_for_department?: string;
    name?: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string | null;
    credit_id?: string;
    department?: string;
    job?: string;
  }>;
  credits?: {
    id?: number;
    cast?: Array<{
      adult?: boolean;
      gender?: number | null;
      id?: number;
      known_for_department?: string;
      name?: string;
      original_name?: string;
      popularity?: number;
      profile_path?: string | null;
      cast_id?: number;
      character: string;
      credit_id: string;
      order: number;
    }>;
    crew?: Array<{
      adult?: boolean;
      gender?: number | null;
      id?: number;
      known_for_department?: string;
      name?: string;
      original_name?: string;
      popularity?: number;
      profile_path?: string | null;
      credit_id?: string;
      department?: string;
      job?: string;
    }>;
  };
  genres?: Array<{ id: number; name: string }>;
  homepage?: string;
  id?: number;
  imdb_id?: string;
  is_billboard?: boolean;
  original_language?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  production_companies: Array<{
    id?: number;
    logo_path?: string;
    name?: string;
    origin_country?: string;
  }>;
  production_countries?: Array<{
    iso_3166_1?: string;
    name?: string;
  }>;
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: Array<{ iso_639_1?: string; name?: string }>;
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  videos?: {
    results?: Array<{
      id?: string;
      iso_639_1?: string;
      iso_3166_1?: string;
      key?: string;
      name?: string;
      site?: string;
      size?: number;
      type?: string;
      official?: boolean;
      published_at?: string;
    }>;
  };
  videoKey?: string;
  videoModel?: IVideoModel;
  vote_average?: number;
  vote_count?: number;
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
